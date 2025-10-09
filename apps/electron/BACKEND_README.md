# Beauty Manager Electron 백엔드 가이드

## 📋 프로젝트 개요

Beauty Manager 데스크탑 앱의 백엔드는 **Electron + SQLite + TypeScript**로 구성되어 있으며, IPC 통신을 통해 안전하게 데이터베이스와 상호작용합니다.

## 🏗️ 아키텍처

```
apps/electron/
├── src/
│   ├── main.ts           # Main 프로세스 (IPC 핸들러 등록)
│   ├── preload.ts        # Preload 스크립트 (contextBridge API)
│   ├── types.ts          # IPC 채널 및 타입 정의
│   └── db/
│       └── database.ts   # SQLite 데이터베이스 로직
```

## 🔒 보안 설정

- **contextIsolation**: `true` (렌더러와 메인 프로세스 격리)
- **nodeIntegration**: `false` (Node.js API 직접 접근 차단)
- **contextBridge**: 안전한 API만 노출

## 📊 데이터베이스 스키마

### 1. Services (서비스)
```sql
CREATE TABLE services (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  category TEXT,
  price INTEGER NOT NULL,
  duration INTEGER,
  description TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 2. Customers (고객)
```sql
CREATE TABLE customers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  email TEXT,
  gender TEXT,
  birth_date TEXT,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 3. Staff (직원)
```sql
CREATE TABLE staff (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  position TEXT NOT NULL,
  hire_date TEXT,
  salary INTEGER,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
```

### 4. Reservations (예약)
```sql
CREATE TABLE reservations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  customer_id INTEGER NOT NULL,
  staff_id INTEGER,
  service_id INTEGER NOT NULL,
  reservation_date TEXT NOT NULL,
  start_time TEXT NOT NULL,
  end_time TEXT,
  status TEXT DEFAULT 'pending',
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  FOREIGN KEY (staff_id) REFERENCES staff(id) ON DELETE SET NULL,
  FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
)
```

## 🚀 IPC 채널 목록 (총 40개)

### 기본 CRUD (20개)
- **Services**: `db:getServices`, `db:getServiceById`, `db:addService`, `db:updateService`, `db:deleteService`
- **Customers**: `db:getCustomers`, `db:getCustomerById`, `db:addCustomer`, `db:updateCustomer`, `db:deleteCustomer`
- **Staff**: `db:getStaff`, `db:getStaffById`, `db:addStaff`, `db:updateStaff`, `db:deleteStaff`
- **Reservations**: `db:getReservations`, `db:getReservationById`, `db:addReservation`, `db:updateReservation`, `db:deleteReservation`

### 검색/필터 (6개)
- `db:searchCustomers` - 고객 검색 (이름/전화번호)
- `db:searchServices` - 서비스 검색 (이름/카테고리)
- `db:getReservationsByDateRange` - 날짜 범위 예약 조회
- `db:getServicesByPriceRange` - 가격 범위 서비스 조회
- `db:getServicesByCategory` - 카테고리별 서비스 조회
- `db:getStaffByPosition` - 직책별 직원 조회

### 관계형 조회 (4개)
- `db:getReservationsWithDetails` - 예약 + 고객 + 직원 + 서비스 정보
- `db:getReservationsByDate` - 특정 날짜 예약 조회
- `db:getCustomerReservations` - 고객별 예약 이력
- `db:getStaffSchedule` - 직원별 스케줄

### 통계 조회 (6개)
- `db:getSalesStats` - 매출 통계 (날짜 범위)
- `db:getServiceStats` - 서비스별 매출 통계
- `db:getStaffPerformance` - 직원별 실적 통계
- `db:getCustomerStats` - 고객별 방문/매출 통계
- `db:getMonthlyRevenue` - 월별 매출 추이
- `db:getDashboardStats` - 대시보드 요약 통계

## 💻 React 앱에서 사용 예시

### 1. 타입 선언 (vite-env.d.ts)
```typescript
/// <reference types="vite/client" />

interface Window {
  api: {
    db: {
      // Services
      getServices: () => Promise<Service[]>;
      addService: (service: Service) => Promise<number>;

      // Customers
      searchCustomers: (searchTerm: string) => Promise<Customer[]>;

      // Statistics
      getDashboardStats: () => Promise<any>;
      getSalesStats: (startDate: string, endDate: string) => Promise<any>;
    };
  };
}
```

### 2. 기본 CRUD 사용
```typescript
// 서비스 목록 조회
const services = await window.api.db.getServices();

// 새 고객 추가
const customerId = await window.api.db.addCustomer({
  name: "홍길동",
  phone: "010-1234-5678",
  email: "hong@example.com",
  gender: "male",
});

// 예약 수정
await window.api.db.updateReservation(1, {
  status: "confirmed",
});
```

