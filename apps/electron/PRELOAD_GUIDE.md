# Preload 스크립트 사용 가이드

## 개요

Preload 스크립트는 일렉트론 앱의 보안을 유지하면서 렌더러 프로세스(React 앱)에서 메인 프로세스 기능에 안전하게 접근할 수 있도록 하는 브릿지입니다.

---

## 보안 원칙

### 1. Context Isolation (컨텍스트 격리)
- 렌더러 프로세스는 Node.js에 직접 접근할 수 없음
- `contextBridge`를 통해서만 정의된 API 사용 가능

### 2. 최소 권한 원칙
- 필요한 메서드만 노출
- IPC 채널에 직접 접근 차단
- 허용된 채널만 이벤트 리스닝 가능

### 3. 입력 검증
- 메인 프로세스에서 모든 입력 데이터 검증
- 타입 안전성 보장 (TypeScript)

---

## API 구조

### window.api

```typescript
window.api = {
  db: { /* 데이터베이스 API */ },
  userData: { /* 사용자 데이터 API */ },
  on: (channel, callback) => { /* 이벤트 리스너 */ },
  once: (channel, callback) => { /* 일회성 이벤트 */ },
  platform: 'darwin' | 'win32' | 'linux',
  versions: { node, chrome, electron }
}
```

---

## 데이터베이스 API (window.api.db)

### 기본 CRUD 작업

#### Services (서비스)
```typescript
// 전체 조회
const services = await window.api.db.getServices();

// ID로 조회
const service = await window.api.db.getServiceById(1);

// 추가
const newId = await window.api.db.addService({
  name: '페이셜 마사지',
  category: '피부관리',
  price: 50000,
  duration: 60,
  description: '얼굴 피부를 위한 마사지',
});

// 수정
await window.api.db.updateService(1, {
  price: 55000,
  duration: 90,
});

// 삭제
await window.api.db.deleteService(1);
```

#### Customers (고객)
```typescript
// 전체 조회
const customers = await window.api.db.getCustomers();

// 추가
const customerId = await window.api.db.addCustomer({
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@example.com',
  birth_date: '1990-01-15',
  gender: 'M',
  notes: 'VIP 고객',
});

// 검색
const results = await window.api.db.searchCustomers('홍길동');
```

#### Staff (직원)
```typescript
// 직원 목록
const staff = await window.api.db.getStaff();

// 직책별 조회
const designers = await window.api.db.getStaffByPosition('디자이너');

// 추가
const staffId = await window.api.db.addStaff({
  name: '김영희',
  position: '원장',
  phone: '010-9876-5432',
  email: 'kim@example.com',
  hire_date: '2024-01-01',
});
```

#### Reservations (예약)
```typescript
// 예약 목록
const reservations = await window.api.db.getReservations();

// 상세 정보 포함 조회
const detailedReservations = await window.api.db.getReservationsWithDetails();

// 날짜별 조회
const todayReservations = await window.api.db.getReservationsByDate('2024-01-15');

// 날짜 범위 조회
const weekReservations = await window.api.db.getReservationsByDateRange(
  '2024-01-15',
  '2024-01-21',
  'confirmed' // 선택적: 상태 필터
);

// 예약 추가
const reservationId = await window.api.db.addReservation({
  customer_id: 1,
  service_id: 2,
  staff_id: 3,
  reservation_date: '2024-01-20',
  start_time: '14:00',
  end_time: '15:30',
  status: 'confirmed',
  notes: '첫 방문 고객',
});
```

---

## 고급 검색 및 필터링

### 검색
```typescript
// 고객 검색
const customers = await window.api.db.searchCustomers('홍길');

// 서비스 검색 (카테고리 필터)
const services = await window.api.db.searchServices('마사지', '피부관리');

// 가격 범위 검색
const affordableServices = await window.api.db.getServicesByPriceRange(30000, 50000);
```

