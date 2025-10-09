# 테스트 데이터 가이드

## 개요

이 문서는 Electron 앱의 테스트 데이터 생성 및 관리 방법을 설명합니다. 개발 및 테스트 환경에서 실제 뷰티샵 데이터와 유사한 현실적인 샘플 데이터를 제공합니다.

---

## 테스트 데이터 구성

### 1. Services (서비스) - 15개
```typescript
// 헤어 서비스 (5개)
- 여성 커트: 35,000원 / 60분
- 남성 커트: 25,000원 / 40분
- 염색: 80,000원 / 120분
- 펌: 100,000원 / 150분
- 매직 스트레이트: 120,000원 / 180분

// 네일 서비스 (3개)
- 젤 네일 기본: 40,000원 / 90분
- 젤 네일 아트: 60,000원 / 120분
- 네일 케어: 30,000원 / 60분

// 피부관리 서비스 (4개)
- 페이셜 마사지: 70,000원 / 90분
- 딥 클렌징: 50,000원 / 60분
- 보습 케어: 60,000원 / 75분
- 안티에이징: 90,000원 / 90분

// 마사지 서비스 (3개)
- 전신 마사지: 100,000원 / 120분
- 등/어깨 마사지: 60,000원 / 60분
- 발 마사지: 40,000원 / 45분
```

### 2. Staff (직원) - 7명
```typescript
- 김미영 (원장) - 20년 경력, 헤어 전문
- 이지은 (헤어 디자이너) - 염색 및 펌 전문
- 박서연 (네일 아티스트) - 젤 네일 아트 전문
- 최유진 (피부 관리사) - 피부 관리 전문 자격증 보유
- 정수아 (마사지 테라피스트) - 아로마 마사지 자격증
- 강민지 (헤어 디자이너) - 신입 디자이너
- 윤하영 (피부 관리사) - 여드름 케어 전문
```

### 3. Customers (고객) - 25명
```typescript
- 다양한 연령대 (1985-1996년생)
- 성별: 남성 8명, 여성 17명
- VIP 고객, 정기 방문 고객 등 다양한 프로필
- 실제 고객 행동 패턴 반영
```

### 4. Reservations (예약) - 100개
```typescript
// 과거 예약 (50개) - 1-90일 전
- 대부분 완료 (90%)
- 일부 취소 (10%)

// 오늘 예약 (10개)
- 모두 확정 상태

// 미래 예약 (40개) - 1-30일 후
- 확정 (70%)
- 대기 (30%)
```

---

## 자동 초기화

### 개발 모드 자동 실행

앱 시작 시 테스트 데이터가 자동으로 확인되고 초기화됩니다:

```typescript
// src/main.ts
if (isDev) {
  const db = getDatabase();

  // 테스트 데이터 존재 여부 확인
  if (!hasTestData(db)) {
    log.info("No test data found. Initializing test data...");
    await initializeTestData(db);
    log.info("Test data initialized successfully");
  } else {
    log.info("Test data already exists, skipping initialization");
  }
}
```

### 자동 초기화 조건

다음 조건이 모두 충족되면 테스트 데이터가 자동 생성됩니다:

1. **개발 모드**: `NODE_ENV === 'development'` 또는 `!app.isPackaged`
2. **데이터 없음**: 서비스 < 10개, 고객 < 20명, 직원 < 5명

---

## 수동 데이터 초기화

### 방법 1: 개발 모드로 앱 실행

```bash
# Electron 앱 개발 모드 실행
cd apps/electron
pnpm dev

# 데이터베이스 위치 확인
# macOS: ~/Library/Application Support/Beauty Manager/beauty.db
# Windows: %APPDATA%/Beauty Manager/beauty.db
# Linux: ~/.config/Beauty Manager/beauty.db
```

### 방법 2: 프로그래밍 방식

```typescript
import { getDatabase } from './db/database';
import { initializeTestData, clearAllData } from './db/test-data';

const db = getDatabase();

// 기존 데이터 삭제 (주의!)
clearAllData(db);

// 테스트 데이터 생성
await initializeTestData(db);
```

---

