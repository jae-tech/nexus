import { ReactNode } from 'react';
import { useUIStore } from '@/stores/ui-store';
import { Sidebar } from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      {/* 메인 컨텐츠 영역 */}
      <div className={`
        transition-all duration-300 pt-20
        ${isSidebarOpen
          ? 'lg:ml-60 md:ml-48 ml-0' // 사이드바 열림: 큰 화면에서 ml-60, 중간 화면에서 ml-48
          : 'lg:ml-16 md:ml-16 ml-0'  // 사이드바 닫힘: 축소된 사이드바 너비만큼
        }
      `}>
        {children}
      </div>
    </div>
  );
}