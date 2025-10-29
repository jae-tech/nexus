# 예약 관리 시스템 DB 연동 가이드

## 개요

예약 관리 시스템이 Electron DB와 완전히 연동되었습니다. 이제 실제 데이터베이스를 사용하여 예약을 관리할 수 있습니다.

## 주요 기능

### 1. 예약 달력 뷰
- **조인 쿼리 연동**: `getReservationsWithDetails()` API를 통해 예약 + 고객 + 직원 + 서비스 정보를 한 번에 조회
- **날짜별 필터링**: 특정 날짜 범위의 예약만 조회하여 성능 최적화
- **상태별 색상 구분**: pending(대기), confirmed(확정), completed(완료), cancelled(취소) 상태별로 시각적 구분
- **직원별 필터링**: 특정 직원의 예약만 확인 가능

### 2. 예약 생성 프로세스
- **자동 검증**: 예약 생성 전 비즈니스 로직을 통해 자동 검증
  - 영업시간 체크
  - 시간 충돌 검사
  - 과거 날짜 방지
- **종료 시간 자동 계산**: 서비스 소요시간을 기준으로 종료시간 자동 계산
- **실시간 충돌 알림**: 다른 예약과 겹치는 경우 즉시 알림

### 3. 예약 수정 기능
- **부분 업데이트**: 변경된 필드만 업데이트
- **재검증**: 수정 내용에 대해 다시 검증 수행
- **자동 종료시간 재계산**: 시작시간이나 서비스가 변경되면 종료시간 자동 재계산

### 4. 비즈니스 로직

#### 시간 충돌 검사
```typescript
// 특정 날짜/시간에 예약이 가능한지 확인
const conflict = await window.api.reservation.checkConflict(
  "2025-10-08",  // 날짜
  "14:00",       // 시작 시간
  "15:30",       // 종료 시간
  1,             // 직원 ID (선택사항)
  null           // 제외할 예약 ID (수정 시 사용)
);

if (conflict.hasConflict) {
  console.log("충돌하는 예약:", conflict.conflictingReservations);
}
```

#### 가능한 시간대 조회
```typescript
// 특정 날짜에 예약 가능한 시간대 목록
const slots = await window.api.reservation.getAvailableSlots(
  "2025-10-08",  // 날짜
  1,             // 직원 ID (선택사항)
  90             // 서비스 소요시간 (분)
);

// 결과:
// [
//   { time: "09:00", available: true },
//   { time: "09:30", available: false, reason: "이미 예약됨" },
//   { time: "12:00", available: false, reason: "영업시간 외" },
//   ...
// ]
```

#### 예약 가능한 직원 조회
```typescript
// 특정 시간대에 예약 가능한 직원 목록
const staff = await window.api.reservation.getAvailableStaff(
  "2025-10-08",  // 날짜
  "14:00",       // 시작 시간
  "15:30",       // 종료 시간
  "헤어 디자이너" // 직책 (선택사항)
);
```

#### 예약 검증
```typescript
// 예약 생성 전 검증
const validation = await window.api.reservation.validate({
  customer_id: 1,
  service_id: 3,
  staff_id: 2,
  reservation_date: "2025-10-08",
  start_time: "14:00",
  status: "confirmed"
});

if (!validation.valid) {
  console.log("검증 실패:", validation.errors);
}
```

### 5. 영업시간 관리
```typescript
// 영업시간 조회
const hours = await window.api.reservation.getBusinessHours();
console.log(hours);
// { openTime: "09:00", closeTime: "18:00", breakStart: "12:00", breakEnd: "13:00" }

// 영업시간 변경
await window.api.reservation.updateBusinessHours({
  openTime: "09:00",
  closeTime: "20:00",
  breakStart: "12:00",
  breakEnd: "13:00"
});
```

## 사용 방법

### 1. 예약 페이지 변경

기존 ReservationsPage.tsx를 새로 작성된 DB 연동 버전으로 교체:

```bash
# 기존 파일 백업
mv apps/mcp-beauty-manager/src/features/reservations/pages/ReservationsPage.tsx \
   apps/mcp-beauty-manager/src/features/reservations/pages/ReservationsPage.bak.tsx

# DB 연동 버전을 메인으로 변경
mv apps/mcp-beauty-manager/src/features/reservations/pages/ReservationsPage-DB.tsx \
   apps/mcp-beauty-manager/src/features/reservations/pages/ReservationsPage.tsx
```

### 2. 커스텀 훅 사용

