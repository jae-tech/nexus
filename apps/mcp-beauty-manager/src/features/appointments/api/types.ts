export type AppointmentStatus =
  | 'scheduled'
  | 'completed'
  | 'cancelled'
  | 'no-show';

export interface ServiceItem {
  id: string;
  name: string;
  duration: number;
  price: number;
}

export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  services: ServiceItem[];
  employeeId: string;
  employeeName: string;
  status: AppointmentStatus;
  memo?: string;
  amount: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}
