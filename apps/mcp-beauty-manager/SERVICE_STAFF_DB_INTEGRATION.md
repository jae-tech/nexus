# 서비스 및 직원 관리 DB 연동 가이드

## 개요

Electron DB와 연동된 서비스 및 직원 관리 시스템입니다. Better-SQLite3를 사용하여 데이터 영속성을 제공하며, IPC 통신을 통해 메인 프로세스와 렌더러 프로세스 간 데이터 교환을 수행합니다.

## 주요 기능

### 서비스 관리

- ✅ CRUD 작업 (생성, 조회, 수정, 삭제)
- ✅ 카테고리별 그룹핑 및 필터링
- ✅ 가격 범위 검색 및 정렬
- ✅ 서비스 인기도 분석 (예약 횟수 기반)
- ✅ 서비스 복제 기능
- ✅ 일괄 가격 업데이트
- ✅ 삭제 영향 분석 (관련 예약 확인)
- ✅ 수익성 분석
- ✅ 고객 맞춤 서비스 추천
- ✅ 자동 검증 (이름 중복, 가격 범위 등)

### 직원 관리

- ✅ CRUD 작업 (생성, 조회, 수정, 삭제)
- ✅ 직책별 그룹핑 및 필터링
- ✅ 성과 분석 (완료율, 매출 기여도)
- ✅ 예약 현황 조회 (진행중/완료/취소)
- ✅ 근무시간 통계
- ✅ TOP 성과자 조회
- ✅ 예약 재배정 (직원 퇴사 시)
- ✅ 삭제 영향 분석
- ✅ 자동 검증 (전화번호 중복, 형식 검증)

## 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Renderer Process                      │
│  ┌─────────────────────────────────────────────────┐   │
│  │  React Components (ServicesPage-DB.tsx 등)      │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │  Custom Hooks (use-services.ts, use-staff.ts)  │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │  API Types (api-types.ts)                      │   │
│  └──────────────────┬──────────────────────────────┘   │
└─────────────────────┼──────────────────────────────────┘
                      │ window.api (Context Bridge)
┌─────────────────────▼──────────────────────────────────┐
│                    Main Process                         │
│  ┌─────────────────────────────────────────────────┐   │
│  │  IPC Handlers (main.ts)                         │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │  Business Logic (service-logic.ts, staff-logic)│   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │  Database Layer (database.ts)                  │   │
│  └──────────────────┬──────────────────────────────┘   │
│                     │                                    │
│  ┌─────────────────▼──────────────────────────────┐   │
│  │  Better-SQLite3                                │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

## 파일 구조

```
apps/
├── electron/
│   └── src/
│       ├── db/
│       │   ├── database.ts           # 데이터베이스 기본 CRUD
│       │   ├── service-logic.ts      # 서비스 비즈니스 로직
│       │   └── staff-logic.ts        # 직원 비즈니스 로직
│       ├── main.ts                   # IPC 핸들러 정의
│       └── preload.ts                # Context Bridge API 노출
│
└── mcp-beauty-manager/
    └── src/
        ├── hooks/
        │   ├── use-services.ts       # 서비스 관리 훅
        │   └── use-staff.ts          # 직원 관리 훅
        ├── lib/
        │   └── api-types.ts          # 타입 정의
        └── features/
            ├── services/
            │   └── pages/
            │       └── ServicesPage-DB.tsx
            └── staff/
                └── pages/
                    └── StaffPage-DB.tsx
```

## 사용 예시

### 1. 서비스 관리

#### 서비스 목록 조회
```typescript
import { useServices } from '@/hooks/use-services';

function MyComponent() {
  const { services, loading, error, refetch } = useServices();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <ul>
      {services.map(service => (
        <li key={service.id}>{service.name} - {service.price}원</li>
      ))}
    </ul>
  );
}
```

#### 서비스 생성
```typescript
import { useCreateService } from '@/hooks/use-services';

function AddServiceForm() {
  const { createService, loading, error } = useCreateService();

  const handleSubmit = async (formData) => {
    try {
      const serviceId = await createService({
        name: '커트',
        category: '헤어',
        price: 20000,
        duration: 60,
        description: '기본 커트 서비스'
      });

      console.log('서비스 생성 완료:', serviceId);
    } catch (err) {
      console.error('서비스 생성 실패:', err.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 서비스 수정
```typescript
import { useUpdateService } from '@/hooks/use-services';