### 고급 검색
```typescript
// 고객 고급 검색
const customers = await window.api.db.searchCustomersAdvanced({
  query: '홍',
  dateRange: ['2024-01-01', '2024-12-31'],
  sort: { field: 'created_at', order: 'desc' },
});

// 서비스 고급 검색
const services = await window.api.db.searchServicesAdvanced({
  query: '마사지',
  category: '피부관리',
  priceRange: [30000, 100000],
  sort: { field: 'price', order: 'asc' },
});
```

### 페이지네이션
```typescript
// 고객 페이지네이션 (1페이지, 20개씩)
const result = await window.api.db.getCustomersPaginated(1, 20, '검색어');
/*
{
  data: Customer[],
  pagination: {
    page: 1,
    limit: 20,
    total: 150,
    totalPages: 8,
    hasNext: true,
    hasPrev: false
  }
}
*/

// 서비스 페이지네이션
const services = await window.api.db.getServicesPaginated(1, 10, '피부관리');

// 예약 페이지네이션
const reservations = await window.api.db.getReservationsPaginated(1, 30, {
  status: 'confirmed',
  dateRange: ['2024-01-01', '2024-01-31'],
});
```

---

## 관계형 쿼리

### 고객 예약 내역
```typescript
const history = await window.api.db.getCustomerReservations(customerId);
// 고객의 모든 예약 내역 (서비스, 직원 정보 포함)
```

### 직원 스케줄
```typescript
// 특정 직원의 전체 스케줄
const schedule = await window.api.db.getStaffSchedule(staffId);

// 기간 지정
const weekSchedule = await window.api.db.getStaffSchedule(
  staffId,
  '2024-01-15',
  '2024-01-21'
);
```

### 고객 방문 이력
```typescript
const visitHistory = await window.api.db.getCustomerVisitHistory(customerId);
/*
[
  {
    visit_date: '2024-01-15',
    service_name: '페이셜 마사지',
    service_price: 50000,
    staff_name: '김영희',
    status: 'completed',
    notes: '만족스러워함'
  }
]
*/
```

---

## 통계 API

### 대시보드 통계
```typescript
const stats = await window.api.db.getDashboardStats();
/*
{
  today_reservations: 12,
  total_customers: 450,
  monthly_revenue: 15000000,
  pending_reservations: 8
}
*/
```

### 월별 상세 통계
```typescript
const monthlyStats = await window.api.db.getMonthlyStatsDetailed(2024, 1);
/*
{
  year: 2024,
  month: 1,
  total_reservations: 150,
  completed_reservations: 135,
  cancelled_reservations: 15,
  total_revenue: 8500000,
  avg_revenue_per_reservation: 62962,
  unique_customers: 120,
  new_customers: 25,
  top_service: { id: 3, name: '페이셜 마사지', count: 45 }
}
*/
```

### 매출 통계
```typescript
// 기간별 매출
const sales = await window.api.db.getSalesStats('2024-01-01', '2024-01-31');

// 연간 월별 매출
const monthlyRevenue = await window.api.db.getMonthlyRevenue(2024);
/*
[
  { month: 1, revenue: 8500000 },
  { month: 2, revenue: 9200000 },
  ...
]
*/
```

### 서비스 통계
```typescript
const serviceStats = await window.api.db.getServiceStats('2024-01-01', '2024-01-31');
/*
[
  {
    id: 1,
    name: '페이셜 마사지',
    category: '피부관리',
    price: 50000,
    total_bookings: 45,
    completed_bookings: 42,
    total_revenue: 2100000,
    avg_rating: 4.8
  }
]
*/

// 인기 서비스 Top 10
const popularServices = await window.api.db.getPopularServices(10);
```

### 직원 실적
```typescript
const performance = await window.api.db.getStaffPerformance('2024-01-01', '2024-01-31');
/*
[
  {
    staff_id: 1,
    staff_name: '김영희',
    total_appointments: 85,
    completed_appointments: 80,
    total_revenue: 4250000,
    avg_rating: 4.9
  }
]
*/
```

