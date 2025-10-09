# Data Access Layer Hooks

Electron IPC 통신을 추상화하는 React Hook 기반 데이터 접근 계층입니다.

---

## 📋 개요

이 Hook들은 `window.api.db` IPC 호출을 감싸서 다음 기능을 제공합니다:

- ✅ 자동 재시도 로직
- ✅ 로딩 및 에러 상태 관리
- ✅ 로컬 캐싱
- ✅ 옵티미스틱 업데이트
- ✅ TypeScript 타입 안전성
- ✅ React Query 스타일 인터페이스

---

## 🎯 제공되는 Hooks

### 1. `useServices`

서비스(시술 메뉴) 데이터 관리

```typescript
import { useServices } from '@/hooks';

function ServicesPage() {
  const {
    // 조회
    services,
    loading,
    error,
    refetch,

    // CRUD
    createService,
    updateService,
    deleteService,

    // 검색/필터링
    searchServices,
    filterByCategory,
    filterByPriceRange,

    // 기타
    categories,
  } = useServices();

  return (
    // UI 렌더링
  );
}
```

### 2. `useCustomers`

고객 데이터 관리

```typescript
import { useCustomers } from '@/hooks';

function CustomersPage() {
  const {
    // 조회
    customers,
    loading,
    error,
    refetch,

    // CRUD
    createCustomer,
    updateCustomer,
    deleteCustomer,

    // 검색/필터링
    searchCustomers,
    filterByGender,
    sortByName,

    // 통계
    getCustomerStats,
    getVisitHistory,
  } = useCustomers();

  return (
    // UI 렌더링
  );
}
```

### 3. `useStaff`

직원 데이터 관리

```typescript
import { useStaff } from '@/hooks';

function StaffPage() {
  const {
    // 조회
    staff,
    loading,
    error,
    refetch,

    // CRUD
    createStaff,
    updateStaff,
    deleteStaff,

    // 검색/필터링
    searchStaff,
    filterByPosition,
    getAvailableStaff,

    // 스케줄/실적
    getStaffSchedule,
    getStaffPerformance,

    // 기타
    positions,
  } = useStaff();

  return (
    // UI 렌더링
  );
}
```

### 4. `useReservations`

예약 데이터 관리

```typescript
import { useReservations } from '@/hooks';

function ReservationsPage() {
  const {
    // 조회
    reservations,
    loading,
    error,
    refetch,

    // CRUD
    createReservation,
    updateReservation,
    deleteReservation,

    // 검색/필터링
    filterByDate,
    filterByDateRange,
    filterByStatus,
    filterByCustomer,
    filterByStaff,

    // 충돌 감지
    checkConflict,

    // 통계
    getTodayReservations,
    getUpcomingReservations,
    getPendingReservations,
  } = useReservations();

  return (
    // UI 렌더링
  );
}
```

---

## 💡 사용 예제

### 1. 기본 조회

```typescript
function ServicesList() {
  const { services, loading, error } = useServices();

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>에러: {error.message}</div>;

  return (
    <ul>
      {services.map((service) => (
        <li key={service.id}>
          {service.name} - {service.price.toLocaleString()}원
        </li>
      ))}
    </ul>
  );
}
```

### 2. 생성 (Create)

```typescript
function AddServiceForm() {
  const { createService, creating, createError } = useServices();

  const handleSubmit = async (formData) => {
    try {
      const newService = await createService({
        name: formData.name,
        category: formData.category,
        price: formData.price,
        duration: formData.duration,
      });

      console.log('서비스 생성 성공:', newService);
      alert('서비스가 추가되었습니다!');
    } catch (error) {
      console.error('서비스 생성 실패:', error);
      alert('서비스 추가에 실패했습니다.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* 폼 필드 */}
      <button type="submit" disabled={creating}>
        {creating ? '추가 중...' : '서비스 추가'}
      </button>
      {createError && <p className="error">{createError.message}</p>}
    </form>
  );
}
```

### 3. 수정 (Update)

