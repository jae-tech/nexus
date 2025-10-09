/**
 * 테스트 데이터 생성
 *
 * 개발 및 테스트 환경에서 사용할 샘플 데이터를 생성합니다.
 * 실제 뷰티샵 운영 데이터와 유사한 현실적인 데이터를 제공합니다.
 */

import type { BeautyDatabase } from "./database";

/**
 * 날짜 유틸리티: 오늘 기준 N일 전/후 날짜
 */
function addDays(date: Date, days: number): string {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result.toISOString().split("T")[0];
}

/**
 * 랜덤 시간 생성 (09:00 ~ 18:00)
 */
function randomTime(): string {
  const hour = 9 + Math.floor(Math.random() * 9); // 9-17시
  const minute = Math.random() > 0.5 ? "00" : "30";
  return `${hour.toString().padStart(2, "0")}:${minute}`;
}

/**
 * 랜덤 요소 선택
 */
function randomChoice<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 테스트 데이터 초기화
 */
export async function initializeTestData(db: BeautyDatabase): Promise<void> {
  console.log("[TestData] Initializing test data...");

  try {
    // 1. 서비스 데이터
    const serviceIds = await createServices(db);
    console.log(`[TestData] Created ${serviceIds.length} services`);

    // 2. 직원 데이터
    const staffIds = await createStaff(db);
    console.log(`[TestData] Created ${staffIds.length} staff members`);

    // 3. 고객 데이터
    const customerIds = await createCustomers(db);
    console.log(`[TestData] Created ${customerIds.length} customers`);

    // 4. 예약 데이터
    const reservationCount = await createReservations(db, customerIds, serviceIds, staffIds);
    console.log(`[TestData] Created ${reservationCount} reservations`);

    console.log("[TestData] Test data initialization completed successfully!");
  } catch (error) {
    console.error("[TestData] Failed to initialize test data:", error);
    throw error;
  }
}

/**
 * 서비스 데이터 생성
 */
async function createServices(db: BeautyDatabase): Promise<number[]> {
  const services = [
    // 헤어 서비스
    { name: "여성 커트", category: "헤어", price: 35000, duration: 60, description: "기본 여성 헤어컷" },
    { name: "남성 커트", category: "헤어", price: 25000, duration: 40, description: "기본 남성 헤어컷" },
    {
      name: "염색",
      category: "헤어",
      price: 80000,
      duration: 120,
      description: "전체 염색 (약품 포함)",
    },
    {
      name: "펌",
      category: "헤어",
      price: 100000,
      duration: 150,
      description: "일반 웨이브 펌",
    },
    {
      name: "매직 스트레이트",
      category: "헤어",
      price: 120000,
      duration: 180,
      description: "매직 스트레이트 펌",
    },

    // 네일 서비스
    {
      name: "젤 네일 기본",
      category: "네일",
      price: 40000,
      duration: 90,
      description: "젤 네일 기본 디자인",
    },
    {
      name: "젤 네일 아트",
      category: "네일",
      price: 60000,
      duration: 120,
      description: "젤 네일 아트 디자인",
    },
    {
      name: "네일 케어",
      category: "네일",
      price: 30000,
      duration: 60,
      description: "네일 케어 및 큐티클 정리",
    },

    // 스킨케어
    {
      name: "페이셜 마사지",
      category: "피부관리",
      price: 70000,
      duration: 90,
      description: "얼굴 피부 마사지 및 관리",
    },
    {
      name: "딥 클렌징",
      category: "피부관리",
      price: 50000,
      duration: 60,
      description: "모공 딥 클렌징",
    },
    {
      name: "보습 케어",
      category: "피부관리",
      price: 60000,
      duration: 75,
      description: "집중 보습 케어",
    },
    {
      name: "안티에이징",
      category: "피부관리",
      price: 90000,
      duration: 90,
      description: "안티에이징 프리미엄 케어",
    },

    // 마사지
    {
      name: "전신 마사지",
      category: "마사지",
      price: 100000,
      duration: 120,
      description: "전신 아로마 마사지",
    },
    {
      name: "등/어깨 마사지",
      category: "마사지",
      price: 60000,
      duration: 60,
      description: "등과 어깨 집중 마사지",
    },
    {
      name: "발 마사지",
      category: "마사지",
      price: 40000,
      duration: 45,
      description: "발 및 종아리 마사지",
    },
  ];

  const ids: number[] = [];
  for (const service of services) {
    const id = db.addService(service);
    ids.push(id);
  }

  return ids;
}

/**
 * 직원 데이터 생성
 */
