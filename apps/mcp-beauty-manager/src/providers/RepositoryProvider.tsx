import React, { createContext, useContext, type ReactNode } from 'react'
import type { CustomerStore } from '@/store/CustomerStore'
import type { AppointmentStore } from '@/store/AppointmentStore'

/**
 * Customer Store Context 정의
 */
const CustomerStoreContext = createContext<CustomerStore | null>(null)

/**
 * Appointment Store Context 정의
 */
const AppointmentStoreContext = createContext<AppointmentStore | null>(null)

/**
 * Customer Store Provider Props
 */
interface CustomerStoreProviderProps {
  store: CustomerStore
  children: ReactNode
}

/**
 * Appointment Store Provider Props
 */
interface AppointmentStoreProviderProps {
  store: AppointmentStore
  children: ReactNode
}

/**
 * Customer Store Provider 컴포넌트
 * Zustand 스토어 인스턴스를 React Context를 통해 하위 컴포넌트에 제공
 *
 * @param store - createCustomerStore()로 생성된 스토어 인스턴스
 * @param children - 자식 컴포넌트
 *
 * @example
 * const customerStore = createCustomerStore(repository)
 *
 * <CustomerStoreProvider store={customerStore}>
 *   <App />
 * </CustomerStoreProvider>
 */
export function CustomerStoreProvider({ store, children }: CustomerStoreProviderProps) {
  return (
    <CustomerStoreContext.Provider value={store}>
      {children}
    </CustomerStoreContext.Provider>
  )
}

/**
 * Appointment Store Provider 컴포넌트
 * Zustand 스토어 인스턴스를 React Context를 통해 하위 컴포넌트에 제공
 *
 * @param store - createAppointmentStore()로 생성된 스토어 인스턴스
 * @param children - 자식 컴포넌트
 *
 * @example
 * const appointmentStore = createAppointmentStore(repository)
 *
 * <AppointmentStoreProvider store={appointmentStore}>
 *   <App />
 * </AppointmentStoreProvider>
 */
export function AppointmentStoreProvider({
  store,
  children
}: AppointmentStoreProviderProps) {
  return (
    <AppointmentStoreContext.Provider value={store}>
      {children}
    </AppointmentStoreContext.Provider>
  )
}

/**
 * Customer Store Context Hook
 * Context에서 스토어 인스턴스를 가져옴
 *
 * @throws Provider 외부에서 사용 시 에러 발생
 * @returns CustomerStore 인스턴스
 *
 * @internal
 * 이 함수는 직접 사용하지 말고, src/store/hooks.ts의 useCustomerStore를 사용할 것
 */
export function useCustomerStoreContext(): CustomerStore {
  const context = useContext(CustomerStoreContext)

  if (!context) {
    throw new Error(
      'useCustomerStoreContext는 CustomerStoreProvider 내부에서만 사용할 수 있습니다.'
    )
  }

  return context
}

/**
 * Appointment Store Context Hook
 * Context에서 스토어 인스턴스를 가져옴
 *
 * @throws Provider 외부에서 사용 시 에러 발생
 * @returns AppointmentStore 인스턴스
 *
 * @internal
 * 이 함수는 직접 사용하지 말고, src/store/hooks.ts의 useAppointmentStore를 사용할 것
 */
export function useAppointmentStoreContext(): AppointmentStore {
  const context = useContext(AppointmentStoreContext)

  if (!context) {
    throw new Error(
      'useAppointmentStoreContext는 AppointmentStoreProvider 내부에서만 사용할 수 있습니다.'
    )
  }

  return context
}
