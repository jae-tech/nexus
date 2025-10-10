import {
  useCustomerStoreContext,
  useAppointmentStoreContext
} from '@/providers/RepositoryProvider'
import type { CustomerState } from '@/store/CustomerStore'
import type { AppointmentState } from '@/store/AppointmentStore'

/**
 * Customer Store Hook
 * Context에서 Zustand 스토어를 가져와 사용
 *
 * @returns Customer Store 상태 및 액션
 *
 * @example
 * function CustomerList() {
 *   const { customers, isLoading, fetchCustomers } = useCustomerStore()
 *
 *   useEffect(() => {
 *     fetchCustomers()
 *   }, [])
 *
 *   return <ul>{customers.map(c => <li key={c.id}>{c.name}</li>)}</ul>
 * }
 */
export function useCustomerStore(): CustomerState {
  const store = useCustomerStoreContext()
  return store()
}

/**
 * Customer Store Selector Hook
 * 성능 최적화를 위한 부분 구독 훅
 *
 * @param selector - 스토어에서 필요한 값만 선택하는 함수
 * @returns 선택된 값
 *
 * @example
 * // 고객 목록만 구독 (isLoading 변경 시 리렌더링 안 됨)
 * const customers = useCustomerStoreSelector(state => state.customers)
 */
export function useCustomerStoreSelector<T>(selector: (state: CustomerState) => T): T {
  const store = useCustomerStoreContext()
  return store(selector)
}

/**
 * Appointment Store Hook
 * Context에서 Zustand 스토어를 가져와 사용
 *
 * @returns Appointment Store 상태 및 액션
 *
 * @example
 * function AppointmentList({ customerId }: { customerId: string }) {
 *   const { appointments, isLoading, fetchAppointmentsByCustomer } = useAppointmentStore()
 *
 *   useEffect(() => {
 *     fetchAppointmentsByCustomer(customerId)
 *   }, [customerId])
 *
 *   return <ul>{appointments.map(a => <li key={a.id}>{a.service}</li>)}</ul>
 * }
 */
export function useAppointmentStore(): AppointmentState {
  const store = useAppointmentStoreContext()
  return store()
}

/**
 * Appointment Store Selector Hook
 * 성능 최적화를 위한 부분 구독 훅
 *
 * @param selector - 스토어에서 필요한 값만 선택하는 함수
 * @returns 선택된 값
 *
 * @example
 * // 예약 목록만 구독 (isLoading 변경 시 리렌더링 안 됨)
 * const appointments = useAppointmentStoreSelector(state => state.appointments)
 */
export function useAppointmentStoreSelector<T>(
  selector: (state: AppointmentState) => T
): T {
  const store = useAppointmentStoreContext()
  return store(selector)
}
