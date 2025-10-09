export type ReservationStatus =
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

export interface Reservation {
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
  status: ReservationStatus;
  memo?: string;
  amount: number;
  createdAt: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}