### 고객 통계
```typescript
// 전체 고객 통계
const allCustomerStats = await window.api.db.getCustomerStats();

// 특정 고객 통계
const customerStat = await window.api.db.getCustomerStats(customerId);
/*
{
  total_visits: 12,
  total_spent: 850000,
  avg_spent_per_visit: 70833,
  favorite_service: '페이셜 마사지',
  last_visit: '2024-01-10'
}
*/
```

---

## 사용자 데이터 API (window.api.userData)

### 설정 관리
```typescript
// 설정 로드
const settings = await window.api.userData.loadSettings();
/*
{
  theme: 'dark',
  language: 'ko',
  autoBackup: true,
  notifications: {
    enabled: true,
    sound: true
  }
}
*/

// 설정 저장
await window.api.userData.saveSettings({
  theme: 'light',
  language: 'ko',
  autoBackup: false,
});
```

### 백업 관리
```typescript
// 수동 백업 생성
const backupPath = await window.api.userData.createBackup();
console.log('백업 완료:', backupPath);

// 백업 목록 조회
const backups = await window.api.userData.listBackups();
/*
[
  {
    name: 'beauty-manager-backup-2024-01-15-143022.db',
    path: '/Users/.../backups/beauty-manager-backup-2024-01-15-143022.db',
    date: Date,
    size: 2048000 // bytes
  }
]
*/

// 백업 복원 (앱 자동 재시작)
await window.api.userData.restoreBackup(backupPath);
```

### 데이터 내보내기/가져오기
```typescript
// JSON 형식으로 모든 데이터 내보내기
const allData = {
  customers: await window.api.db.getCustomers(),
  services: await window.api.db.getServices(),
  staff: await window.api.db.getStaff(),
  reservations: await window.api.db.getReservations(),
};

await window.api.userData.exportData(allData, '/path/to/export.json');

// JSON 파일에서 데이터 가져오기
const importedData = await window.api.userData.importData('/path/to/import.json');
```

### 디스크 사용량
```typescript
const usage = await window.api.userData.getDiskUsage();
/*
{
  database: 2048000,    // 2 MB
  backups: 10240000,    // 10 MB
  total: 12288000,      // 12 MB
  formatted: {
    database: '2.00 MB',
    backups: '10.00 MB',
    total: '12.00 MB'
  }
}
*/
```

---

## 이벤트 리스너 API

### 메뉴 이벤트
```typescript
// 메뉴 네비게이션
const unsubscribe = window.api.on('menu-navigate', (path: string) => {
  router.navigate(path);
});

// 새 고객 추가
window.api.on('menu-new-customer', () => {
  openNewCustomerModal();
});

// 새 예약 추가
window.api.on('menu-new-reservation', () => {
  openNewReservationModal();
});

// 데이터 내보내기
window.api.on('menu-export-data', async (filePath: string) => {
  const data = await getAllData();
  await window.api.userData.exportData(data, filePath);
});

// 데이터 가져오기
window.api.on('menu-import-data', async (filePath: string) => {
  const data = await window.api.userData.importData(filePath);
  if (data) {
    await importAllData(data);
  }
});

// 구독 해제
unsubscribe();
```

### 딥 링크 이벤트
```typescript
// 딥 링크 네비게이션
window.api.on('deep-link-navigate', (path: string) => {
  router.navigate(path);
});

// 딥 링크 액션
window.api.on('deep-link-action', (action: string, params: any) => {
  switch (action) {
    case 'new-reservation':
      openReservationModal(params);
      break;
    case 'check-in':
      handleCheckIn(params.reservationId);
      break;
    case 'check-out':
      handleCheckOut(params.reservationId);
      break;
  }
});
```

### React Hook 예시
```typescript
// useElectronEvent.ts
import { useEffect } from 'react';

export function useElectronEvent(
  channel: string,
  callback: (...args: any[]) => void
) {
  useEffect(() => {
    const unsubscribe = window.api.on(channel, callback);
    return () => unsubscribe();
  }, [channel, callback]);
}

// 사용
function MyComponent() {
  useElectronEvent('menu-navigate', (path) => {
    console.log('Navigate to:', path);
    router.navigate(path);
  });

  return <div>...</div>;
}
```

---

## 플랫폼 정보