function EditServiceForm({ serviceId }) {
  const { updateService, loading } = useUpdateService();

  const handleUpdate = async () => {
    await updateService(serviceId, {
      price: 25000,
      description: '업데이트된 설명'
    });
  };

  return <button onClick={handleUpdate}>가격 수정</button>;
}
```

#### 서비스 삭제 (영향 분석 포함)
```typescript
import { useDeleteService, useServiceDeletionImpact } from '@/hooks/use-services';

function DeleteServiceButton({ serviceId }) {
  const { impact, loading } = useServiceDeletionImpact(serviceId);
  const { deleteService } = useDeleteService();

  const handleDelete = async () => {
    if (impact && !impact.canDelete) {
      alert(`삭제 불가:\n${impact.warnings.join('\n')}`);
      return;
    }

    try {
      await deleteService(serviceId);
      console.log('서비스 삭제 완료');
    } catch (err) {
      console.error('삭제 실패:', err.message);
    }
  };

  return (
    <div>
      {loading && <p>분석 중...</p>}
      {impact && (
        <div>
          <p>활성 예약: {impact.activeReservations}건</p>
          <p>미래 예약: {impact.futureReservations}건</p>
          <button onClick={handleDelete} disabled={!impact.canDelete}>
            삭제
          </button>
        </div>
      )}
    </div>
  );
}
```

#### 서비스 복제
```typescript
import { useDuplicateService } from '@/hooks/use-services';

function DuplicateButton({ serviceId }) {
  const { duplicateService } = useDuplicateService();

  const handleDuplicate = async () => {
    const newServiceId = await duplicateService(serviceId, '커트 (복사본)');
    console.log('복제된 서비스 ID:', newServiceId);
  };

  return <button onClick={handleDuplicate}>복제</button>;
}
```

#### 일괄 가격 업데이트
```typescript
import { useBulkUpdatePrices } from '@/hooks/use-services';

function BulkPriceUpdate({ selectedServiceIds }) {
  const { bulkUpdatePrices } = useBulkUpdatePrices();

  const handleBulkUpdate = async () => {
    await bulkUpdatePrices(
      selectedServiceIds.map(id => ({
        serviceId: id,
        newPrice: 30000,
        reason: '시즌 인상'
      }))
    );
  };

  return <button onClick={handleBulkUpdate}>일괄 가격 수정</button>;
}
```

#### 서비스 인기도 조회
```typescript
import { useServiceStats } from '@/hooks/use-services';

