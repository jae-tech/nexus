/**
 * Electron API 타입 정의
 *
 * window.api를 통해 접근하는 Electron IPC API의 타입 정의
 */

// ========== 데이터베이스 엔티티 타입 ==========

export interface Service {
  id?: number;
  name: string;
  category?: string;
  price: number;
  duration?: number;
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
  birth_date?: string;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Staff {
  id?: number;
  name: string;
  phone: string;
  position: string;
  hire_date?: string;
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
  reservation_date: string;
  start_time: string;
  end_time?: string;
  status?: "pending" | "confirmed" | "completed" | "cancelled";
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

// ========== 조인 쿼리 결과 타입 ==========

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
  service_category?: string;
  service_price: number;
  service_duration?: number;
  staff_id?: number;
  staff_name?: string;
  staff_position?: string;
}

// ========== 예약 비즈니스 로직 타입 ==========

export interface BusinessHours {
  openTime: string;
  closeTime: string;
  breakStart?: string;
  breakEnd?: string;
}

export interface ConflictCheck {
  hasConflict: boolean;
  conflictingReservations: Array<{
    id: number;
    customerName: string;
    startTime: string;
    endTime: string;
  }>;
}

export interface AvailableTimeSlot {
  time: string;
  available: boolean;
  reason?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

export interface ReservationAvailability {
  can: boolean;
  reason?: string;
}

// ========== Electron API 타입 정의 ==========

// ========== 서비스 관리 타입 ==========

export interface ServiceStats {
  service_id: number;
  service_name: string;
  category?: string;
  current_price: number;
  total_reservations: number;
  completed_reservations: number;
  total_revenue: number;
  popularity_rank?: number;
}

export interface ServiceDeletionImpact {
  canDelete: boolean;
  activeReservations: number;
  futureReservations: number;
  completedReservations: number;
  warnings: string[];
}

// ========== 직원 관리 타입 ==========

export interface StaffPerformance {
  staff_id: number;
  staff_name: string;
  position: string;
  total_reservations: number;
  completed_reservations: number;
  cancelled_reservations: number;
  total_revenue: number;
  avg_revenue_per_reservation: number;
  completion_rate: number;
  performance_score: number;
}

export interface StaffDeletionImpact {
  canDelete: boolean;
  activeReservations: number;
  futureReservations: number;
  completedReservations: number;
  warnings: string[];
  reassignmentNeeded: boolean;
}

export interface StaffReservationStatus {
  upcoming: number;
  inProgress: number;
  completed: number;
  cancelled: number;
}

export interface StaffWorkingHours {
  totalDays: number;
  totalReservations: number;
  avgReservationsPerDay: number;
  busiestDay: string;
}

export interface ElectronAPI {
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
    getReservationsByDateRange: (startDate: string, endDate: string, status?: string) => Promise<Reservation[]>;
    getServicesByPriceRange: (minPrice: number, maxPrice: number) => Promise<Service[]>;
    getServicesByCategory: (category: string) => Promise<Service[]>;
    getStaffByPosition: (position: string) => Promise<Staff[]>;

    // Relational Queries
    getReservationsWithDetails: () => Promise<ReservationWithDetails[]>;
    getReservationsByDate: (date: string) => Promise<any[]>;
    getCustomerReservations: (customerId: number) => Promise<any[]>;
    getStaffSchedule: (staffId: number, startDate?: string, endDate?: string) => Promise<any[]>;

    // Statistics
    getSalesStats: (startDate: string, endDate: string) => Promise<any>;
    getServiceStats: (startDate?: string, endDate?: string) => Promise<any[]>;
    getStaffPerformance: (startDate?: string, endDate?: string) => Promise<any[]>;
    getCustomerStats: (customerId?: number) => Promise<any[]>;
    getMonthlyRevenue: (year: number) => Promise<any[]>;
    getDashboardStats: () => Promise<any>;

    // Advanced Search
    searchCustomersAdvanced: (options: any) => Promise<Customer[]>;
    searchServicesAdvanced: (options: any) => Promise<Service[]>;
    searchReservationsAdvanced: (options: any) => Promise<Reservation[]>;

    // Pagination
    getCustomersPaginated: (page: number, limit: number, search?: string) => Promise<any>;
    getServicesPaginated: (page: number, limit: number, category?: string, search?: string) => Promise<any>;
    getReservationsPaginated: (page: number, limit: number, filters?: any) => Promise<any>;
    getStaffPaginated: (page: number, limit: number, position?: string) => Promise<any>;