async function createStaff(db: BeautyDatabase): Promise<number[]> {
  const today = new Date();
  const staff = [
    {
      name: "김미영",
      phone: "010-1234-5601",
      position: "원장",
      hire_date: addDays(today, -730), // 2년 전
      salary: 4500000,
      notes: "20년 경력의 헤어 전문가",
    },
    {
      name: "이지은",
      phone: "010-1234-5602",
      position: "헤어 디자이너",
      hire_date: addDays(today, -365), // 1년 전
      salary: 3500000,
      notes: "염색 및 펌 전문",
    },
    {
      name: "박서연",
      phone: "010-1234-5603",
      position: "네일 아티스트",
      hire_date: addDays(today, -540), // 1.5년 전
      salary: 3200000,
      notes: "젤 네일 아트 전문",
    },
    {
      name: "최유진",
      phone: "010-1234-5604",
      position: "피부 관리사",
      hire_date: addDays(today, -450), // 1년 3개월 전
      salary: 3000000,
      notes: "피부 관리 전문 자격증 보유",
    },
    {
      name: "정수아",
      phone: "010-1234-5605",
      position: "마사지 테라피스트",
      hire_date: addDays(today, -180), // 6개월 전
      salary: 2800000,
      notes: "아로마 마사지 자격증",
    },
    {
      name: "강민지",
      phone: "010-1234-5606",
      position: "헤어 디자이너",
      hire_date: addDays(today, -90), // 3개월 전
      salary: 2500000,
      notes: "신입 디자이너",
    },
    {
      name: "윤하영",
      phone: "010-1234-5607",
      position: "피부 관리사",
      hire_date: addDays(today, -270), // 9개월 전
      salary: 2900000,
      notes: "여드름 케어 전문",
    },
  ];

  const ids: number[] = [];
  for (const s of staff) {
    const id = db.addStaff(s);
    ids.push(id);
  }

  return ids;
}

/**
 * 고객 데이터 생성
 */
async function createCustomers(db: BeautyDatabase): Promise<number[]> {
  const customers = [
    {
      name: "홍길동",
      phone: "010-2001-0001",
      email: "hong@example.com",
      gender: "male" as const,
      birth_date: "1990-03-15",
      notes: "VIP 고객",
    },
    {
      name: "김영희",
      phone: "010-2001-0002",
      email: "kim@example.com",
      gender: "female" as const,
      birth_date: "1985-07-22",
      notes: "염색 알레르기 주의",
    },
    {
      name: "이철수",
      phone: "010-2001-0003",
      email: "lee@example.com",
      gender: "male" as const,
      birth_date: "1992-11-05",
      notes: "",
    },
    {
      name: "박민지",
      phone: "010-2001-0004",
      email: "park@example.com",
      gender: "female" as const,
      birth_date: "1995-02-14",
      notes: "매달 정기 방문",
    },
    {
      name: "정수영",
      phone: "010-2001-0005",
      email: "jung@example.com",
      gender: "female" as const,
      birth_date: "1988-09-30",
      notes: "",
    },
    {
      name: "최현우",
      phone: "010-2001-0006",
      email: "choi@example.com",
      gender: "male" as const,
      birth_date: "1993-06-18",
      notes: "짧은 커트 선호",
    },
    {
      name: "강서진",
      phone: "010-2001-0007",
      email: "kang@example.com",
      gender: "female" as const,
      birth_date: "1991-04-25",
      notes: "피부 민감",
    },
    {
      name: "윤지호",
      phone: "010-2001-0008",
      email: "yoon@example.com",
      gender: "male" as const,
      birth_date: "1987-12-08",
      notes: "",
    },
    {
      name: "임소희",
      phone: "010-2001-0009",
      email: "lim@example.com",
      gender: "female" as const,
      birth_date: "1994-01-20",
      notes: "젤 네일 단골",
    },
    {
      name: "한지우",
      phone: "010-2001-0010",
      email: "han@example.com",
      gender: "female" as const,
      birth_date: "1989-08-12",
      notes: "",
    },
    {
      name: "오성민",
      phone: "010-2001-0011",
      email: "oh@example.com",
      gender: "male" as const,
      birth_date: "1996-05-03",
      notes: "",
    },
    {
      name: "서예진",
      phone: "010-2001-0012",
      email: "seo@example.com",
      gender: "female" as const,
      birth_date: "1990-10-17",
      notes: "피부관리 정기 고객",
    },
    {
      name: "남궁민",
      phone: "010-2001-0013",
      email: "nam@example.com",
      gender: "male" as const,
      birth_date: "1992-03-28",
      notes: "",
    },
    {
      name: "배수지",
      phone: "010-2001-0014",
      email: "bae@example.com",
      gender: "female" as const,
      birth_date: "1993-07-09",
      notes: "웨이브 펌 선호",
    },
    {
      name: "황인성",
      phone: "010-2001-0015",
      email: "hwang@example.com",
      gender: "male" as const,
      birth_date: "1986-11-23",
      notes: "",
    },
    {
      name: "노은채",
      phone: "010-2001-0016",
      email: "noh@example.com",
      gender: "female" as const,
      birth_date: "1995-04-16",
      notes: "네일 아트 애호가",
    },
    {
      name: "양태영",
      phone: "010-2001-0017",
      email: "yang@example.com",
      gender: "male" as const,
      birth_date: "1991-09-05",
      notes: "",
    },
    {
      name: "진아라",
      phone: "010-2001-0018",
      email: "jin@example.com",
      gender: "female" as const,
      birth_date: "1988-02-27",
      notes: "안티에이징 케어 정기",
    },
    {
      name: "신동혁",
      phone: "010-2001-0019",
      email: "shin@example.com",
      gender: "male" as const,
      birth_date: "1994-06-14",
      notes: "",
    },
    {
      name: "문채원",
      phone: "010-2001-0020",
      email: "moon@example.com",
      gender: "female" as const,
      birth_date: "1990-12-01",
      notes: "마사지 단골",
    },
    {
      name: "조현우",
      phone: "010-2001-0021",
      email: "jo@example.com",
      gender: "male" as const,
      birth_date: "1987-05-19",
      notes: "",
    },
    {
      name: "유나영",
      phone: "010-2001-0022",
      email: "yu@example.com",
      gender: "female" as const,
      birth_date: "1993-08-22",
      notes: "염색 자주 함",
    },
    {
      name: "차민수",
      phone: "010-2001-0023",
      email: "cha@example.com",
      gender: "male" as const,
      birth_date: "1989-01-10",
      notes: "",
    },
    {
      name: "송지아",
      phone: "010-2001-0024",
      email: "song@example.com",
      gender: "female" as const,
      birth_date: "1996-11-07",
      notes: "피부 트러블 관리 중",
    },
    {
      name: "안준혁",
      phone: "010-2001-0025",
      email: "ahn@example.com",
      gender: "male" as const,
      birth_date: "1991-03-29",
      notes: "",
    },
  ];

  const ids: number[] = [];
  for (const customer of customers) {
    const id = db.addCustomer(customer);
    ids.push(id);
  }

  return ids;
}

