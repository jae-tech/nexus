# BeautyManager 빌드 가이드

## 📋 목차
- [사전 요구사항](#사전-요구사항)
- [개발 환경 설정](#개발-환경-설정)
- [빌드 실행](#빌드-실행)
- [SQLite3 네이티브 모듈 처리](#sqlite3-네이티브-모듈-처리)
- [플랫폼별 빌드](#플랫폼별-빌드)
- [트러블슈팅](#트러블슈팅)

## 사전 요구사항

### 필수 도구
- **Node.js**: v20.x 이상
- **pnpm**: v8.x 이상
- **Python**: v3.x (SQLite3 네이티브 모듈 빌드용)
- **Visual Studio Build Tools** (Windows만 해당)
  - "C++를 사용한 데스크톱 개발" 워크로드 설치 필요

### Windows 사용자
```bash
# Visual Studio Build Tools 다운로드
# https://visualstudio.microsoft.com/ko/downloads/

# 또는 npm을 통해 설치
npm install --global windows-build-tools
```

### macOS 사용자
```bash
# Xcode Command Line Tools 설치
xcode-select --install
```

### Linux 사용자
```bash
# Ubuntu/Debian
sudo apt-get install build-essential python3

# Fedora/RHEL
sudo dnf install gcc-c++ make python3
```

## 개발 환경 설정

### 1. 의존성 설치
```bash
# 프로젝트 루트에서
pnpm install
```

### 2. SQLite3 네이티브 모듈 재빌드
```bash
# Electron 버전에 맞게 SQLite3 재빌드
cd apps/mcp-beauty-manager
pnpm rebuild sqlite3
```

### 3. 개발 서버 실행
```bash
# Vite 개발 서버 + Electron 실행
pnpm electron:dev
```

## 빌드 실행

### 전체 플랫폼 빌드
```bash
cd apps/mcp-beauty-manager
pnpm electron:build
```

### 플랫폼별 빌드

#### Windows
```bash
pnpm electron:build:win
```
출력: `release/BeautyManager-1.0.0-Setup.exe`

#### macOS
```bash
pnpm electron:build:mac
```
출력:
- `release/BeautyManager-1.0.0-arm64.dmg` (Apple Silicon)
- `release/BeautyManager-1.0.0-x64.dmg` (Intel)

#### Linux
```bash
pnpm electron:build:linux
```
출력:
- `release/BeautyManager-1.0.0-x64.AppImage`
- `release/BeautyManager-1.0.0-x64.deb`

## SQLite3 네이티브 모듈 처리

### 문제
SQLite3는 네이티브 C++ 바인딩을 사용하므로, Electron 빌드 시 특별한 처리가 필요합니다.

### 해결 방법
`package.json`의 `build` 설정에서 다음과 같이 처리:

```json
{
  "build": {
    "extraResources": [
      {
        "from": "node_modules/sqlite3",
        "to": "node_modules/sqlite3",
        "filter": ["**/*"]
      }
    ],
    "asarUnpack": [
      "node_modules/sqlite3/**/*"
    ]
  }
}
```

#### 설명
1. **extraResources**: SQLite3 폴더를 빌드 결과물에 포함
2. **asarUnpack**: ASAR 압축에서 SQLite3를 제외하여 네이티브 바인딩 로드 가능

## 빌드 구조

```
release/
├── win-unpacked/              # Windows 압축 해제 버전
│   ├── BeautyManager.exe
│   ├── resources/
│   │   ├── app.asar           # 앱 코드 (SQLite3 제외)
│   │   └── app.asar.unpacked/ # SQLite3 네이티브 모듈
│   └── ...
├── mac/                       # macOS 앱 번들
│   └── BeautyManager.app/
├── linux-unpacked/            # Linux 압축 해제 버전
└── installers/                # 설치 파일들
    ├── BeautyManager-1.0.0-Setup.exe
    ├── BeautyManager-1.0.0-x64.dmg
    └── BeautyManager-1.0.0-x64.AppImage
```

## 앱 아이콘 설정

### 아이콘 준비
다음 파일들을 `build/` 디렉토리에 추가:

- **Windows**: `icon.ico` (256x256)
- **macOS**: `icon.icns` (512x512@2x)
- **Linux**: `icon.png` (512x512)

### 아이콘 생성 도구
```bash
# PNG에서 다른 형식으로 변환
npm install -g png2icons

# 사용 예시
png2icons icon.png --icns --ico --output build/
```

## 트러블슈팅

### 1. SQLite3 빌드 실패
```bash
# 에러: node-gyp rebuild 실패
# 해결: Python 및 빌드 도구 설치 후 재빌드
pnpm rebuild sqlite3 --build-from-source
```

### 2. Electron 버전 불일치
```bash
# 에러: Module did not self-register
# 해결: Electron 버전에 맞게 재빌드
./node_modules/.bin/electron-rebuild
```

### 3. Windows 코드 서명 경고
```
# 경고: 게시자를 확인할 수 없습니다
# 해결: 코드 서명 인증서 필요 (상용 배포 시)
```

### 4. macOS Gatekeeper 차단
```bash
# 해결: 앱 신뢰 설정
sudo xattr -rd com.apple.quarantine /Applications/BeautyManager.app
```

### 5. Linux 권한 문제
```bash
# AppImage 실행 권한 추가
chmod +x BeautyManager-1.0.0-x64.AppImage
```

## 배포 체크리스트

- [ ] 버전 번호 업데이트 (`package.json`)
- [ ] 앱 아이콘 준비 (`build/` 디렉토리)
- [ ] 라이선스 파일 확인 (`LICENSE`)
- [ ] 빌드 테스트 (각 플랫폼)
- [ ] SQLite3 데이터베이스 마이그레이션 테스트
- [ ] 설치/제거 프로세스 테스트
- [ ] 코드 서명 (선택, 상용 배포 시)
- [ ] 릴리스 노트 작성

## 참고 자료

- [Electron Builder 공식 문서](https://www.electron.build/)
- [SQLite3 npm 패키지](https://www.npmjs.com/package/sqlite3)
- [Electron Rebuild](https://github.com/electron/electron-rebuild)