function PopularServices() {
  const { stats, loading } = useServiceStats('2024-01-01', '2024-12-31');

  return (
    <div>
      <h2>인기 서비스</h2>
      {stats.map((stat, index) => (
        <div key={stat.service_id}>
          <p>#{index + 1} {stat.service_name}</p>
          <p>예약: {stat.total_reservations}회</p>
          <p>매출: {stat.total_revenue.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
}
```

#### 카테고리별 평균 가격
```typescript
import { useCategoryAveragePrices } from '@/hooks/use-services';

function CategoryPriceAnalysis() {
  const { avgPrices, loading } = useCategoryAveragePrices();

  return (
    <div>
      {Object.entries(avgPrices).map(([category, avgPrice]) => (
        <p key={category}>
          {category}: {avgPrice.toLocaleString()}원
        </p>
      ))}
    </div>
  );
}
```

### 2. 직원 관리

#### 직원 목록 조회
```typescript
import { useStaff } from '@/hooks/use-staff';

function StaffList() {
  const { staff, loading, error, refetch } = useStaff();

  if (loading) return <div>로딩 중...</div>;

  return (
    <ul>
      {staff.map(member => (
        <li key={member.id}>
          {member.name} - {member.position}
        </li>
      ))}
    </ul>
  );
}
```

#### 직원 생성
```typescript
import { useCreateStaff } from '@/hooks/use-staff';

function AddStaffForm() {
  const { createStaff, loading } = useCreateStaff();

  const handleSubmit = async (formData) => {
    try {
      const staffId = await createStaff({
        name: '홍길동',
        phone: '010-1234-5678',
        position: '헤어 디자이너',
        hire_date: '2024-01-01',
        salary: 3000000
      });

      console.log('직원 생성 완료:', staffId);
    } catch (err) {
      console.error('생성 실패:', err.message);
    }
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

#### 직원 성과 분석
```typescript
import { useStaffPerformance } from '@/hooks/use-staff';

function StaffPerformanceReport() {
  const { performance, loading } = useStaffPerformance(
    undefined, // 전체 직원
    '2024-01-01',
    '2024-12-31'
  );

  return (
    <div>
      {performance.map(perf => (
        <div key={perf.staff_id}>
          <h3>{perf.staff_name}</h3>
          <p>완료율: {perf.completion_rate.toFixed(1)}%</p>
          <p>총 매출: {perf.total_revenue.toLocaleString()}원</p>
          <p>성과 점수: {perf.performance_score.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
}
```

#### 직원 예약 현황
```typescript
import { useStaffReservationStatus } from '@/hooks/use-staff';

function StaffReservationDashboard({ staffId }) {
  const { status, loading } = useStaffReservationStatus(staffId);

  if (!status) return null;

  return (
    <div>
      <p>다가오는 예약: {status.upcoming}건</p>
      <p>진행중: {status.inProgress}건</p>
      <p>완료: {status.completed}건</p>
      <p>취소: {status.cancelled}건</p>
    </div>
  );
}
```

#### 직원 삭제 및 예약 재배정
```typescript
import { useDeleteStaff, useStaffDeletionImpact, useReassignReservations } from '@/hooks/use-staff';

function StaffDeletion({ staffId }) {
  const { impact } = useStaffDeletionImpact(staffId);
  const { deleteStaff } = useDeleteStaff();
  const { reassignReservations } = useReassignReservations();

  const handleDeleteWithReassignment = async () => {
    if (impact?.reassignmentNeeded) {
      // 다른 직원에게 예약 재배정
      const reassignedCount = await reassignReservations(
        staffId,
        2, // 새로운 직원 ID
        new Date().toISOString().split('T')[0]
      );

      console.log(`${reassignedCount}건의 예약이 재배정되었습니다.`);
    }

    // 직원 삭제
    await deleteStaff(staffId);
  };

  return (
    <div>
      {impact && (
        <>
          <p>활성 예약: {impact.activeReservations}건</p>
          <p>미래 예약: {impact.futureReservations}건</p>
          {impact.warnings.map((warning, i) => (
            <p key={i} className="text-red-600">{warning}</p>
          ))}
          <button onClick={handleDeleteWithReassignment}>
            {impact.reassignmentNeeded ? '재배정 후 삭제' : '삭제'}
          </button>
        </>
      )}
    </div>
  );
}
```

#### TOP 성과자 조회
```typescript
import { useTopPerformers } from '@/hooks/use-staff';

function TopPerformersBoard() {
  const { topPerformers, loading } = useTopPerformers(5, '2024-01-01', '2024-12-31');

  return (
    <div>
      <h2>이달의 TOP 5</h2>
      {topPerformers.map((staff, index) => (
        <div key={staff.staff_id}>
          <p>#{index + 1} {staff.staff_name}</p>
          <p>성과 점수: {staff.performance_score.toFixed(2)}</p>
          <p>매출: {staff.total_revenue.toLocaleString()}원</p>
        </div>
      ))}
    </div>
  );
}
```

#### 근무시간 통계
```typescript
import { useStaffWorkingHours } from '@/hooks/use-staff';

function WorkingHoursReport({ staffId }) {
  const { workingHours, loading } = useStaffWorkingHours(
    staffId,
    '2024-01-01',
    '2024-01-31'
  );

  if (!workingHours) return null;

  return (
    <div>
      <p>총 근무일: {workingHours.totalDays}일</p>
      <p>총 예약: {workingHours.totalReservations}건</p>
      <p>일평균 예약: {workingHours.avgReservationsPerDay.toFixed(1)}건</p>
      <p>가장 바쁜 날: {workingHours.busiestDay}</p>
    </div>
  );
}
```

## 데이터 검증

### 서비스 검증 규칙
- ✅ 서비스명 필수
- ✅ 가격 0 이상
- ✅ 소요시간 0 이상
- ✅ 이름 중복 검사

### 직원 검증 규칙
- ✅ 이름 필수
- ✅ 전화번호 필수 및 형식 검증 (`010-XXXX-XXXX`)
- ✅ 전화번호 중복 검사
- ✅ 직책 필수
- ✅ 급여 0 이상

## 성능 최적화

1. **React 훅 메모이제이션**
   - `useCallback`으로 함수 메모이제이션
   - `useMemo`로 필터링/정렬 결과 캐싱

2. **데이터베이스 최적화**
   - JOIN 쿼리로 다중 API 호출 방지
   - 인덱스 활용으로 검색 속도 향상

3. **조건부 데이터 로딩**
   - 필요한 경우에만 통계 데이터 요청
   - 페이지네이션 지원 (향후 추가 가능)

## 에러 처리

모든 훅은 다음 패턴으로 에러를 처리합니다:

```typescript
try {
  // DB 작업 수행
  await window.api.service.create(data);
} catch (err) {
  setError(err as Error);
  throw err; // 상위 컴포넌트에서 처리 가능
}
```

컴포넌트에서의 에러 처리 예시:

```typescript
const handleCreate = async () => {
  try {
    await createService(data);
    toast.success('생성 완료');
  } catch (err) {
    toast.error(err.message);
  }
};
```

## 테스트 데이터

Electron 앱을 실행하면 다음 테스트 데이터가 자동 생성됩니다:

### 서비스 (15개)
- 헤어 카테고리: 커트, 펌, 염색 등
- 네일 카테고리: 네일 아트, 젤 네일 등
- 피부 카테고리: 기본 관리, 딥 클렌징 등

### 직원 (10명)
- 다양한 직책: 헤어 디자이너, 네일 아티스트, 피부 관리사 등
- 각각 고유한 연락처 및 입사일

### 고객 (20명)
- 다양한 연령대 및 성별
- 연락처 및 생년월일 포함

### 예약 (30건)
- 과거, 현재, 미래 예약 포함
- 다양한 상태: pending, confirmed, completed, cancelled

## 다음 단계

1. **페이지 교체**
   - `ServicesPage.tsx` → `ServicesPage-DB.tsx`로 교체
   - `StaffPage.tsx` → `StaffPage-DB.tsx`로 교체

2. **라우팅 업데이트**
   ```typescript
   // src/routes/services.index.tsx
   import ServicesPageDB from '@/features/services/pages/ServicesPage-DB';

   export const Route = createFileRoute('/services/')({
     component: ServicesPageDB
   });
   ```

3. **추가 기능 구현**
   - 서비스 카테고리 DB 관리
   - 직원 근무 스케줄 관리
   - 성과 대시보드 차트 추가

4. **최적화**
   - 무한 스크롤 또는 페이지네이션 추가
   - 검색 디바운싱 적용
   - 낙관적 업데이트 구현

## 문제 해결

### 1. "Electron API not available" 에러
- Electron 환경에서 실행 중인지 확인
- `window.api`가 정상적으로 노출되었는지 확인

### 2. 검증 에러
- 에러 메시지를 확인하고 입력 데이터 수정
- 필수 필드가 모두 채워졌는지 확인

### 3. 삭제 실패
- `analyzeDeletion` API로 삭제 가능 여부 먼저 확인
- 관련 예약이 있는 경우 재배정 또는 취소 후 삭제

## 참고 자료

- [예약 관리 DB 연동 가이드](./RESERVATION_DB_INTEGRATION.md)
- [Electron IPC 공식 문서](https://www.electronjs.org/docs/latest/api/ipc-main)
- [Better-SQLite3 문서](https://github.com/WiseLibs/better-sqlite3/blob/master/docs/api.md)
- [React Hooks 가이드](https://react.dev/reference/react)
