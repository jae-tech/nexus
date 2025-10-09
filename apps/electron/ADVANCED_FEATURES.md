# Electron 고급 기능 가이드

## 구현된 기능 개요

이 문서는 Beauty Manager 일렉트론 앱에 구현된 고급 기능들을 설명합니다.

---

## 1. 윈도우 상태 관리 (Window State Manager)

### 기능
- 윈도우 크기, 위치, 최대화 상태 자동 저장
- 앱 재시작 시 이전 상태 복원

### 구현 파일
- `src/window-state.ts`

### 사용 방법
```typescript
// main.ts에서 자동으로 초기화됨
const windowStateManager = new WindowStateManager();
const state = windowStateManager.getState();

// BrowserWindow 생성 시 상태 적용
const mainWindow = new BrowserWindow({
  ...state,
  // 기타 옵션
});

// 상태 트래킹 시작
windowStateManager.track(mainWindow);
```

### 저장 위치
- **경로**: `app.getPath('userData')/window-state.json`
- **macOS**: `~/Library/Application Support/Beauty Manager/`
- **Windows**: `%APPDATA%/Beauty Manager/`
- **Linux**: `~/.config/Beauty Manager/`

---

## 2. 애플리케이션 메뉴

### 기능
- 플랫폼별 네이티브 메뉴
- 키보드 단축키 지원
- 페이지 네비게이션
- 데이터 내보내기/가져오기

### 구현 파일
- `src/menu.ts`

### 주요 메뉴
1. **파일 메뉴**
   - 새 고객 (`Cmd/Ctrl+N`)
   - 새 예약 (`Cmd/Ctrl+Shift+N`)
   - 데이터 내보내기/가져오기

2. **편집 메뉴**
   - 실행 취소/다시 실행
   - 복사/붙여넣기

3. **보기 메뉴**
   - 새로고침
   - 개발자 도구
   - 확대/축소

4. **이동 메뉴**
   - 대시보드 (`Cmd/Ctrl+1`)
   - 예약 (`Cmd/Ctrl+2`)
   - 고객 (`Cmd/Ctrl+3`)
   - 서비스 (`Cmd/Ctrl+4`)
   - 직원 (`Cmd/Ctrl+5`)

### 프론트엔드 연동
```typescript
// 렌더러 프로세스에서 메뉴 이벤트 수신
window.electron.on('menu-navigate', (path) => {
  router.navigate(path);
});

window.electron.on('menu-new-customer', () => {
  openNewCustomerModal();
});
```

---

## 3. 시스템 트레이

### 기능
- 백그라운드 실행
- 빠른 작업 메뉴
- 알림 개수 표시

### 구현 파일
- `src/tray.ts`

### 플랫폼별 아이콘
- **macOS**: `resources/trayTemplate.png` (다크모드 자동 대응)
- **Windows**: `resources/tray.ico`
- **Linux**: `resources/tray.png`

### 트레이 메뉴
- 열기
- 새 예약
- 새 고객
- 오늘 예약 보기
- 종료

### 알림 표시
```typescript
// 알림 개수 업데이트
trayManager.setBadge(5);

// 알림 아이콘으로 변경
trayManager.updateIcon(true);
```

---

## 4. 딥 링크 (Deep Link)

### 기능
- 외부 앱에서 특정 페이지 열기
- URL 스킴: `beauty-manager://`

### 구현 파일
- `src/deep-link.ts`

### URL 스킴 예시

#### 페이지 열기
```
beauty-manager://open/reservations
beauty-manager://open/customers
beauty-manager://open/customer/123
beauty-manager://open/services/456
```

#### 새 항목 생성
```
beauty-manager://new/reservation?customerId=123&serviceId=456
beauty-manager://new/customer?name=홍길동&phone=010-1234-5678
```

#### 액션 실행
```
beauty-manager://action/check-in?reservationId=123
beauty-manager://action/check-out?reservationId=123
```

### 프론트엔드 연동
```typescript
// 딥 링크 네비게이션 수신
window.electron.on('deep-link-navigate', (path) => {
  router.navigate(path);
});

// 딥 링크 액션 수신
window.electron.on('deep-link-action', (action, params) => {
  switch(action) {
    case 'new-reservation':
      openReservationModal(params);
      break;
    case 'check-in':
      handleCheckIn(params.reservationId);
      break;
  }
});
```

