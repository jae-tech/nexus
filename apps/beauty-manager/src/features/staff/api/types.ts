export type HolidayType = 'annual' | 'sick' | 'personal' | 'family' | 'other';
export type HolidayStatus = 'pending' | 'approved' | 'rejected';
export type StaffPosition =
  | 'owner'
  | 'manager'
  | 'senior'
  | 'junior'
  | 'intern';
export type StaffStatus = 'active' | 'on_leave' | 'terminated';

export interface Holiday {
  id: string;
  startDate: string;
  endDate: string;
  type: HolidayType;
  isHalfDay: boolean;
  reason?: string;
  status: HolidayStatus;
  appliedAt: string;
}

export interface Staff {
  id: string;
  name: string;
  role: string;
  position: StaffPosition;
  phone: string;
  email: string;
  hireDate: string;
  status: StaffStatus;
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
