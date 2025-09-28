import { app, BrowserWindow, shell, ipcMain, Menu } from "electron";
import updaterPkg from "electron-updater";
import { join } from "path";
import { fileURLToPath } from "url";

const { autoUpdater } = updaterPkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = join(__filename, "..");

export interface ElectronConfig {
  /**
   * The name of the application
   */
  name: string;
  /**
   * The URL to load in development mode
   */
  devUrl?: string;
  /**
   * The path to the built React app
   */
  buildPath?: string;
  /**
   * Window configuration
   */
  window?: {
    width?: number;
    height?: number;
    minWidth?: number;
    minHeight?: number;
    resizable?: boolean;
    maximizable?: boolean;
  };
  /**
   * Whether to enable auto-updater
   */
  autoUpdater?: boolean;
}

export class ElectronApp {
  private mainWindow: BrowserWindow | null = null;
  private config: Required<ElectronConfig>;

  constructor(config: ElectronConfig) {
    const defaultConfig = {
      devUrl: "http://localhost:5173",
      buildPath: "dist",
      window: {
        width: 1200,
        height: 800,
        minWidth: 800,
        minHeight: 600,
        resizable: true,
        maximizable: true,
      },
      autoUpdater: false,
    };

    this.config = {
      ...defaultConfig,
      ...config,
      window: {
        ...defaultConfig.window,
        ...config.window,
      },
    };

    this.initialize();
  }

  private initialize() {
    // macOS에서 앱 이름 설정
    if (process.platform === "darwin") {
      app.setName(this.config.name);
    }

    // 개발 모드에서 웹 보안 완화
    if (process.env.NODE_ENV === "development") {
      app.commandLine.appendSwitch("disable-web-security");
      app.commandLine.appendSwitch("disable-site-isolation-trials");
      app.commandLine.appendSwitch("disable-features", "OutOfBlinkCors");
    }

    // GPU 가속 설정 (성능 최적화)
    app.commandLine.appendSwitch("enable-features", "VaapiVideoDecoder");

    // This method will be called when Electron has finished initialization
    app.whenReady().then(() => {
      // macOS에서 앱 독 설정 (아이콘 파일이 있는 경우에만)
      if (process.platform === "darwin") {
        try {
          const iconPath = join(__dirname, "../assets/icon.icns");
          app.dock.setIcon(iconPath);
        } catch (error) {
          // 아이콘 파일이 없어도 앱은 정상 실행
          console.log("Icon file not found, using default icon");
        }
      }

      this.createWindow();
      this.createMenu();

      // macOS에서 독 아이콘 클릭 시 창 복원
      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        } else if (this.mainWindow) {
          // 기존 창이 있으면 표시하고 포커스
          if (this.mainWindow.isMinimized()) {
            this.mainWindow.restore();
          }
          this.mainWindow.show();
          this.mainWindow.focus();
        }
      });

