# 클로드 코드 작업 가이드

## 프로젝트 개요

- **타입**: Turborepo 모노레포 디자인 시스템
- **패키지 매니저**: pnpm (워크스페이스)
- **빌드 도구**: Turbo + tsup
- **기술 스택**: TypeScript + React 19 + shadcn/ui + TailwindCSS v4 + Electron

## 핵심 패키지 구조

```
@nexus/ui              # shadcn/ui 기반 컴포넌트 라이브러리
@nexus/design-tokens   # 디자인 토큰 (색상, 간격, 타이포그래피)
@nexus/electron-builder # 일렉트론 앱 빌드 설정
@nexus/tailwind-config # Tailwind CSS 공통 설정
@nexus/eslint-config   # ESLint 공유 설정
```

## 신규 앱 생성 방법

### 1. 기본 React 앱 생성

```bash
# 새 앱 생성
pnpm create-app 앱이름

# 또는 수동 생성
cp -r apps/react-boilerplate apps/새앱이름
cd apps/새앱이름
# package.json에서 name 수정
```

### 2. 필수 의존성 설정

```json
{
  "dependencies": {
    "@nexus/ui": "workspace:*",
    "@nexus/design-tokens": "workspace:*",
    "react": "catalog:",
    "react-dom": "catalog:",
    "@tanstack/react-router": "catalog:"
  },
  "devDependencies": {
    "@nexus/eslint-config": "workspace:*",
    "@nexus/tailwind-config": "workspace:*",
    "typescript": "catalog:",
    "vite": "catalog:"
  }
}
```

## 필수 설정 규칙

### 1. 절대경로 설정 (최우선)

**tsconfig.json**

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

**vite.config.ts**

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import path from "path";

export default defineConfig({
  plugins: [TanStackRouterVite(), react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/types": path.resolve(__dirname, "./src/types"),
    },
  },
});
```

### 2. 디렉토리 구조 (반드시 준수)

```
src/
├── routes/               # TanStack Router 파일 기반 라우팅
│   ├── __root.tsx        # 루트 레이아웃
│   ├── index.tsx         # 홈페이지
│   └── [기타 페이지들]
├── components/
│   ├── ui/               # 재사용 UI 컴포넌트
│   ├── features/         # 기능별 컴포넌트
│   └── common/           # 공통 컴포넌트
├── hooks/                # 커스텀 훅
├── lib/
│   ├── utils.ts          # 유틸리티 함수
│   └── constants.ts      # 상수 정의
├── stores/               # 상태 관리
├── types/                # 타입 정의
├── styles/
│   └── globals.css       # 글로벌 스타일
├── main.tsx             # 앱 진입점 (App.tsx 사용 금지)
└── router.tsx           # 라우터 설정
```

### 3. Import 경로 우선순위

1. **절대경로 (최우선)**: `@/components/Button`
2. **워크스페이스 패키지**: `@nexus/ui`
3. **외부 패키지**: `react`, `lodash`
4. **상대경로 (최후)**: `./Button` (같은 폴더만)

## 컴포넌트 사용 패턴

### 올바른 Import 방식

```typescript
// 1순위: @nexus/ui 컴포넌트
import { Button, Card, ThemeProvider } from "@nexus/ui";

// 2순위: 절대경로 내부 컴포넌트
import { Header } from "@/components/layout/Header";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";

// 3순위: 상대경로 (같은 폴더만)
import { helper } from "./helper";
```

### 테마 설정 (필수)

```typescript
// src/routes/__root.tsx
import { createRootRoute, Outlet } from '@tanstack/react-router'
import { ThemeProvider } from '@nexus/ui'

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      <div className="min-h-screen bg-background">
        <Outlet />
      </div>
    </ThemeProvider>
  )
})
```

## 라우팅 시스템 (TanStack Router 필수)

### React Router 사용 금지

- `BrowserRouter`, `Routes`, `Route` 사용 금지
- `react-router-dom` 의존성 제거
- TanStack Router 파일 기반 라우팅만 사용

### 올바른 라우트 파일 작성

```typescript
// src/routes/index.tsx
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomePage
})

