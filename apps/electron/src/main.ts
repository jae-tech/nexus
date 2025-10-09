import { app, BrowserWindow, ipcMain, dialog, Notification, Menu } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";
import { getDatabase, closeDatabase } from "./db/database";
import { ReservationLogic } from "./db/reservation-logic";
import { ServiceLogic } from "./db/service-logic";
import { StaffLogic } from "./db/staff-logic";
import { IPC_CHANNELS } from "./types";
import { WindowStateManager } from "./window-state";
import { createApplicationMenu } from "./menu";
import { TrayManager } from "./tray";
import { DeepLinkManager } from "./deep-link";
import { UserDataManager } from "./user-data";
import { initializeTestData, hasTestData } from "./db/test-data";
import { initializeLogger, appLogger, ipcLogger, dbLogger, updaterLogger, userDataLogger } from "./logger";
import { registerGlobalErrorHandlers, DatabaseError } from "./error-handler";

let mainWindow: BrowserWindow | null = null;
let windowStateManager: WindowStateManager;
let trayManager: TrayManager | null = null;
let deepLinkManager: DeepLinkManager | null = null;
let userDataManager: UserDataManager;

// ========== 환경 설정 ==========

// 프론트엔드 개발 서버 URL
const FRONTEND_DEV_URL = process.env.VITE_DEV_SERVER || "http://localhost:5173";

// 개발 모드 확인
const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

// ========== 자동 업데이트 ==========

function registerAutoUpdaterEvents() {
  if (isDev) {
    updaterLogger.info("Auto-updater disabled in development mode");
    return;
  }

  // 업데이트 확인 시작
  autoUpdater.on("checking-for-update", () => {
    updaterLogger.info("Checking for updates...");
  });

  // 업데이트 사용 가능
  autoUpdater.on("update-available", (info) => {
    updaterLogger.info("Update available:", info.version);
  });

  // 업데이트 없음
  autoUpdater.on("update-not-available", (info) => {
    updaterLogger.info("Update not available:", info.version);
  });

  // 업데이트 다운로드 진행 중
  autoUpdater.on("download-progress", (progressObj) => {
    const message = `Download speed: ${progressObj.bytesPerSecond} - Downloaded ${progressObj.percent}%`;
    updaterLogger.info(message);
  });

  // 업데이트 에러
  autoUpdater.on("error", (error) => {
    updaterLogger.error("Update error:", error);
  });

  // 업데이트 다운로드 완료
  autoUpdater.on("update-downloaded", (info) => {
    updaterLogger.info("Update downloaded:", info.version);

    dialog
      .showMessageBox({
        type: "info",
        title: "새로운 업데이트",
        message: `버전 ${info.version}이(가) 다운로드되었습니다. 지금 재시작하여 업데이트를 적용하시겠습니까?`,
        buttons: ["지금 재시작", "나중에"],
        defaultId: 0,
        cancelId: 1,
      })
      .then((result: { response: number }) => {
        if (result.response === 0) {
          updaterLogger.info("Quitting and installing update...");
          autoUpdater.quitAndInstall();
        }
      });
  });

  // 앱 준비 후 업데이트 확인 (5초 딜레이)
  app.on("ready", () => {
    setTimeout(() => {
      updaterLogger.info("Starting auto-update check...");
      autoUpdater.checkForUpdatesAndNotify();
    }, 5000);
  });
}

// ========== 윈도우 생성 ==========