      if (this.config.autoUpdater) {
        autoUpdater.checkForUpdatesAndNotify();
      }
    });

    // 모든 창이 닫혔을 때 처리
    app.on("window-all-closed", () => {
      // macOS에서는 명시적으로 종료하지 않는 한 앱이 계속 실행
      if (process.platform !== "darwin") {
        app.quit();
      }
    });

    // 앱이 종료되기 전에 정리 작업
    app.on("before-quit", () => {
      // 필요시 상태 저장 등의 정리 작업
    });

    // Handle app protocol for production
    if (process.defaultApp) {
      if (process.argv.length >= 2) {
        app.setAsDefaultProtocolClient(this.config.name, process.execPath, [
          join(process.cwd(), process.argv[1]),
        ]);
      }
    } else {
      app.setAsDefaultProtocolClient(this.config.name);
    }

    // Security: prevent new window creation
    app.on("web-contents-created", (_, contents) => {
      contents.on("new-window", (navigationEvent, navigationUrl) => {
        navigationEvent.preventDefault();
        shell.openExternal(navigationUrl);
      });
    });
  }

  private createWindow() {
    this.mainWindow = new BrowserWindow({
      // 기본 창 크기 및 위치
      width: this.config.window.width,
      height: this.config.window.height,
      minWidth: this.config.window.minWidth,
      minHeight: this.config.window.minHeight,
      resizable: this.config.window.resizable,
      maximizable: this.config.window.maximizable,

      // 창 위치 및 표시 설정
      center: true, // 화면 중앙에 배치
      show: false, // ready-to-show 이벤트에서 표시

      // 창 레벨 및 포커스 설정 (겹침 방지)
      alwaysOnTop: false, // 다른 앱과 겹치지 않도록
      fullscreen: false, // 전체화면 비활성화
      kiosk: false, // 키오스크 모드 비활성화

      // macOS 특화 설정
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
      trafficLightPosition: process.platform === "darwin" ? { x: 20, y: 15 } : undefined,
      vibrancy: process.platform === "darwin" ? "under-window" : undefined,

      // 보안 설정
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        // 개발 모드에서는 webSecurity 완화 (localhost 접근을 위해)
        webSecurity: process.env.NODE_ENV !== "development",
        allowRunningInsecureContent: process.env.NODE_ENV === "development",
        experimentalFeatures: false,
      },

      // 창 동작 설정
      closable: true,
      minimizable: true,
      autoHideMenuBar: false, // 메뉴바 자동 숨김 비활성화
      useContentSize: true, // 콘텐츠 크기 기준으로 설정하여 DevTools 영향 최소화

      // 아이콘 설정 (필요시)
      icon: process.platform === "darwin" ? undefined : join(__dirname, "../assets/icon.png"),
    });

    // Load the app
    if (process.env.NODE_ENV === "development") {
      console.log(`Loading development URL: ${this.config.devUrl}`);
      this.mainWindow.loadURL(this.config.devUrl);

      // 환경변수로 DevTools 제어 (기본적으로 자동 열리지 않음)
      this.mainWindow.webContents.once("did-finish-load", () => {
        console.log("Development app loaded successfully");

        // OPEN_DEVTOOLS 환경변수가 'true'일 때만 자동으로 열기
        if (process.env.OPEN_DEVTOOLS === 'true') {
          this.mainWindow?.webContents.openDevTools();
        }
      });

      // 로드 실패 시 재시도 로직
      this.mainWindow.webContents.once("did-fail-load", async (event, errorCode, errorDescription) => {
        console.log(`Failed to load ${this.config.devUrl}: ${errorDescription}`);
        console.log("Retrying in 2 seconds...");
        setTimeout(() => {
          this.mainWindow?.loadURL(this.config.devUrl);
        }, 2000);
      });
    } else {
      // buildPath가 절대 경로인지 확인
      const indexPath = this.config.buildPath.startsWith("/")
        ? join(this.config.buildPath, "index.html")
        : join(__dirname, "..", this.config.buildPath, "index.html");

      this.mainWindow.loadFile(indexPath);
    }

    // 창 표시 및 포커스 관리
    this.mainWindow.once("ready-to-show", () => {
      if (this.mainWindow) {
        this.mainWindow.show();
        // 개발 모드가 아닐 때만 포커스
        if (process.env.NODE_ENV !== "development") {
          this.mainWindow.focus();
        }
      }
    });

    // 창 상태 변화 이벤트 처리
    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });

    // macOS에서 창 포커스 관리
    this.mainWindow.on("blur", () => {
      // 창이 포커스를 잃었을 때의 처리 (필요시)
    });

    this.mainWindow.on("focus", () => {
      // 창이 포커스를 받았을 때의 처리 (필요시)
    });

    // 창 크기 변경 이벤트 처리
    this.mainWindow.on("resize", () => {
      // 창 크기가 변경되었을 때의 처리 (필요시 상태 저장)
    });

    // 로드 실패 시 에러 처리
    this.mainWindow.webContents.on("did-fail-load", (event, errorCode, errorDescription) => {
      console.error("Failed to load:", errorDescription);
    });

    // DevTools 이벤트 처리 (레이아웃 안정성 개선)
    this.mainWindow.webContents.on('devtools-opened', () => {
      console.log('DevTools opened');
      // DevTools가 열렸을 때 창 크기 유지
      if (this.mainWindow) {
        const bounds = this.mainWindow.getBounds();
        // 약간의 지연 후 창 크기 복원 (DevTools 레이아웃 적용 대기)
        setTimeout(() => {
          this.mainWindow?.setBounds(bounds);
        }, 100);
      }
    });

    this.mainWindow.webContents.on('devtools-closed', () => {
      console.log('DevTools closed');
      // DevTools가 닫혔을 때 웹 콘텐츠 레이아웃 재조정
      if (this.mainWindow) {
        this.mainWindow.webContents.executeJavaScript(`
          // 뷰포트 크기 변경 이벤트 발생시켜 React 리렌더링 트리거
          window.dispatchEvent(new Event('resize'));
        `).catch(err => console.log('Layout adjustment failed:', err));
      }
    });

    // 새 창 열기 방지 (보안)
    this.mainWindow.webContents.setWindowOpenHandler(({ url }) => {
      shell.openExternal(url);
      return { action: "deny" };
    });
  }

  private createMenu() {
    const template = [
      {
        label: 'Application',
        submenu: [
          { label: 'About Application', selector: 'orderFrontStandardAboutPanel:' },
          { type: 'separator' },
          { label: 'Quit', accelerator: 'Command+Q', click: function() { app.quit(); }}
        ]
      },
      {
        label: 'Developer',
        submenu: [
          {
            label: 'Toggle DevTools',
            accelerator: process.platform === 'darwin' ? 'Cmd+Option+I' : 'Ctrl+Shift+I',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.webContents.toggleDevTools();
              }
            }
          },
          {
            label: 'Reload',
            accelerator: process.platform === 'darwin' ? 'Cmd+R' : 'Ctrl+R',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.webContents.reload();
              }
            }
          },
          {
            label: 'Force Reload',
            accelerator: process.platform === 'darwin' ? 'Cmd+Shift+R' : 'Ctrl+Shift+R',
            click: () => {
              if (this.mainWindow) {
                this.mainWindow.webContents.reloadIgnoringCache();
              }
            }
          }
        ]
      }
    ];

    // 플랫폼별 메뉴 설정
    if (process.platform === 'darwin') {
      template[0].label = this.config.name;
    } else {
      // Windows/Linux에서는 간단한 메뉴
      template[0] = {
        label: 'File',
        submenu: [
          { label: 'Quit', accelerator: 'Ctrl+Q', click: function() { app.quit(); }}
        ]
      };
    }

    const menu = Menu.buildFromTemplate(template as any);
    Menu.setApplicationMenu(menu);
  }

  /**
   * Get the main window instance
   */
  public getMainWindow() {
    return this.mainWindow;
  }

  /**
   * Register IPC handlers
   */
  public registerIpcHandlers(
    handlers: Record<string, (event: any, ...args: any[]) => any>,
  ) {
    Object.entries(handlers).forEach(([channel, handler]) => {
      ipcMain.handle(channel, handler);
    });
  }
}

// Export builder configuration
export const builderConfig = {
  appId: "com.myorg.app",
  productName: "My App",
  directories: {
    output: "release",
    assets: "assets",
  },
  files: ["dist/**/*", "node_modules/**/*", "package.json"],
  extraMetadata: {
    main: "dist/main.js",
  },
  mac: {
    icon: "assets/icon.icns",
    category: "public.app-category.productivity",
    hardenedRuntime: true,
    entitlements: "assets/entitlements.mac.plist",
    entitlementsInherit: "assets/entitlements.mac.plist",
    notarize: {
      teamId: process.env.APPLE_TEAM_ID,
    },
  },
  win: {
    icon: "assets/icon.ico",
    target: [
      {
        target: "nsis",
        arch: ["x64"],
      },
    ],
  },
  linux: {
    icon: "assets/icon.png",
    target: [
      {
        target: "AppImage",
        arch: ["x64"],
      },
    ],
  },
  publish: {
    provider: "github",
    owner: "your-username",
    repo: "your-repo",
  },
};