## 테스트 시나리오

### 1. 예약 충돌 테스트

```typescript
// 같은 날짜/시간에 여러 예약 생성
const reservations = await window.api.db.getReservationsByDate('2024-01-20');

// 직원별 스케줄 확인
const schedule = await window.api.db.getStaffSchedule(
  staffId,
  '2024-01-20',
  '2024-01-20'
);

// 시간 충돌 감지
function detectConflicts(schedule) {
  // 구현...
}
```

### 2. 고객 방문 이력 분석

```typescript
// 고객의 전체 방문 이력
const history = await window.api.db.getCustomerVisitHistory(customerId);
/*
[
  {
    visit_date: '2024-01-15',
    service_name: '페이셜 마사지',
    service_price: 70000,
    staff_name: '최유진',
    status: 'completed'
  },
  // ...
]
*/

// 고객 통계
const stats = await window.api.db.getCustomerStats(customerId);
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

### 3. 월별 매출 통계

```typescript
// 월별 상세 통계
const stats = await window.api.db.getMonthlyStatsDetailed(2024, 1);
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
  top_service: {
    id: 9,
    name: '페이셜 마사지',
    count: 45
  }
}
*/

// 연간 월별 매출
const revenue = await window.api.db.getMonthlyRevenue(2024);
/*
[
  { month: 1, revenue: 8500000 },
  { month: 2, revenue: 9200000 },
  // ...
]
*/
```

### 4. 인기 서비스 랭킹

```typescript
// 인기 서비스 Top 10
const popular = await window.api.db.getPopularServices(10);
/*
[
  {
    id: 9,
    name: '페이셜 마사지',
    category: '피부관리',
    price: 70000,
    total_bookings: 45,
    completed_bookings: 42,
    total_revenue: 2940000
  },
  {
    id: 3,
    name: '염색',
    category: '헤어',
    price: 80000,
    total_bookings: 38,
    completed_bookings: 36,
    total_revenue: 2880000
  },
  // ...
]
*/

// 기간별 인기 서비스
const monthlyPopular = await window.api.db.getPopularServices(
  5,
  '2024-01-01',
  '2024-01-31'
);
```

### 5. 직원 실적 분석

```typescript
// 전체 직원 실적
const performance = await window.api.db.getStaffPerformance(
  '2024-01-01',
  '2024-01-31'
);
/*
[
  {
    staff_id: 1,
    staff_name: '김미영',
    total_appointments: 85,
    completed_appointments: 80,
    total_revenue: 4250000
  },
  {
    staff_id: 2,
    staff_name: '이지은',
    total_appointments: 72,
    completed_appointments: 68,
    total_revenue: 3820000
  },
  // ...
]
*/
```

---

## 데이터 관리 함수

### hasTestData()

테스트 데이터 존재 여부 확인

```typescript
import { hasTestData } from './db/test-data';

const db = getDatabase();
if (hasTestData(db)) {
  console.log('Test data exists');
} else {
  console.log('No test data found');
}
```

### initializeTestData()

테스트 데이터 생성

```typescript
import { initializeTestData } from './db/test-data';

const db = getDatabase();
await initializeTestData(db);
// 15개 서비스, 7명 직원, 25명 고객, 100개 예약 생성
```

### clearAllData()

모든 데이터 삭제 (주의!)

```typescript
import { clearAllData } from './db/test-data';

const db = getDatabase();
clearAllData(db);
// 모든 테이블 데이터 삭제
```

---

## 데이터 검증

### 통계 확인

```typescript
// 대시보드 통계
const stats = await window.api.db.getDashboardStats();
console.log('Total customers:', stats.totalCustomers.count);
console.log('Total staff:', stats.totalStaff.count);
console.log('Total services:', stats.totalServices.count);
console.log('Today reservations:', stats.todayReservations.count);
console.log('This month revenue:', stats.thisMonthRevenue.revenue);
```

### 데이터 무결성 확인

```typescript
// 모든 예약의 외래 키 확인
const reservations = await window.api.db.getReservationsWithDetails();