function createWindow(): void {
  appLogger.info("Creating main window...");

  // 윈도우 상태 관리자 초기화
  windowStateManager = new WindowStateManager();

  mainWindow = new BrowserWindow({
    ...windowStateManager.getState(),
    minWidth: 800,
    minHeight: 600,
    show: false, // 준비될 때까지 숨김
    backgroundColor: "#ffffff",
    title: "Beauty Manager",
    icon: path.join(__dirname, "..", "resources", "icon.png"),
    webPreferences: {
      // 보안 설정
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false, // SQLite 접근을 위해 비활성화
      webSecurity: true,
      allowRunningInsecureContent: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 윈도우 상태 트래킹 시작
  windowStateManager.track(mainWindow);

  // 윈도우 준비 완료 후 표시
  mainWindow.once("ready-to-show", () => {
    appLogger.info("Window ready to show");
    mainWindow?.show();
  });

  // 로딩 에러 처리
  mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
    appLogger.error(`Failed to load: ${errorCode} - ${errorDescription}`);
  });

  // 개발/프로덕션 분기
  if (isDev) {
    // 개발 모드: 개발 서버 연결
    appLogger.info(`Loading development URL: ${FRONTEND_DEV_URL}`);
    mainWindow
      .loadURL(FRONTEND_DEV_URL)
      .then(() => {
        appLogger.info("Development server loaded successfully");
      })
      .catch((err) => {
        appLogger.error("Failed to load development server:", err);
        // 개발 서버 연결 실패 시 재시도
        setTimeout(() => {
          appLogger.info("Retrying connection to development server...");
          mainWindow?.loadURL(FRONTEND_DEV_URL);
        }, 3000);
      });

    // 개발자 도구 자동 열기
    mainWindow.webContents.openDevTools();
  } else {
    // 프로덕션 모드: 빌드된 파일 로드
    const buildPath = path.join(__dirname, "..", "..", "mcp-beauty-manager", "dist", "index.html");
    appLogger.info(`Loading production file: ${buildPath}`);
    mainWindow
      .loadFile(buildPath)
      .then(() => {
        appLogger.info("Production file loaded successfully");
      })
      .catch((err) => {
        appLogger.error("Failed to load production file:", err);
      });
  }

  // 윈도우 닫힘 이벤트
  mainWindow.on("closed", () => {
    appLogger.info("Main window closed");
    mainWindow = null;
  });

  // 애플리케이션 메뉴 설정
  const menu = createApplicationMenu(mainWindow);
  Menu.setApplicationMenu(menu);

  // 시스템 트레이 생성 (Windows, Linux)
  if (process.platform !== "darwin") {
    trayManager = new TrayManager(mainWindow);
    trayManager.create();
  }

  // 딥 링크 매니저 초기화
  deepLinkManager = new DeepLinkManager(mainWindow);
  deepLinkManager.register();
  deepLinkManager.setReady();

  // 업데이트 이벤트 등록
  registerAutoUpdaterEvents();
}

// ========== IPC 에러 처리 유틸리티 ==========

/**
 * IPC 핸들러를 안전하게 래핑하여 에러 처리 추가
 */
function safeIpcHandler<T extends (...args: any[]) => any>(
  channel: string,
  handler: T
): (...args: Parameters<T>) => Promise<ReturnType<T>> {
  return async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    try {
      const result = await handler(...args);
      return result;
    } catch (error) {
      ipcLogger.error(channel, error);

      // 에러를 사용자 친화적인 메시지로 변환
      const errorMessage = error instanceof Error ? error.message : "알 수 없는 오류가 발생했습니다.";

      // 프로덕션에서는 상세 에러 숨김
      if (!isDev && error instanceof Error) {
        throw new Error("데이터베이스 오류가 발생했습니다. 나중에 다시 시도해주세요.");
      }

      throw new Error(errorMessage);
    }
  };
}

// ========== IPC 핸들러 등록 ==========