### 3. 검색/필터 사용
```typescript
// 고객 검색
const customers = await window.api.db.searchCustomers("홍길동");

// 날짜 범위로 예약 조회
const reservations = await window.api.db.getReservationsByDateRange(
  "2025-01-01",
  "2025-01-31",
  "confirmed"
);

// 가격 범위로 서비스 조회
const services = await window.api.db.getServicesByPriceRange(30000, 100000);
```

### 4. 관계형 조회 사용
```typescript
// 예약 정보 + 관련 데이터 모두 조회
const reservationsWithDetails = await window.api.db.getReservationsWithDetails();
// 결과: { customer_name, service_name, staff_name, ... }

// 고객 예약 이력
const customerHistory = await window.api.db.getCustomerReservations(1);

// 직원 스케줄 조회
const schedule = await window.api.db.getStaffSchedule(1, "2025-01-01", "2025-01-31");
```

### 5. 통계 조회 사용
```typescript
// 대시보드 통계
const stats = await window.api.db.getDashboardStats();
console.log(stats.totalCustomers);
console.log(stats.todayReservations);
console.log(stats.thisMonthRevenue);

// 매출 통계
const salesStats = await window.api.db.getSalesStats("2025-01-01", "2025-01-31");
console.log(salesStats.total_revenue);
console.log(salesStats.completed_count);

// 서비스별 매출
const serviceStats = await window.api.db.getServiceStats("2025-01-01", "2025-01-31");

// 월별 매출 추이
const monthlyRevenue = await window.api.db.getMonthlyRevenue(2025);
```

## 🗃️ 샘플 데이터

개발 모드에서 앱을 실행하면 자동으로 샘플 데이터가 초기화됩니다:

- **서비스**: 7개 (헤어, 네일, 스킨케어)
- **직원**: 4명 (헤어 디자이너, 네일 아티스트, 피부 관리사)
- **고객**: 5명
- **예약**: 5건 (오늘, 어제, 내일 포함)

샘플 데이터는 `database.ts:899`의 `initializeSampleData()` 메서드에서 관리됩니다.

## 🛠️ 개발 및 빌드

### 개발 모드 실행
```bash
# Electron 개발 서버 실행
cd apps/electron
pnpm dev

# 또는 루트에서
pnpm --filter @nexus/electron dev
```

### 빌드
```bash
# TypeScript 컴파일
pnpm build

# Electron 배포 패키징
pnpm electron:build
```

### 타입 체크
```bash
pnpm turbo type-check --filter @nexus/electron
```

## 📝 주요 파일 설명

### database.ts
- **라인 57-149**: 데이터베이스 초기화 및 테이블 생성
- **라인 151-414**: 기본 CRUD 메서드 (Services, Customers, Staff, Reservations)
- **라인 416-534**: 검색/필터 메서드
- **라인 536-680**: 관계형 조회 메서드
- **라인 682-882**: 통계 조회 메서드
- **라인 899-1017**: 샘플 데이터 초기화

### main.ts
- **라인 92-277**: 기본 CRUD IPC 핸들러
- **라인 279-332**: 검색/필터 IPC 핸들러
- **라인 334-369**: 관계형 조회 IPC 핸들러
- **라인 371-424**: 통계 조회 IPC 핸들러
- **라인 286-290**: 개발 모드 샘플 데이터 초기화

### preload.ts
- **라인 6-123**: contextBridge API 노출 (모든 데이터베이스 메서드)

### types.ts
- **라인 6-56**: IPC 채널 상수 정의
- **라인 58-111**: Window API 타입 정의

## 🔄 나중에 API 서버 전환 시

현재 SQLite 기반 구조를 API 서버로 전환하려면:

1. `database.ts`의 메서드들을 API 호출로 변경
2. IPC 핸들러는 그대로 유지 (내부 구현만 변경)
3. React 앱 코드는 수정 불필요 (동일한 `window.api` 사용)

```typescript
// 예시: database.ts에서 API로 전환
async getAllServices(): Promise<Service[]> {
  // Before: SQLite
  // const stmt = this.db.prepare("SELECT * FROM services");
  // return stmt.all() as Service[];

  // After: API
  const response = await fetch('https://api.example.com/services');
  return response.json();
}
```

## ⚠️ 주의사항

1. **데이터베이스 위치**: `app.getPath('userData')/beauty.db`
2. **보안**: `contextBridge`를 통해 필요한 API만 노출
3. **에러 처리**: 모든 메서드에서 try-catch 사용
4. **트랜잭션**: 복잡한 작업은 `executeTransaction()` 사용 권장

## 📚 참고 자료

- [Electron 공식 문서](https://www.electronjs.org/docs)
- [better-sqlite3 문서](https://github.com/WiseLibs/better-sqlite3)
- [Electron IPC 보안 가이드](https://www.electronjs.org/docs/latest/tutorial/context-isolation)
