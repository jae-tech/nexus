import type { IAppointmentRepository } from '@/data/interfaces/IAppointmentRepository'
import type { Appointment, CreateAppointmentDTO } from '@/types/data'

/**
 * Electron 환경용 Appointment Repository
 * IPC 통신을 통해 메인 프로세스의 SQLite3에 접근
 */
export class ElectronAppointmentRepository implements IAppointmentRepository {
  async getAllByCustomerId(customerId: string): Promise<Appointment[]> {
    try {
      const appointments = await window.api.invoke(
        'appointment:getAllByCustomerId',
        customerId
      )
      return appointments
    } catch (error) {
      console.error('[ElectronAppointmentRepository] getAllByCustomerId 실패:', error)
      throw new Error('예약 목록을 불러오는데 실패했습니다.')
    }
  }

  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    try {
      const appointment = await window.api.invoke('appointment:create', data)
      return appointment
    } catch (error) {
      console.error('[ElectronAppointmentRepository] create 실패:', error)
      throw new Error('예약 생성에 실패했습니다.')
    }
  }
}