    // Advanced Statistics
    getMonthlyStatsDetailed: (year: number, month: number) => Promise<any>;
    getPopularServices: (limit?: number, startDate?: string, endDate?: string) => Promise<any[]>;
    getCustomerVisitHistory: (customerId: number) => Promise<any[]>;
  };

  service: {
    getByCategory: () => Promise<Record<string, Service[]>>;
    getPopularity: (startDate?: string, endDate?: string) => Promise<ServiceStats[]>;
    search: (options: any) => Promise<Service[]>;
    analyzeDeletion: (serviceId: number) => Promise<ServiceDeletionImpact>;
    duplicate: (serviceId: number, newName: string) => Promise<number>;
    bulkUpdatePrices: (updates: Array<{ serviceId: number; newPrice: number; reason?: string }>) => Promise<{ success: boolean }>;
    getCategoryAvgPrices: () => Promise<Record<string, number>>;
    analyzeProfitability: (startDate?: string, endDate?: string) => Promise<any[]>;
    recommendForCustomer: (customerId: number, limit?: number) => Promise<Service[]>;
    validate: (service: Omit<Service, "id">) => Promise<ValidationResult>;
    validateUpdate: (serviceId: number, updates: Partial<Service>) => Promise<ValidationResult>;
  };

  staff: {
    getByPosition: () => Promise<Record<string, Staff[]>>;
    analyzePerformance: (staffId?: number, startDate?: string, endDate?: string) => Promise<StaffPerformance[]>;
    getReservationStatus: (staffId: number, startDate?: string, endDate?: string) => Promise<StaffReservationStatus>;
    analyzeDeletion: (staffId: number) => Promise<StaffDeletionImpact>;
    reassignReservations: (fromStaffId: number, toStaffId: number, startDate?: string) => Promise<number>;
    getWorkingHours: (staffId: number, startDate: string, endDate: string) => Promise<StaffWorkingHours>;
    getTopPerformers: (limit?: number, startDate?: string, endDate?: string) => Promise<StaffPerformance[]>;
    validate: (staff: Omit<Staff, "id">) => Promise<ValidationResult>;
    validateUpdate: (staffId: number, updates: Partial<Staff>) => Promise<ValidationResult>;
    search: (options: any) => Promise<Staff[]>;
  };

  reservation: {
    checkConflict: (date: string, startTime: string, endTime: string, staffId?: number, excludeReservationId?: number) => Promise<ConflictCheck>;
    getAvailableSlots: (date: string, staffId?: number, serviceDuration?: number) => Promise<AvailableTimeSlot[]>;
    getAvailableStaff: (date: string, startTime: string, endTime: string, position?: string) => Promise<Staff[]>;
    validate: (reservation: Omit<Reservation, "id">) => Promise<ValidationResult>;
    validateUpdate: (reservationId: number, updates: Partial<Reservation>) => Promise<ValidationResult>;
    suggestAlternatives: (date: string, staffId?: number, serviceDuration?: number, limit?: number) => Promise<AvailableTimeSlot[]>;
    calculateEndTime: (startTime: string, durationMinutes: number) => Promise<string>;
    canMake: (date: string, startTime: string, endTime: string, staffId?: number) => Promise<ReservationAvailability>;
    getBusinessHours: () => Promise<BusinessHours>;
    updateBusinessHours: (businessHours: BusinessHours) => Promise<{ success: boolean }>;
  };

  userData: {
    loadSettings: <T = any>() => Promise<T | null>;
    saveSettings: <T = any>(settings: T) => Promise<boolean>;
    createBackup: () => Promise<string | null>;
    listBackups: () => Promise<Array<{ name: string; path: string; date: Date; size: number }>>;
    restoreBackup: (backupPath: string) => Promise<boolean>;
    exportData: (data: any, filePath: string) => Promise<boolean>;
    importData: <T = any>(filePath: string) => Promise<T | null>;
    getDiskUsage: () => Promise<{ database: number; backups: number; total: number; formatted: { database: string; backups: string; total: string } }>;
  };

  on: (channel: string, callback: (...args: any[]) => void) => () => void;
  once: (channel: string, callback: (...args: any[]) => void) => void;
  platform: string;
  versions: {
    node: string;
    chrome: string;
    electron: string;
  };
}

// window.api 전역 타입 선언
declare global {
  interface Window {
    api: ElectronAPI;
  }
}