### 단일 인스턴스 보장
- 앱이 이미 실행 중일 때 새 인스턴스 대신 기존 윈도우 활성화
- 딥 링크 URL은 기존 인스턴스로 전달

---

## 5. 자동 업데이트

### 기능
- 백그라운드 업데이트 확인
- 사용자 알림
- 자동 다운로드 및 설치

### 구현 위치
- `src/main.ts` - `registerAutoUpdaterEvents()`

### 업데이트 프로세스
1. 앱 시작 후 5초 뒤 업데이트 확인
2. 업데이트 발견 시 자동 다운로드
3. 다운로드 완료 후 사용자 알림
4. 사용자 선택 시 재시작 및 업데이트 적용

### 이벤트
- `checking-for-update`: 업데이트 확인 중
- `update-available`: 업데이트 사용 가능
- `update-not-available`: 최신 버전
- `download-progress`: 다운로드 진행률
- `update-downloaded`: 다운로드 완료
- `error`: 업데이트 오류

### 개발 모드
- 개발 모드에서는 자동 업데이트 비활성화

---

## 6. 사용자 데이터 관리

### 기능
- 설정 저장/로드
- 데이터베이스 백업/복원
- 자동 백업 스케줄링
- 데이터 내보내기/가져오기

### 구현 파일
- `src/user-data.ts`

### 데이터 경로
```typescript
// 사용자 데이터 디렉토리
app.getPath('userData')

// 데이터베이스
userData/beauty-manager.db

// 설정 파일
userData/settings.json

// 백업 디렉토리
userData/backups/
```

### 자동 백업
- **주기**: 24시간마다
- **최대 백업 개수**: 10개
- **초기 백업**: 앱 시작 10초 후

### API 사용 예시

#### 설정 관리
```typescript
// 설정 저장
await window.electron.invoke('user-data:save-settings', {
  theme: 'dark',
  language: 'ko',
  autoBackup: true
});

// 설정 로드
const settings = await window.electron.invoke('user-data:load-settings');
```

#### 백업/복원
```typescript
// 수동 백업 생성
const backupPath = await window.electron.invoke('user-data:create-backup');

// 백업 목록 조회
const backups = await window.electron.invoke('user-data:list-backups');
// [
//   {
//     name: 'beauty-manager-backup-2024-01-15-143022.db',
//     path: '/path/to/backup',
//     date: Date,
//     size: 1024000
//   }
// ]

// 백업에서 복원 (앱 자동 재시작)
await window.electron.invoke('user-data:restore-backup', backupPath);
```

#### 데이터 내보내기/가져오기
```typescript
// JSON 형식으로 내보내기
const allData = {
  customers: await getAllCustomers(),
  services: await getAllServices(),
  staff: await getAllStaff()
};

await window.electron.invoke('user-data:export-data', allData, '/path/to/export.json');

// JSON 파일에서 가져오기
const importedData = await window.electron.invoke('user-data:import-data', '/path/to/import.json');
```

#### 디스크 사용량 확인
```typescript
const usage = await window.electron.invoke('user-data:get-disk-usage');
// {
//   database: 1024000,
//   backups: 5120000,
//   total: 6144000,
//   formatted: {
//     database: '1.00 MB',
//     backups: '5.00 MB',
//     total: '6.00 MB'
//   }
// }
```

---

## 7. IPC 통신 채널

### 데이터베이스 채널
모든 데이터베이스 작업은 `IPC_CHANNELS`에 정의됨 (기존 문서 참조)

### 사용자 데이터 채널
- `user-data:load-settings`
- `user-data:save-settings`
- `user-data:create-backup`
- `user-data:list-backups`
- `user-data:restore-backup`
- `user-data:export-data`
- `user-data:import-data`
- `user-data:get-disk-usage`

### 메뉴 이벤트 (렌더러 → 메인)
- `menu-new-customer`
- `menu-new-reservation`
- `menu-navigate`
- `menu-export-data`
- `menu-import-data`
- `menu-check-updates`

### 딥 링크 이벤트 (메인 → 렌더러)
- `deep-link-navigate`
- `deep-link-action`

---

## 8. 앱 아이콘 설정

### 필요한 아이콘 파일

#### macOS
- `resources/icon.icns` (앱 아이콘)
- `resources/trayTemplate.png` (트레이, 16x16 & 32x32)
- `resources/trayNotificationTemplate.png` (알림 트레이)

