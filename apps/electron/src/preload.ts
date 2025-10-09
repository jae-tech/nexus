import { contextBridge, ipcRenderer, IpcRendererEvent } from "electron";
import { IPC_CHANNELS } from "./types";
import type { Service, Customer, Staff, Reservation } from "./db/database";

/**
 * Preload 스크립트
 *
 * contextBridge를 통해 안전한 API만 렌더러 프로세스에 노출
 * 보안을 위해 직접적인 IPC 접근은 차단하고, 정의된 메서드만 사용 가능
 */

// 안전하게 렌더러에 API 노출
contextBridge.exposeInMainWorld("api", {
  // ========== 데이터베이스 API ==========
  db: {
    // ========== SERVICES ==========
    getServices: (): Promise<Service[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICES),

    getServiceById: (id: number): Promise<Service | undefined> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICE_BY_ID, id),

    addService: (service: Service): Promise<number> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_ADD_SERVICE, service),

    updateService: (id: number, service: Partial<Service>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_UPDATE_SERVICE, id, service),

    deleteService: (id: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_DELETE_SERVICE, id),

    // ========== CUSTOMERS ==========
    getCustomers: (): Promise<Customer[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMERS),

    getCustomerById: (id: number): Promise<Customer | undefined> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMER_BY_ID, id),

    addCustomer: (customer: Customer): Promise<number> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_ADD_CUSTOMER, customer),

    updateCustomer: (id: number, customer: Partial<Customer>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_UPDATE_CUSTOMER, id, customer),

    deleteCustomer: (id: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_DELETE_CUSTOMER, id),

    // ========== STAFF ==========
    getStaff: (): Promise<Staff[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF),

    getStaffById: (id: number): Promise<Staff | undefined> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF_BY_ID, id),

    addStaff: (staff: Staff): Promise<number> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_ADD_STAFF, staff),

    updateStaff: (id: number, staff: Partial<Staff>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_UPDATE_STAFF, id, staff),

    deleteStaff: (id: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_DELETE_STAFF, id),

    // ========== RESERVATIONS ==========
    getReservations: (): Promise<Reservation[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATIONS),

    getReservationById: (id: number): Promise<Reservation | undefined> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATION_BY_ID, id),

    addReservation: (reservation: Reservation): Promise<number> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_ADD_RESERVATION, reservation),

    updateReservation: (id: number, reservation: Partial<Reservation>): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_UPDATE_RESERVATION, id, reservation),

    deleteReservation: (id: number): Promise<void> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_DELETE_RESERVATION, id),

    // ========== SEARCH & FILTER ==========
    searchCustomers: (searchTerm: string): Promise<Customer[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SEARCH_CUSTOMERS, searchTerm),

    searchServices: (searchTerm: string, category?: string): Promise<Service[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SEARCH_SERVICES, searchTerm, category),

    getReservationsByDateRange: (startDate: string, endDate: string, status?: string): Promise<Reservation[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATIONS_BY_DATE_RANGE, startDate, endDate, status),

    getServicesByPriceRange: (minPrice: number, maxPrice: number): Promise<Service[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICES_BY_PRICE_RANGE, minPrice, maxPrice),

    getServicesByCategory: (category: string): Promise<Service[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICES_BY_CATEGORY, category),

    getStaffByPosition: (position: string): Promise<Staff[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF_BY_POSITION, position),

    // ========== RELATIONAL QUERIES ==========
    getReservationsWithDetails: (): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATIONS_WITH_DETAILS),

    getReservationsByDate: (date: string): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATIONS_BY_DATE, date),

    getCustomerReservations: (customerId: number): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMER_RESERVATIONS, customerId),

    getStaffSchedule: (staffId: number, startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF_SCHEDULE, staffId, startDate, endDate),

    // ========== STATISTICS ==========
    getSalesStats: (startDate: string, endDate: string): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SALES_STATS, startDate, endDate),

    getServiceStats: (startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICE_STATS, startDate, endDate),

    getStaffPerformance: (startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF_PERFORMANCE, startDate, endDate),

    getCustomerStats: (customerId?: number): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMER_STATS, customerId),

    getMonthlyRevenue: (year: number): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_MONTHLY_REVENUE, year),

    getDashboardStats: (): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_DASHBOARD_STATS),

    // ========== ADVANCED SEARCH ==========
    searchCustomersAdvanced: (options: any): Promise<Customer[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SEARCH_CUSTOMERS_ADVANCED, options),

    searchServicesAdvanced: (options: any): Promise<Service[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SEARCH_SERVICES_ADVANCED, options),

    searchReservationsAdvanced: (options: any): Promise<Reservation[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_SEARCH_RESERVATIONS_ADVANCED, options),

    // ========== PAGINATION ==========
    getCustomersPaginated: (page: number, limit: number, search?: string): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMERS_PAGINATED, page, limit, search),

    getServicesPaginated: (page: number, limit: number, category?: string, search?: string): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_SERVICES_PAGINATED, page, limit, category, search),

    getReservationsPaginated: (page: number, limit: number, filters?: any): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_RESERVATIONS_PAGINATED, page, limit, filters),

    getStaffPaginated: (page: number, limit: number, position?: string): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_STAFF_PAGINATED, page, limit, position),

    // ========== ADVANCED STATISTICS ==========
    getMonthlyStatsDetailed: (year: number, month: number): Promise<any> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_MONTHLY_STATS_DETAILED, year, month),

    getPopularServices: (limit?: number, startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_POPULAR_SERVICES, limit, startDate, endDate),

    getCustomerVisitHistory: (customerId: number): Promise<any[]> =>
      ipcRenderer.invoke(IPC_CHANNELS.DB_GET_CUSTOMER_VISIT_HISTORY, customerId),
  },

  // ========== 서비스 비즈니스 로직 API ==========
  service: {
    // 카테고리별 그룹핑
    getByCategory: (): Promise<Record<string, Service[]>> =>
      ipcRenderer.invoke("service:get-by-category"),

    // 인기도 조회
    getPopularity: (startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke("service:get-popularity", startDate, endDate),

    // 검색
    search: (options: any): Promise<Service[]> =>
      ipcRenderer.invoke("service:search", options),

    // 삭제 영향 분석
    analyzeDeletion: (serviceId: number): Promise<any> =>
      ipcRenderer.invoke("service:analyze-deletion", serviceId),

    // 복제
    duplicate: (serviceId: number, newName: string): Promise<number> =>
      ipcRenderer.invoke("service:duplicate", serviceId, newName),

    // 일괄 가격 업데이트
    bulkUpdatePrices: (updates: Array<{ serviceId: number; newPrice: number; reason?: string }>): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("service:bulk-update-prices", updates),

    // 카테고리별 평균 가격
    getCategoryAvgPrices: (): Promise<Record<string, number>> =>
      ipcRenderer.invoke("service:get-category-avg-prices"),

    // 수익성 분석
    analyzeProfitability: (startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke("service:analyze-profitability", startDate, endDate),

    // 고객 맞춤 추천
    recommendForCustomer: (customerId: number, limit?: number): Promise<Service[]> =>
      ipcRenderer.invoke("service:recommend-for-customer", customerId, limit),

    // 검증
    validate: (service: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("service:validate", service),

    // 수정 검증
    validateUpdate: (serviceId: number, updates: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("service:validate-update", serviceId, updates),
  },

  // ========== 직원 비즈니스 로직 API ==========
  staff: {
    // 직책별 그룹핑
    getByPosition: (): Promise<Record<string, Staff[]>> =>
      ipcRenderer.invoke("staff:get-by-position"),

    // 성과 분석
    analyzePerformance: (staffId?: number, startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke("staff:analyze-performance", staffId, startDate, endDate),

    // 예약 현황
    getReservationStatus: (staffId: number, startDate?: string, endDate?: string): Promise<any> =>
      ipcRenderer.invoke("staff:get-reservation-status", staffId, startDate, endDate),

    // 삭제 영향 분석
    analyzeDeletion: (staffId: number): Promise<any> =>
      ipcRenderer.invoke("staff:analyze-deletion", staffId),

    // 예약 재배정
    reassignReservations: (fromStaffId: number, toStaffId: number, startDate?: string): Promise<number> =>
      ipcRenderer.invoke("staff:reassign-reservations", fromStaffId, toStaffId, startDate),

    // 근무시간 통계
    getWorkingHours: (staffId: number, startDate: string, endDate: string): Promise<any> =>
      ipcRenderer.invoke("staff:get-working-hours", staffId, startDate, endDate),

    // TOP 직원
    getTopPerformers: (limit?: number, startDate?: string, endDate?: string): Promise<any[]> =>
      ipcRenderer.invoke("staff:get-top-performers", limit, startDate, endDate),

    // 검증
    validate: (staff: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("staff:validate", staff),

    // 수정 검증
    validateUpdate: (staffId: number, updates: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("staff:validate-update", staffId, updates),

    // 검색
    search: (options: any): Promise<Staff[]> =>
      ipcRenderer.invoke("staff:search", options),
  },

  // ========== 예약 비즈니스 로직 API ==========
  reservation: {
    // 시간 충돌 검사
    checkConflict: (date: string, startTime: string, endTime: string, staffId?: number, excludeReservationId?: number): Promise<any> =>
      ipcRenderer.invoke("reservation:check-conflict", date, startTime, endTime, staffId, excludeReservationId),

    // 가능한 시간대 조회
    getAvailableSlots: (date: string, staffId?: number, serviceDuration?: number): Promise<any[]> =>
      ipcRenderer.invoke("reservation:get-available-slots", date, staffId, serviceDuration),

    // 가능한 직원 조회
    getAvailableStaff: (date: string, startTime: string, endTime: string, position?: string): Promise<Staff[]> =>
      ipcRenderer.invoke("reservation:get-available-staff", date, startTime, endTime, position),

    // 예약 검증
    validate: (reservation: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("reservation:validate", reservation),

    // 예약 수정 검증
    validateUpdate: (reservationId: number, updates: any): Promise<{ valid: boolean; errors: string[] }> =>
      ipcRenderer.invoke("reservation:validate-update", reservationId, updates),

    // 대안 시간 제안
    suggestAlternatives: (date: string, staffId?: number, serviceDuration?: number, limit?: number): Promise<any[]> =>
      ipcRenderer.invoke("reservation:suggest-alternatives", date, staffId, serviceDuration, limit),

    // 종료 시간 계산
    calculateEndTime: (startTime: string, durationMinutes: number): Promise<string> =>
      ipcRenderer.invoke("reservation:calculate-end-time", startTime, durationMinutes),

    // 예약 가능 여부 체크
    canMake: (date: string, startTime: string, endTime: string, staffId?: number): Promise<{ can: boolean; reason?: string }> =>
      ipcRenderer.invoke("reservation:can-make", date, startTime, endTime, staffId),

    // 영업시간 조회
    getBusinessHours: (): Promise<any> =>
      ipcRenderer.invoke("reservation:get-business-hours"),

    // 영업시간 업데이트
    updateBusinessHours: (businessHours: any): Promise<{ success: boolean }> =>
      ipcRenderer.invoke("reservation:update-business-hours", businessHours),
  },

  // ========== 사용자 데이터 API ==========
  userData: {
    // 설정
    loadSettings: <T = any>(): Promise<T | null> => ipcRenderer.invoke("user-data:load-settings"),
    saveSettings: <T = any>(settings: T): Promise<boolean> =>
      ipcRenderer.invoke("user-data:save-settings", settings),

    // 백업
    createBackup: (): Promise<string | null> => ipcRenderer.invoke("user-data:create-backup"),
    listBackups: (): Promise<
      Array<{
        name: string;
        path: string;
        date: Date;
        size: number;
      }>
    > => ipcRenderer.invoke("user-data:list-backups"),
    restoreBackup: (backupPath: string): Promise<boolean> =>
      ipcRenderer.invoke("user-data:restore-backup", backupPath),

    // 데이터 내보내기/가져오기
    exportData: (data: any, filePath: string): Promise<boolean> =>
      ipcRenderer.invoke("user-data:export-data", data, filePath),
    importData: <T = any>(filePath: string): Promise<T | null> =>
      ipcRenderer.invoke("user-data:import-data", filePath),

    // 디스크 사용량
    getDiskUsage: (): Promise<{
      database: number;
      backups: number;
      total: number;
      formatted: {
        database: string;
        backups: string;
        total: string;
      };
    }> => ipcRenderer.invoke("user-data:get-disk-usage"),
  },

  // ========== 이벤트 리스너 API ==========
  on: (channel: string, callback: (...args: any[]) => void) => {
    // 허용된 채널만 리스닝 가능 (보안)
    const validChannels = [
      "menu-new-customer",
      "menu-new-reservation",
      "menu-navigate",
      "menu-export-data",
      "menu-import-data",
      "menu-check-updates",
      "deep-link-navigate",
      "deep-link-action",
    ];

    if (validChannels.includes(channel)) {
      const subscription = (_event: IpcRendererEvent, ...args: any[]) => callback(...args);
      ipcRenderer.on(channel, subscription);

      // 구독 해제 함수 반환
      return () => {
        ipcRenderer.removeListener(channel, subscription);
      };
    }

    console.warn(`[Preload] Attempted to listen to invalid channel: ${channel}`);
    return () => {}; // noop
  },

  // ========== 일회성 이벤트 리스너 ==========
  once: (channel: string, callback: (...args: any[]) => void) => {
    const validChannels = [
      "menu-new-customer",
      "menu-new-reservation",
      "menu-navigate",
      "menu-export-data",
      "menu-import-data",
      "menu-check-updates",
      "deep-link-navigate",
      "deep-link-action",
    ];

    if (validChannels.includes(channel)) {
      ipcRenderer.once(channel, (_event: IpcRendererEvent, ...args: any[]) => callback(...args));
    } else {
      console.warn(`[Preload] Attempted to listen to invalid channel: ${channel}`);
    }
  },

  // ========== 유틸리티 API ==========
  platform: process.platform, // 'darwin' | 'win32' | 'linux'
  versions: {
    node: process.versions.node,
    chrome: process.versions.chrome,
    electron: process.versions.electron,
  },
});
