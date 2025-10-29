import type { IAppointmentRepository } from '@/data/interfaces/IAppointmentRepository'
import type { Appointment, CreateAppointmentDTO } from '@/types/data'

/**
 * Web API 환경용 Appointment Repository
 * HTTP 통신을 통해 백엔드 서버에 접근
 */
export class WebAppointmentRepository implements IAppointmentRepository {
  private readonly baseUrl = '/api/appointments'

  async getAllByCustomerId(customerId: string): Promise<Appointment[]> {
    try {
      const response = await fetch(`${this.baseUrl}?customerId=${customerId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const appointments = await response.json()
      return appointments
    } catch (error) {
      console.error('[WebAppointmentRepository] getAllByCustomerId 실패:', error)
      throw new Error('예약 목록을 불러오는데 실패했습니다.')
    }
  }

  async create(data: CreateAppointmentDTO): Promise<Appointment> {
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const appointment = await response.json()
      return appointment
    } catch (error) {
      console.error('[WebAppointmentRepository] create 실패:', error)
      throw new Error('예약 생성에 실패했습니다.')
    }
  }
}
