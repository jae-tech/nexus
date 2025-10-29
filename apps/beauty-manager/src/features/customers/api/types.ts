export interface Customer {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  registeredDate: string;
  memo: string;
  visitCount: number;
  lastVisit: string;
  lastService: string;
  mainStaff: string;
}

export interface TodayAppointment {
  id: number;
  time: string;
  customerName: string;
  service: string;
  staff: string;
  phone: string;
}

export interface RecentCustomer {
  id: number;
  name: string;
  phone: string;
  registeredDate: string;
  firstService: string;
}
