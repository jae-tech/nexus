import { create } from 'zustand'
import type { ICustomerRepository } from '@/data/interfaces/ICustomerRepository'
import type { Customer, CreateCustomerDTO } from '@/types/data'

/**
 * Customer Store 상태 인터페이스
 */
export interface CustomerState {
  // 상태
  customers: Customer[]
  isLoading: boolean
  error: string | null

  // 액션
  fetchCustomers: () => Promise<void>
  addCustomer: (data: CreateCustomerDTO) => Promise<void>
  clearError: () => void
}

/**
 * Customer Store 타입 정의
 */
export type CustomerStore = ReturnType<typeof createCustomerStore>

/**
 * Customer Zustand Store 생성 함수
 * Repository 인스턴스를 주입받아 스토어 생성
 *
 * @param repository - ICustomerRepository 구현체
 * @returns Zustand 스토어 인스턴스
 *
 * @example
 * const customerStore = createCustomerStore(new ElectronCustomerRepository())
 */
export function createCustomerStore(repository: ICustomerRepository) {
  return create<CustomerState>((set) => ({
    // 초기 상태
    customers: [],
    isLoading: false,
    error: null,

    // 모든 고객 조회
    fetchCustomers: async () => {
      set({ isLoading: true, error: null })

      try {
        const customers = await repository.getAll()
        set({ customers, isLoading: false })
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
        set({ error: errorMessage, isLoading: false })
      }
    },

    // 고객 생성
    addCustomer: async (data: CreateCustomerDTO) => {
      set({ isLoading: true, error: null })

      try {
        const customer = await repository.create(data)
        set((state) => ({
          customers: [...state.customers, customer],
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
    }
  }))
}
