import { app, BrowserWindow, shell, ipcMain } from "electron";
import { autoUpdater } from "electron-updater";
import { join } from "path";
import { fileURLToPath } from "url";

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
    // This method will be called when Electron has finished initialization
    app.whenReady().then(() => {
      this.createWindow();

      app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          this.createWindow();
        }
      });

      if (this.config.autoUpdater) {
        autoUpdater.checkForUpdatesAndNotify();
      }
    });

    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
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
      width: this.config.window.width,
      height: this.config.window.height,
      minWidth: this.config.window.minWidth,
      minHeight: this.config.window.minHeight,
      resizable: this.config.window.resizable,
      maximizable: this.config.window.maximizable,
      webPreferences: {
        preload: join(__dirname, "preload.js"),
        nodeIntegration: false,
        contextIsolation: true,
        enableRemoteModule: false,
        webSecurity: true,
      },
      titleBarStyle: process.platform === "darwin" ? "hiddenInset" : "default",
      show: false,
    });

    // Load the app
    if (process.env.NODE_ENV === "development") {
      this.mainWindow.loadURL(this.config.devUrl);
      this.mainWindow.webContents.openDevTools();
    } else {
      this.mainWindow.loadFile(
        join(__dirname, "..", this.config.buildPath, "index.html"),
      );
    }

    // Show window when ready to prevent visual flash
    this.mainWindow.once("ready-to-show", () => {
      this.mainWindow?.show();
    });

    this.mainWindow.on("closed", () => {
      this.mainWindow = null;
    });
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
