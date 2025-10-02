import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from '@tanstack/react-router';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  path: string;
}

const menuItems: MenuItem[] = [
  { id: 'home', label: '홈', icon: 'ri-home-line', path: '/' },
  {
    id: 'customers',
    label: '고객관리',
    icon: 'ri-user-line',
    path: '/customers',
  },
  {
    id: 'reservations',
    label: '예약관리',
    icon: 'ri-calendar-line',
    path: '/reservations',
  },
  { id: 'staff', label: '직원관리', icon: 'ri-team-line', path: '/staff' },
  {
    id: 'services',
    label: '서비스관리',
    icon: 'ri-scissors-line',
    path: '/services',
  },
  {
    id: 'settings',
    label: '설정',
    icon: 'ri-settings-line',
    path: '/settings',
  },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // 화면 크기에 따른 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      } else if (window.innerWidth < 1200) {
        setIsCollapsed(false);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 모바일에서 메뉴 클릭 시 사이드바 닫기
  const handleMenuClick = (path: string) => {
    navigate(path);
    if (window.innerWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="fixed left-4 top-4 z-50 rounded-lg border border-gray-200 bg-white p-2 shadow-md lg:hidden"
      >
        <i
          className={`ri-menu-${isMobileOpen ? 'fold' : 'unfold'}-line text-lg text-gray-600`}
        />
      </button>

      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`fixed left-0 top-0 z-30 h-full border-r border-gray-200 bg-white transition-all duration-300 ${
          window.innerWidth < 768
            ? `${isMobileOpen ? 'translate-x-0' : '-translate-x-full'} w-60`
            : window.innerWidth < 1200
              ? isCollapsed
                ? 'w-16'
                : 'w-48'
              : isCollapsed
                ? 'w-16'
                : 'w-60'
        } `}
      >
        {/* Header - 80px 높이로 통일 */}
        <div className="flex h-20 items-center border-b border-gray-200 p-4">
          <div className="flex w-full items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500">
                  <i className="ri-scissors-line text-lg text-white" />
                </div>
                <span
                  className="hidden font-bold text-gray-800 sm:block"
                  style={{ fontFamily: '"Pacifico", serif' }}
                >
                  Beauty Manager
                </span>
              </div>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="hidden rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 lg:block"
            >
              <i
                className={`ri-menu-${isCollapsed ? 'unfold' : 'fold'}-line text-lg`}
              />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-4 p-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleMenuClick(item.path)}
              className={`mb-1 flex w-full items-center gap-3 rounded-lg px-3 py-3 text-left transition-all duration-200 ${
                location.pathname === item.path
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <div className="flex h-5 w-5 items-center justify-center">
                <i className={`${item.icon} text-lg`} />
              </div>
              {!isCollapsed && (
                <span className="text-sm font-medium">{item.label}</span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 rounded-lg bg-gray-50 p-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                <span className="text-sm font-bold text-white">관</span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-gray-900">
                  관리자
                </p>
                <p className="truncate text-xs text-gray-500">
                  admin@salon.com
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