function registerIPCHandlers(): void {
  ipcLogger.info("Registering IPC handlers...");

  try {
    const db = getDatabase();
    dbLogger.info("Database initialized successfully");

  // ========== SERVICES ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICES, async () => {
    try {
      return db.getAllServices();
    } catch (error) {
      console.error("[IPC] Error in getServices:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICE_BY_ID, async (_, id: number) => {
    try {
      return db.getServiceById(id);
    } catch (error) {
      console.error("[IPC] Error in getServiceById:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_ADD_SERVICE, async (_, service) => {
    try {
      return db.addService(service);
    } catch (error) {
      console.error("[IPC] Error in addService:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_UPDATE_SERVICE, async (_, id: number, service) => {
    try {
      return db.updateService(id, service);
    } catch (error) {
      console.error("[IPC] Error in updateService:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_DELETE_SERVICE, async (_, id: number) => {
    try {
      return db.deleteService(id);
    } catch (error) {
      console.error("[IPC] Error in deleteService:", error);
      throw error;
    }
  });

  // ========== CUSTOMERS ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMERS, async () => {
    try {
      return db.getAllCustomers();
    } catch (error) {
      console.error("[IPC] Error in getCustomers:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMER_BY_ID, async (_, id: number) => {
    try {
      return db.getCustomerById(id);
    } catch (error) {
      console.error("[IPC] Error in getCustomerById:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_ADD_CUSTOMER, async (_, customer) => {
    try {
      return db.addCustomer(customer);
    } catch (error) {
      console.error("[IPC] Error in addCustomer:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_UPDATE_CUSTOMER, async (_, id: number, customer) => {
    try {
      return db.updateCustomer(id, customer);
    } catch (error) {
      console.error("[IPC] Error in updateCustomer:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_DELETE_CUSTOMER, async (_, id: number) => {
    try {
      return db.deleteCustomer(id);
    } catch (error) {
      console.error("[IPC] Error in deleteCustomer:", error);
      throw error;
    }
  });

  // ========== STAFF ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF, async () => {
    try {
      return db.getAllStaff();
    } catch (error) {
      console.error("[IPC] Error in getStaff:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF_BY_ID, async (_, id: number) => {
    try {
      return db.getStaffById(id);
    } catch (error) {
      console.error("[IPC] Error in getStaffById:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_ADD_STAFF, async (_, staff) => {
    try {
      return db.addStaff(staff);
    } catch (error) {
      console.error("[IPC] Error in addStaff:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_UPDATE_STAFF, async (_, id: number, staff) => {
    try {
      return db.updateStaff(id, staff);
    } catch (error) {
      console.error("[IPC] Error in updateStaff:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_DELETE_STAFF, async (_, id: number) => {
    try {
      return db.deleteStaff(id);
    } catch (error) {
      console.error("[IPC] Error in deleteStaff:", error);
      throw error;
    }
  });

  // ========== RESERVATIONS ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATIONS, async () => {
    try {
      return db.getAllReservations();
    } catch (error) {
      console.error("[IPC] Error in getReservations:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATION_BY_ID, async (_, id: number) => {
    try {
      return db.getReservationById(id);
    } catch (error) {
      console.error("[IPC] Error in getReservationById:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_ADD_RESERVATION, async (_, reservation) => {
    try {
      return db.addReservation(reservation);
    } catch (error) {
      console.error("[IPC] Error in addReservation:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_UPDATE_RESERVATION, async (_, id: number, reservation) => {
    try {
      return db.updateReservation(id, reservation);
    } catch (error) {
      console.error("[IPC] Error in updateReservation:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_DELETE_RESERVATION, async (_, id: number) => {
    try {
      return db.deleteReservation(id);
    } catch (error) {
      console.error("[IPC] Error in deleteReservation:", error);
      throw error;
    }
  });

  // ========== SEARCH & FILTER ==========
  ipcMain.handle(IPC_CHANNELS.DB_SEARCH_CUSTOMERS, async (_, searchTerm: string) => {
    try {
      return db.searchCustomers(searchTerm);
    } catch (error) {
      console.error("[IPC] Error in searchCustomers:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_SEARCH_SERVICES, async (_, searchTerm: string, category?: string) => {
    try {
      return db.searchServices(searchTerm, category);
    } catch (error) {
      console.error("[IPC] Error in searchServices:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATIONS_BY_DATE_RANGE, async (_, startDate: string, endDate: string, status?: string) => {
    try {
      return db.getReservationsByDateRange(startDate, endDate, status);
    } catch (error) {
      console.error("[IPC] Error in getReservationsByDateRange:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICES_BY_PRICE_RANGE, async (_, minPrice: number, maxPrice: number) => {
    try {
      return db.getServicesByPriceRange(minPrice, maxPrice);
    } catch (error) {
      console.error("[IPC] Error in getServicesByPriceRange:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICES_BY_CATEGORY, async (_, category: string) => {
    try {
      return db.getServicesByCategory(category);
    } catch (error) {
      console.error("[IPC] Error in getServicesByCategory:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF_BY_POSITION, async (_, position: string) => {
    try {
      return db.getStaffByPosition(position);
    } catch (error) {
      console.error("[IPC] Error in getStaffByPosition:", error);
      throw error;
    }
  });

  // ========== RELATIONAL QUERIES ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATIONS_WITH_DETAILS, async () => {
    try {
      return db.getReservationsWithDetails();
    } catch (error) {
      console.error("[IPC] Error in getReservationsWithDetails:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATIONS_BY_DATE, async (_, date: string) => {
    try {
      return db.getReservationsByDate(date);
    } catch (error) {
      console.error("[IPC] Error in getReservationsByDate:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMER_RESERVATIONS, async (_, customerId: number) => {
    try {
      return db.getCustomerReservations(customerId);
    } catch (error) {
      console.error("[IPC] Error in getCustomerReservations:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF_SCHEDULE, async (_, staffId: number, startDate?: string, endDate?: string) => {
    try {
      return db.getStaffSchedule(staffId, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error in getStaffSchedule:", error);
      throw error;
    }
  });

  // ========== STATISTICS ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_SALES_STATS, async (_, startDate: string, endDate: string) => {
    try {
      return db.getSalesStats(startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error in getSalesStats:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICE_STATS, async (_, startDate?: string, endDate?: string) => {
    try {
      return db.getServiceStats(startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error in getServiceStats:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF_PERFORMANCE, async (_, startDate?: string, endDate?: string) => {
    try {
      return db.getStaffPerformance(startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error in getStaffPerformance:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMER_STATS, async (_, customerId?: number) => {
    try {
      return db.getCustomerStats(customerId);
    } catch (error) {
      console.error("[IPC] Error in getCustomerStats:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_MONTHLY_REVENUE, async (_, year: number) => {
    try {
      return db.getMonthlyRevenue(year);
    } catch (error) {
      console.error("[IPC] Error in getMonthlyRevenue:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_DASHBOARD_STATS, async () => {
    try {
      return db.getDashboardStats();
    } catch (error) {
      console.error("[IPC] Error in getDashboardStats:", error);
      throw error;
    }
  });

  // ========== ADVANCED SEARCH ==========
  ipcMain.handle(IPC_CHANNELS.DB_SEARCH_CUSTOMERS_ADVANCED, async (_, options: any) => {
    try {
      return db.searchCustomersAdvanced(options);
    } catch (error) {
      console.error("[IPC] Error in searchCustomersAdvanced:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_SEARCH_SERVICES_ADVANCED, async (_, options: any) => {
    try {
      return db.searchServicesAdvanced(options);
    } catch (error) {
      console.error("[IPC] Error in searchServicesAdvanced:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_SEARCH_RESERVATIONS_ADVANCED, async (_, options: any) => {
    try {
      return db.searchReservationsAdvanced(options);
    } catch (error) {
      console.error("[IPC] Error in searchReservationsAdvanced:", error);
      throw error;
    }
  });

  // ========== PAGINATION ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMERS_PAGINATED, async (_, page: number, limit: number, search?: string) => {
    try {
      return db.getCustomersPaginated(page, limit, search);
    } catch (error) {
      console.error("[IPC] Error in getCustomersPaginated:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_SERVICES_PAGINATED, async (_, page: number, limit: number, category?: string, search?: string) => {
    try {
      return db.getServicesPaginated(page, limit, category, search);
    } catch (error) {
      console.error("[IPC] Error in getServicesPaginated:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_RESERVATIONS_PAGINATED, async (_, page: number, limit: number, filters?: any) => {
    try {
      return db.getReservationsPaginated(page, limit, filters);
    } catch (error) {
      console.error("[IPC] Error in getReservationsPaginated:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_STAFF_PAGINATED, async (_, page: number, limit: number, position?: string) => {
    try {
      return db.getStaffPaginated(page, limit, position);
    } catch (error) {
      console.error("[IPC] Error in getStaffPaginated:", error);
      throw error;
    }
  });

  // ========== ADVANCED STATISTICS ==========
  ipcMain.handle(IPC_CHANNELS.DB_GET_MONTHLY_STATS_DETAILED, async (_, year: number, month: number) => {
    try {
      return db.getMonthlyStatsDetailed(year, month);
    } catch (error) {
      console.error("[IPC] Error in getMonthlyStatsDetailed:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_POPULAR_SERVICES, async (_, limit?: number, startDate?: string, endDate?: string) => {
    try {
      return db.getPopularServices(limit, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error in getPopularServices:", error);
      throw error;
    }
  });

  ipcMain.handle(IPC_CHANNELS.DB_GET_CUSTOMER_VISIT_HISTORY, async (_, customerId: number) => {
    try {
      return db.getCustomerVisitHistory(customerId);
    } catch (error) {
      console.error("[IPC] Error in getCustomerVisitHistory:", error);
      throw error;
    }
  });

  // ========== BUSINESS LOGIC ==========
  const reservationLogic = new ReservationLogic(db);
  const serviceLogic = new ServiceLogic(db);
  const staffLogic = new StaffLogic(db);

  // ========== RESERVATION BUSINESS LOGIC ==========

  // 예약 시간 충돌 검사
  ipcMain.handle("reservation:check-conflict", async (_, date: string, startTime: string, endTime: string, staffId?: number, excludeReservationId?: number) => {
    try {
      return reservationLogic.checkTimeConflict(date, startTime, endTime, staffId, excludeReservationId);
    } catch (error) {
      console.error("[IPC] Error checking time conflict:", error);
      throw error;
    }
  });

  // 가능한 시간대 조회
  ipcMain.handle("reservation:get-available-slots", async (_, date: string, staffId?: number, serviceDuration?: number) => {
    try {
      return reservationLogic.getAvailableTimeSlots(date, staffId, serviceDuration);
    } catch (error) {
      console.error("[IPC] Error getting available time slots:", error);
      throw error;
    }
  });

  // 가능한 직원 조회
  ipcMain.handle("reservation:get-available-staff", async (_, date: string, startTime: string, endTime: string, position?: string) => {
    try {
      return reservationLogic.getAvailableStaff(date, startTime, endTime, position);
    } catch (error) {
      console.error("[IPC] Error getting available staff:", error);
      throw error;
    }
  });

  // 예약 검증
  ipcMain.handle("reservation:validate", async (_, reservation: any) => {
    try {
      return reservationLogic.validateReservation(reservation);
    } catch (error) {
      console.error("[IPC] Error validating reservation:", error);
      throw error;
    }
  });

  // 예약 수정 검증
  ipcMain.handle("reservation:validate-update", async (_, reservationId: number, updates: any) => {
    try {
      return reservationLogic.validateReservationUpdate(reservationId, updates);
    } catch (error) {
      console.error("[IPC] Error validating reservation update:", error);
      throw error;
    }
  });

  // 대안 시간 제안
  ipcMain.handle("reservation:suggest-alternatives", async (_, date: string, staffId?: number, serviceDuration?: number, limit?: number) => {
    try {
      return reservationLogic.suggestAlternativeTimeSlots(date, staffId, serviceDuration, limit);
    } catch (error) {
      console.error("[IPC] Error suggesting alternative time slots:", error);
      throw error;
    }
  });

  // 종료 시간 계산
  ipcMain.handle("reservation:calculate-end-time", async (_, startTime: string, durationMinutes: number) => {
    try {
      return reservationLogic.calculateEndTime(startTime, durationMinutes);
    } catch (error) {
      console.error("[IPC] Error calculating end time:", error);
      throw error;
    }
  });

  // 예약 가능 여부 체크
  ipcMain.handle("reservation:can-make", async (_, date: string, startTime: string, endTime: string, staffId?: number) => {
    try {
      return reservationLogic.canMakeReservation(date, startTime, endTime, staffId);
    } catch (error) {
      console.error("[IPC] Error checking reservation availability:", error);
      throw error;
    }
  });

  // 영업시간 조회
  ipcMain.handle("reservation:get-business-hours", async () => {
    try {
      return reservationLogic.getBusinessHours();
    } catch (error) {
      console.error("[IPC] Error getting business hours:", error);
      throw error;
    }
  });

  // 영업시간 업데이트
  ipcMain.handle("reservation:update-business-hours", async (_, businessHours: any) => {
    try {
      reservationLogic.updateBusinessHours(businessHours);
      return { success: true };
    } catch (error) {
      console.error("[IPC] Error updating business hours:", error);
      throw error;
    }
  });

  // ========== SERVICE BUSINESS LOGIC ==========

  // 카테고리별 서비스 그룹핑
  ipcMain.handle("service:get-by-category", async () => {
    try {
      const grouped = serviceLogic.getServicesByCategory();
      return Object.fromEntries(grouped);
    } catch (error) {
      console.error("[IPC] Error grouping services by category:", error);
      throw error;
    }
  });

  // 서비스 인기도 조회
  ipcMain.handle("service:get-popularity", async (_, startDate?: string, endDate?: string) => {
    try {
      return serviceLogic.getServicePopularity(startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error getting service popularity:", error);
      throw error;
    }
  });

  // 서비스 검색
  ipcMain.handle("service:search", async (_, options: any) => {
    try {
      return serviceLogic.searchServices(options);
    } catch (error) {
      console.error("[IPC] Error searching services:", error);
      throw error;
    }
  });

  // 서비스 삭제 영향 분석
  ipcMain.handle("service:analyze-deletion", async (_, serviceId: number) => {
    try {
      return serviceLogic.analyzeServiceDeletion(serviceId);
    } catch (error) {
      console.error("[IPC] Error analyzing service deletion:", error);
      throw error;
    }
  });

  // 서비스 복제
  ipcMain.handle("service:duplicate", async (_, serviceId: number, newName: string) => {
    try {
      return serviceLogic.duplicateService(serviceId, newName);
    } catch (error) {
      console.error("[IPC] Error duplicating service:", error);
      throw error;
    }
  });

  // 일괄 가격 업데이트
  ipcMain.handle("service:bulk-update-prices", async (_, updates: any[]) => {
    try {
      serviceLogic.bulkUpdatePrices(updates);
      return { success: true };
    } catch (error) {
      console.error("[IPC] Error bulk updating prices:", error);
      throw error;
    }
  });

  // 카테고리별 평균 가격
  ipcMain.handle("service:get-category-avg-prices", async () => {
    try {
      const averages = serviceLogic.getCategoryAveragePrices();
      return Object.fromEntries(averages);
    } catch (error) {
      console.error("[IPC] Error getting category average prices:", error);
      throw error;
    }
  });

  // 서비스 수익성 분석
  ipcMain.handle("service:analyze-profitability", async (_, startDate?: string, endDate?: string) => {
    try {
      return serviceLogic.analyzeServiceProfitability(startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error analyzing service profitability:", error);
      throw error;
    }
  });

  // 서비스 추천
  ipcMain.handle("service:recommend-for-customer", async (_, customerId: number, limit?: number) => {
    try {
      return serviceLogic.recommendServicesForCustomer(customerId, limit);
    } catch (error) {
      console.error("[IPC] Error recommending services:", error);
      throw error;
    }
  });

  // 서비스 검증
  ipcMain.handle("service:validate", async (_, service: any) => {
    try {
      return serviceLogic.validateService(service);
    } catch (error) {
      console.error("[IPC] Error validating service:", error);
      throw error;
    }
  });

  // 서비스 수정 검증
  ipcMain.handle("service:validate-update", async (_, serviceId: number, updates: any) => {
    try {
      return serviceLogic.validateServiceUpdate(serviceId, updates);
    } catch (error) {
      console.error("[IPC] Error validating service update:", error);
      throw error;
    }
  });

  // ========== STAFF BUSINESS LOGIC ==========

  // 직책별 직원 그룹핑
  ipcMain.handle("staff:get-by-position", async () => {
    try {
      const grouped = staffLogic.getStaffByPosition();
      return Object.fromEntries(grouped);
    } catch (error) {
      console.error("[IPC] Error grouping staff by position:", error);
      throw error;
    }
  });

  // 직원 성과 분석
  ipcMain.handle("staff:analyze-performance", async (_, staffId?: number, startDate?: string, endDate?: string) => {
    try {
      return staffLogic.analyzeStaffPerformance(staffId, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error analyzing staff performance:", error);
      throw error;
    }
  });

  // 직원별 예약 현황
  ipcMain.handle("staff:get-reservation-status", async (_, staffId: number, startDate?: string, endDate?: string) => {
    try {
      return staffLogic.getStaffReservationStatus(staffId, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error getting staff reservation status:", error);
      throw error;
    }
  });

  // 직원 삭제 영향 분석
  ipcMain.handle("staff:analyze-deletion", async (_, staffId: number) => {
    try {
      return staffLogic.analyzeStaffDeletion(staffId);
    } catch (error) {
      console.error("[IPC] Error analyzing staff deletion:", error);
      throw error;
    }
  });

  // 예약 재배정
  ipcMain.handle("staff:reassign-reservations", async (_, fromStaffId: number, toStaffId: number, startDate?: string) => {
    try {
      return staffLogic.reassignReservations(fromStaffId, toStaffId, startDate);
    } catch (error) {
      console.error("[IPC] Error reassigning reservations:", error);
      throw error;
    }
  });

  // 직원별 근무시간 통계
  ipcMain.handle("staff:get-working-hours", async (_, staffId: number, startDate: string, endDate: string) => {
    try {
      return staffLogic.getStaffWorkingHours(staffId, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error getting staff working hours:", error);
      throw error;
    }
  });

  // TOP 직원 조회
  ipcMain.handle("staff:get-top-performers", async (_, limit?: number, startDate?: string, endDate?: string) => {
    try {
      return staffLogic.getTopPerformers(limit, startDate, endDate);
    } catch (error) {
      console.error("[IPC] Error getting top performers:", error);
      throw error;
    }
  });

  // 직원 검증
  ipcMain.handle("staff:validate", async (_, staff: any) => {
    try {
      return staffLogic.validateStaff(staff);
    } catch (error) {
      console.error("[IPC] Error validating staff:", error);
      throw error;
    }
  });

  // 직원 수정 검증
  ipcMain.handle("staff:validate-update", async (_, staffId: number, updates: any) => {
    try {
      return staffLogic.validateStaffUpdate(staffId, updates);
    } catch (error) {
      console.error("[IPC] Error validating staff update:", error);
      throw error;
    }
  });

  // 직원 검색
  ipcMain.handle("staff:search", async (_, options: any) => {
    try {
      return staffLogic.searchStaff(options);
    } catch (error) {
      console.error("[IPC] Error searching staff:", error);
      throw error;
    }
  });

    ipcLogger.info("All IPC handlers registered successfully");
  } catch (error) {
    ipcLogger.error("Failed to register IPC handlers:", error);
    throw error;
  }
}

// ========== 사용자 데이터 IPC 핸들러 ==========

function registerUserDataHandlers(): void {
  userDataLogger.info("Registering user data IPC handlers...");

  // 설정 로드
  ipcMain.handle("user-data:load-settings", async () => {
    try {
      return userDataManager.loadSettings();
    } catch (error) {
      console.error("[IPC] Error loading settings:", error);
      throw error;
    }
  });

  // 설정 저장
  ipcMain.handle("user-data:save-settings", async (_, settings) => {
    try {
      return userDataManager.saveSettings(settings);
    } catch (error) {
      console.error("[IPC] Error saving settings:", error);
      throw error;
    }
  });

  // 백업 생성
  ipcMain.handle("user-data:create-backup", async () => {
    try {
      const backupPath = await userDataManager.createBackup();
      if (backupPath) {
        new Notification({
          title: "백업 완료",
          body: "데이터베이스 백업이 완료되었습니다.",
        }).show();
      }
      return backupPath;
    } catch (error) {
      console.error("[IPC] Error creating backup:", error);
      throw error;
    }
  });

  // 백업 목록 조회
  ipcMain.handle("user-data:list-backups", async () => {
    try {
      return userDataManager.listBackups();
    } catch (error) {
      console.error("[IPC] Error listing backups:", error);
      throw error;
    }
  });

  // 백업에서 복원
  ipcMain.handle("user-data:restore-backup", async (_, backupPath) => {
    try {
      const result = await userDataManager.restoreFromBackup(backupPath);
      if (result) {
        new Notification({
          title: "복원 완료",
          body: "데이터베이스 복원이 완료되었습니다. 앱을 재시작합니다.",
        }).show();
        // 앱 재시작
        app.relaunch();
        app.quit();
      }
      return result;
    } catch (error) {
      console.error("[IPC] Error restoring backup:", error);
      throw error;
    }
  });

  // 데이터 내보내기
  ipcMain.handle("user-data:export-data", async (_, data, filePath) => {
    try {
      return await userDataManager.exportData(data, filePath);
    } catch (error) {
      console.error("[IPC] Error exporting data:", error);
      throw error;
    }
  });

  // 데이터 가져오기
  ipcMain.handle("user-data:import-data", async (_, filePath) => {
    try {
      return await userDataManager.importData(filePath);
    } catch (error) {
      console.error("[IPC] Error importing data:", error);
      throw error;
    }
  });

  // 디스크 사용량 조회
  ipcMain.handle("user-data:get-disk-usage", async () => {
    try {
      return userDataManager.getDiskUsage();
    } catch (error) {
      console.error("[IPC] Error getting disk usage:", error);
      throw error;
    }
  });

  userDataLogger.info("User data IPC handlers registered");
}

// ========== 자동 백업 스케줄링 ==========

function scheduleAutoBackup(): void {
  // 매일 자정에 자동 백업 (24시간)
  const BACKUP_INTERVAL = 24 * 60 * 60 * 1000;

  setInterval(async () => {
    userDataLogger.info("Running scheduled auto-backup...");
    try {
      await userDataManager.autoBackup(10);
      userDataLogger.info("Auto-backup completed successfully");
    } catch (error) {
      userDataLogger.error("Auto-backup failed:", error);
    }
  }, BACKUP_INTERVAL);

  // 앱 시작 시 1회 백업
  setTimeout(async () => {
    userDataLogger.info("Running initial auto-backup...");
    try {
      await userDataManager.autoBackup(10);
      userDataLogger.info("Initial backup completed");
    } catch (error) {
      userDataLogger.error("Initial backup failed:", error);
    }
  }, 10000); // 10초 후 실행
}

// ========== 앱 생명주기 관리 ==========

// 앱 준비 완료
app.whenReady().then(async () => {
  // 로거 초기화 (가장 먼저)
  initializeLogger();

  // 전역 에러 핸들러 등록
  registerGlobalErrorHandlers();

  appLogger.info("App is ready");

  try {
    // 1. 사용자 데이터 관리자 초기화
    userDataManager = new UserDataManager();
    appLogger.info("User data path:", userDataManager.getUserDataPath());

    // 2. IPC 핸들러 등록
    registerIPCHandlers();
    registerUserDataHandlers();

    // 3. 윈도우 생성
    createWindow();

    // 4. 개발 모드에서만 테스트 데이터 초기화
    if (isDev) {
      const db = getDatabase();

      // 테스트 데이터 존재 여부 확인
      if (!hasTestData(db)) {
        dbLogger.info("No test data found. Initializing test data (development mode)...");
        await initializeTestData(db);
        dbLogger.info("Test data initialized successfully");
      } else {
        dbLogger.info("Test data already exists, skipping initialization");
      }
    }

    // 5. 자동 백업 스케줄링 (매일 1회)
    scheduleAutoBackup();

    appLogger.info("App initialization completed");
  } catch (error) {
    appLogger.error("App initialization failed:", error);

    // 치명적 오류 알림
    dialog.showErrorBox("초기화 오류", "앱을 시작하는 중 오류가 발생했습니다. 앱을 종료합니다.");

    app.quit();
  }
});

// 모든 창이 닫힘
app.on("window-all-closed", () => {
  appLogger.info("All windows closed");

  // 시스템 트레이 정리
  if (trayManager) {
    trayManager.destroy();
  }

  // 데이터베이스 정리
  try {
    closeDatabase();
    dbLogger.info("Database closed successfully");
  } catch (error) {
    dbLogger.error("Error closing database:", error);
  }

  // macOS를 제외하고 앱 종료
  if (process.platform !== "darwin") {
    app.quit();
  }
});

// Activate (macOS)
app.on("activate", () => {
  appLogger.info("App activated");

  // macOS에서 독 아이콘 클릭 시 창이 없으면 새로 생성
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// 앱 종료 전
app.on("before-quit", (event) => {
  appLogger.info("App is quitting");

  try {
    closeDatabase();
  } catch (error) {
    appLogger.error("Error during cleanup:", error);
  }
});

// 앱 종료 시
app.on("will-quit", () => {
  appLogger.info("App will quit");
  // 모든 IPC 핸들러 제거
  ipcMain.removeAllListeners();
});

// 렌더러 프로세스 크래시 처리
app.on("render-process-gone", (event, webContents, details) => {
  appLogger.error("Renderer process gone:", details);

  if (details.reason === "crashed") {
    dialog
      .showMessageBox({
        type: "error",
        title: "프로세스 오류",
        message: "렌더러 프로세스가 예기치 않게 종료되었습니다.",
        buttons: ["재시작", "종료"],
      })
      .then((result) => {
        if (result.response === 0) {
          // 재시작
          app.relaunch();
          app.quit();
        } else {
          // 종료
          app.quit();
        }
      });
  }
});
