import { ElectronApp } from "@nexus/electron-builder";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Electron 앱 설정
const config = {
  name: "Nexus Electron App",
  devUrl: "http://localhost:3000",
  buildPath: join(__dirname, "..", "..", "dist"), // 절대 경로로 dist 폴더 지정
  window: {
    width: 1200, // 적절한 기본 크기로 조정
    height: 800,
    minWidth: 800, // 최소 크기 조정
    minHeight: 600,
    resizable: true,
    maximizable: true,
  },
  autoUpdater: false,
};

// ElectronApp 인스턴스 생성
const electronApp = new ElectronApp(config);

// IPC 핸들러 등록 (필요한 경우)
electronApp.registerIpcHandlers({
  "app:get-version": () => {
    return process.env.npm_package_version || "0.1.0";
  },
  "app:get-name": () => {
    return config.name;
  },
  "theme:get": () => {
    // 시스템 테마 정보 반환
    return {
      shouldUseDarkColors: false, // 실제로는 nativeTheme.shouldUseDarkColors 사용
      platform: process.platform,
    };
  },
});

// 개발 모드에서의 추가 설정
if (process.env.NODE_ENV === "development") {
  console.log("🚀 Nexus Electron App starting in development mode");
  console.log(`📱 Loading React app from: ${config.devUrl}`);
} else {
  console.log("📦 Nexus Electron App starting in production mode");
}