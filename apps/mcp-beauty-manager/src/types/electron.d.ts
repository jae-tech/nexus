/**
 * Electron API 타입 정의 (React 앱용)
 *
 * 이 파일은 React 앱에서 window.api의 타입 안전성을 보장합니다.
 * Electron preload 스크립트에서 노출한 API와 동일한 인터페이스를 제공합니다.
 */

// ========== 기본 엔티티 타입 ==========

export interface Service {
  id?: number;
  name: string;
  category?: string;
  price: number;
  duration?: number; // 분 단위
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Customer {
  id?: number;
  name: string;
  phone: string;
  email?: string;
  gender?: "male" | "female" | "other";
  birth_date?: string; // YYYY-MM-DD
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
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

export interface Reservation {
  id?: number;
  customer_id: number;
  staff_id?: number;
  service_id: number;
  reservation_date: string; // YYYY-MM-DD
  start_time: string; // HH:MM
  end_time?: string; // HH:MM
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ========== 확장 타입 (JOIN 쿼리 결과) ==========

export interface ReservationWithDetails {
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

// ========== 통계 타입 ==========

export interface DashboardStats {
  today_reservations: number;
  total_customers: number;
  monthly_revenue: number;
  pending_reservations: number;
}

export interface MonthlyStats {
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

export interface ServiceStats {
  id: number;
  name: string;
  category: string;
  price: number;
  total_bookings: number;
  completed_bookings: number;
  total_revenue: number;
  avg_rating?: number;
}

export interface StaffPerformance {
  staff_id: number;
  staff_name: string;
  total_appointments: number;
  completed_appointments: number;
  total_revenue: number;
  avg_rating?: number;
}

export interface CustomerStat {
  customer_id: number;
  customer_name: string;
  total_visits: number;
  total_spent: number;
  avg_spent_per_visit: number;
  favorite_service?: string;
  last_visit?: string;
}

export interface VisitHistory {
  visit_date: string;
  service_name: string;
  service_price: number;
  staff_name?: string;
  status: string;
  notes?: string;
}

export interface MonthlyRevenue {
  month: number;
  revenue: number;
}

export interface SalesStats {
  total_revenue: number;
  total_reservations: number;
  avg_revenue_per_reservation: number;
  period_start: string;
  period_end: string;
}

// ========== 페이지네이션 타입 ==========

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: PaginationMeta;
}

// ========== 검색 및 필터 타입 ==========

export interface SortOptions {
  field: string;
  order: "asc" | "desc";
}

export interface SearchOptions {
  query?: string;
  category?: string;
  priceRange?: [number, number];
  dateRange?: [string, string];
  status?: string;
  sort?: SortOptions;
}

export interface CustomerSearchOptions extends SearchOptions {
  gender?: "male" | "female" | "other";
  minVisits?: number;
}

export interface ServiceSearchOptions extends SearchOptions {
  minPrice?: number;
  maxPrice?: number;
  minDuration?: number;
  maxDuration?: number;
}

export interface ReservationSearchOptions extends SearchOptions {
  customerId?: number;
  staffId?: number;
  serviceId?: number;
  startDate?: string;
  endDate?: string;
}

// ========== 사용자 데이터 타입 ==========

export interface BackupInfo {
  name: string;
  path: string;
  date: Date;
  size: number;
}

export interface DiskUsage {
  database: number;
  backups: number;
  total: number;
  formatted: {
    database: string;
    backups: string;
    total: string;
  };
}

export interface AppSettings {
  theme?: "light" | "dark" | "system";
  language?: "ko" | "en";
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
    defaultView: "day" | "week" | "month";
  };
}

// ========== Electron API 인터페이스 ==========

export interface ElectronDatabaseAPI {
  // Services
  getServices: () => Promise<Service[]>;
  getServiceById: (id: number) => Promise<Service | undefined>;
  addService: (service: Omit<Service, "id" | "created_at" | "updated_at">) => Promise<number>;
  updateService: (id: number, service: Partial<Service>) => Promise<void>;
  deleteService: (id: number) => Promise<void>;

  // Customers
  getCustomers: () => Promise<Customer[]>;
  getCustomerById: (id: number) => Promise<Customer | undefined>;
  addCustomer: (customer: Omit<Customer, "id" | "created_at" | "updated_at">) => Promise<number>;
  updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
  deleteCustomer: (id: number) => Promise<void>;

  // Staff
  getStaff: () => Promise<Staff[]>;
  getStaffById: (id: number) => Promise<Staff | undefined>;
  addStaff: (staff: Omit<Staff, "id" | "created_at" | "updated_at">) => Promise<number>;
  updateStaff: (id: number, staff: Partial<Staff>) => Promise<void>;
  deleteStaff: (id: number) => Promise<void>;

  // Reservations
  getReservations: () => Promise<Reservation[]>;
  getReservationById: (id: number) => Promise<Reservation | undefined>;
  addReservation: (
    reservation: Omit<Reservation, "id" | "created_at" | "updated_at">
  ) => Promise<number>;
  updateReservation: (id: number, reservation: Partial<Reservation>) => Promise<void>;
  deleteReservation: (id: number) => Promise<void>;

  // Search & Filter
  searchCustomers: (searchTerm: string) => Promise<Customer[]>;
  searchServices: (searchTerm: string, category?: string) => Promise<Service[]>;
  getReservationsByDateRange: (
    startDate: string,
    endDate: string,
    status?: string
  ) => Promise<Reservation[]>;
  getServicesByPriceRange: (minPrice: number, maxPrice: number) => Promise<Service[]>;
  getServicesByCategory: (category: string) => Promise<Service[]>;
  getStaffByPosition: (position: string) => Promise<Staff[]>;

  // Relational Queries
  getReservationsWithDetails: () => Promise<ReservationWithDetails[]>;
  getReservationsByDate: (date: string) => Promise<ReservationWithDetails[]>;
  getCustomerReservations: (customerId: number) => Promise<ReservationWithDetails[]>;
  getStaffSchedule: (
    staffId: number,
    startDate?: string,
    endDate?: string
  ) => Promise<ReservationWithDetails[]>;

  // Statistics
  getSalesStats: (startDate: string, endDate: string) => Promise<SalesStats>;
  getServiceStats: (startDate?: string, endDate?: string) => Promise<ServiceStats[]>;
  getStaffPerformance: (startDate?: string, endDate?: string) => Promise<StaffPerformance[]>;
  getCustomerStats: (customerId?: number) => Promise<CustomerStat[]>;
  getMonthlyRevenue: (year: number) => Promise<MonthlyRevenue[]>;
  getDashboardStats: () => Promise<DashboardStats>;

  // Advanced Search
  searchCustomersAdvanced: (options: CustomerSearchOptions) => Promise<Customer[]>;
  searchServicesAdvanced: (options: ServiceSearchOptions) => Promise<Service[]>;
  searchReservationsAdvanced: (options: ReservationSearchOptions) => Promise<Reservation[]>;

  // Pagination
  getCustomersPaginated: (
    page: number,
    limit: number,
    search?: string
  ) => Promise<PaginatedResult<Customer>>;
  getServicesPaginated: (
    page: number,
    limit: number,
    category?: string,
    search?: string
  ) => Promise<PaginatedResult<Service>>;
  getReservationsPaginated: (
    page: number,
    limit: number,
    filters?: ReservationSearchOptions
  ) => Promise<PaginatedResult<Reservation>>;
  getStaffPaginated: (
    page: number,
    limit: number,
    position?: string
  ) => Promise<PaginatedResult<Staff>>;

  // Advanced Statistics
  getMonthlyStatsDetailed: (year: number, month: number) => Promise<MonthlyStats>;
  getPopularServices: (
    limit?: number,
    startDate?: string,
    endDate?: string
  ) => Promise<ServiceStats[]>;
  getCustomerVisitHistory: (customerId: number) => Promise<VisitHistory[]>;
}

export interface ElectronUserDataAPI {
  loadSettings: <T = AppSettings>() => Promise<T | null>;
  saveSettings: <T = AppSettings>(settings: T) => Promise<boolean>;
  createBackup: () => Promise<string | null>;
  listBackups: () => Promise<BackupInfo[]>;
  restoreBackup: (backupPath: string) => Promise<boolean>;
  exportData: (data: any, filePath: string) => Promise<boolean>;
  importData: <T = any>(filePath: string) => Promise<T | null>;
  getDiskUsage: () => Promise<DiskUsage>;
}

export interface ElectronAPI {
  // 데이터베이스 API
  db: ElectronDatabaseAPI;

  // 사용자 데이터 API
  userData: ElectronUserDataAPI;

  // 이벤트 리스너 API
  on: (channel: string, callback: (...args: any[]) => void) => () => void;
  once: (channel: string, callback: (...args: any[]) => void) => void;

  // 유틸리티 API
  platform: "darwin" | "win32" | "linux";
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

// ========== 신규 Customer/Appointment API (간소화된 버전) ==========

export interface SimpleElectronAPI {
  customer: {
    getAll: () => Promise<Array<{ id: string; name: string; phone: string; memo: string }>>;
    getById: (id: string) => Promise<{ id: string; name: string; phone: string; memo: string } | null>;
    create: (customer: { id: string; name: string; phone: string; memo: string }) => Promise<void>;
    update: (customer: { id: string; name: string; phone: string; memo: string }) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
  appointment: {
    getAll: () => Promise<Array<{ id: string; customerId: string; datetime: string; service: string }>>;
    getAllByCustomerId: (customerId: string) => Promise<Array<{ id: string; customerId: string; datetime: string; service: string }>>;
    getById: (id: string) => Promise<{ id: string; customerId: string; datetime: string; service: string } | null>;
    create: (appointment: { id: string; customerId: string; datetime: string; service: string }) => Promise<void>;
    update: (appointment: { id: string; customerId: string; datetime: string; service: string }) => Promise<void>;
    delete: (id: string) => Promise<void>;
  };
}

// ========== Window 객체 확장 ==========

declare global {
  interface Window {
    api: {
      db: {
        getCustomers: () => Promise<Customer[]>;
        getCustomerById: (id: number) => Promise<Customer | null>;
        getStaff: () => Promise<Staff[]>;
        getServices: () => Promise<Service[]>;
      };
      customer: {
        getAll: () => Promise<Customer[]>;
        getById: (id: string) => Promise<Customer | null>;
        create: (customer: Customer) => Promise<void>;
        update: (customer: Customer) => Promise<void>;
        delete: (id: string) => Promise<void>;
      };
      appointments: {
        getAll: () => Promise<Reservation[]>;
        getAllByCustomerId: (customerId: string) => Promise<Reservation[]>;
        getById: (id: string) => Promise<Reservation | null>;
        create: (appointment: Reservation) => Promise<void>;
        update: (appointment: Reservation) => Promise<void>;
        delete: (id: string) => Promise<void>;
      };
    };
  }
}
