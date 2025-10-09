/**
 * 시스템 트레이 관리
 */

import { app, Tray, Menu, nativeImage, BrowserWindow } from "electron";
import * as path from "path";

export class TrayManager {
  private tray: Tray | null = null;

  constructor(private mainWindow: BrowserWindow) {}

  /**
   * 시스템 트레이 생성
   */
  public create(): void {
    try {
      // 트레이 아이콘 경로
      const iconPath = this.getTrayIconPath();

      // 트레이 생성
      this.tray = new Tray(iconPath);

      // 툴팁 설정
      this.tray.setToolTip("Beauty Manager");

      // 컨텍스트 메뉴 설정
      this.setContextMenu();

      // 트레이 클릭 이벤트
      this.tray.on("click", () => {
        this.toggleWindow();
      });

      console.log("[Tray] System tray created");
    } catch (error) {
      console.error("[Tray] Failed to create system tray:", error);
    }
  }

  /**
   * 컨텍스트 메뉴 설정
   */
  private setContextMenu(): void {
    if (!this.tray) return;

    const contextMenu = Menu.buildFromTemplate([
      {
        label: "열기",
        click: () => {
          this.showWindow();
        },
      },
      {
        label: "새 예약",
        click: () => {
          this.showWindow();
          this.mainWindow.webContents.send("menu-new-reservation");
        },
      },
      {
        label: "새 고객",
        click: () => {
          this.showWindow();
          this.mainWindow.webContents.send("menu-new-customer");
        },
      },
      { type: "separator" },
      {
        label: "오늘 예약 보기",
        click: () => {
          this.showWindow();
          this.mainWindow.webContents.send("menu-navigate", "/reservations");
        },
      },
      { type: "separator" },
      {
        label: "종료",
        click: () => {
          app.quit();
        },
      },
    ]);

    this.tray.setContextMenu(contextMenu);
  }

  /**
   * 트레이 아이콘 경로 가져오기
   */
  private getTrayIconPath(): string {
    const isDev = process.env.NODE_ENV === "development" || !app.isPackaged;

    if (process.platform === "darwin") {
      // macOS: Template 이미지 사용 (다크모드 자동 대응)
      return path.join(__dirname, "..", "resources", "trayTemplate.png");
    } else if (process.platform === "win32") {
      // Windows: ICO 파일
      return path.join(__dirname, "..", "resources", "tray.ico");
    } else {
      // Linux: PNG 파일
      return path.join(__dirname, "..", "resources", "tray.png");
    }
  }

  /**
   * 윈도우 표시/숨기기 토글
   */
  private toggleWindow(): void {
    if (this.mainWindow.isVisible()) {
      this.mainWindow.hide();
    } else {
      this.showWindow();
    }
  }

  /**
   * 윈도우 표시
   */
  private showWindow(): void {
    this.mainWindow.show();
    this.mainWindow.focus();
  }

  /**
   * 트레이 제거
   */
  public destroy(): void {
    if (this.tray) {
      this.tray.destroy();
      this.tray = null;
      console.log("[Tray] System tray destroyed");
    }
  }

  /**
   * 트레이 아이콘 업데이트 (알림 등)
   */
  public updateIcon(hasNotification: boolean = false): void {
    if (!this.tray) return;

    // 알림 상태에 따라 다른 아이콘 사용 가능
    const iconPath = hasNotification ? this.getNotificationIconPath() : this.getTrayIconPath();

    this.tray.setImage(iconPath);
  }

  /**
   * 알림 아이콘 경로
   */
  private getNotificationIconPath(): string {
    if (process.platform === "darwin") {
      return path.join(__dirname, "..", "resources", "trayNotificationTemplate.png");
    } else if (process.platform === "win32") {
      return path.join(__dirname, "..", "resources", "tray-notification.ico");
    } else {
      return path.join(__dirname, "..", "resources", "tray-notification.png");
    }
  }

  /**
   * 배지 설정 (알림 개수 표시)
   */
  public setBadge(count: number): void {
    // macOS에서만 지원
    if (process.platform === "darwin" && app.dock) {
      app.dock.setBadge(count > 0 ? count.toString() : "");
    }

    // 트레이 툴팁에 알림 개수 표시
    if (this.tray) {
      const tooltip = count > 0 ? `Beauty Manager (${count}개의 알림)` : "Beauty Manager";
      this.tray.setToolTip(tooltip);
    }
  }
}