#### 예약 목록 조회
```typescript
import { useReservations } from '@/hooks/use-reservations';

function MyComponent() {
  const { reservations, loading, error, refetch } = useReservations(
    "2025-10-01",  // 시작 날짜
    "2025-10-31",  // 종료 날짜
    "confirmed"    // 상태 필터 (선택사항)
  );

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return <div>{reservations.length}개의 예약</div>;
}
```

#### 예약 생성
```typescript
import { useCreateReservation } from '@/hooks/use-reservations';

function AddReservationForm() {
  const { createReservation, creating, error } = useCreateReservation();

  const handleSubmit = async () => {
    const result = await createReservation({
      customer_id: 1,
      service_id: 3,
      staff_id: 2,
      reservation_date: "2025-10-08",
      start_time: "14:00",
      status: "confirmed"
    });

    if (result.success) {
      console.log("예약 생성 완료:", result.id);
    } else {
      console.error("예약 생성 실패:", result.error);
    }
  };

  return (
    <button onClick={handleSubmit} disabled={creating}>
      {creating ? "생성 중..." : "예약 추가"}
    </button>
  );
}
```

#### 예약 수정
```typescript
import { useUpdateReservation } from '@/hooks/use-reservations';

function EditReservationForm({ reservationId }: { reservationId: number }) {
  const { updateReservation, updating, error } = useUpdateReservation();

  const handleUpdate = async () => {
    const result = await updateReservation(reservationId, {
      start_time: "15:00",  // 시작 시간만 변경
      status: "completed"    // 상태 변경
    });

    if (result.success) {
      console.log("예약 수정 완료");
    }
  };

  return (
    <button onClick={handleUpdate} disabled={updating}>
      {updating ? "수정 중..." : "예약 수정"}
    </button>
  );
}
```

### 3. 데이터베이스 엔티티 조회

```typescript
import { useCustomers, useStaff, useServices } from '@/hooks/use-database';

function MyComponent() {
  const { customers, loading: customersLoading } = useCustomers();
  const { staff, loading: staffLoading } = useStaff();
  const { services, loading: servicesLoading } = useServices();

  // 사용...
}
```

## 성능 최적화

### 1. 날짜 범위 제한
불필요한 데이터 로드를 방지하기 위해 항상 날짜 범위를 지정:

```typescript
// ✅ 좋은 예
const { reservations } = useReservations("2025-10-01", "2025-10-31");

// ❌ 나쁜 예 (전체 데이터 로드)
const { reservations } = useReservations();
```

### 2. 메모이제이션
React useMemo를 활용한 불필요한 재계산 방지:

```typescript
const filteredReservations = useMemo(() => {
  return reservations.filter(/* 필터링 로직 */);
}, [reservations, /* 의존성 */]);
```

### 3. 조인 쿼리 활용
여러 번의 API 호출 대신 조인 쿼리 사용:

```typescript
// ✅ 좋은 예 (1번의 API 호출)
const reservations = await window.api.db.getReservationsWithDetails();

// ❌ 나쁜 예 (N+1 문제)
const reservations = await window.api.db.getReservations();
for (const r of reservations) {
  const customer = await window.api.db.getCustomerById(r.customer_id);
  const service = await window.api.db.getServiceById(r.service_id);
  // ...
}
```

## 에러 처리

모든 API 호출은 try-catch로 감싸져 있으며, 에러 발생 시 사용자 친화적인 메시지를 표시합니다:

```typescript
try {
  const result = await createReservation(data);
  if (!result.success) {
    alert(result.error);  // 사용자에게 표시
  }
} catch (error) {
  console.error("예기치 않은 오류:", error);
}
```

## 테스트 데이터

개발 모드에서는 자동으로 테스트 데이터가 생성됩니다:
- 15개의 서비스
- 7명의 직원
- 25명의 고객
- 100개의 예약 (과거 50개, 오늘 10개, 미래 40개)

## 다음 단계

1. **드래그 앤 드롭 구현**: 캘린더에서 예약을 드래그하여 시간 변경
2. **대안 시간 제안 UI**: 충돌 시 가능한 시간대 제안
3. **휴무일 관리**: 휴무일 데이터베이스 테이블 추가 및 UI 구현
4. **예약 리마인더**: 예약 전날 알림 기능
5. **통계 대시보드**: 예약 통계를 시각화하는 대시보드 추가

## 문의

이슈가 발생하거나 개선 사항이 있으면 팀에 문의해주세요.
