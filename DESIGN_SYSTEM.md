# Beauty Manager Design System

## 📋 개요

Beauty Manager 앱의 통일된 디자인 시스템입니다. 일관성 있는 UI/UX를 위해 모든 컴포넌트는 이 가이드라인을 따라야 합니다.

## 🎨 Button Variants

### Primary Button

주요 액션에 사용 (저장, 생성, 확인 등)

```tsx
<Button variant="primary" size="sm">
  새 고객 추가
</Button>
```

### Secondary Button

보조 액션에 사용

```tsx
<Button variant="secondary" size="sm">
  취소
</Button>
```

### Outline Button

중성적 액션에 사용 (엑셀 내보내기, 편집 등)

```tsx
<Button variant="outline" size="sm">
  엑셀 내보내기
</Button>
```

### Success Button

성공/완료 액션에 사용

```tsx
<Button variant="success" size="sm">
  완료
</Button>
```

### Danger Button

삭제/위험한 액션에 사용

```tsx
<Button variant="danger" size="sm">
  삭제
</Button>
```

## 📦 Modal System

### 통일된 Modal 컴포넌트 사용

```tsx
import Modal, {
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@/components/ui/Modal";

function MyModal({ isOpen, onClose }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalHeader onClose={onClose}>
        <h2>모달 제목</h2>
      </ModalHeader>

      <ModalBody>
        <p>모달 내용</p>
      </ModalBody>

      <ModalFooter>
        <Button variant="secondary" onClick={onClose}>
          취소
        </Button>
        <Button variant="primary" onClick={handleSave}>
          저장
        </Button>
      </ModalFooter>
    </Modal>
  );
}
```

### Modal 크기 옵션

- `sm`: 작은 확인 다이얼로그
- `md`: 기본 폼 모달
- `lg`: 상세 정보 모달
- `xl`, `2xl`, `3xl`, `4xl`: 대용량 컨텐츠

## 🏷️ Card System

### 기본 Card

```tsx
<Card>내용</Card>
```

### 호버 효과가 있는 Card

```tsx
<Card hover>클릭 가능한 내용</Card>
```

### 패딩 옵션

```tsx
<Card padding="sm">작은 패딩</Card>
<Card padding="default">기본 패딩</Card>
<Card padding="lg">큰 패딩</Card>
<Card padding="none">패딩 없음</Card>
```

## 🎯 CSS 유틸리티 클래스

### 모달 관련

```css
/* 모달 오버레이 - 모든 모달에서 사용 */
.modal-overlay {
  @apply fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50 p-4;
}

/* 모달 컨텐츠 - 모든 모달에서 사용 */
.modal-content {
  @apply bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden;
}
```

### 인터랙션

```css
/* 포커스 링 */
.focus-ring:focus {
  outline: none;
  box-shadow: 0 0 0 2px var(--color-primary-500);
}

/* 호버 효과 */
.interactive {
  @apply transition-all duration-200;
}

.card-interactive:hover {
  @apply shadow-md transform -translate-y-0.5;
}
```

## 📐 사용 규칙

### ❌ 하지 말아야 할 것

```tsx
// 개별 컴포넌트에 인라인 스타일 적용
<Button
  variant="default"
  className="bg-blue-600 hover:bg-blue-700 text-white"
>

// 개별 모달마다 다른 배경 스타일
<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
```

### ✅ 해야 할 것

```tsx
// 통일된 variant 사용
<Button variant="primary">

// 통일된 Modal 컴포넌트 사용
<Modal isOpen={isOpen} onClose={onClose}>
```

## 🔧 확장 방법

새로운 디자인 패턴이 필요한 경우:

1. **Design System 팀에 문의** - 새로운 variant나 패턴 추가 검토
2. **UI 패키지 업데이트** - `packages/ui/src/components/ui/`에서 기본 컴포넌트 확장
3. **타입 정의 업데이트** - `src/types/nexus-ui.d.ts`에서 타입 추가
4. **문서 업데이트** - 이 가이드에 새로운 패턴 문서화

## 🎨 컬러 시스템

### Primary Colors

- `primary-50` ~ `primary-900`: 주요 브랜드 컬러
- `success-50` ~ `success-900`: 성공 상태
- `danger-50` ~ `danger-900`: 위험/에러 상태
- `warning-50` ~ `warning-900`: 경고 상태

### Neutral Colors

- `gray-50` ~ `gray-900`: 텍스트, 배경, 보더

## 📱 반응형 가이드라인

### 브레이크포인트

- `sm`: 640px+
- `md`: 768px+
- `lg`: 1024px+
- `xl`: 1280px+

### 모바일 우선 디자인

```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
```

---

**📞 문의**: 디자인 시스템 관련 질문이나 개선 제안이 있으시면 개발팀에 연락해주세요.
