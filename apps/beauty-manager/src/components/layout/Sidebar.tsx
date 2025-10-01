import { useState, useEffect } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { useUIStore } from "@/stores/ui-store";
import {
  Home,
  User,
  Calendar,
  Users,
  Scissors,
  Settings,
  Menu,
} from "lucide-react";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  path: string;
}

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "대시보드",
    icon: Home,
    path: "/dashboard",
  },
  {
    id: "customers",
    label: "고객관리",
    icon: User,
    path: "/customers",
  },
  {
    id: "reservations",
    label: "예약관리",
    icon: Calendar,
    path: "/reservations",
  },
  { id: "staff", label: "직원관리", icon: Users, path: "/staff" },
  {
    id: "services",
    label: "서비스관리",
    icon: Scissors,
    path: "/services",
  },
  {
    id: "settings",
    label: "설정",
    icon: Settings,
    path: "/settings",
  },
];

export function Sidebar() {
  const { isSidebarOpen, toggleSidebar } = useUIStore();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );
  const location = useLocation();
  const currentPath = location.pathname;

  // 데스크톱에서는 Zustand 상태를 사용, 모바일에서는 로컬 상태 사용
  const isCollapsed = !isSidebarOpen;

  // 화면 크기에 따른 반응형 처리
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 모바일에서 메뉴 클릭 시 사이드바 닫기
  const handleMenuClick = () => {
    if (windowWidth < 768) {
      setIsMobileOpen(false);
    }
  };

  return (
    <>
      {/* 모바일 햄버거 메뉴 버튼 */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200"
      >
        {isMobileOpen ? (
          <Menu size={18} className="text-gray-600" />
        ) : (
          <Menu size={18} className="text-gray-600" />
        )}
      </button>

      {/* 모바일 오버레이 */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <div
        className={`
        bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 h-full z-30
        ${
          windowWidth < 768
            ? `${isMobileOpen ? "translate-x-0" : "-translate-x-full"} w-60`
            : windowWidth < 1200
              ? isCollapsed
                ? "w-16"
                : "w-48"
              : isCollapsed
                ? "w-16"
                : "w-60"
        }
      `}
      >
        {/* Header - 80px 높이로 통일 */}
        <div className="p-4 border-b border-gray-200 h-20 flex items-center">
          <div className="flex items-center justify-between w-full">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Scissors size={18} className="text-white" />
              </div>
              {!isCollapsed && (
                <span
                  className="font-bold text-gray-800 hidden sm:block"
                  style={{ fontFamily: '"Pacifico", serif' }}
                >
                  Beauty Manager
                </span>
              )}
            </Link>
            <button
              onClick={toggleSidebar}
              className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors"
            >
              {isCollapsed ? <Menu size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 mt-4">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.id}
                to={item.path}
                onClick={handleMenuClick}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-1 ${
                  currentPath === item.path
                    ? "bg-blue-600 text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <div className="w-5 h-5 flex items-center justify-center">
                  <IconComponent size={18} />
                </div>
                {!isCollapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">관</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  관리자
                </p>
                <p className="text-xs text-gray-500 truncate">
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
