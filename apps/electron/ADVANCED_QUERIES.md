# 고급 쿼리 기능 가이드

## 📋 개요

Beauty Manager Electron 앱에 고급 쿼리 기능이 추가되었습니다. 페이지네이션, 고급 검색, 통계 분석 등 다양한 기능을 제공합니다.

## 🎯 추가된 기능

### 1. 페이지네이션 (4개 메서드)
- `getCustomersPaginated` - 고객 목록 페이지네이션
- `getServicesPaginated` - 서비스 목록 페이지네이션
- `getReservationsPaginated` - 예약 목록 페이지네이션
- `getStaffPaginated` - 직원 목록 페이지네이션

### 2. 고급 검색 (3개 메서드)
- `searchCustomersAdvanced` - 고급 고객 검색 (필터, 정렬)
- `searchServicesAdvanced` - 고급 서비스 검색 (가격 범위, 카테고리)
- `searchReservationsAdvanced` - 고급 예약 검색 (날짜 범위, 상태)

### 3. 고급 통계 (3개 메서드)
- `getMonthlyStatsDetailed` - 월별 상세 통계
- `getPopularServices` - 인기 서비스 순위
- `getCustomerVisitHistory` - 고객 방문 이력

### 4. 성능 최적화
- **13개 인덱스** 생성 (검색 속도 향상)
- 복합 인덱스 활용 (날짜+상태)
- WAL 모드 활성화

## 📊 성능 개선

### 생성된 인덱스

**Services (3개)**
```sql
idx_services_category
idx_services_price
idx_services_name
```

**Customers (3개)**
```sql
idx_customers_phone
idx_customers_name
idx_customers_email
```

**Staff (2개)**
```sql
idx_staff_position
idx_staff_name
```

**Reservations (5개)**
```sql
idx_reservations_date
idx_reservations_customer
idx_reservations_staff
idx_reservations_service
idx_reservations_status
idx_reservations_date_status  -- 복합 인덱스
```

## 💻 사용 예시

### 1. 페이지네이션

#### 고객 목록 페이지네이션
```typescript
const result = await window.api.db.getCustomersPaginated(1, 10, "홍길동");

console.log(result.data);  // Customer[]
console.log(result.pagination);
// {
//   page: 1,
//   limit: 10,
//   total: 100,
//   totalPages: 10,
//   hasNext: true,
//   hasPrev: false
// }
```

#### 서비스 목록 페이지네이션 (카테고리 필터)
```typescript
const result = await window.api.db.getServicesPaginated(
  2,           // page
  15,          // limit
  "헤어",      // category
  "커트"       // search
);
```

#### 예약 목록 페이지네이션 (필터)
```typescript
const result = await window.api.db.getReservationsPaginated(1, 20, {
  status: "confirmed",
  dateRange: ["2025-01-01", "2025-01-31"]
});
```

#### 직원 목록 페이지네이션
```typescript
const result = await window.api.db.getStaffPaginated(1, 10, "헤어 디자이너");
```

### 2. 고급 검색

#### 고객 검색 (필터 + 정렬)
```typescript
const customers = await window.api.db.searchCustomersAdvanced({
  query: "김",              // 이름/전화번호/이메일 검색
  gender: "female",         // 성별 필터
  sortBy: "name",           // 정렬 기준
  sortOrder: "asc",         // 정렬 순서
  limit: 50                 // 결과 제한
});
```

#### 서비스 검색 (가격 범위 + 정렬)
```typescript
const services = await window.api.db.searchServicesAdvanced({
  query: "커트",            // 이름/설명 검색
  category: "헤어",         // 카테고리 필터
  priceRange: [30000, 100000],  // 가격 범위
  sortBy: "price",          // 가격순 정렬
  sortOrder: "asc",         // 오름차순
  limit: 20
});
```

#### 예약 검색 (다중 필터)
```typescript
const reservations = await window.api.db.searchReservationsAdvanced({
  customerId: 1,            // 특정 고객
  staffId: 2,               // 특정 직원
  serviceId: 3,             // 특정 서비스
  status: "completed",      // 상태 필터
  dateRange: ["2025-01-01", "2025-12-31"],  // 날짜 범위
  sortBy: "reservation_date",
  sortOrder: "desc"
});
```

