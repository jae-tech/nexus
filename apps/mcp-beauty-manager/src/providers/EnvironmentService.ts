import type { ICustomerRepository } from '@/data/interfaces/ICustomerRepository'
import type { IAppointmentRepository } from '@/data/interfaces/IAppointmentRepository'
import { ElectronCustomerRepository } from '@/data/adapters/electron/ElectronCustomerRepository'
import { WebCustomerRepository } from '@/data/adapters/web/WebCustomerRepository'
import { ElectronAppointmentRepository } from '@/data/adapters/electron/ElectronAppointmentRepository'
import { WebAppointmentRepository } from '@/data/adapters/web/WebAppointmentRepository'

/**
 * 환경 타입 정의
 */
export type Environment = 'electron' | 'web'

/**
 * 현재 실행 환경 감지
 *
 * @returns 'electron' 또는 'web'
 */
export function detectEnvironment(): Environment {
  // Electron 환경 확인: window.api 존재 여부
  if (typeof window !== 'undefined' && window.api !== undefined) {
    return 'electron'
  }

  // Web 환경
  return 'web'
}

/**
 * 환경에 맞는 Customer Repository 인스턴스 생성
 *
 * @returns ICustomerRepository 구현체
 */
export function createCustomerRepository(): ICustomerRepository {
  const env = detectEnvironment()

  switch (env) {
    case 'electron':
      console.log('[EnvironmentService] Electron 환경 감지 - IPC Customer Repository 사용')
      return new ElectronCustomerRepository()

    case 'web':
      console.log('[EnvironmentService] Web 환경 감지 - HTTP Customer Repository 사용')
      return new WebCustomerRepository()

    default:
      // TypeScript exhaustive check
      const _exhaustive: never = env
      throw new Error(`지원하지 않는 환경: ${_exhaustive}`)
  }
}

/**
 * 환경에 맞는 Appointment Repository 인스턴스 생성
 *
 * @returns IAppointmentRepository 구현체
 */
export function createAppointmentRepository(): IAppointmentRepository {
  const env = detectEnvironment()

  switch (env) {
    case 'electron':
      console.log('[EnvironmentService] Electron 환경 감지 - IPC Appointment Repository 사용')
      return new ElectronAppointmentRepository()

    case 'web':
      console.log('[EnvironmentService] Web 환경 감지 - HTTP Appointment Repository 사용')
      return new WebAppointmentRepository()

    default:
      const _exhaustive: never = env
      throw new Error(`지원하지 않는 환경: ${_exhaustive}`)
  }
}