/**
 * 예약 데이터 생성
 */
async function createReservations(
  db: BeautyDatabase,
  customerIds: number[],
  serviceIds: number[],
  staffIds: number[]
): Promise<number> {
  const today = new Date();
  const statuses = ["completed", "confirmed", "pending", "cancelled"] as const;

  let count = 0;

  // 과거 예약 (50개) - 주로 완료됨
  for (let i = 0; i < 50; i++) {
    const daysAgo = Math.floor(Math.random() * 90) + 1; // 1-90일 전
    const date = addDays(today, -daysAgo);
    const time = randomTime();

    const reservation = {
      customer_id: randomChoice(customerIds),
      service_id: randomChoice(serviceIds),
      staff_id: randomChoice(staffIds),
      reservation_date: date,
      start_time: time,
      status: Math.random() > 0.1 ? ("completed" as const) : ("cancelled" as const),
      notes: Math.random() > 0.7 ? "고객 만족" : "",
    };

    db.addReservation(reservation);
    count++;
  }

  // 오늘 예약 (10개) - 확정됨
  for (let i = 0; i < 10; i++) {
    const time = randomTime();

    const reservation = {
      customer_id: randomChoice(customerIds),
      service_id: randomChoice(serviceIds),
      staff_id: randomChoice(staffIds),
      reservation_date: addDays(today, 0),
      start_time: time,
      status: "confirmed" as const,
      notes: "",
    };

    db.addReservation(reservation);
    count++;
  }

  // 미래 예약 (40개) - 확정 또는 대기
  for (let i = 0; i < 40; i++) {
    const daysLater = Math.floor(Math.random() * 30) + 1; // 1-30일 후
    const date = addDays(today, daysLater);
    const time = randomTime();

    const reservation = {
      customer_id: randomChoice(customerIds),
      service_id: randomChoice(serviceIds),
      staff_id: randomChoice(staffIds),
      reservation_date: date,
      start_time: time,
      status: Math.random() > 0.3 ? ("confirmed" as const) : ("pending" as const),
      notes: "",
    };

    db.addReservation(reservation);
    count++;
  }

  return count;
}

/**
 * 테스트 데이터 존재 여부 확인
 */
export function hasTestData(db: BeautyDatabase): boolean {
  try {
    const services = db.getAllServices();
    const customers = db.getAllCustomers();
    const staff = db.getAllStaff();

    // 최소 데이터가 있으면 테스트 데이터가 있다고 판단
    return services.length >= 10 && customers.length >= 20 && staff.length >= 5;
  } catch (error) {
    console.error("[TestData] Error checking test data:", error);
    return false;
  }
}

/**
 * 모든 데이터 삭제 (주의!)
 */
export function clearAllData(db: BeautyDatabase): void {
  console.warn("[TestData] Clearing all data...");

  try {
    // 외래 키 제약조건 비활성화
    db["db"].exec("PRAGMA foreign_keys = OFF");

    // 모든 테이블 데이터 삭제
    db["db"].exec("DELETE FROM reservations");
    db["db"].exec("DELETE FROM customers");
    db["db"].exec("DELETE FROM services");
    db["db"].exec("DELETE FROM staff");

    // 외래 키 제약조건 재활성화
    db["db"].exec("PRAGMA foreign_keys = ON");

    console.log("[TestData] All data cleared successfully");
  } catch (error) {
    console.error("[TestData] Error clearing data:", error);
    throw error;
  }
}
