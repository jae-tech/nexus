import { create } from 'zustand'
import type { IAppointmentRepository } from '@/data/interfaces/IAppointmentRepository'
import type { Appointment, CreateAppointmentDTO } from '@/types/data'

/**
 * Appointment Store 상태 인터페이스
 */
export interface AppointmentState {
  // 상태
  appointments: Appointment[]
  isLoading: boolean
  error: string | null
  currentCustomerId: string | null

  // 액션
  fetchAppointmentsByCustomer: (customerId: string) => Promise<void>
  addAppointment: (data: CreateAppointmentDTO) => Promise<void>
  clearError: () => void
  clearAppointments: () => void
}

/**
 * Appointment Store 타입 정의
 */
export type AppointmentStore = ReturnType<typeof createAppointmentStore>

/**
 * Appointment Zustand Store 생성 함수
 * Repository 인스턴스를 주입받아 스토어 생성
 *
 * @param repository - IAppointmentRepository 구현체
 * @returns Zustand 스토어 인스턴스
 *
 * @example
 * const appointmentStore = createAppointmentStore(new ElectronAppointmentRepository())
 */
export function createAppointmentStore(repository: IAppointmentRepository) {
  return create<AppointmentState>((set) => ({
    // 초기 상태
    appointments: [],
    isLoading: false,
    error: null,
    currentCustomerId: null,

    // 특정 고객의 예약 조회
    fetchAppointmentsByCustomer: async (customerId: string) => {
      set({ isLoading: true, error: null, currentCustomerId: customerId })

      try {
        const appointments = await repository.getAllByCustomerId(customerId)
        set({ appointments, isLoading: false })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
      }
    },

    // 예약 생성
    addAppointment: async (data: CreateAppointmentDTO) => {
      set({ isLoading: true, error: null })

      try {
        const appointment = await repository.create(data)
        set((state) => ({
          appointments: [...state.appointments, appointment],
          isLoading: false
        }))
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
      }
    },

    // 에러 초기화
    clearError: () => {
      set({ error: null })
    },

    // 예약 목록 초기화
    clearAppointments: () => {
      set({ appointments: [], currentCustomerId: null })
    }
  }))
}
