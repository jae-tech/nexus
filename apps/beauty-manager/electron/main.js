"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const db_1 = require("./database/db");
const customerHandlers_1 = require("./ipc/customerHandlers");
const appointmentHandlers_1 = require("./ipc/appointmentHandlers");
const staffHandlers_1 = require("./ipc/staffHandlers");
const serviceHandlers_1 = require("./ipc/serviceHandlers");
let mainWindow = null;
/**
 * 메인 윈도우 생성
 */
function createWindow() {
    mainWindow = new electron_1.BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path_1.default.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    // 개발 환경에서는 Vite 개발 서버, 프로덕션에서는 빌드된 파일 로드
    if (process.env.NODE_ENV === 'development') {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    }
    else {
        mainWindow.loadFile(path_1.default.join(__dirname, '../dist/index.html'));
    }
    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}
/**
 * 앱 초기화
 */
electron_1.app.whenReady().then(async () => {
    try {
        // 데이터베이스 초기화
        await db_1.database.initialize();
        console.log('Database initialized successfully');
        // IPC 핸들러 등록
        (0, customerHandlers_1.registerCustomerHandlers)();
        (0, appointmentHandlers_1.registerAppointmentHandlers)();
        (0, staffHandlers_1.registerStaffHandlers)();
        (0, serviceHandlers_1.registerServiceHandlers)();
        console.log('IPC handlers registered');
        // 메인 윈도우 생성
        createWindow();
        electron_1.app.on('activate', () => {
            if (electron_1.BrowserWindow.getAllWindows().length === 0) {
                createWindow();
            }
        });
    }
    catch (error) {
        console.error('Failed to initialize app:', error);
        electron_1.app.quit();
    }
});
/**
 * 앱 종료 처리
 */
electron_1.app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        db_1.database.close().then(() => {
            electron_1.app.quit();
        });
    }
});
electron_1.app.on('before-quit', async () => {
    await db_1.database.close();
});
