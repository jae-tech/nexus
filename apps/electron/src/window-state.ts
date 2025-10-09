/**
 * 윈도우 상태 관리 (크기, 위치 기억)
 */

import { app, BrowserWindow } from "electron";
import * as fs from "fs";
import * as path from "path";

interface WindowState {
  width: number;
  height: number;
  x?: number;
  y?: number;
  isMaximized: boolean;
}

const DEFAULT_WIDTH = 1200;
const DEFAULT_HEIGHT = 800;

export class WindowStateManager {
  private stateFilePath: string;
  private state: WindowState;

  constructor(filename: string = "window-state.json") {
    this.stateFilePath = path.join(app.getPath("userData"), filename);
    this.state = this.loadState();
  }

  /**
   * 저장된 윈도우 상태 로드
   */
  private loadState(): WindowState {
    try {
      if (fs.existsSync(this.stateFilePath)) {
        const data = fs.readFileSync(this.stateFilePath, "utf-8");
        return JSON.parse(data);
      }
    } catch (error) {
      console.error("Failed to load window state:", error);
    }

    // 기본값 반환
    return {
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      isMaximized: false,
    };
  }

  /**
   * 윈도우 상태 저장
   */
  private saveState(): void {
    try {
      fs.writeFileSync(this.stateFilePath, JSON.stringify(this.state, null, 2));
    } catch (error) {
      console.error("Failed to save window state:", error);
    }
  }

  /**
   * 윈도우에 저장된 상태 적용
   */
  public getState(): Partial<Electron.BrowserWindowConstructorOptions> {
    return {
      width: this.state.width,
      height: this.state.height,
      x: this.state.x,
      y: this.state.y,
    };
  }

  /**
   * 윈도우 이벤트 트래킹 시작
   */
  public track(window: BrowserWindow): void {
    // 윈도우 크기 변경 트래킹
    window.on("resize", () => {
      if (!window.isMaximized()) {
        const bounds = window.getBounds();
        this.state.width = bounds.width;
        this.state.height = bounds.height;
        this.saveState();
      }
    });

    // 윈도우 이동 트래킹
    window.on("move", () => {
      if (!window.isMaximized()) {
        const bounds = window.getBounds();
        this.state.x = bounds.x;
        this.state.y = bounds.y;
        this.saveState();
      }
    });

    // 최대화 상태 트래킹
    window.on("maximize", () => {
      this.state.isMaximized = true;
      this.saveState();
    });

    window.on("unmaximize", () => {
      this.state.isMaximized = false;
      this.saveState();
    });

    // 초기 최대화 상태 복원
    if (this.state.isMaximized) {
      window.maximize();
    }
  }

  /**
   * 현재 윈도우 상태 가져오기
   */
  public getCurrentState(): WindowState {
    return { ...this.state };
  }
}
