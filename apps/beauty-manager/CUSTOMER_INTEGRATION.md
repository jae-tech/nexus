# 고객 관리 Electron DB 연동 가이드

## 📋 완료된 작업

### 1. 고객 목록 페이지 (`CustomersPage.tsx`)

#### ✅ 구현된 기능

**데이터 로딩:**
- `useCustomers()` Hook을 사용하여 실제 SQLite DB에서 고객 데이터 로드
- 로딩 스피너 표시 (초기 로드 시)
- 에러 상태 UI 및 재시도 기능

**검색 기능:**
- 실시간 검색 (고객명, 연락처)
- `searchCustomers()` 함수 사용

**필터링:**
- 성별 필터 (전체/남성/여성)
- 유형 필터 (신규 고객/정기 고객/최근 방문)
- 정렬 (이름순/등록일순)

**CRUD 작업:**
- ✅ 조회: `useCustomers()`로 자동 로드
- ✅ 생성: `createCustomer()` with 성공/실패 토스트
- ✅ 삭제: `deleteCustomer()` with 확인 다이얼로그
- ⏳ 수정: EditCustomerModal에서 구현 예정

**UI/UX:**
- 로딩 중: 전체 화면 스피너
- 에러 발생: 에러 메시지 + 재시도 버튼
- 데이터 없음: Empty State with CTA
- 반응형 그리드 레이아웃

---

## 🎯 사용 방법

### 기본 사용

```typescript
import { useCustomers } from '@/hooks';

function CustomersPage() {
  const {
    customers,        // 고객 목록
    loading,          // 로딩 상태
    error,            // 에러 객체
    refetch,          // 수동 새로고침
    createCustomer,   // 생성
    updateCustomer,   // 수정
    deleteCustomer,   // 삭제
    searchCustomers,  // 검색
    filterByGender,   // 성별 필터
  } = useCustomers();

  return (
    // UI 렌더링
  );
}
```

### 고객 추가

```typescript
const handleAddCustomer = async (newCustomer: Omit<Customer, 'id'>) => {
  try {
    await createCustomer({
      name: '홍길동',
      phone: '010-1234-5678',
      gender: 'male',
      email: 'hong@example.com',
      birth_date: '1990-01-01',
      address: '서울시 강남구',
      notes: '비고 사항',
    });
    success('고객이 등록되었습니다.');
  } catch (err) {
    showError('고객 등록에 실패했습니다.');
  }
};
```

### 고객 삭제

```typescript
const handleDelete = async (customerId: number) => {
  if (!confirm('정말 삭제하시겠습니까?')) return;

  try {
    await deleteCustomer(customerId);
    success('고객이 삭제되었습니다.');
  } catch (err) {
    showError('삭제에 실패했습니다.');
  }
};
```

### 검색/필터링

```typescript
// 검색
const results = searchCustomers('홍길동');

// 성별 필터
const maleCustomers = filterByGender('male');

// 신규 고객 필터 (30일 이내 등록)
const newCustomers = customers.filter(c => {
  if (!c.created_at) return false;
  const daysSince = getDaysSince(c.created_at);
  return daysSince <= 30;
});
```

---

## 🔄 데이터 플로우

```
1. 컴포넌트 마운트
   └─> useCustomers() 호출
       └─> window.api.db.getCustomers() (IPC)
           └─> SQLite DB 조회
               └─> React State 업데이트

2. 고객 생성
   └─> createCustomer() 호출
       └─> window.api.db.addCustomer() (IPC)
           └─> SQLite INSERT
               └─> 옵티미스틱 업데이트
                   └─> 토스트 메시지

3. 검색
   └─> searchCustomers() 호출
       └─> 로컬 필터링 (네트워크 호출 없음)
           └─> 즉시 결과 반환
```

---

## 🎨 UI 상태

### 로딩 상태
```tsx
if (loading && customers.length === 0) {
  return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-blue-600" />
      <p>고객 정보를 불러오는 중...</p>
    </div>
  );
}
```

### 에러 상태
```tsx
if (error && customers.length === 0) {
  return (
    <div className="flex h-screen items-center justify-center">
      <AlertCircle className="h-12 w-12 text-red-600" />
      <h3>데이터를 불러올 수 없습니다</h3>
      <p>{error.message}</p>
      <Button onClick={() => refetch()}>다시 시도</Button>
    </div>
  );
}
```

### Empty State
```tsx
{filteredCustomers.length === 0 && (
  <div className="py-12 text-center">
    <User className="mx-auto h-16 w-16 text-gray-400" />
    <h3>등록된 고객이 없습니다</h3>
    <p>첫 번째 고객을 등록해보세요</p>
    <Button onClick={() => setShowAddModal(true)}>
      신규 고객 등록
    </Button>
  </div>
)}
```

