import { app, BrowserWindow } from "electron";
import * as path from "path";
import { autoUpdater } from "electron-updater";

let mainWindow: BrowserWindow | null = null;

// ⚠️ 핵심: 프론트엔드 개발 서버의 URL을 지정합니다.
// (일반적으로 React: 3000, Vue: 8080, Next: 3000 등)
const FRONTEND_DEV_URL = "http://localhost:5173";

// 개발 모드 확인 함수
const isDev = process.env.NODE_ENV === "development";

function registerAutoUpdaterEvents() {
  if (isDev) return; // 개발 중에는 자동 업데이트 로직 건너뛰기

  // 1. 서버 URL 설정 (electron-builder 설정 파일에도 필요)
  // autoUpdater.setFeedURL({
  //     provider: 'github',
  //     repo: 'your-repo-name',
  //     owner: 'your-github-user'
  // });

  // 2. 업데이트 에러 발생 시
  autoUpdater.on("error", (error) => {
    console.error("Update Error:", error.message);
  });

  // 3. 새 업데이트 파일이 준비되면 사용자에게 알림
  autoUpdater.on("update-downloaded", (info) => {
    dialog
      .showMessageBox({
        type: "info",
        title: "새로운 업데이트",
        message: `버전 ${info.version}이(가) 다운로드되었습니다. 지금 재시작하여 업데이트를 적용하시겠습니까?`,
        buttons: ["지금 재시작", "나중에"],
      })
      .then((result) => {
        if (result.response === 0) {
          // '지금 재시작' 선택
          autoUpdater.quitAndInstall();
        }
      });
  });

  // 4. 앱이 시작되면 업데이트 확인 시작
  app.on("ready", () => {
    // 5분 후 업데이트 확인 시작 (앱 시작 직후는 로딩이 길어질 수 있으므로 약간의 지연 권장)
    setTimeout(() => {
      autoUpdater.checkForUpdatesAndNotify();
    }, 5000);
  });
}

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      // 보안 설정은 그대로 유지합니다.
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  if (isDev) {
    // 🚀 개발 모드: 로컬 개발 서버 URL을 로드합니다.
    console.log(`[Electron] Loading Development URL: ${FRONTEND_DEV_URL}`);
    mainWindow.loadURL(FRONTEND_DEV_URL);

    // 개발자 도구 자동 열기 (선택 사항)
    mainWindow.webContents.openDevTools();
  } else {
    // 📦 배포 모드: 빌드된 로컬 파일을 로드합니다. (이전 답변과 동일)
    const buildPath = path.join(__dirname, "..", "build", "index.html");
    console.log(`[Electron] Loading Production File: ${buildPath}`);
    mainWindow.loadFile(buildPath);
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  // 업데이트 이벤트 등록
  registerAutoUpdaterEvents();
}

app.whenReady().then(createWindow);

// 모든 창이 닫히면 앱을 종료합니다. (macOS 제외)
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // macOS에서는 독 아이콘 클릭 시 창이 없으면 새로 만듭니다.
  if (mainWindow === null) {
    createWindow();
  }
});
