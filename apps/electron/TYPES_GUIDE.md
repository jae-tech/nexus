# TypeScript 타입 정의 가이드

## 개요

이 문서는 Electron 앱의 TypeScript 타입 시스템을 설명합니다. 모든 타입은 메인 프로세스와 렌더러 프로세스(React 앱)에서 동일하게 사용됩니다.

---

## 타입 파일 위치

### Electron (메인 프로세스)
- **위치**: `apps/electron/src/types.ts`
- **용도**: IPC 채널 정의, Window API 인터페이스

### React 앱 (렌더러 프로세스)
- **위치**: `apps/mcp-beauty-manager/src/types/electron.d.ts`
- **용도**: `window.api` 타입 정의, 컴포넌트에서 사용

---

## 기본 엔티티 타입

### Service (서비스)
```typescript
interface Service {
  id?: number;
  name: string;
  category?: string;
  price: number;
  duration?: number; // 분 단위
  description?: string;
  created_at?: string;
  updated_at?: string;
}
```

**사용 예시:**
```typescript
// 새 서비스 추가
const newService: Omit<Service, 'id' | 'created_at' | 'updated_at'> = {
  name: '페이셜 마사지',
  category: '피부관리',
  price: 50000,
  duration: 60,
  description: '얼굴 피부를 위한 마사지'
};

const serviceId = await window.api.db.addService(newService);
```

### Customer (고객)
```typescript
interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  gender?: 'male' | 'female' | 'other';
  birth_date?: string; // YYYY-MM-DD
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
```

**사용 예시:**
```typescript
const newCustomer: Omit<Customer, 'id' | 'created_at' | 'updated_at'> = {
  name: '홍길동',
  phone: '010-1234-5678',
  email: 'hong@example.com',
  gender: 'male',
  birth_date: '1990-01-15',
  notes: 'VIP 고객'
};

await window.api.db.addCustomer(newCustomer);
```

### Staff (직원)
```typescript
interface Staff {
  id?: number;
  name: string;
  phone: string;
  position: string;
  hire_date?: string; // YYYY-MM-DD
  salary?: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
```

### Reservation (예약)
```typescript
interface Reservation {
  id?: number;
  customer_id: number;
  staff_id?: number;
  service_id: number;
  reservation_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time?: string; // HH:MM
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
  updated_at?: string;
}
```

---

## 확장 타입 (JOIN 결과)

### ReservationWithDetails
```typescript
interface ReservationWithDetails {
  id: number;
  reservation_date: string;
  start_time: string;
  end_time?: string;
  status: string;
  notes?: string;
  created_at: string;

  // 고객 정보
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;

  // 서비스 정보
  service_id: number;
  service_name: string;
  service_category: string;
  service_price: number;
  service_duration: number;

  // 직원 정보
  staff_id?: number;
  staff_name?: string;
  staff_position?: string;
}
```

**사용 예시:**
```typescript
const reservations = await window.api.db.getReservationsWithDetails();

reservations.forEach(r => {
  console.log(`${r.customer_name} - ${r.service_name} (${r.staff_name})`);
});
```

---

## 통계 타입

### DashboardStats
```typescript
interface DashboardStats {
  today_reservations: number;
  total_customers: number;
  monthly_revenue: number;
  pending_reservations: number;
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

### StaffPerformance
```typescript
interface StaffPerformance {
  staff_id: number;
  staff_name: string;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: number;
  avg_rating?: number;
}
```

---

## 페이지네이션 타입

### PaginatedResult<T>
```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}
```

**사용 예시:**
```typescript
const result: PaginatedResult<Customer> =
  await window.api.db.getCustomersPaginated(1, 20);

console.log(`Page ${result.pagination.page} of ${result.pagination.totalPages}`);
console.log(`Total customers: ${result.pagination.total}`);

result.data.forEach(customer => {
  console.log(customer.name);
});
```

---

## 검색 옵션 타입

### SearchOptions
```typescript
interface SortOptions {
  field: string;
  order: 'asc' | 'desc';
}

