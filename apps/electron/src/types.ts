// Electron IPC 통신을 위한 타입 정의

import type { Service, Customer, Staff, Reservation } from "./db/database";

// ========== 페이지네이션 타입 ==========

export interface PaginatedResult<T> {
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

// ========== 예약 상세 정보 타입 ==========

export interface ReservationWithDetails {
  id: number;
  reservation_date: string;
  start_time: string;
  end_time?: string;
  status: string;
  notes?: string;
  created_at: string;
  customer_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  service_id: number;
  service_name: string;
  service_category: string;
  service_price: number;
  service_duration: number;
  staff_id?: number;
  staff_name?: string;
  staff_position?: string;
}

// ========== 통계 타입 ==========

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

export interface VisitHistory {
  visit_date: string;
  service_name: string;
  service_price: number;
  staff_name?: string;
  status: string;
  notes?: string;
}

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

// IPC 채널 정의
export const IPC_CHANNELS = {
  // Services
  DB_GET_SERVICES: "db:getServices",
  DB_GET_SERVICE_BY_ID: "db:getServiceById",
  DB_ADD_SERVICE: "db:addService",
  DB_UPDATE_SERVICE: "db:updateService",
  DB_DELETE_SERVICE: "db:deleteService",

  // Customers
  DB_GET_CUSTOMERS: "db:getCustomers",
  DB_GET_CUSTOMER_BY_ID: "db:getCustomerById",
  DB_ADD_CUSTOMER: "db:addCustomer",
  DB_UPDATE_CUSTOMER: "db:updateCustomer",
  DB_DELETE_CUSTOMER: "db:deleteCustomer",

  // Staff
  DB_GET_STAFF: "db:getStaff",
  DB_GET_STAFF_BY_ID: "db:getStaffById",
  DB_ADD_STAFF: "db:addStaff",
  DB_UPDATE_STAFF: "db:updateStaff",
  DB_DELETE_STAFF: "db:deleteStaff",

  // Reservations
  DB_GET_RESERVATIONS: "db:getReservations",
  DB_GET_RESERVATION_BY_ID: "db:getReservationById",
  DB_ADD_RESERVATION: "db:addReservation",
  DB_UPDATE_RESERVATION: "db:updateReservation",
  DB_DELETE_RESERVATION: "db:deleteReservation",

  // Search & Filter
  DB_SEARCH_CUSTOMERS: "db:searchCustomers",
  DB_SEARCH_SERVICES: "db:searchServices",
  DB_GET_RESERVATIONS_BY_DATE_RANGE: "db:getReservationsByDateRange",
  DB_GET_SERVICES_BY_PRICE_RANGE: "db:getServicesByPriceRange",
  DB_GET_SERVICES_BY_CATEGORY: "db:getServicesByCategory",
  DB_GET_STAFF_BY_POSITION: "db:getStaffByPosition",

  // Relational Queries
  DB_GET_RESERVATIONS_WITH_DETAILS: "db:getReservationsWithDetails",
  DB_GET_RESERVATIONS_BY_DATE: "db:getReservationsByDate",
  DB_GET_CUSTOMER_RESERVATIONS: "db:getCustomerReservations",
  DB_GET_STAFF_SCHEDULE: "db:getStaffSchedule",

  // Statistics
  DB_GET_SALES_STATS: "db:getSalesStats",
  DB_GET_SERVICE_STATS: "db:getServiceStats",
  DB_GET_STAFF_PERFORMANCE: "db:getStaffPerformance",
  DB_GET_CUSTOMER_STATS: "db:getCustomerStats",
  DB_GET_MONTHLY_REVENUE: "db:getMonthlyRevenue",
  DB_GET_DASHBOARD_STATS: "db:getDashboardStats",

  // Advanced Search
  DB_SEARCH_CUSTOMERS_ADVANCED: "db:searchCustomersAdvanced",
  DB_SEARCH_SERVICES_ADVANCED: "db:searchServicesAdvanced",
  DB_SEARCH_RESERVATIONS_ADVANCED: "db:searchReservationsAdvanced",

  // Pagination
  DB_GET_CUSTOMERS_PAGINATED: "db:getCustomersPaginated",
  DB_GET_SERVICES_PAGINATED: "db:getServicesPaginated",
  DB_GET_RESERVATIONS_PAGINATED: "db:getReservationsPaginated",
  DB_GET_STAFF_PAGINATED: "db:getStaffPaginated",

  // Advanced Statistics
  DB_GET_MONTHLY_STATS_DETAILED: "db:getMonthlyStatsDetailed",
  DB_GET_POPULAR_SERVICES: "db:getPopularServices",
  DB_GET_CUSTOMER_VISIT_HISTORY: "db:getCustomerVisitHistory",
} as const;

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

// ========== Window API 인터페이스 (React 앱에서 사용) ==========

export interface WindowAPI {
  // 데이터베이스 API
  db: {
    // Services
    getServices: () => Promise<Service[]>;
    getServiceById: (id: number) => Promise<Service | undefined>;
    addService: (service: Service) => Promise<number>;
    updateService: (id: number, service: Partial<Service>) => Promise<void>;
    deleteService: (id: number) => Promise<void>;

    // Customers
    getCustomers: () => Promise<Customer[]>;
    getCustomerById: (id: number) => Promise<Customer | undefined>;
    addCustomer: (customer: Customer) => Promise<number>;
    updateCustomer: (id: number, customer: Partial<Customer>) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;

    // Staff
    getStaff: () => Promise<Staff[]>;
    getStaffById: (id: number) => Promise<Staff | undefined>;
    addStaff: (staff: Staff) => Promise<number>;
    updateStaff: (id: number, staff: Partial<Staff>) => Promise<void>;
    deleteStaff: (id: number) => Promise<void>;

    // Reservations
    getReservations: () => Promise<Reservation[]>;
    getReservationById: (id: number) => Promise<Reservation | undefined>;
    addReservation: (reservation: Reservation) => Promise<number>;
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
    getSalesStats: (startDate: string, endDate: string) => Promise<any>;
    getServiceStats: (startDate?: string, endDate?: string) => Promise<ServiceStats[]>;
    getStaffPerformance: (startDate?: string, endDate?: string) => Promise<any[]>;
    getCustomerStats: (customerId?: number) => Promise<any[]>;
    getMonthlyRevenue: (year: number) => Promise<any[]>;
    getDashboardStats: () => Promise<any>;

    // Advanced Search
    searchCustomersAdvanced: (options: SearchOptions) => Promise<Customer[]>;
    searchServicesAdvanced: (options: SearchOptions) => Promise<Service[]>;
    searchReservationsAdvanced: (options: SearchOptions) => Promise<Reservation[]>;

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
      filters?: any
    ) => Promise<PaginatedResult<Reservation>>;
    getStaffPaginated: (
      page: number,
      limit: number,
      position?: string
    ) => Promise<PaginatedResult<Staff>>;

    // Advanced Statistics
    getMonthlyStatsDetailed: (year: number, month: number) => Promise<MonthlyStats>;
    getPopularServices: (limit?: number, startDate?: string, endDate?: string) => Promise<ServiceStats[]>;
    getCustomerVisitHistory: (customerId: number) => Promise<VisitHistory[]>;
  };

  // 사용자 데이터 API
  userData: {
    loadSettings: <T = any>() => Promise<T | null>;
    saveSettings: <T = any>(settings: T) => Promise<boolean>;
    createBackup: () => Promise<string | null>;
    listBackups: () => Promise<BackupInfo[]>;
    restoreBackup: (backupPath: string) => Promise<boolean>;
    exportData: (data: any, filePath: string) => Promise<boolean>;
    importData: <T = any>(filePath: string) => Promise<T | null>;
    getDiskUsage: () => Promise<DiskUsage>;
  };

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

// Window 객체 확장
declare global {
  interface Window {
    api: WindowAPI;
  }
}

export {};
