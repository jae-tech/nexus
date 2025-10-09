/**
 * 딥 링크 처리
 *
 * 사용 예시:
 * beauty-manager://open/reservations
 * beauty-manager://open/customer/123
 * beauty-manager://new/reservation
 */

import { app, BrowserWindow } from "electron";

const PROTOCOL = "beauty-manager";

export class DeepLinkManager {
  private mainWindow: BrowserWindow;
  private isReady: boolean = false;

  constructor(mainWindow: BrowserWindow) {
    this.mainWindow = mainWindow;
  }

  /**
   * 딥 링크 핸들러 등록
   */
  public register(): void {
    // 단일 인스턴스 잠금
    const gotTheLock = app.requestSingleInstanceLock();

    if (!gotTheLock) {
      console.log("[DeepLink] Another instance is running, quitting...");
      app.quit();
      return;
    }

    // 다른 인스턴스가 실행되려고 할 때
    app.on("second-instance", (event, commandLine) => {
      console.log("[DeepLink] Second instance attempted with:", commandLine);

      // 윈도우가 최소화되어 있으면 복원
      if (this.mainWindow.isMinimized()) {
        this.mainWindow.restore();
      }
      this.mainWindow.focus();

      // 딥 링크 URL 찾기 (Windows/Linux)
      const url = commandLine.find((arg) => arg.startsWith(`${PROTOCOL}://`));
      if (url) {
        this.handleDeepLink(url);
      }
    });

    // macOS: URL 열기 이벤트
    app.on("open-url", (event, url) => {
      event.preventDefault();
      console.log("[DeepLink] Received URL:", url);

      if (this.isReady) {
        this.handleDeepLink(url);
      } else {
        // 앱이 준비되지 않은 경우 대기
        app.once("ready", () => {
          this.handleDeepLink(url);
        });
      }
    });

    // 프로토콜 등록 (개발 모드에서는 실패할 수 있음)
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(PROTOCOL, process.execPath, [process.argv[1]]);
      }
    } else {
      app.setAsDefaultProtocolClient(PROTOCOL);
    }

    console.log("[DeepLink] Protocol handler registered for:", PROTOCOL);
  }

  /**
   * 앱이 준비되었음을 표시
   */
  public setReady(): void {
    this.isReady = true;
  }

  /**
   * 딥 링크 URL 처리
   */
  private handleDeepLink(url: string): void {
    try {
      console.log("[DeepLink] Handling URL:", url);

      // URL 파싱
      const urlObj = new URL(url);
      const protocol = urlObj.protocol.replace(":", "");
      const host = urlObj.hostname;
      const path = urlObj.pathname;
      const params = urlObj.searchParams;

      if (protocol !== PROTOCOL) {
        console.warn("[DeepLink] Invalid protocol:", protocol);
        return;
      }

      // 라우팅 처리
      switch (host) {
        case "open":
          this.handleOpenCommand(path, params);
          break;

        case "new":
          this.handleNewCommand(path, params);
          break;

        case "action":
          this.handleActionCommand(path, params);
          break;

        default:
          console.warn("[DeepLink] Unknown command:", host);
      }
    } catch (error) {
      console.error("[DeepLink] Failed to handle URL:", error);
    }
  }

  /**
   * Open 명령어 처리
   * beauty-manager://open/reservations
   * beauty-manager://open/customer/123
   */
  private handleOpenCommand(path: string, params: URLSearchParams): void {
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      // 메인 화면으로 이동
      this.mainWindow.webContents.send("deep-link-navigate", "/");
      return;
    }

    const [resource, id] = segments;

    switch (resource) {
      case "reservations":
        this.mainWindow.webContents.send("deep-link-navigate", "/reservations");
        break;

      case "customers":
        if (id) {
          this.mainWindow.webContents.send("deep-link-navigate", `/customers/${id}`);
        } else {
          this.mainWindow.webContents.send("deep-link-navigate", "/customers");
        }
        break;

      case "services":
        if (id) {
          this.mainWindow.webContents.send("deep-link-navigate", `/services/${id}`);
        } else {
          this.mainWindow.webContents.send("deep-link-navigate", "/services");
        }
        break;

      case "staff":
        if (id) {
          this.mainWindow.webContents.send("deep-link-navigate", `/staff/${id}`);
        } else {
          this.mainWindow.webContents.send("deep-link-navigate", "/staff");
        }
        break;

      default:
        console.warn("[DeepLink] Unknown resource:", resource);
    }
  }

  /**
   * New 명령어 처리
   * beauty-manager://new/reservation
   * beauty-manager://new/customer
   */
  private handleNewCommand(path: string, params: URLSearchParams): void {
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      return;
    }

    const [resource] = segments;

    switch (resource) {
      case "reservation":
        this.mainWindow.webContents.send("deep-link-action", "new-reservation", {
          customerId: params.get("customerId"),
          serviceId: params.get("serviceId"),
          staffId: params.get("staffId"),
          date: params.get("date"),
        });
        break;

      case "customer":
        this.mainWindow.webContents.send("deep-link-action", "new-customer", {
          name: params.get("name"),
          phone: params.get("phone"),
        });
        break;

      default:
        console.warn("[DeepLink] Unknown new resource:", resource);
    }
  }

  /**
   * Action 명령어 처리
   * beauty-manager://action/check-in?reservationId=123
   */
  private handleActionCommand(path: string, params: URLSearchParams): void {
    const segments = path.split("/").filter(Boolean);

    if (segments.length === 0) {
      return;
    }

    const [action] = segments;

    switch (action) {
      case "check-in":
        this.mainWindow.webContents.send("deep-link-action", "check-in", {
          reservationId: params.get("reservationId"),
        });
        break;

      case "check-out":
        this.mainWindow.webContents.send("deep-link-action", "check-out", {
          reservationId: params.get("reservationId"),
        });
        break;

      default:
        console.warn("[DeepLink] Unknown action:", action);
    }
  }

  /**
   * 딥 링크 URL 생성 헬퍼
   */
  public static createUrl(command: string, path: string, params?: Record<string, string>): string {
    const url = new URL(`${PROTOCOL}://${command}${path}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }

    return url.toString();
  }
}
