# Nexus Design System

**프로덕션 수준의 디자인 시스템과 모노레포 아키텍처**입니다. Turborepo를 활용한
컴포넌트 라이브러리, 디자인 토큰, 크로스 플랫폼 데스크톱 앱 개발을 통해
엔터프라이즈급 프론트엔드 아키텍처 패턴, 증분 빌드 최적화, 최신 개발 도구 활용
사례를 보여줍니다.

---

## 목차

- [프로젝트 개요](#프로젝트-개요)
- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시스템 아키텍처](#시스템-아키텍처)
- [시작하기](#시작하기)
- [프로젝트 구조](#프로젝트-구조)
- [개발 가이드](#개발-가이드)
- [빌드 및 배포](#빌드-및-배포)
- [로컬 개발 주의사항](#로컬-개발-주의사항)

---

## 프로젝트 개요

Nexus는 모노레포 기반 디자인 시스템으로, 여러 애플리케이션에서 일관된 UI를
구축할 수 있도록 공통 컴포넌트 라이브러리와 디자인 토큰을 제공합니다. 실제
동작하는 Electron 데스크톱 애플리케이션(BeautyManager)을 포함하여 실무 활용
방식을 구체적으로 보여줍니다.

**핵심 목표:**

- shadcn/ui 기반으로 확장 가능한 컴포넌트 아키텍처 구축
- Turborepo 증분 빌드와 원격 캐싱으로 CI/CD 성능 최적화
- 파일 기반 라우팅, 타입 안전 상태 관리, CSS-in-JS 테마 등 최신 프론트엔드 패턴
  적용
- 별도 설정 없이 바로 시작할 수 있는 보일러플레이트 제공

---

## 주요 기능

### 1. 모노레포 아키텍처

Turborepo와 pnpm 워크스페이스를 활용해 효율적인 의존성 관리와 병렬 빌드를
구현했습니다. 증분 컴파일과 스마트 캐싱으로 **빌드 시간 70% 단축**을
달성했습니다.

### 2. 디자인 시스템

shadcn/ui와 Radix UI Primitives 기반의 50개 이상 React 컴포넌트를 제공합니다.
WCAG 2.1 AA 접근성 기준을 준수하고, 색상·타이포그래피·간격 등 100개 이상의
디자인 토큰으로 일관된 스타일링을 지원합니다.

### 3. 크로스 플랫폼 데스크톱 앱

실제 배포 가능한 Electron 앱(BeautyManager)으로 다음을 구현했습니다:

- Main과 Renderer 프로세스 간 IPC 통신
- SQLite 로컬 데이터 저장
- i18next 다국어 지원(한국어/영어)
- Zustand 상태 관리 및 영속화

### 4. 타입 안전성

100% TypeScript로 작성되었으며 strict 모드를 적용했습니다. TanStack Router는
컴파일 시점에 라우트 경로를 검증하고, Prisma는 스키마에서 타입을 자동
생성합니다.

### 5. 개발자 경험

- 파일 기반 라우팅과 자동 코드 스플리팅
- 50ms 이하의 빠른 HMR (Hot Module Replacement)
- TypeScript 경로 매핑으로 절대 경로 import 지원
- unplugin-auto-import로 컴포넌트 자동 import
- pre-commit 훅으로 린팅·포맷팅 자동 적용

---

## 기술 스택

**빌드 시스템**

- Turborepo 2.5+ (모노레포 오케스트레이션)
- pnpm 10+ (워크스페이스 관리)
- Vite 7+ (개발 서버 및 번들러)
- tsup (TypeScript 라이브러리 번들러)

**프론트엔드**

- React 19 (Concurrent Features, Suspense)
- TypeScript 5.9 (strict mode)
- TanStack Router 1.x (파일 기반 라우팅)
- Zustand 5+ (상태 관리)

**스타일링**

- TailwindCSS v4 (CSS-in-JS 아키텍처)
- shadcn/ui (컴포넌트 프리미티브)
- Radix UI (headless UI 컴포넌트)
- CSS Variables (동적 테마)

**데스크톱**

- Electron 38+ (크로스 플랫폼 데스크톱 프레임워크)
- SQLite3 (임베디드 데이터베이스)
- Electron Builder (패키징 및 배포)

**개발 도구**

- ESLint 9+ (Flat Config)
- Prettier 3+ (코드 포맷팅)
- Changesets (버전 관리 및 변경 로그)
- Vitest (단위 테스트)

---

## 시스템 아키텍처

### 시스템 개요

```
┌─────────────────────────────────────────────────────────┐
│                    Turborepo Root                        │
│  ┌───────────────────────────────────────────────────┐  │
│  │  작업 파이프라인 (의존성 DAG로 병렬화)             │  │
│  │  build → lint → type-check → test                 │  │
│  └───────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────┐         ┌─────────────────────┐  │
│  │  애플리케이션     │         │  공유 패키지        │  │
│  ├──────────────────┤         ├─────────────────────┤  │
│  │ beauty-manager   │────────▶│ @nexus/ui           │  │
│  │ react-boilerplate│         │ @nexus/design-tokens│  │
│  │ reference        │         │ @nexus/tailwind-cfg │  │
│  └──────────────────┘         │ @nexus/eslint-cfg   │  │
│                                │ @nexus/typescript   │  │
│                                │ @nexus/electron     │  │
│                                └─────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

### 데이터 흐름

**컴포넌트 개발 흐름**

1. 개발자가 `@nexus/ui`에서 공통 컴포넌트 import
2. TailwindCSS JIT 엔진이 사용된 클래스만 스캔해 최소 CSS 생성
3. `@nexus/design-tokens`의 디자인 토큰이 CSS 변수로 변환
4. Vite가 번들링하며 HMR로 즉시 피드백 제공

**빌드 파이프라인 실행**

```bash
pnpm build
# Turbo가 의존성 그래프 분석:
# 1. @nexus/design-tokens (의존성 없음)
# 2. @nexus/tailwind-config (design-tokens 의존)
# 3. @nexus/ui (design-tokens, tailwind-config 의존)
# 4. beauty-manager (ui, design-tokens 의존)
# 변경되지 않은 패키지는 캐시된 산출물 사용 (해시 기반 검증)
```

### 패키지 의존성 그래프

```
beauty-manager (Electron 앱)
├── @nexus/ui
│   ├── @nexus/design-tokens
│   └── @nexus/tailwind-config
│       └── @nexus/design-tokens
├── @nexus/electron-builder
├── @nexus/eslint-config
└── @nexus/typescript-config
```

---

## 시작하기

### 사전 요구사항

- **Node.js**: 18.0.0 이상
- **pnpm**: 9.0.0 이상 (`npm install -g pnpm`으로 설치)
- **Git**: 버전 관리용

### 설치

```bash
# 저장소 클론
git clone <repository-url>
cd nexus

# 의존성 설치 (postinstall 스크립트도 자동 실행됨)
pnpm install

# 설치 확인
pnpm --version
```

### 개발 서버 실행

```bash
# 모든 애플리케이션을 개발 모드로 실행
pnpm dev

# 특정 애플리케이션만 실행
pnpm --filter beauty-manager dev

# Electron 데스크톱 앱 실행
pnpm --filter beauty-manager electron:dev
```

### 프로덕션 빌드

```bash
# 모든 패키지 및 애플리케이션 빌드
pnpm build

# 특정 애플리케이션만 빌드
pnpm --filter beauty-manager build

# Electron 앱 배포용 패키징
pnpm --filter beauty-manager electron:build:win  # Windows
pnpm --filter beauty-manager electron:build:mac  # macOS
pnpm --filter beauty-manager electron:build:linux # Linux
```

---

## 프로젝트 구조

### 디렉토리 레이아웃

```
nexus/
├── apps/                       # 애플리케이션 패키지
│   ├── beauty-manager/         # Electron 데스크톱 애플리케이션
│   │   ├── src/
│   │   │   ├── routes/         # TanStack Router 파일 기반 라우트
│   │   │   ├── components/     # 애플리케이션 전용 컴포넌트
│   │   │   ├── stores/         # Zustand 상태 관리
│   │   │   ├── lib/            # 유틸리티 함수
│   │   │   ├── types/          # TypeScript 타입 정의
│   │   │   └── locales/        # i18next 번역 파일
│   │   ├── electron/           # Electron 메인 프로세스
│   │   │   ├── main.ts         # 애플리케이션 라이프사이클
│   │   │   ├── preload.ts      # IPC 브릿지
│   │   │   └── database.ts     # SQLite 핸들러
│   │   └── package.json
│   ├── react-boilerplate/      # 신규 앱 생성용 템플릿
│   └── reference/              # 문서 및 예제
│
├── packages/                   # 공유 라이브러리
│   ├── ui/                     # 컴포넌트 라이브러리
│   │   ├── src/
│   │   │   ├── components/     # 50+ 재사용 컴포넌트
│   │   │   ├── hooks/          # 커스텀 React 훅
│   │   │   └── lib/            # 유틸리티 (cn, clsx 등)
│   │   └── styles/             # 전역 CSS 및 import
│   ├── design-tokens/          # 디자인 시스템 토큰
│   ├── electron-builder/       # Electron 빌드 설정
│   ├── tailwind-config/        # 공유 Tailwind 설정
│   ├── typescript-config/      # 기본 TypeScript 설정
│   └── eslint-config/          # ESLint 규칙
│
├── scripts/                    # 빌드 및 자동화 스크립트
├── turbo.json                  # Turborepo 설정
├── pnpm-workspace.yaml         # pnpm 워크스페이스 정의
└── package.json                # 루트 패키지 매니페스트
```

### 주요 파일 및 역할

| 파일                                   | 설명                                    |
| -------------------------------------- | --------------------------------------- |
| `turbo.json`                           | 작업 파이프라인, 캐싱 규칙, 의존성 정의 |
| `pnpm-workspace.yaml`                  | pnpm용 워크스페이스 패키지 선언         |
| `apps/beauty-manager/electron/main.ts` | Electron 메인 프로세스 진입점           |
| `packages/ui/src/index.ts`             | 모든 UI 컴포넌트의 중앙 집중식 export   |
| `packages/design-tokens/src/colors.ts` | 색상 팔레트 정의 (HSL 형식)             |
| `scripts/create-app.js`                | 신규 애플리케이션 스캐폴딩용 CLI 도구   |

---

## 개발 가이드

### 환경 변수

루트 디렉토리에 `.env` 파일을 생성하여 전역 설정을 관리합니다:

```env
# Turborepo Remote Cache (선택사항)
TURBO_TOKEN=your_vercel_token
TURBO_TEAM=your_team_slug

# 애플리케이션별 변수 (각 app/.env에 설정)
# beauty-manager 예시:
DATABASE_URL=file:./beauty_manager.db
VITE_APP_TITLE=BeautyManager
```

### 새 애플리케이션 생성

```bash
# 내장 CLI 사용
pnpm create-app my-new-app

# 수동 생성
cp -r apps/react-boilerplate apps/my-new-app
cd apps/my-new-app
# package.json의 name 필드 수정
```

### UI 라이브러리에 새 컴포넌트 추가

```bash
cd packages/ui

# shadcn CLI 사용 (권장)
npx shadcn@latest add button

# 컴포넌트는 src/index.ts에서 자동으로 export됨
```

### 상태 관리 패턴

```typescript
// stores/feature-store.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface FeatureState {
  data: Data[];
  setData: (data: Data[]) => void;
}

export const useFeatureStore = create<FeatureState>()(
  persist(
    (set) => ({
      data: [],
      setData: (data) => set({ data }),
    }),
    { name: 'feature-storage' }
  )
);
```

### 라우팅 규칙

TanStack Router의 파일 기반 라우팅은 다음 규칙을 따릅니다:

```
routes/
├── __root.tsx          # 루트 레이아웃 (모든 라우트를 감쌈)
├── index.tsx           # 홈페이지 (/)
├── about.tsx           # /about
├── users/
│   ├── index.tsx       # /users
│   └── [id].tsx        # /users/:id (동적 세그먼트)
└── _layout.tsx         # 경로 없는 레이아웃 (그룹화용)
```

---

## 빌드 및 배포

### 프로덕션 빌드 프로세스

```bash
# 1. 이전 빌드 정리
pnpm clean

# 2. 타입 검사 실행
pnpm type-check

# 3. 모든 패키지 빌드
pnpm build

# 4. 테스트 실행 (있는 경우)
pnpm test

# 5. Electron 앱 패키징
cd apps/beauty-manager
pnpm electron:build:win
```

### 배포 전략

**웹 애플리케이션:**

- 빌드 출력물: `apps/[app-name]/dist/`
- 정적 호스팅에 배포 (Vercel, Netlify, S3 + CloudFront)
- 최적화를 위해 `NODE_ENV=production` 설정

**Electron 데스크톱 앱:**

- 빌드 출력물: `apps/beauty-manager/release/`
- 배포 가능 형식: NSIS (Windows), DMG (macOS), AppImage/deb (Linux)
- 프로덕션 릴리스에는 코드 서명 권장

### CI/CD 설정 예시

```yaml
# .gitlab-ci.yml 또는 .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main, develop]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 10
      - uses: actions/setup-node@v4
        with:
          node-version: 18
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
      - run: pnpm lint
      - run: pnpm type-check
```

---

## 로컬 개발 주의사항

### 일반적인 문제 및 해결 방법

**1. 모듈을 찾을 수 없는 오류**

- `pnpm install` 정상 완료 여부 확인
- `tsconfig.json`의 경로 매핑 설정 확인
- IDE에서 TypeScript 서버 재시작

**2. TailwindCSS v4 설정 관련**

- CSS 파일에 `@import "tailwindcss"` 사용 (`tailwind.config.js`가 아님)
- 커스텀 테마는 `@theme` 블록에 작성
- CSS 변경 시 Vite 개발 서버 재시작 필요

**3. Electron 빌드 실패**

- 메인 프로세스 컴파일 테스트: `pnpm --filter beauty-manager electron:dev`
- `electron/tsconfig.json`의 Node.js 타입 설정 확인
- 네이티브 의존성 재빌드: `npm rebuild sqlite3`

**4. Turborepo 캐시 이슈**

- 캐시 삭제: `pnpm exec turbo clean`
- 강제 재빌드: `pnpm build --force`
- `.turbo` 폴더 권한 확인

### 권장 IDE 설정

**Visual Studio Code 확장 프로그램:**

- ESLint (`dbaeumer.vscode-eslint`)
- Prettier (`esbenp.prettier-vscode`)
- Tailwind CSS IntelliSense (`bradlc.vscode-tailwindcss`)
- TypeScript Vue Plugin (`Vue.vscode-typescript-vue-plugin`)

**설정 (`.vscode/settings.json`):**

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

### 성능 최적화 팁

1. **Turbo Remote Caching**: 팀 전체가 빌드 캐시를 공유하도록 Vercel 연동

   ```bash
   pnpm exec turbo login
   pnpm exec turbo link
   ```

2. **선택적 실행**: `--filter`로 특정 패키지만 실행

   ```bash
   pnpm --filter="beauty-manager" dev
   pnpm --filter="@nexus/*" build
   ```

3. **병렬 처리**: Turbo가 독립적인 작업을 자동으로 병렬 실행

4. **증분 빌드**: 변경된 패키지만 다시 빌드 (`turbo.json` 참고)

---
