/**
 * 공유 타입 정의
 * Electron 메인 프로세스와 렌더러 프로세스 간에 공유되는 타입들
 */

/**
 * 고객 엔티티
 */
export interface Customer {
  id: string;
  name: string;
  phone: string;
  memo: string;
}

/**
 * 고객 생성 DTO
 */
export type CreateCustomerDTO = Omit<Customer, 'id'>;

/**
 * 고객 수정 DTO
 */
export type UpdateCustomerDTO = Partial<CreateCustomerDTO>;

/**
 * 예약 엔티티
 */
export interface Appointment {
  id: string;
  customerId: string;
  datetime: string;
  service: string;
}

/**
 * 예약 생성 DTO
 */
export type CreateAppointmentDTO = Omit<Appointment, 'id'>;

/**
 * 예약 수정 DTO
 */
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;
