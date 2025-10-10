import type { Appointment, CreateAppointmentDTO } from '@/types/data'

/**
 * 예약 데이터 접근을 위한 Repository 인터페이스
 * Electron IPC와 Web API 구현체 모두 이 인터페이스를 따름
 */
export interface IAppointmentRepository {
  /**
   * 특정 고객의 모든 예약 조회
   * @param customerId - 고객 ID
   */
  getAllByCustomerId(customerId: string): Promise<Appointment[]>

  /**
   * 예약 생성
   * @param data - 예약 생성 데이터
   */
  create(data: CreateAppointmentDTO): Promise<Appointment>
}