interface SearchOptions {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  dateRange?: [string, string];
  status?: string;
  sort?: SortOptions;
}
```

### CustomerSearchOptions
```typescript
interface CustomerSearchOptions extends SearchOptions {
  gender?: 'male' | 'female' | 'other';
  minVisits?: number;
}
```

**사용 예시:**
```typescript
const searchOptions: CustomerSearchOptions = {
  query: '홍',
  gender: 'male',
  minVisits: 5,
  sort: { field: 'created_at', order: 'desc' }
};

const customers = await window.api.db.searchCustomersAdvanced(searchOptions);
```

### ServiceSearchOptions
```typescript
interface ServiceSearchOptions extends SearchOptions {
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
}
```

### ReservationSearchOptions
```typescript
interface ReservationSearchOptions extends SearchOptions {
  customerId?: number;
  staffId?: number;
  serviceId?: number;
  startDate?: string;
  endDate?: string;
}
```

---

## 사용자 데이터 타입

### AppSettings
```typescript
interface AppSettings {
  theme?: 'light' | 'dark' | 'system';
  language?: 'ko' | 'en';
  autoBackup?: boolean;
  backupInterval?: number; // 시간 단위
  notifications?: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
  };
  calendar?: {
    startHour: number;
    endHour: number;
    slotDuration: number; // 분 단위
    defaultView: 'day' | 'week' | 'month';
  };
}
```

**사용 예시:**
```typescript
const settings: AppSettings = {
  theme: 'dark',
  language: 'ko',
  autoBackup: true,
  backupInterval: 24,
  notifications: {
    enabled: true,
    sound: false,
    desktop: true
  },
  calendar: {
    startHour: 9,
    endHour: 18,
    slotDuration: 30,
    defaultView: 'week'
  }
};

await window.api.userData.saveSettings(settings);
```

### BackupInfo
```typescript
interface BackupInfo {
  name: string;
  path: string;
  date: Date;
  size: number;
}
```

### DiskUsage
```typescript
interface DiskUsage {
  database: number;
  backups: number;
  total: number;
  formatted: {
    database: string;
    backups: string;
    total: string;
  };
}
```

---

## React 컴포넌트에서 타입 사용

### 1. Props 타입 정의
```typescript
import type { Service } from '@/types/electron';

interface ServiceListProps {
  services: Service[];
  onSelect: (service: Service) => void;
}

function ServiceList({ services, onSelect }: ServiceListProps) {
  return (
    <ul>
      {services.map(service => (
        <li key={service.id} onClick={() => onSelect(service)}>
          {service.name} - {service.price.toLocaleString()}원
        </li>
      ))}
    </ul>
  );
}
```

### 2. State 타입 정의
```typescript
import { useState } from 'react';
import type { Customer, PaginatedResult } from '@/types/electron';

function CustomerList() {
  const [result, setResult] = useState<PaginatedResult<Customer> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCustomers();
  }, []);

  async function loadCustomers() {
    setLoading(true);
    const data = await window.api.db.getCustomersPaginated(1, 20);
    setResult(data);
    setLoading(false);
  }

  if (loading) return <div>Loading...</div>;
  if (!result) return null;

  return (
    <div>
      <p>Total: {result.pagination.total}</p>
      {/* ... */}
    </div>
  );
}
```

### 3. Form 데이터 타입
```typescript
import type { Service } from '@/types/electron';

function AddServiceForm() {
  const [formData, setFormData] = useState<Omit<Service, 'id' | 'created_at' | 'updated_at'>>({
    name: '',
    category: '',
    price: 0,
    duration: 0,
    description: ''
  });

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const id = await window.api.db.addService(formData);
    console.log('New service ID:', id);
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        value={formData.name}
        onChange={e => setFormData({ ...formData, name: e.target.value })}
      />
      {/* ... */}
    </form>
  );
}
```

---

## Zustand 스토어 타입

### 서비스 스토어
```typescript
import { create } from 'zustand';
import type { Service, ServiceSearchOptions } from '@/types/electron';

