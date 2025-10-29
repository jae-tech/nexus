/**
 * 공유 타입 재내보내기
 * Electron 메인 프로세스와 동일한 타입 사용
 */
export type {
  Customer,
  CreateCustomerDTO,
  UpdateCustomerDTO,
  Appointment,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from '../../electron/types';