reservations.forEach(r => {
  console.assert(r.customer_name, 'Customer name should exist');
  console.assert(r.service_name, 'Service name should exist');
  console.assert(r.staff_name || !r.staff_id, 'Staff name should exist if staff_id exists');
});
```

---

## 실제 사용 시나리오

### 시나리오 1: 신규 고객 예약

```typescript
// 1. 고객 검색
const customers = await window.api.db.searchCustomers('홍길동');

// 2. 서비스 조회
const services = await window.api.db.getServicesByCategory('헤어');

// 3. 직원 스케줄 확인
const schedule = await window.api.db.getStaffSchedule(
  staffId,
  '2024-01-20',
  '2024-01-20'
);

// 4. 예약 생성
await window.api.db.addReservation({
  customer_id: customers[0].id,
  service_id: services[0].id,
  staff_id: staffId,
  reservation_date: '2024-01-20',
  start_time: '14:00',
  status: 'confirmed'
});
```

### 시나리오 2: 월말 정산

```typescript
// 1. 이번 달 통계
const stats = await window.api.db.getMonthlyStatsDetailed(2024, 1);

// 2. 서비스별 매출
const serviceStats = await window.api.db.getServiceStats('2024-01-01', '2024-01-31');

// 3. 직원별 실적
const staffPerformance = await window.api.db.getStaffPerformance('2024-01-01', '2024-01-31');

// 4. 인기 서비스
const popularServices = await window.api.db.getPopularServices(10, '2024-01-01', '2024-01-31');
```

### 시나리오 3: VIP 고객 관리

```typescript
// 1. 고객 방문 이력
const history = await window.api.db.getCustomerVisitHistory(customerId);

// 2. 고객 통계
const stats = await window.api.db.getCustomerStats(customerId);

// 3. 다음 예약 제안
if (stats.favorite_service) {
  const service = await window.api.db.getServiceByName(stats.favorite_service);
  // 서비스 추천...
}
```

---

## 프로덕션 환경

### ⚠️ 주의사항

프로덕션 환경에서는 테스트 데이터가 자동으로 생성되지 않습니다:

```typescript
const isDev = process.env.NODE_ENV === 'development' || !app.isPackaged;

if (isDev) {
  // 테스트 데이터 초기화 (개발 모드만)
  await initializeTestData(db);
}
```

### 프로덕션 데이터 마이그레이션

프로덕션 환경으로 전환 시:

1. 테스트 데이터 백업
2. 실제 데이터 가져오기
3. 데이터 검증
4. 운영 시작

```typescript
// 백업
const backup = await window.api.userData.createBackup();

// 데이터 내보내기
const allData = {
  customers: await window.api.db.getCustomers(),
  services: await window.api.db.getServices(),
  staff: await window.api.db.getStaff(),
  reservations: await window.api.db.getReservations()
};

await window.api.userData.exportData(allData, '/path/to/export.json');
```

---

## 디버깅

### 콘솔 로그 확인

```bash
# 앱 실행 시 로그 확인
pnpm dev

# 출력 예시:
# [Database] Opening database at: /Users/.../beauty.db
# [TestData] Initializing test data...
# [TestData] Created 15 services
# [TestData] Created 7 staff members
# [TestData] Created 25 customers
# [TestData] Created 100 reservations
# [TestData] Test data initialization completed successfully!
```

### 데이터베이스 직접 확인

```bash
# SQLite CLI로 데이터베이스 열기
sqlite3 ~/Library/Application\ Support/Beauty\ Manager/beauty.db

# 테이블 확인
.tables

# 데이터 조회
SELECT COUNT(*) FROM services;
SELECT COUNT(*) FROM customers;
SELECT COUNT(*) FROM staff;
SELECT COUNT(*) FROM reservations;

# 종료
.quit
```

---

## 추가 참고 자료

- `apps/electron/src/db/test-data.ts` - 테스트 데이터 생성 함수
- `apps/electron/src/db/database.ts` - 데이터베이스 클래스
- `apps/electron/BACKEND_README.md` - 데이터베이스 스키마
- `apps/electron/ADVANCED_QUERIES.md` - 고급 쿼리 가이드
