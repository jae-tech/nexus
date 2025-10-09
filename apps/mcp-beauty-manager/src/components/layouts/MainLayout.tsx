import { type ReactNode, useState } from 'react';
import { Sidebar } from './Sidebar';
import { cn } from '@/lib/utils';

interface MainLayoutProps {
  children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <Sidebar isCollapsed={isCollapsed} onToggleCollapse={() => setIsCollapsed(!isCollapsed)} />

      {/* Main Content */}
      <div
        className={cn(
          'transition-all duration-300',
          'lg:ml-60',
          isCollapsed && 'lg:ml-16'
        )}
      >
        {children}
      </div>
    </div>
  );
}
