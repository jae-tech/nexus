import { app, BrowserWindow } from 'electron';
import path from 'path';
import { database } from './database/db';
import { registerCustomerHandlers } from './ipc/customerHandlers';
import { registerAppointmentHandlers } from './ipc/appointmentHandlers';
import { registerStaffHandlers } from './ipc/staffHandlers';
import { registerServiceHandlers } from './ipc/serviceHandlers';

let mainWindow: BrowserWindow | null = null;

/**
 * 메인 윈도우 생성
 */
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  // 개발 환경에서는 Vite 개발 서버, 프로덕션에서는 빌드된 파일 로드
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

/**
 * 앱 초기화
 */
app.whenReady().then(async () => {
  try {
    // 데이터베이스 초기화
    await database.initialize();
    console.log('Database initialized successfully');

    // IPC 핸들러 등록
    registerCustomerHandlers();
    registerAppointmentHandlers();
    registerStaffHandlers();
    registerServiceHandlers();
    console.log('IPC handlers registered');

    // 메인 윈도우 생성
    createWindow();

    app.on('activate', () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
      }
    });
  } catch (error) {
    console.error('Failed to initialize app:', error);
    app.quit();
  }
});

/**
 * 앱 종료 처리
 */
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    database.close().then(() => {
      app.quit();
    });
  }
});

app.on('before-quit', async () => {
  await database.close();
});