```typescript
function EditServiceModal({ serviceId }) {
  const { updateService, updating, updateError } = useServices();

  const handleUpdate = async (formData) => {
    try {
      const updated = await updateService(serviceId, {
        name: formData.name,
        price: formData.price,
      });

      console.log('서비스 수정 성공:', updated);
      onClose();
    } catch (error) {
      console.error('서비스 수정 실패:', error);
    }
  };

  return (
    <Modal>
      <form onSubmit={handleUpdate}>
        {/* 폼 필드 */}
        <button type="submit" disabled={updating}>
          {updating ? '수정 중...' : '수정 완료'}
        </button>
      </form>
    </Modal>
  );
}
```

### 4. 삭제 (Delete)

```typescript
function DeleteServiceButton({ serviceId }) {
  const { deleteService, deleting } = useServices();

  const handleDelete = async () => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteService(serviceId);
      alert('서비스가 삭제되었습니다.');
    } catch (error) {
      console.error('삭제 실패:', error);
      alert('서비스 삭제에 실패했습니다.');
    }
  };

  return (
    <button onClick={handleDelete} disabled={deleting}>
      {deleting ? '삭제 중...' : '삭제'}
    </button>
  );
}
```

### 5. 검색/필터링

```typescript
function ServicesFilter() {
  const { services, searchServices, filterByCategory, categories } = useServices();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredServices = useMemo(() => {
    let result = services;

    // 검색어 필터링
    if (searchQuery) {
      result = searchServices(searchQuery);
    }

    // 카테고리 필터링
    if (selectedCategory) {
      result = filterByCategory(selectedCategory);
    }

    return result;
  }, [services, searchQuery, selectedCategory]);

  return (
    <div>
      <input
        type="text"
        placeholder="서비스 검색..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <select
        value={selectedCategory}
        onChange={(e) => setSelectedCategory(e.target.value)}
      >
        <option value="">전체 카테고리</option>
        {categories.map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <ul>
        {filteredServices.map((service) => (
          <li key={service.id}>{service.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### 6. 수동 refetch

```typescript
function RefreshButton() {
  const { refetch, loading } = useServices();

  return (
    <button onClick={() => refetch()} disabled={loading}>
      {loading ? '새로고침 중...' : '새로고침'}
    </button>
  );
}
```

### 7. 옵션 사용

```typescript
function ServicesWithOptions() {
  const { services, loading, error } = useServices({
    enabled: true, // 자동 로드 활성화
    refetchOnMount: true, // 마운트 시 자동 갱신
    retry: {
      maxRetries: 3,
      retryDelay: 1000,
      exponentialBackoff: true,
    },
    cache: {
      enabled: true,
      ttl: 5 * 60 * 1000, // 5분
    },
    onSuccess: (data) => {
      console.log('데이터 로드 성공:', data.length);
    },
    onError: (error) => {
      console.error('데이터 로드 실패:', error);
    },
  });

  return <div>{/* UI */}</div>;
}
```

### 8. 예약 충돌 감지

```typescript
function ReservationForm() {
  const { checkConflict, createReservation } = useReservations();

  const handleSubmit = async (formData) => {
    // 충돌 확인
    const hasConflict = checkConflict(
      formData.staffId,
      formData.date,
      formData.startTime,
      formData.endTime
    );

    if (hasConflict) {
      alert('해당 시간대에 이미 예약이 있습니다.');
      return;
    }

    // 예약 생성
    try {
      await createReservation(formData);
      alert('예약이 완료되었습니다!');
    } catch (error) {
      alert('예약에 실패했습니다.');
    }
  };

  return <form onSubmit={handleSubmit}>{/* 폼 필드 */}</form>;
}
```

### 9. 고객 통계 조회

```typescript
function CustomerStats({ customerId }) {
  const { getCustomerStats, getVisitHistory } = useCustomers();
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    async function loadStats() {
      try {
        const statsData = await getCustomerStats(customerId);
        const historyData = await getVisitHistory(customerId);

        setStats(statsData);
        setHistory(historyData);
      } catch (error) {
        console.error('통계 로드 실패:', error);
      }
    }

    loadStats();
  }, [customerId]);

  if (!stats) return <div>로딩 중...</div>;

  return (
    <div>
      <h3>고객 통계</h3>
      <p>총 방문 횟수: {stats.total_visits}회</p>
      <p>총 결제 금액: {stats.total_spent.toLocaleString()}원</p>
      <p>평균 결제 금액: {stats.avg_spent_per_visit.toLocaleString()}원</p>
      <p>선호 서비스: {stats.favorite_service}</p>

      <h4>방문 이력</h4>
      <ul>
        {history.map((visit, idx) => (
          <li key={idx}>
            {visit.visit_date} - {visit.service_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### 10. 직원 스케줄 조회

```typescript
function StaffSchedule({ staffId }) {
  const { getStaffSchedule } = useStaff();
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function loadSchedule() {
      const today = new Date().toISOString().split('T')[0];
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      const endDate = nextWeek.toISOString().split('T')[0];

      try {
        const data = await getStaffSchedule(staffId, today, endDate);
        setSchedule(data);
      } catch (error) {
        console.error('스케줄 로드 실패:', error);
      }
    }

    loadSchedule();
  }, [staffId]);

  return (
    <div>
      <h3>스케줄</h3>
      {schedule.map((item) => (
        <div key={item.id}>
          {item.reservation_date} {item.start_time} - {item.service_name}
        </div>
      ))}
    </div>
  );
}
```

---

## 🔧 고급 기능

### 1. 캐싱

모든 Hook은 자동 캐싱을 지원합니다:

```typescript
const { services } = useServices({
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5분
  },
});
```

### 2. 자동 재시도

네트워크 오류 시 자동으로 재시도합니다:

```typescript
const { services } = useServices({
  retry: {
    maxRetries: 3, // 최대 3회 재시도
    retryDelay: 1000, // 1초 대기
    exponentialBackoff: true, // 지수 백오프
  },
});
```

### 3. 옵티미스틱 업데이트

생성/수정/삭제 시 즉시 UI 업데이트:

```typescript
// 삭제 시 서버 응답 전에 UI에서 제거됨
await deleteService(id);
```

### 4. 에러 핸들링

```typescript
const { error, createError, updateError, deleteError } = useServices();

if (error) {
  // 조회 에러
  console.error('데이터 로드 실패:', error.message);
}

if (createError) {
  // 생성 에러
  console.error('생성 실패:', createError.message);
}
```

---

## 🚀 향후 확장

### API 서버 전환

Hook 내부 구현만 변경하면 됩니다:

```typescript
// Before (IPC)
const data = await window.api.db.getServices();

// After (HTTP API)
const response = await fetch('/api/services');
const data = await response.json();
```

컴포넌트 코드는 변경 불필요!

### 추가 기능

- [ ] 페이지네이션 지원
- [ ] 무한 스크롤
- [ ] WebSocket 실시간 동기화
- [ ] Offline-first 지원
- [ ] 데이터 동기화 충돌 해결

---

## 🐛 트러블슈팅

### 1. IPC가 사용 불가능합니다

**원인**: Electron 환경이 아니거나 preload 스크립트가 로드되지 않음

**해결**:
```typescript
// 브라우저에서 테스트 시 Mock API 사용
if (!window.api) {
  window.api = {
    db: {
      getServices: async () => mockServices,
      // ... 기타 Mock 함수들
    },
  };
}
```

### 2. 캐시가 업데이트되지 않음

**원인**: 캐시 TTL이 너무 길거나 수동 캐시 클리어 필요

**해결**:
```typescript
import { cache } from '@/hooks/utils';

// 특정 캐시 삭제
cache.clear('services:all');

// 모든 캐시 삭제
cache.clear();
```

### 3. 메모리 누수

**원인**: 컴포넌트 언마운트 후에도 비동기 작업 계속됨

**해결**: Hook 내부에서 자동으로 처리됨 (isMountedRef 사용)

---

## 📚 참고 자료

- [React Hooks API](https://react.dev/reference/react)
- [TanStack Query](https://tanstack.com/query)
- [Electron IPC](https://www.electronjs.org/docs/latest/api/ipc-main)
