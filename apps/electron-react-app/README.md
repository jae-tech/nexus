# Nexus Electron App

React 19 + Vite + TypeScript + Electron 앱으로 Nexus Design System을 활용한 데스크톱 애플리케이션입니다.

## ✨ 주요 기능

- **React 19.1.1** - 최신 React 컨커런트 기능
- **Electron 38.1.2** - 크로스 플랫폼 데스크톱 앱
- **Vite 7** - 빠른 빌드 도구 및 개발 서버
- **TypeScript 5.9** - 타입 안전성 및 개발자 경험
- **TailwindCSS v4** - 현대적 유틸리티 우선 CSS 프레임워크
- **Nexus UI** - 완전한 컴포넌트 라이브러리
- **React Router v6** - 클라이언트 사이드 라우팅
- **테마 지원** - 다크/라이트 모드 및 시스템 설정
- **IPC 통신** - Electron과 React 간 안전한 통신
- **에러 바운더리** - 우아한 에러 처리

## 🚀 빠른 시작

### 개발 모드

1. **의존성 설치**
   ```bash
   pnpm install
   ```

2. **개발 서버 시작** (React + Electron 동시 실행)
   ```bash
   pnpm dev
   ```

   또는 개별 실행:
   ```bash
   # React 개발 서버만 시작
   pnpm dev:react

   # Electron 앱만 시작 (React 서버가 실행 중이어야 함)
   pnpm dev:electron
   ```

### 프로덕션 빌드

1. **전체 빌드**
   ```bash
   pnpm build
   ```

2. **Electron 앱 실행**
   ```bash
   ./node_modules/.bin/electron .
   ```

3. **앱 패키징** (선택사항)
   ```bash
   pnpm build:app
   ```

### 사용 가능한 스크립트

```bash
# 개발
pnpm dev              # React + Electron 동시 개발 모드
pnpm dev:react        # React 개발 서버만 시작
pnpm dev:electron     # Electron 앱만 시작

# 빌드
pnpm build            # React + Electron 전체 빌드
pnpm build:react      # React 앱만 빌드
pnpm build:electron   # Electron 메인 프로세스만 빌드
pnpm build:app        # 전체 빌드 + Electron 패키징

# 코드 품질
pnpm lint             # ESLint 실행
pnpm lint:fix         # ESLint 자동 수정
pnpm type-check       # TypeScript 타입 검사

# 유틸리티
pnpm preview          # Vite 프로덕션 미리보기
pnpm clean            # 빌드 파일 정리
```

## 📁 프로젝트 구조

```
apps/electron-react-app/
├── electron/                 # Electron 메인 프로세스
│   └── main.ts              # 앱 설정 및 ElectronApp 인스턴스
├── src/                     # React 앱 소스
│   ├── components/          # React 컴포넌트
│   │   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── common/         # 공통 컴포넌트
│   │   └── pages/          # 페이지 컴포넌트
│   ├── hooks/              # 커스텀 React 훅
│   │   ├── use-theme.ts    # 테마 관리
│   │   ├── use-electron.ts # Electron API 훅
│   │   └── use-local-storage.ts
│   ├── lib/                # 유틸리티 함수
│   ├── types/              # TypeScript 타입 정의
│   │   ├── electron.d.ts   # Electron API 타입
│   │   └── nexus-ui.d.ts   # Nexus UI 타입
│   └── styles/             # 글로벌 스타일
├── dist/                   # 빌드 결과
│   ├── assets/            # React 빌드 에셋
│   ├── electron/          # Electron 메인 프로세스 빌드
│   └── index.html         # React 앱 엔트리
└── release/               # 패키징된 앱 (build:app 실행 시)
```

## 🔧 Electron API 사용법

### 기본 IPC 통신

```tsx
import { useElectronAPI } from '@/hooks/use-electron';

function MyComponent() {
  const { isElectron, invoke } = useElectronAPI();

  const handleGetAppInfo = async () => {
    if (isElectron) {
      const version = await invoke('app:get-version');
      const name = await invoke('app:get-name');
      console.log({ version, name });
    }
  };

  return (
    <div>
      {isElectron && (
        <button onClick={handleGetAppInfo}>
          앱 정보 가져오기
        </button>
      )}
    </div>
  );
}
```

### 앱 정보 훅 사용

```tsx
import { useElectronAppInfo } from '@/hooks/use-electron';

function AppInfo() {
  const appInfo = useElectronAppInfo();

  if (!appInfo) return null;

  return (
    <div>
      <h3>{appInfo.name}</h3>
      <p>버전: {appInfo.version}</p>
      <p>플랫폼: {appInfo.platform}</p>
    </div>
  );
}
```

## 🎨 Nexus UI 컴포넌트 사용

```tsx
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge
} from '@nexus/ui';

function Dashboard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>대시보드</CardTitle>
        <Badge variant="secondary">Electron</Badge>
      </CardHeader>
      <CardContent>
        <Button variant="default">
          액션 실행
        </Button>
      </CardContent>
    </Card>
  );
}
```

## 🔍 주요 특징

### Electron 환경 감지
앱이 Electron 환경에서 실행 중인지 자동으로 감지하고 브라우저에서도 정상 작동합니다.

### 안전한 IPC 통신
preload 스크립트를 통해 안전하게 Electron API에 접근할 수 있습니다.

### 반응형 테마
시스템 테마 설정을 감지하고 다크/라이트 모드를 지원합니다.

### Hot Reload
개발 모드에서 React와 Electron 모두 Hot Reload를 지원합니다.

## 🚢 배포

1. **빌드 생성**
   ```bash
   pnpm build:app
   ```

2. **패키징된 앱 확인**
   ```bash
   ls release/
   ```

생성된 앱은 `release/` 디렉토리에서 확인할 수 있습니다.

## 🤝 기여하기

1. 저장소 포크
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add some amazing feature'`)
4. 브랜치에 푸시 (`git push origin feature/amazing-feature`)
5. Pull Request 생성

## 📄 라이선스

이 프로젝트는 MIT 라이선스 하에 있습니다.