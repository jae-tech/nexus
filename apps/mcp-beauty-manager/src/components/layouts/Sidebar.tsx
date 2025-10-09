import type { LucideIcon } from 'lucide-react';
import { Calendar, ChevronLeft, ChevronRight, Home, Menu, Scissors, Settings, User, Users } from 'lucide-react';
import { useNavigate, useLocation } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: '홈', icon: Home, path: '/' },
  {
    id: 'customers',
    label: '고객관리',
    icon: User,
    path: '/customers',
  },
  {
    id: 'reservations',
    label: '예약관리',
    icon: Calendar,
    path: '/reservations',
  },
  { id: 'staff', label: '직원관리', icon: Users, path: '/staff' },
  {
    id: 'services',
    label: '서비스관리',
    icon: Scissors,
    path: '/services',
  },
  {
    id: 'settings',
    label: '설정',
    icon: Settings,
    path: '/settings',
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function Sidebar({ isCollapsed = false, onToggleCollapse }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleMenuClick = (path: string) => {
    navigate({ to: path });
  };

  const SidebarContent = () => (
    <>
      {/* Header */}
      <div className="flex h-20 items-center border-b border-border p-4">
        <div className="flex w-full items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Scissors size={18} className="text-white" />
              </div>
              <span className="hidden font-bold text-foreground sm:block" style={{ fontFamily: '"Pacifico", serif' }}>
                Beauty Manager
              </span>
            </div>
          )}
          {onToggleCollapse && (
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggleCollapse}
              className="hidden lg:flex"
            >
              {isCollapsed ? <ChevronRight size={18} className="text-gray-600" /> : <ChevronLeft size={18} className="text-gray-600" />}
            </Button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="mt-4 p-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Button
              key={item.id}
              variant={location.pathname === item.path ? 'default' : 'ghost'}
              className={cn(
                'mb-1 w-full justify-start gap-3',
                isCollapsed && 'justify-center'
              )}
              onClick={() => handleMenuClick(item.path)}
            >
              <Icon className="h-5 w-5" />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Button>
          );
        })}
      </nav>

      {/* User Profile Section */}
      {!isCollapsed && (
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-3 rounded-lg bg-muted p-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
              <span className="text-sm font-bold text-primary-foreground">관</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">관리자</p>
              <p className="truncate text-xs text-muted-foreground">admin@salon.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      {/* 데스크톱 사이드바 */}
      <div
        className={cn(
          'hidden lg:fixed lg:left-0 lg:top-0 lg:z-30 lg:flex lg:h-full lg:flex-col lg:border-r lg:border-border lg:bg-card lg:transition-all lg:duration-300',
          isCollapsed ? 'lg:w-16' : 'lg:w-60'
        )}
      >
        <SidebarContent />
      </div>

      {/* 모바일 Sheet */}
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="fixed left-4 top-4 z-50"
            >
              <Menu size={18} className="text-gray-600" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-60 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
