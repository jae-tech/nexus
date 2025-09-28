"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Sidebar;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var menuItems = [
    { id: 'home', label: '홈', icon: 'ri-home-line', path: '/' },
    { id: 'customers', label: '고객관리', icon: 'ri-user-line', path: '/customers' },
    { id: 'reservations', label: '예약관리', icon: 'ri-calendar-line', path: '/reservations' },
    { id: 'staff', label: '직원관리', icon: 'ri-team-line', path: '/staff' },
    { id: 'services', label: '서비스관리', icon: 'ri-scissors-line', path: '/services' },
    { id: 'settings', label: '설정', icon: 'ri-settings-line', path: '/settings' }
];
function Sidebar() {
    var _a = (0, react_1.useState)(false), isCollapsed = _a[0], setIsCollapsed = _a[1];
    var _b = (0, react_1.useState)(false), isMobileOpen = _b[0], setIsMobileOpen = _b[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var location = (0, react_router_dom_1.useLocation)();
    // 화면 크기에 따른 반응형 처리
    (0, react_1.useEffect)(function () {
        var handleResize = function () {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
            else if (window.innerWidth < 1200) {
                setIsCollapsed(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return function () { return window.removeEventListener('resize', handleResize); };
    }, []);
    // 모바일에서 메뉴 클릭 시 사이드바 닫기
    var handleMenuClick = function (path) {
        navigate(path);
        if (window.innerWidth < 768) {
            setIsMobileOpen(false);
        }
    };
    return (<>
      {/* 모바일 햄버거 메뉴 버튼 */}
      <button onClick={function () { return setIsMobileOpen(!isMobileOpen); }} className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-md border border-gray-200">
        <i className={"ri-menu-".concat(isMobileOpen ? 'fold' : 'unfold', "-line text-lg text-gray-600")}></i>
      </button>

      {/* 모바일 오버레이 */}
      {isMobileOpen && (<div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40" onClick={function () { return setIsMobileOpen(false); }}/>)}

      {/* 사이드바 */}
      <div className={"\n        bg-white border-r border-gray-200 transition-all duration-300 fixed left-0 top-0 h-full z-30\n        ".concat(window.innerWidth < 768
            ? "".concat(isMobileOpen ? 'translate-x-0' : '-translate-x-full', " w-60")
            : window.innerWidth < 1200
                ? (isCollapsed ? 'w-16' : 'w-48')
                : (isCollapsed ? 'w-16' : 'w-60'), "\n      ")}>
        {/* Header - 80px 높이로 통일 */}
        <div className="p-4 border-b border-gray-200 h-20 flex items-center">
          <div className="flex items-center justify-between w-full">
            {!isCollapsed && (<div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <i className="ri-scissors-line text-white text-lg"></i>
                </div>
                <span className="font-bold text-gray-800 hidden sm:block" style={{ fontFamily: '"Pacifico", serif' }}>
                  Beauty Manager
                </span>
              </div>)}
            <button onClick={function () { return setIsCollapsed(!isCollapsed); }} className="hidden lg:block p-1.5 rounded-lg hover:bg-gray-100 text-gray-600 transition-colors">
              <i className={"ri-menu-".concat(isCollapsed ? 'unfold' : 'fold', "-line text-lg")}></i>
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-2 mt-4">
          {menuItems.map(function (item) { return (<button key={item.id} onClick={function () { return handleMenuClick(item.path); }} className={"w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 mb-1 ".concat(location.pathname === item.path
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900')}>
              <div className="w-5 h-5 flex items-center justify-center">
                <i className={"".concat(item.icon, " text-lg")}></i>
              </div>
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </button>); })}
        </nav>

        {/* User Profile Section */}
        {!isCollapsed && (<div className="absolute bottom-4 left-4 right-4">
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">관</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">관리자</p>
                <p className="text-xs text-gray-500 truncate">admin@salon.com</p>
              </div>
            </div>
          </div>)}
      </div>
    </>);
}