#### Windows
- `resources/icon.ico` (앱 아이콘, 256x256)
- `resources/tray.ico` (트레이, 16x16)
- `resources/tray-notification.ico` (알림 트레이)

#### Linux
- `resources/icon.png` (앱 아이콘, 512x512)
- `resources/tray.png` (트레이, 22x22)
- `resources/tray-notification.png` (알림 트레이)

### 아이콘 생성 도구
```bash
# macOS ICNS 생성
iconutil -c icns icon.iconset

# Windows ICO 생성 (ImageMagick)
convert icon.png -define icon:auto-resize=256,128,64,48,32,16 icon.ico
```

---

## 9. 앱 빌드 및 배포

### 빌드 설정
`package.json`의 `build` 섹션 참조

### 빌드 명령어
```bash
# 개발 모드
pnpm dev

# TypeScript 빌드
pnpm build:ts

# 일렉트론 앱 패키징 (테스트)
pnpm pack

# 배포용 빌드
pnpm dist
```

### 플랫폼별 빌드 결과
- **macOS**: `release/*.dmg`
- **Windows**: `release/*.exe` (NSIS 인스톨러)
- **Linux**: `release/*.AppImage`

---

## 10. 보안 설정

### 웹 보안
```typescript
webPreferences: {
  nodeIntegration: false,        // Node.js 통합 비활성화
  contextIsolation: true,        // 컨텍스트 격리 활성화
  sandbox: false,                // SQLite 접근 위해 샌드박스 비활성화
  webSecurity: true,             // 웹 보안 활성화
  allowRunningInsecureContent: false,
  preload: path.join(__dirname, "preload.js")
}
```

### CSP (Content Security Policy)
프로덕션 빌드 시 HTML에 CSP 헤더 추가 권장

---

## 11. 에러 처리

### 전역 에러 핸들러
```typescript
// 처리되지 않은 예외
process.on('uncaughtException', (error) => {
  log.error('Uncaught exception:', error);
  // 프로덕션에서는 앱 종료
});

// 처리되지 않은 Promise 거부
process.on('unhandledRejection', (reason) => {
  log.error('Unhandled rejection:', reason);
});

// 렌더러 프로세스 크래시
app.on('render-process-gone', (event, webContents, details) => {
  // 사용자에게 재시작 옵션 제공
});
```

### IPC 에러 처리
모든 IPC 핸들러는 try-catch로 래핑되어 안전한 에러 처리 제공

---

## 12. 로깅

### 로그 위치
- **개발 모드**: 콘솔 출력
- **프로덕션**: `app.getPath('userData')/logs/`

### 로그 레벨
```typescript
log.info('정보 메시지');
log.warn('경고 메시지');
log.error('에러 메시지', error);
```

---

## 13. 성능 최적화

### 렌더러 프로세스 최적화
- 코드 스플리팅
- 레이지 로딩
- 메모이제이션

### 메인 프로세스 최적화
- 데이터베이스 쿼리 최적화
- 비동기 작업 활용
- 메모리 누수 방지

---

## 14. 테스트

### 개발 모드 테스트
```bash
pnpm dev
```

### 프로덕션 빌드 테스트
```bash
pnpm pack
# release/ 폴더의 앱 실행
```

### 딥 링크 테스트
```bash
# macOS/Linux
open "beauty-manager://open/reservations"

# Windows
start beauty-manager://open/reservations
```

---

## 15. 문제 해결

### 윈도우가 나타나지 않을 때
1. 개발자 도구 확인 (`show: false` 제거)
2. 로그 확인 (`app.getPath('userData')/logs/`)
3. 윈도우 상태 파일 삭제

### 자동 업데이트가 작동하지 않을 때
- `package.json`의 버전 확인
- 서명된 빌드인지 확인 (macOS)
- 업데이트 서버 설정 확인

### 데이터베이스 오류
- 백업에서 복원
- 데이터베이스 파일 권한 확인
- SQLite 드라이버 재설치

---

## 참고 자료

- [Electron 공식 문서](https://www.electronjs.org/docs)
- [electron-updater](https://www.electron.build/auto-update)
- [electron-builder](https://www.electron.build/)
- [Better SQLite3](https://github.com/WiseLibs/better-sqlite3)
