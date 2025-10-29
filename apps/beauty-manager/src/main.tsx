import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// 글로벌 CSS
import '@/styles/index.css';

// TanStack Router가 자동 생성한 routeTree
import { routeTree } from './routeTree.gen';

// Repository Pattern 의존성 주입
import {
  createCustomerRepository,
  createAppointmentRepository,
} from '@/providers/EnvironmentService';
import { createCustomerStore } from '@/store/CustomerStore';
import { createAppointmentStore } from '@/store/AppointmentStore';
import {
  CustomerStoreProvider,
  AppointmentStoreProvider,
} from '@/providers/RepositoryProvider';

// Router 인스턴스 생성
const router = createRouter({
  routeTree,
  defaultPreload: 'intent',
});

// TypeScript 타입 등록
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

/**
 * 애플리케이션 초기화 및 의존성 주입
 */
function initializeApp() {
  // 1. 환경에 맞는 Repository 인스턴스 생성
  const customerRepository = createCustomerRepository();
  const appointmentRepository = createAppointmentRepository();

  // 2. Repository를 주입하여 Zustand Store 생성
  const customerStore = createCustomerStore(customerRepository);
  const appointmentStore = createAppointmentStore(appointmentRepository);

  return {
    customerStore,
    appointmentStore,
  };
}

// 앱 초기화
const { customerStore, appointmentStore } = initializeApp();

/**
 * 초기 데이터 로딩 컴포넌트
 * 앱 시작 시 모든 필요한 데이터를 미리 로드
 */
function AppInitializer({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 고객 데이터 초기 로드
    customerStore.getState().fetchCustomers();
  }, []);

  return <>{children}</>;
}

// 앱 렌더링 (Provider 중첩)
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <CustomerStoreProvider store={customerStore}>
      <AppointmentStoreProvider store={appointmentStore}>
        <AppInitializer>
          <RouterProvider router={router} />
        </AppInitializer>
      </AppointmentStoreProvider>
    </CustomerStoreProvider>
  </StrictMode>
);