---

## ⚠️ 알려진 제한사항

### 1. 예약 이력 기반 기능 미구현

다음 기능들은 예약 테이블 연동 후 구현 예정:

- 최근 방문일 표시
- 방문 횟수 계산
- VIP/단골 고객 판단
- 최근 서비스 정보

**임시 처리:**
```typescript
// TODO: 예약 이력에서 가져와야 함
case 'recent':
  return true; // 임시로 모든 고객 표시

case 'regular':
  return true; // 임시로 모든 고객 표시
```

### 2. 통계 정보 미연동

`getCustomerStats()` 및 `getVisitHistory()`는 구현되어 있으나, UI에 아직 미연동:

```typescript
const { getCustomerStats, getVisitHistory } = useCustomers();

// 고객 상세 페이지에서 사용 예정
const stats = await getCustomerStats(customerId);
const history = await getVisitHistory(customerId);
```

---

## 📝 TODO

### 필수 작업

- [ ] **EditCustomerModal 연동**
  - `updateCustomer()` 함수 사용
  - 폼 유효성 검증
  - 성공/실패 피드백

- [ ] **CustomerDetailPage 연동**
  - URL 파라미터에서 ID 추출
  - 고객 정보 + 예약 이력 표시
  - 편집 모드 전환

- [ ] **예약 이력 연동**
  - `useReservations()` Hook 함께 사용
  - 최근 방문일 계산
  - 방문 횟수 집계
  - VIP/단골 판정 로직

### 추가 기능

- [ ] **중복 전화번호 체크**
  ```typescript
  const checkDuplicate = (phone: string) => {
    return customers.some(c => c.phone === phone);
  };
  ```

- [ ] **디바운싱 검색**
  ```typescript
  import { debounce } from '@/hooks/utils';

  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
    }, 300),
    []
  );
  ```

- [ ] **엑셀 내보내기**
  ```typescript
  const exportToExcel = () => {
    // CSV 생성 로직
    const csv = customers.map(c =>
      `${c.name},${c.phone},${c.gender},${c.email}`
    ).join('\n');

    // 다운로드
    downloadFile(csv, 'customers.csv');
  };
  ```

- [ ] **페이지네이션 또는 무한 스크롤**
  ```typescript
  // 페이지네이션 예제
  const [page, setPage] = useState(1);
  const pageSize = 20;
  const paginatedCustomers = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredCustomers.slice(start, start + pageSize);
  }, [filteredCustomers, page]);
  ```

---

## 🔍 디버깅

### 로그 확인

```typescript
// hooks/utils.ts의 devLog 사용
import { devLog } from '@/hooks/utils';

devLog('Customers loaded', customers.length);
```

### IPC 통신 확인

```typescript
// 브라우저 콘솔에서
window.api.db.getCustomers().then(console.log);
```

### 캐시 상태 확인

```typescript
import { cache } from '@/hooks/utils';

// 캐시 확인
cache.get('customers:all', 5 * 60 * 1000);

// 캐시 삭제
cache.clear('customers:all');
```

---

## 🚀 성능 최적화

### 1. 메모이제이션

```typescript
const filteredCustomers = useMemo(() => {
  // 필터링 로직
}, [customers, searchQuery, filters]);
```

### 2. 캐싱

```typescript
const { customers } = useCustomers({
  cache: {
    enabled: true,
    ttl: 5 * 60 * 1000, // 5분
  },
});
```

### 3. 옵티미스틱 업데이트

```typescript
// 삭제 시 서버 응답 전에 UI 즉시 업데이트
await deleteCustomer(id);
// 로컬 state에서 즉시 제거됨
```

---

## 📱 반응형 지원

```tsx
// 모바일
<div className="grid-cols-1">

// 태블릿
<div className="sm:grid-cols-2">

// 데스크톱
<div className="lg:grid-cols-3 xl:grid-cols-4">
```

---

## 🔐 보안 고려사항

- ✅ IPC를 통한 안전한 DB 접근
- ✅ SQL Injection 방어 (Prepared Statements)
- ✅ 입력 데이터 검증
- ⏳ 개인정보 마스킹 (전화번호 등)

---

## 📚 관련 문서

- [Data Access Layer Hooks](/src/hooks/README.md)
- [Electron IPC 가이드](/apps/electron/PRELOAD_GUIDE.md)
- [데이터베이스 스키마](/apps/electron/BACKEND_README.md)
