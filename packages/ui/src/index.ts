/**
 * Nexus UI - 범용 디자인 시스템
 * 모든 Turborepo 프로젝트에서 사용 가능한 통합 UI 컴포넌트 라이브러리
 */

// ============================================================================
// Foundation Components (기본 UI 컴포넌트)
// ============================================================================
export * from "./components/ui/button.js";
export * from "./components/ui/card.js";
export * from "./components/ui/input.js";
export * from "./components/ui/label.js";
export * from "./components/ui/textarea.js";
export * from "./components/ui/checkbox.js";
export * from "./components/ui/switch.js";
export * from "./components/ui/select.js";
export * from "./components/ui/badge.js";
export * from "./components/ui/avatar.js";
export * from "./components/ui/separator.js";
export * from "./components/ui/tooltip.js";
export * from "./components/ui/dropdown-menu.js";
export * from "./components/ui/popover.js";
export * from "./components/ui/dialog.js";
export * from "./components/ui/form.js";
export * from "./components/ui/tabs.js";
export * from "./components/ui/skeleton.js";
export * from "./components/ui/progress.js";

// ============================================================================
// Layout Components (레이아웃 컴포넌트)
// ============================================================================
export * from "./components/layout/index.js";

// ============================================================================
// Feedback Components (피드백 컴포넌트 - shadcn/ui 사용)
// ============================================================================
export { Toaster } from "./components/ui/sonner.js";

// ============================================================================
// Custom Composed Components (커스텀 조합 컴포넌트)
// ============================================================================
export * from "./components/theme-provider.js";
export * from "./components/loading-spinner.js";
export * from "./components/date-picker.js";

// ============================================================================
// Utils
// ============================================================================
export * from "./lib/utils.js";
