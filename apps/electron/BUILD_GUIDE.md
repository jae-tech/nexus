# Beauty Manager 빌드 & 배포 가이드

## 📋 목차

1. [개발 환경 설정](#개발-환경-설정)
2. [로컬 개발](#로컬-개발)
3. [빌드 프로세스](#빌드-프로세스)
4. [플랫폼별 빌드](#플랫폼별-빌드)
5. [코드 서명](#코드-서명)
6. [자동 업데이트](#자동-업데이트)
7. [배포](#배포)
8. [문제 해결](#문제-해결)

---

## 개발 환경 설정

### 1. 필수 요구사항

```bash
# Node.js 18+ 및 pnpm 설치
node --version  # v18.0.0+
pnpm --version  # 8.0.0+

# 플랫폼별 도구
# macOS: Xcode Command Line Tools
xcode-select --install

# Windows: Visual Studio Build Tools
# https://visualstudio.microsoft.com/downloads/

# Linux: build-essential
sudo apt-get install build-essential
```

### 2. 환경 변수 설정

```bash
# .env.example을 복사하여 .env 파일 생성
cp .env.example .env

# 필요한 환경 변수 설정
vi .env
```

### 3. 의존성 설치

```bash
# 프로젝트 루트에서
pnpm install

# Electron 네이티브 모듈 빌드
cd apps/electron
pnpm run postinstall
```

---

## 로컬 개발

### 개발 서버 실행

```bash
# 방법 1: Electron만 실행
cd apps/electron
pnpm dev

# 방법 2: 프론트엔드 + Electron 동시 실행
pnpm dev:concurrent

# 방법 3: TypeScript Watch 모드
pnpm dev:watch
```

### 디버깅

```bash
# 개발자 도구가 자동으로 열림 (개발 모드)
# Chrome DevTools 사용 가능

# 로그 확인
# macOS: ~/Library/Logs/Beauty Manager/
# Windows: %USERPROFILE%\AppData\Roaming\Beauty Manager\logs\
# Linux: ~/.config/Beauty Manager/logs/
```

### Hot Reload

```bash
# TypeScript 파일 변경 시 자동 재컴파일
pnpm dev:watch

# 변경 사항 적용하려면 Electron 재시작 (Cmd+R / Ctrl+R)
```

---

## 빌드 프로세스

### 전체 빌드 플로우

```
1. 프론트엔드 빌드 (React)
   └─> apps/mcp-beauty-manager/out/

2. Electron 메인 프로세스 빌드 (TypeScript)
   └─> apps/electron/dist/

3. electron-builder 실행
   └─> apps/electron/release/
```

### 빌드 명령어

```bash
# 1. TypeScript 컴파일만
pnpm run build:ts

# 2. 전체 빌드 (프론트엔드 + Electron)
pnpm run build

# 3. 패키징 (압축 없이)
pnpm run pack

# 4. 배포용 빌드
pnpm run dist

# 5. 빌드 결과물 삭제
pnpm run clean
```

---

## 플랫폼별 빌드

### macOS

```bash
# Intel + Apple Silicon 유니버설 빌드
pnpm run dist:mac

# 출력 파일:
# - release/Beauty Manager-1.0.0.dmg
# - release/Beauty Manager-1.0.0-mac.zip
# - release/Beauty Manager-1.0.0-arm64.dmg (Apple Silicon)
# - release/Beauty Manager-1.0.0-x64.dmg (Intel)
```

**빌드 설정:**
- DMG 인스톨러
- ZIP 아카이브 (자동 업데이트용)
- Intel (x64) + Apple Silicon (arm64) 지원

### Windows

```bash
# Windows 빌드 (64bit + 32bit)
pnpm run dist:win

# 출력 파일:
# - release/Beauty Manager Setup 1.0.0.exe (NSIS 인스톨러)
# - release/Beauty Manager 1.0.0.exe (포터블 버전)
```

**빌드 설정:**
- NSIS 인스톨러 (사용자 지정 설치 경로)
- 포터블 실행 파일
- 데스크톱 바로가기 생성
- 시작 메뉴 항목 생성

### Linux

```bash
# Linux 빌드 (AppImage + deb + rpm)
pnpm run dist:linux

# 출력 파일:
# - release/Beauty Manager-1.0.0.AppImage
# - release/beauty-manager_1.0.0_amd64.deb
# - release/beauty-manager-1.0.0.x86_64.rpm
```

**빌드 설정:**
- AppImage (모든 배포판)
- .deb (Debian, Ubuntu)
- .rpm (Fedora, CentOS)

---

## 코드 서명

### macOS 코드 서명

```bash
# 1. Apple Developer ID 인증서 준비
# - Apple Developer 계정 필요
# - Keychain Access에서 인증서 내보내기 (.p12)

# 2. 환경 변수 설정
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your_password

# 3. 서명된 빌드 생성
pnpm run dist:mac

# 4. 공증 (Notarization)
# electron-builder가 자동으로 처리
# Apple ID 및 앱 전용 암호 필요
```

**entitlements.mac.plist 설정:**
```xml
<!-- SQLite 네이티브 모듈 지원 -->
<key>com.apple.security.cs.allow-unsigned-executable-memory</key>
<true/>

<!-- 파일 시스템 접근 -->
<key>com.apple.security.files.user-selected.read-write</key>
<true/>
```

### Windows 코드 서명

```bash
# 1. Code Signing 인증서 준비 (.pfx)

# 2. 환경 변수 설정
export WIN_CSC_LINK=/path/to/certificate.pfx
export WIN_CSC_KEY_PASSWORD=your_password

# 3. 서명된 빌드 생성
pnpm run dist:win
```

---

## 자동 업데이트

### GitHub Releases 설정

```bash
# 1. GitHub 토큰 생성
# Settings → Developer settings → Personal access tokens
# repo 권한 필요

# 2. 환경 변수 설정
export GH_TOKEN=ghp_your_github_token

# 3. 배포
pnpm run dist
```

### 업데이트 설정 (package.json)

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "nexus-design-system",
      "repo": "beauty-manager",
      "private": false
    }
  }
}
```

### 자동 업데이트 플로우

```
1. 앱 시작 시 업데이트 확인 (5초 후)
2. 새 버전 발견 → 백그라운드 다운로드
3. 다운로드 완료 → 사용자에게 알림
4. "지금 재시작" 클릭 → 자동 설치 & 재시작
```

### 업데이트 비활성화 (개발 모드)

```typescript
// src/main.ts
if (isDev) {
  updaterLogger.info("Auto-updater disabled in development mode");
  return;
}
```

---

## 배포

### GitHub Release 배포

```bash
# 1. 버전 업데이트
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0

# 2. 빌드 & 배포
export GH_TOKEN=your_token
pnpm run dist

# 3. GitHub Release 자동 생성
# - latest.yml 업로드 (자동 업데이트 정보)
# - 설치 파일 업로드
```

### 수동 배포

```bash
# 1. 빌드
pnpm run dist

# 2. release/ 폴더의 파일 확인
ls -la release/

# 3. 필요한 파일만 배포
# macOS: .dmg, .zip
# Windows: Setup.exe
# Linux: .AppImage, .deb, .rpm
```

### 배포 체크리스트

- [ ] 버전 번호 업데이트 (`package.json`)
- [ ] CHANGELOG.md 작성
- [ ] 코드 서명 인증서 확인
- [ ] 테스트 빌드 실행 (`pnpm run pack`)
- [ ] 모든 플랫폼에서 테스트
- [ ] 자동 업데이트 테스트
- [ ] GitHub Release 생성
- [ ] 릴리스 노트 작성

---

## 문제 해결

### SQLite 네이티브 모듈 에러

```bash
# 문제: better-sqlite3 바인딩 에러
# 해결 1: 네이티브 모듈 재빌드
pnpm run postinstall

# 해결 2: electron-builder 재설치
pnpm add -D electron-builder

# 해결 3: node_modules 재설치
rm -rf node_modules
pnpm install
```

### ASAR 압축 관련 에러

```json
// package.json - SQLite는 압축 해제 필요
{
  "build": {
    "asar": true,
    "asarUnpack": [
      "node_modules/better-sqlite3/**/*"
    ]
  }
}
```

### macOS 공증 실패

```bash
# 문제: Notarization failed
# 해결 1: Hardened Runtime 설정 확인
# entitlements.mac.plist 검토

# 해결 2: Apple ID 앱 전용 암호 생성
# https://appleid.apple.com/account/manage

# 해결 3: 공증 상태 확인
xcrun altool --notarization-info <request-id>
```

### Windows 빌드 에러

```bash
# 문제: NSIS 빌드 실패
# 해결 1: NSIS 수동 설치
# https://nsis.sourceforge.io/Download

# 해결 2: Visual Studio Build Tools 설치
# https://visualstudio.microsoft.com/downloads/
```

### 빌드 크기 최적화

```json
// package.json - 불필요한 파일 제외
{
  "build": {
    "files": [
      "dist/**/*",
      "!dist/**/*.map",  // 소스맵 제외
      "!**/*.md"          // 마크다운 제외
    ],
    "compression": "maximum"
  }
}
```

---

## 성능 최적화

### 1. 번들 크기 분석

```bash
# electron-builder 빌드 로그 확인
pnpm run dist --verbose

# 패키지 크기 확인
du -sh release/*.dmg
du -sh release/*.exe
```

### 2. 메모리 사용량 모니터링

```typescript
// src/main.ts
app.on('ready', () => {
  setInterval(() => {
    const usage = process.memoryUsage();
    appLogger.debug('Memory usage:', {
      rss: `${Math.round(usage.rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(usage.heapUsed / 1024 / 1024)} MB`
    });
  }, 60000); // 1분마다
});
```

### 3. 데이터베이스 최적화

```typescript
// 데이터베이스 VACUUM (정기적으로)
db.pragma('vacuum');

// WAL 모드 활성화 (동시성 향상)
db.pragma('journal_mode = WAL');

// 메모리 캐시 증가
db.pragma('cache_size = -64000'); // 64MB
```

---

## 추가 리소스

- [electron-builder 공식 문서](https://www.electron.build/)
- [Electron 공식 문서](https://www.electronjs.org/docs)
- [Better SQLite3 문서](https://github.com/WiseLibs/better-sqlite3)
- [Apple 코드 서명 가이드](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [Windows 코드 서명 가이드](https://docs.microsoft.com/en-us/windows/win32/seccrypto/cryptography-tools)

---

## 버전 관리

### Semantic Versioning

```
MAJOR.MINOR.PATCH

1.0.0 → 초기 릴리스
1.0.1 → 버그 수정
1.1.0 → 새 기능 추가 (하위 호환)
2.0.0 → Breaking Changes
```

### 버전 업데이트 자동화

```bash
# package.json 버전 업데이트 + Git 태그 생성
npm version patch -m "chore: release v%s"

# 자동으로 생성됨:
# - package.json 버전 업데이트
# - Git 커밋 생성
# - Git 태그 생성 (v1.0.1)
```

---

## 보안 체크리스트

- [ ] 환경 변수에 민감한 정보 저장 금지
- [ ] .env 파일 .gitignore에 추가
- [ ] 코드 서명 인증서 안전하게 보관
- [ ] GitHub 토큰 권한 최소화
- [ ] Content Security Policy 설정
- [ ] Node Integration 비활성화
- [ ] Context Isolation 활성화
- [ ] IPC 통신 검증
- [ ] 사용자 입력 검증
- [ ] SQL Injection 방어 (Prepared Statements)