### 3. 고급 통계

#### 월별 상세 통계
```typescript
const stats = await window.api.db.getMonthlyStatsDetailed(2025, 1);

console.log(stats);
// {
//   year: 2025,
//   month: 1,
//   total_reservations: 150,
//   completed_reservations: 130,
//   cancelled_reservations: 10,
//   total_revenue: 3500000,
//   avg_revenue_per_reservation: 26923,
//   unique_customers: 80,
//   new_customers: 15,
//   top_service: { id: 1, name: "커트", count: 50 }
// }
```

#### 인기 서비스 순위
```typescript
const popular = await window.api.db.getPopularServices(
  10,                    // 상위 10개
  "2025-01-01",         // 시작일
  "2025-01-31"          // 종료일
);

popular.forEach(service => {
  console.log(`${service.name}: ${service.total_bookings}건, ${service.total_revenue}원`);
});
```

#### 고객 방문 이력
```typescript
const history = await window.api.db.getCustomerVisitHistory(1);

history.forEach(visit => {
  console.log(`${visit.visit_date}: ${visit.service_name} (${visit.status})`);
});
```

## 🔍 타입 정의

### PaginatedResult<T>
```typescript
interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}
```

### SearchOptions
```typescript
interface SearchOptions {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  dateRange?: [string, string];
  status?: string;
  sort?: SortOptions;
}

interface SortOptions {
  field: string;
  order: "asc" | "desc";
}
```

### MonthlyStats
```typescript
interface MonthlyStats {
  year: number;
  month: number;
  total_reservations: number;
  completed_reservations: number;
  cancelled_reservations: number;
  total_revenue: number;
  avg_revenue_per_reservation: number;
  unique_customers: number;
  new_customers: number;
  top_service: {
    id: number;
    name: string;
    count: number;
  };
}
```

### ServiceStats
```typescript
interface ServiceStats {
  id: number;
  name: string;
  category: string;
  price: number;
  total_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  avg_rating?: number;
}
```

### VisitHistory
```typescript
interface VisitHistory {
  visit_date: string;
  service_name: string;
  service_price: number;
  staff_name?: string;
  status: string;
  notes?: string;
}
```

## 🚀 React 컴포넌트 예시

### 페이지네이션 컴포넌트
```typescript
import { useState, useEffect } from 'react';

function CustomerList() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any>(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadCustomers();
  }, [page, search]);

  const loadCustomers = async () => {
    const result = await window.api.db.getCustomersPaginated(page, 10, search);
    setData(result);
  };

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="고객 검색..."
      />

      <table>
        <tbody>
          {data.data.map((customer: any) => (
            <tr key={customer.id}>
              <td>{customer.name}</td>
              <td>{customer.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div>
        <button
          disabled={!data.pagination.hasPrev}
          onClick={() => setPage(p => p - 1)}
        >
          이전
        </button>
        <span>{page} / {data.pagination.totalPages}</span>
        <button
          disabled={!data.pagination.hasNext}
          onClick={() => setPage(p => p + 1)}
        >
          다음
        </button>
      </div>
    </div>
  );
}
```

### 고급 검색 컴포넌트
```typescript
function ServiceSearch() {
  const [services, setServices] = useState([]);
  const [filters, setFilters] = useState({
    query: "",
    category: "",
    priceRange: [0, 200000] as [number, number],
    sortBy: "created_at" as const,
    sortOrder: "desc" as const,
  });

  const search = async () => {
    const results = await window.api.db.searchServicesAdvanced(filters);
    setServices(results);
  };

  return (
    <div>
      <input
        value={filters.query}
        onChange={(e) => setFilters({ ...filters, query: e.target.value })}
        placeholder="서비스 검색..."
      />

      <select
        value={filters.category}
        onChange={(e) => setFilters({ ...filters, category: e.target.value })}
      >
        <option value="">전체 카테고리</option>
        <option value="헤어">헤어</option>
        <option value="네일">네일</option>
        <option value="스킨케어">스킨케어</option>
      </select>

      <button onClick={search}>검색</button>

      {/* 검색 결과 표시 */}
    </div>
  );
}
```