### 플랫폼 감지
```typescript
const platform = window.api.platform;
// 'darwin' (macOS) | 'win32' (Windows) | 'linux'

if (platform === 'darwin') {
  // macOS 전용 기능
}
```

### 버전 정보
```typescript
const { node, chrome, electron } = window.api.versions;
console.log(`Node: ${node}, Chrome: ${chrome}, Electron: ${electron}`);
```

---

## React 통합 예시

### 서비스 조회 컴포넌트
```typescript
import { useState, useEffect } from 'react';

function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  async function loadServices() {
    try {
      const data = await window.api.db.getServices();
      setServices(data);
    } catch (error) {
      console.error('Failed to load services:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) return <div>Loading...</div>;

  return (
    <ul>
      {services.map((service) => (
        <li key={service.id}>
          {service.name} - {service.price}원
        </li>
      ))}
    </ul>
  );
}
```

### 고객 검색 컴포넌트
```typescript
import { useState } from 'react';

function CustomerSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  async function handleSearch() {
    const data = await window.api.db.searchCustomers(query);
    setResults(data);
  }

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="고객 검색..."
      />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {results.map((customer) => (
          <li key={customer.id}>{customer.name}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Zustand 스토어 통합
```typescript
import { create } from 'zustand';

interface ServiceStore {
  services: Service[];
  loading: boolean;
  error: string | null;
  fetchServices: () => Promise<void>;
  addService: (service: Service) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set) => ({
  services: [],
  loading: false,
  error: null,

  fetchServices: async () => {
    set({ loading: true, error: null });
    try {
      const services = await window.api.db.getServices();
      set({ services, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  addService: async (service) => {
    try {
      const id = await window.api.db.addService(service);
      set((state) => ({
        services: [...state.services, { ...service, id }],
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },
}));
```

---

## 에러 처리

### 기본 에러 처리
```typescript
try {
  await window.api.db.addCustomer(customerData);
} catch (error) {
  console.error('Failed to add customer:', error);
  // 사용자에게 에러 메시지 표시
}
```

### React Error Boundary
```typescript
import { Component } from 'react';

class ElectronErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Electron API Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <div>데이터베이스 오류가 발생했습니다.</div>;
    }
    return this.props.children;
  }
}
```

---

## 타입 정의 사용

### React 컴포넌트에서
```typescript
// window.api는 자동으로 타입 추론됨
const services = await window.api.db.getServices();
// services: Service[]

// 명시적 타입 import (필요시)
import type { Service, Customer, Reservation } from '@/types/electron';
```

### TypeScript 설정
```json
// tsconfig.json
{
  "compilerOptions": {
    "types": ["node"]
  },
  "include": ["src/**/*", "../electron/src/types.ts"]
}
```

---

## 보안 고려사항

### ✅ 안전한 사용
```typescript
// OK: 정의된 API 사용
await window.api.db.getServices();

// OK: 타입 안전성 보장
const service: Service = { /* ... */ };
await window.api.db.addService(service);
```

### ❌ 위험한 사용
```typescript
// 불가능: 직접 IPC 접근 차단
window.require('electron').ipcRenderer.send(...); // undefined

// 불가능: Node.js 직접 접근 차단
window.require('fs').readFileSync(...); // undefined
```

---

## 디버깅

### 개발자 도구에서 API 확인
```javascript
// 브라우저 콘솔에서
console.log(window.api);
// { db: {...}, userData: {...}, on: f, ... }

// 버전 확인
console.log(window.api.versions);

// 플랫폼 확인
console.log(window.api.platform);
```

### 네트워크 모니터링
일렉트론 DevTools에서 IPC 통신 확인 가능

---

## 추가 참고 자료

- [일렉트론 공식 문서 - Context Bridge](https://www.electronjs.org/docs/latest/api/context-bridge)
- [일렉트론 보안 가이드](https://www.electronjs.org/docs/latest/tutorial/security)
- `apps/electron/src/types.ts` - 전체 타입 정의
- `apps/electron/BACKEND_README.md` - 데이터베이스 스키마