function HomePage() {
  return <div>홈페이지</div>
}
```

## 스타일링 규칙

### TailwindCSS 설정

```javascript
// tailwind.config.js
import baseConfig from "@nexus/tailwind-config";

export default {
  ...baseConfig,
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};
```

### 글로벌 스타일

```css
/* src/styles/globals.css */
@import "tailwindcss";
@import "@nexus/ui/styles";
```

## 일렉트론 앱 생성

### 일렉트론 설정

```typescript
// main.ts
import { ElectronApp } from "@nexus/electron-builder";

const app = new ElectronApp({
  name: "앱 이름",
  devUrl: "http://localhost:5173",
  window: { width: 1200, height: 800 },
});
```

### 개발 스크립트

```json
{
  "scripts": {
    "electron:dev": "concurrently \"pnpm dev\" \"electron .\"",
    "electron:build": "pnpm build && electron-builder"
  }
}
```

## 금지 사항 (반드시 지키기)

1. **App.tsx 사용 금지** - main.tsx만 사용
2. **React Router 사용 금지** - TanStack Router만 사용
3. **상대경로 남용 금지** - 절대경로 우선 사용
4. **개별 Tailwind 설정 금지** - 공통 설정 사용
5. **shadcn 컴포넌트 직접 복사 금지** - @nexus/ui 사용
6. **디자인 토큰 중복 정의 금지** - @nexus/design-tokens 사용

## 디버깅 명령어

```bash
# 의존성 문제 해결
pnpm install

# 특정 앱 빌드
pnpm --filter 앱이름 build

# 전체 빌드
pnpm turbo build

# 타입 검사
pnpm turbo type-check

# 린트 검사
pnpm turbo lint

# 개발 서버 실행
pnpm --filter 앱이름 dev
```

## 상태 관리 (Zustand 사용)

### Zustand 스토어 생성

```typescript
// src/stores/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (user) => set({ user, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
    }
  )
);
```

### 스토어 사용 패턴

```typescript
// 컴포넌트에서 사용
import { useAuthStore } from '@/stores/auth-store'

function Profile() {
  const { user, logout } = useAuthStore()

  return (
    <div>
      <p>{user?.name}</p>
      <button onClick={logout}>로그아웃</button>
    </div>
  )
}
```

### Zustand 의존성 설정

```json
{
  "dependencies": {
    "zustand": "catalog:"
  }
}
```

## 커밋 메시지 규칙

### 작업 분류 기준

커밋 메시지는 다음 형식을 사용합니다:

```
타입(범위): 설명

예시:
feat(ui): 버튼 컴포넌트 추가
fix(auth): 로그인 에러 수정
style(design): 색상 토큰 업데이트
refactor(router): TanStack Router로 마이그레이션
chore(deps): 의존성 업데이트
docs(readme): 설치 가이드 추가
```

### 커밋 타입 분류

- **feat**: 새로운 기능 추가
- **fix**: 버그 수정
- **style**: 스타일링 변경 (CSS, 디자인 토큰 등)
- **refactor**: 코드 리팩토링 (기능 변경 없음)
- **chore**: 빌드, 의존성, 설정 변경
- **docs**: 문서 변경
- **test**: 테스트 추가/수정
- **perf**: 성능 개선

### 범위 예시

- **ui**: UI 컴포넌트 관련
- **auth**: 인증 관련
- **router**: 라우팅 관련
- **store**: 상태 관리 관련
- **build**: 빌드 시스템 관련
- **config**: 설정 파일 관련

## 클로드 코드 응답 규칙

### 한글 응답 필수

- 모든 설명과 안내는 한글로 작성
- 코드 주석도 한글 사용 권장
- 에러 메시지 설명도 한글로 제공

### 응답 형식 예시

```
작업을 완료했습니다.

변경 사항:
- TanStack Router로 마이그레이션 완료
- 절대경로 설정 적용
- Zustand 스토어 추가

다음 명령어로 실행하세요:
pnpm dev
```
