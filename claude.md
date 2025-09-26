# Claude.md - Turborepo 디자인 시스템 가이드

## 프로젝트 컨텍스트

- **타입**: Turborepo 모노레포 디자인 시스템
- **패키지 매니저**: pnpm (workspace)
- **빌드 도구**: Turbo + tsup
- **스택**: TypeScript + React + shadcn/ui + Tailwind CSS + Electron

## 핵심 패키지 구조

```
@nexus/ui              # shadcn/ui 기반 컴포넌트 라이브러리
@nexus/design-tokens   # 색상, 간격, 타이포그래피 등 디자인 토큰
@nexus/electron-builder # Electron 앱 빌드 설정
@nexus/tailwind-config # Tailwind CSS 공통 설정
```

## 신규 앱 생성 패턴

### 1. 기본 React 앱

```bash
# apps/app-name/ 생성
pnpm turbo gen workspace --type app
```

**package.json 템플릿:**

```json
{
  "name": "app-name",
  "dependencies": {
    "@nexus/ui": "workspace:*",
    "@nexus/design-tokens": "workspace:*",
    "react": "catalog:react",
    "react-dom": "catalog:react-dom"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "vite": "catalog:vite",
    "@vitejs/plugin-react": "catalog:@vitejs/plugin-react"
  },
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

**필수 설정 파일들:**

- `tsconfig.json` - 절대경로 설정 포함
- `vite.config.ts` - alias 절대경로 설정 포함

### 2. Electron 앱

**main.ts 템플릿:**

```typescript
import { ElectronApp } from "@nexus/electron-builder";

const app = new ElectronApp({
  name: "App Name",
  devUrl: "http://localhost:5173",
  window: { width: 1200, height: 800 },
});
```

## 일관된 디자인 적용

### 1. 테마 설정

```typescript
// main.tsx
import { ThemeProvider } from '@nexus/ui'

export default function main() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="app-theme">
      {/* 앱 내용 */}
    </ThemeProvider>
  )
}
```

### 2. Tailwind 설정

```javascript
// tailwind.config.js
import baseConfig from "@nexus/tailwind-config";

export default {
  ...baseConfig,
  content: ["./src/**/*.{ts,tsx}", "../../packages/ui/src/**/*.{ts,tsx}"],
};
```

## 컴포넌트 사용 패턴

```typescript
// 1순위: 절대경로 (권장)
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  ThemeProvider,
  LoadingSpinner,
} from "@nexus/ui";

import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { UserType } from "@/types/user";
import Header from "@/components/Header";

// 2순위: 상대경로 (절대경로 불가능한 경우)
import Button from "./Button";
import { helper } from "../utils/helper";
```

### Import 경로 결정 가이드

- **같은 폴더**: `./ComponentName` (상대경로)
- **다른 폴더**: `@/components/ComponentName` (절대경로 우선)
- **라이브러리**: `@nexus/ui` (workspace 패키지)
- **외부 패키지**: `react`, `lodash` (패키지명)

## 클로드 코드 작업 지침

### 필수 설정 - Import 경로 우선순위

**경로 사용 우선순위: 절대경로 > 상대경로**

1. **TypeScript 설정** (`tsconfig.json`):

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

2. **Vite 설정** (`vite.config.ts`):

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@/components": path.resolve(__dirname, "./src/components"),
      "@/lib": path.resolve(__dirname, "./src/lib"),
      "@/hooks": path.resolve(__dirname, "./src/hooks"),
      "@/types": path.resolve(__dirname, "./src/types"),
      "@/utils": path.resolve(__dirname, "./src/utils"),
    },
  },
});
```

### 토큰 최적화 원칙

1. **절대경로 최우선**: `@/`로 시작하는 절대경로 사용 (권장)
2. **상대경로 차선**: 절대경로 설정 불가 시에만 `./`, `../` 사용
3. **기존 패키지 참조**: 새 컴포넌트 생성 시 `@nexus/ui`에서 기존 것 재사용
4. **설정 재사용**: tailwind.config, tsconfig, eslint는 workspace 패키지 활용
5. **패턴 반복**: 위 템플릿 구조를 일관되게 적용

### 작업 우선순위

1. 신규 앱 디렉토리 구조 생성
2. 기본 설정 파일 복사/수정
3. 핵심 컴포넌트 구현 (기존 UI 패키지 활용)
4. Electron 설정 적용
5. 빌드/배포 스크립트 설정

### 금지사항

- 디자인 토큰 중복 정의 (항상 `@nexus/design-tokens` 사용)
- shadcn/ui 컴포넌트 직접 복사 (항상 `@nexus/ui`에서 import)
- 개별 앱별 Tailwind 설정 (공통 config 사용)
- **절대경로 가능한데 상대경로 사용** (절대경로 우선 원칙)

### 디버깅 가이드

```bash
# 의존성 문제
pnpm install

# 빌드 오류
pnpm turbo build --filter=app-name

# 타입 에러
pnpm turbo type-check
```

### 일렉트론 빌드

```json
{
  "scripts": {
    "electron:dev": "concurrently \"pnpm dev\" \"electron .\"",
    "electron:build": "pnpm build && electron-builder"
  }
}
```

## 명령어 치트시트

```bash
# 새 앱 생성
pnpm turbo gen workspace --type app

# 개발 서버 실행
pnpm turbo dev --filter=app-name

# 전체 빌드
pnpm turbo build

# 컴포넌트 추가 (UI 패키지에)
pnpm --filter @nexus/ui exec shadcn@latest add [component]

# Electron 앱 빌드
pnpm --filter app-name run electron:build
```