### 통계 대시보드 컴포넌트
```typescript
function MonthlyDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [year, setYear] = useState(2025);
  const [month, setMonth] = useState(1);

  useEffect(() => {
    loadStats();
  }, [year, month]);

  const loadStats = async () => {
    const data = await window.api.db.getMonthlyStatsDetailed(year, month);
    setStats(data);
  };

  if (!stats) return <div>Loading...</div>;

  return (
    <div>
      <h2>{year}년 {month}월 통계</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>총 예약</h3>
          <p>{stats.total_reservations}건</p>
        </div>

        <div className="stat-card">
          <h3>완료된 예약</h3>
          <p>{stats.completed_reservations}건</p>
        </div>

        <div className="stat-card">
          <h3>총 매출</h3>
          <p>{stats.total_revenue.toLocaleString()}원</p>
        </div>

        <div className="stat-card">
          <h3>평균 매출</h3>
          <p>{stats.avg_revenue_per_reservation.toLocaleString()}원</p>
        </div>

        <div className="stat-card">
          <h3>고객 수</h3>
          <p>{stats.unique_customers}명 (신규: {stats.new_customers}명)</p>
        </div>

        <div className="stat-card">
          <h3>인기 서비스</h3>
          <p>{stats.top_service.name} ({stats.top_service.count}건)</p>
        </div>
      </div>
    </div>
  );
}
```

## 📈 성능 가이드

### 쿼리 최적화 팁

1. **인덱스 활용**
   - 검색 시 인덱스가 적용된 컬럼 사용 (name, phone, category, date 등)
   - WHERE 절에 인덱스 컬럼 우선 사용

2. **페이지네이션 필수**
   - 대량 데이터 조회 시 반드시 페이지네이션 사용
   - limit 기본값: 10~20개 권장

3. **필터 우선순위**
   - 가장 제한적인 필터를 먼저 적용
   - 예: 날짜 범위 → 상태 → 기타 필터

4. **정렬 최소화**
   - 필요한 경우만 정렬 사용
   - 인덱스된 컬럼으로 정렬 시 성능 향상

### 메모리 최적화

```typescript
// ❌ 나쁜 예: 모든 데이터 로드
const allCustomers = await window.api.db.getCustomers();

// ✅ 좋은 예: 페이지네이션 사용
const result = await window.api.db.getCustomersPaginated(1, 20);
```

### 쿼리 성능 모니터링

```typescript
// 쿼리 실행 시간 측정
const start = performance.now();
const result = await window.api.db.searchCustomersAdvanced(options);
const end = performance.now();
console.log(`Query took ${end - start}ms`);
```

## 🔧 추가 개선 가능 사항

1. **풀텍스트 검색**: SQLite FTS5 확장 활용
2. **캐싱**: 자주 조회되는 데이터 캐싱
3. **가상 스크롤**: 대량 데이터 렌더링 최적화
4. **쿼리 빌더**: 동적 쿼리 생성 유틸리티

## 📝 총 IPC 채널 수

- **기본 CRUD**: 20개
- **검색/필터**: 6개
- **관계형 조회**: 4개
- **통계**: 6개
- **고급 검색**: 3개
- **페이지네이션**: 4개
- **고급 통계**: 3개

**총계: 50개 IPC 채널**

## ⚡ 성능 벤치마크

예상 성능 (1만 건 데이터 기준):

| 작업 | 인덱스 없음 | 인덱스 있음 | 개선율 |
|------|------------|------------|--------|
| 고객 검색 (이름) | ~50ms | ~5ms | **90%** |
| 예약 조회 (날짜) | ~100ms | ~8ms | **92%** |
| 서비스 필터 (카테고리) | ~30ms | ~3ms | **90%** |
| 페이지네이션 | ~80ms | ~6ms | **92%** |

## 🎓 학습 자료

- [SQLite 인덱스 가이드](https://www.sqlite.org/lang_createindex.html)
- [쿼리 최적화 기법](https://www.sqlite.org/optoverview.html)
- [페이지네이션 패턴](https://use-the-index-luke.com/sql/partial-results/fetch-next-page)
