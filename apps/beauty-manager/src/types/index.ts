// 기본 타입 정의
export interface Service {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  services: Service[];
  employeeId: string;
  employeeName: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  memo?: string;
  amount: number;
  createdAt: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday?: string;
  registeredDate: string;
  memo?: string;
  visitCount: number;
  lastVisit?: string;
  lastService?: string;
  mainStaff?: string;
}

export interface Holiday {
  id: string;
  startDate: string;
  endDate: string;
  type: 'annual' | 'sick' | 'personal' | 'family' | 'other';
  isHalfDay: boolean;
  reason?: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  position: 'owner' | 'manager' | 'senior' | 'junior' | 'intern';
  phone: string;
  email: string;
  hireDate: string;
  status: 'active' | 'on_leave' | 'terminated';
  avatar?: string;
  specialties: string[];
  personalMemo: string;
  monthlyCustomers: number;
  monthlyServices: number;
  holidays: Holiday[];
  workingDays: number;
  annualLeaveUsed: number;
  annualLeaveTotal: number;
}

export interface ServiceItem {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  monthlyUsage: number;
  averageRating: number;
  totalRevenue: number;
  priceOptions?: {
    id: string;
    name: string;
    additionalPrice: number;
    description: string;
  }[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}