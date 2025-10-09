import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';

// 글로벌 CSS
import '@/styles/index.css';

// i18n 설정
import '@/shared/i18n';

// TanStack Router가 자동 생성한 routeTree
import { routeTree } from './routeTree.gen';

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

// 앱 렌더링
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
