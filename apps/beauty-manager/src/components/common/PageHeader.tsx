import { ReactNode } from 'react';
import { useUIStore } from '@/stores/ui-store';

interface PageHeaderProps {
  title: string;
  searchBar?: ReactNode;
  actions?: ReactNode;
  className?: string;
}

export default function PageHeader({ title, searchBar, actions, className = '' }: PageHeaderProps) {
  const { isSidebarOpen } = useUIStore();

  return (
    <div className={`
      fixed top-0 right-0 z-40 bg-white border-b border-gray-200 px-8 py-6 h-20 flex items-center transition-all duration-300
      ${isSidebarOpen
        ? 'lg:left-60 md:left-48 left-0' // 사이드바 열림: 큰 화면에서 left-60, 중간 화면에서 left-48
        : 'lg:left-16 md:left-16 left-0'  // 사이드바 닫힘: 축소된 사이드바 너비만큼
      }
      ${className}
    `}>
      <div className="flex items-center justify-between w-full">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <div className="flex items-center gap-4">
          {searchBar}
          {actions}
        </div>
      </div>
    </div>
  );
}