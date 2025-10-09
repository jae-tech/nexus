/**
 * 앱 메뉴 구성
 */

import { app, Menu, shell, BrowserWindow, dialog } from "electron";

export function createApplicationMenu(mainWindow: BrowserWindow): Menu {
  const isMac = process.platform === "darwin";

  const template: Electron.MenuItemConstructorOptions[] = [
    // 앱 메뉴 (macOS만)
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" as const, label: "About Beauty Manager" },
              { type: "separator" as const },
              { role: "services" as const, label: "서비스" },
              { type: "separator" as const },
              { role: "hide" as const, label: "숨기기" },
              { role: "hideOthers" as const, label: "다른 항목 숨기기" },
              { role: "unhide" as const, label: "모두 표시" },
              { type: "separator" as const },
              { role: "quit" as const, label: "종료" },
            ],
          },
        ]
      : []),

    // 파일 메뉴
    {
      label: "파일",
      submenu: [
        {
          label: "새 고객",
          accelerator: "CmdOrCtrl+N",
          click: () => {
            mainWindow.webContents.send("menu-new-customer");
          },
        },
        {
          label: "새 예약",
          accelerator: "CmdOrCtrl+Shift+N",
          click: () => {
            mainWindow.webContents.send("menu-new-reservation");
          },
        },
        { type: "separator" as const },
        {
          label: "데이터 내보내기",
          click: async () => {
            const result = await dialog.showSaveDialog(mainWindow, {
              title: "데이터 내보내기",
              defaultPath: `beauty-manager-backup-${new Date().toISOString().split("T")[0]}.json`,
              filters: [{ name: "JSON", extensions: ["json"] }],
            });

            if (!result.canceled && result.filePath) {
              mainWindow.webContents.send("menu-export-data", result.filePath);
            }
          },
        },
        {
          label: "데이터 가져오기",
          click: async () => {
            const result = await dialog.showOpenDialog(mainWindow, {
              title: "데이터 가져오기",
              filters: [{ name: "JSON", extensions: ["json"] }],
              properties: ["openFile"],
            });

            if (!result.canceled && result.filePaths.length > 0) {
              mainWindow.webContents.send("menu-import-data", result.filePaths[0]);
            }
          },
        },
        { type: "separator" as const },
        isMac ? { role: "close" as const, label: "창 닫기" } : { role: "quit" as const, label: "종료" },
      ],
    },

    // 편집 메뉴
    {
      label: "편집",
      submenu: [
        { role: "undo" as const, label: "실행 취소" },
        { role: "redo" as const, label: "다시 실행" },
        { type: "separator" as const },
        { role: "cut" as const, label: "잘라내기" },
        { role: "copy" as const, label: "복사" },
        { role: "paste" as const, label: "붙여넣기" },
        ...(isMac
          ? [
              { role: "pasteAndMatchStyle" as const, label: "붙여넣기 및 스타일 일치" },
              { role: "delete" as const, label: "삭제" },
              { role: "selectAll" as const, label: "모두 선택" },
            ]
          : [
              { role: "delete" as const, label: "삭제" },
              { type: "separator" as const },
              { role: "selectAll" as const, label: "모두 선택" },
            ]),
      ],
    },

    // 보기 메뉴
    {
      label: "보기",
      submenu: [
        { role: "reload" as const, label: "새로고침" },
        { role: "forceReload" as const, label: "강제 새로고침" },
        { role: "toggleDevTools" as const, label: "개발자 도구" },
        { type: "separator" as const },
        { role: "resetZoom" as const, label: "실제 크기" },
        { role: "zoomIn" as const, label: "확대" },
        { role: "zoomOut" as const, label: "축소" },
        { type: "separator" as const },
        { role: "togglefullscreen" as const, label: "전체 화면" },
      ],
    },

    // 이동 메뉴
    {
      label: "이동",
      submenu: [
        {
          label: "대시보드",
          accelerator: "CmdOrCtrl+1",
          click: () => {
            mainWindow.webContents.send("menu-navigate", "/");
          },
        },
        {
          label: "예약",
          accelerator: "CmdOrCtrl+2",
          click: () => {
            mainWindow.webContents.send("menu-navigate", "/reservations");
          },
        },
        {
          label: "고객",
          accelerator: "CmdOrCtrl+3",
          click: () => {
            mainWindow.webContents.send("menu-navigate", "/customers");
          },
        },
        {
          label: "서비스",
          accelerator: "CmdOrCtrl+4",
          click: () => {
            mainWindow.webContents.send("menu-navigate", "/services");
          },
        },
        {
          label: "직원",
          accelerator: "CmdOrCtrl+5",
          click: () => {
            mainWindow.webContents.send("menu-navigate", "/staff");
          },
        },
      ],
    },

    // 창 메뉴
    {
      label: "창",
      submenu: [
        { role: "minimize" as const, label: "최소화" },
        { role: "zoom" as const, label: "확대/축소" },
        ...(isMac
          ? [
              { type: "separator" as const },
              { role: "front" as const, label: "모두 앞으로 가져오기" },
              { type: "separator" as const },
              { role: "window" as const, label: "창" },
            ]
          : [{ role: "close" as const, label: "닫기" }]),
      ],
    },

    // 도움말 메뉴
    {
      label: "도움말",
      submenu: [
        {
          label: "사용 설명서",
          click: async () => {
            await shell.openExternal("https://github.com/nexus/beauty-manager/docs");
          },
        },
        {
          label: "키보드 단축키",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "키보드 단축키",
              message: "주요 단축키",
              detail: `
새 고객: Ctrl+N (Cmd+N)
새 예약: Ctrl+Shift+N (Cmd+Shift+N)

대시보드: Ctrl+1 (Cmd+1)
예약: Ctrl+2 (Cmd+2)
고객: Ctrl+3 (Cmd+3)
서비스: Ctrl+4 (Cmd+4)
직원: Ctrl+5 (Cmd+5)

검색: Ctrl+F (Cmd+F)
새로고침: Ctrl+R (Cmd+R)
개발자 도구: F12
              `.trim(),
            });
          },
        },
        { type: "separator" as const },
        {
          label: "업데이트 확인",
          click: () => {
            mainWindow.webContents.send("menu-check-updates");
          },
        },
        { type: "separator" as const },
        {
          label: "About Beauty Manager",
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: "info",
              title: "Beauty Manager",
              message: "Beauty Manager",
              detail: `버전: ${app.getVersion()}\n일렉트론: ${process.versions.electron}\nChrome: ${process.versions.chrome}\nNode.js: ${process.versions.node}`,
            });
          },
        },
      ],
    },
  ];

  return Menu.buildFromTemplate(template);
}