interface ServiceStore {
  services: Service[];
  loading: boolean;
  error: string | null;

  // Actions
  fetchServices: () => Promise<void>;
  addService: (service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) => Promise<void>;
  updateService: (id: number, updates: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;
  searchServices: (options: ServiceSearchOptions) => Promise<void>;
}

export const useServiceStore = create<ServiceStore>((set, get) => ({
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
      set(state => ({
        services: [...state.services, { ...service, id }]
      }));
    } catch (error) {
      set({ error: error.message });
    }
  },

  // ...
}));
```

---

## 타입 가드 함수

### 예약 상태 체크
```typescript
import type { Reservation } from '@/types/electron';

function isCompletedReservation(reservation: Reservation): boolean {
  return reservation.status === 'completed';
}

function isPendingReservation(reservation: Reservation): boolean {
  return reservation.status === 'pending';
}

// 사용
const reservations = await window.api.db.getReservations();
const completed = reservations.filter(isCompletedReservation);
const pending = reservations.filter(isPendingReservation);
```

### 타입 좁히기
```typescript
import type { Customer } from '@/types/electron';

function hasEmail(customer: Customer): customer is Required<Pick<Customer, 'email'>> & Customer {
  return customer.email !== undefined && customer.email !== null;
}

// 사용
const customers = await window.api.db.getCustomers();
const withEmail = customers.filter(hasEmail);
// withEmail의 타입: Customer[] (email 필드가 string으로 보장됨)
```

---

## 유틸리티 타입

### API 응답 래퍼
```typescript
type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: string;
};

async function safeApiCall<T>(
  apiCall: () => Promise<T>
): Promise<ApiResponse<T>> {
  try {
    const data = await apiCall();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

// 사용
const result = await safeApiCall(() => window.api.db.getServices());
if (result.error) {
  console.error(result.error);
} else {
  console.log(result.data);
}
```

---

## 타입 재사용 팁

### 1. 공통 Pick 타입
```typescript
// ID 제외한 서비스 데이터
type ServiceInput = Omit<Service, 'id' | 'created_at' | 'updated_at'>;

// 업데이트용 서비스 데이터
type ServiceUpdate = Partial<ServiceInput>;

// 사용
const newService: ServiceInput = { /* ... */ };
const updates: ServiceUpdate = { price: 60000 };
```

### 2. 확장 타입
```typescript
// UI에서 사용하는 확장된 서비스 타입
interface ServiceWithSelection extends Service {
  isSelected: boolean;
}

// 사용
const [services, setServices] = useState<ServiceWithSelection[]>([]);
```

### 3. 조건부 타입
```typescript
type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

// email이 필수인 Customer 타입
type CustomerWithEmail = RequiredFields<Customer, 'email'>;
```

---

## VSCode 설정

### tsconfig.json
```json
{
  "compilerOptions": {
    "types": ["node"],
    "paths": {
      "@/*": ["./src/*"],
      "@/types/*": ["./src/types/*"]
    }
  },
  "include": [
    "src/**/*",
    "../electron/src/types.ts"
  ]
}
```

### 자동 import 설정
`.vscode/settings.json`:
```json
{
  "typescript.preferences.importModuleSpecifier": "non-relative",
  "typescript.suggest.autoImports": true
}
```

---

## 타입 체크 명령어

```bash
# Electron 타입 체크
cd apps/electron
pnpm run build:ts

# React 앱 타입 체크
cd apps/mcp-beauty-manager
pnpm run type-check
```

---

## 추가 참고 자료

- [TypeScript 공식 문서](https://www.typescriptlang.org/docs/)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- `apps/electron/src/types.ts` - Electron 타입 정의
- `apps/mcp-beauty-manager/src/types/electron.d.ts` - React 앱 타입 정의
