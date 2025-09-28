"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = HomePage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("../../components/feature/Sidebar");
var PageHeader_1 = require("../../components/feature/PageHeader");
var Card_1 = require("../../components/base/Card");
var Button_1 = require("../../components/base/Button");
var customers_1 = require("../../mocks/customers");
var reservations_1 = require("../../mocks/reservations");
var staff_1 = require("../../mocks/staff");
var services_1 = require("../../mocks/services");
function HomePage() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, react_1.useState)(new Date()), currentTime = _a[0], setCurrentTime = _a[1];
    // 시간 업데이트 - 자동 새로고침 효과
    (0, react_1.useEffect)(function () {
        var timer = setInterval(function () {
            setCurrentTime(new Date());
        }, 60000); // 1분마다 업데이트
        return function () { return clearInterval(timer); };
    }, []);
    // 통계 데이터 계산
    var totalCustomers = customers_1.mockCustomers.length;
    var todayReservations = reservations_1.mockReservations.filter(function (r) {
        var today = new Date().toISOString().split('T')[0];
        return r.date === today;
    }).length;
    var activeStaff = staff_1.mockStaff.filter(function (s) { return s.status === 'active'; }).length;
    var activeServices = services_1.mockServices.filter(function (s) { return s.isActive; }).length;
    // 오늘의 예약 목록 (시간순 정렬)
    var todayReservationList = reservations_1.mockReservations
        .filter(function (r) {
        var today = new Date().toISOString().split('T')[0];
        return r.date === today;
    })
        .sort(function (a, b) { return a.startTime.localeCompare(b.startTime); })
        .slice(0, 8);
    // 최근 등록 고객 (등록일 기준 최신 5명)
    var recentCustomers = customers_1.mockCustomers
        .sort(function (a, b) { return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime(); })
        .slice(0, 5);
    // 이번 주 인기 서비스 TOP 5 (모의 데이터)
    var popularServices = services_1.mockServices
        .map(function (service) { return (__assign(__assign({}, service), { weeklyUsage: Math.floor(Math.random() * 50) + 10 })); })
        .sort(function (a, b) { return b.weeklyUsage - a.weeklyUsage; })
        .slice(0, 5);
    // 장기 미방문 고객 (30일 이상)
    var longAbsentCustomers = customers_1.mockCustomers.filter(function (customer) {
        if (!customer.lastVisit)
            return true;
        var lastVisitDate = new Date(customer.lastVisit);
        var today = new Date();
        var daysDiff = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff >= 30;
    }).slice(0, 5);
    // 생일 고객 체크 (오늘 생일인 고객)
    var birthdayCustomers = customers_1.mockCustomers.filter(function (customer) {
        if (!customer.birthday)
            return false;
        var today = new Date();
        var birthday = new Date(customer.birthday);
        return today.getMonth() === birthday.getMonth() && today.getDate() === birthday.getDate();
    });
    // 예약 상태별 통계
    var reservationStats = {
        scheduled: todayReservationList.filter(function (r) { return r.status === 'scheduled'; }).length,
        completed: todayReservationList.filter(function (r) { return r.status === 'completed'; }).length,
        cancelled: todayReservationList.filter(function (r) { return r.status === 'cancelled'; }).length
    };
    var quickActions = [
        {
            title: '새 예약 추가',
            description: '고객 예약을 빠르게 등록',
            icon: 'ri-calendar-event-line',
            color: 'bg-gradient-to-r from-blue-500 to-blue-600',
            hoverColor: 'hover:from-blue-600 hover:to-blue-700',
            action: function () { return navigate('/reservations'); }
        },
        {
            title: '신규 고객 등록',
            description: '새로운 고객 정보 등록',
            icon: 'ri-user-add-line',
            color: 'bg-gradient-to-r from-green-500 to-green-600',
            hoverColor: 'hover:from-green-600 hover:to-green-700',
            action: function () { return navigate('/customers'); }
        },
        {
            title: '직원 스케줄 확인',
            description: '직원 근무 일정 관리',
            icon: 'ri-calendar-schedule-line',
            color: 'bg-gradient-to-r from-purple-500 to-purple-600',
            hoverColor: 'hover:from-purple-600 hover:to-purple-700',
            action: function () { return navigate('/staff'); }
        },
        {
            title: '서비스 관리',
            description: '서비스 메뉴 관리',
            icon: 'ri-scissors-line',
            color: 'bg-gradient-to-r from-orange-500 to-orange-600',
            hoverColor: 'hover:from-orange-600 hover:to-orange-700',
            action: function () { return navigate('/services'); }
        }
    ];
    var getStatusBadge = function (status) {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };
    var getStatusText = function (status) {
        switch (status) {
            case 'scheduled':
                return '예약됨';
            case 'completed':
                return '완료';
            case 'cancelled':
                return '취소';
            default:
                return status;
        }
    };
    var handleReservationClick = function (reservationId) {
        navigate("/reservations?highlight=".concat(reservationId));
    };
    var handleCustomerClick = function (customerId) {
        navigate("/customers/".concat(customerId));
    };
    return (<div className="min-h-screen bg-gray-50">
      <Sidebar_1.default />
      
      <div className="lg:ml-60 md:ml-48 transition-all duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          <PageHeader_1.default title="대시보드" actions={<div className="flex items-center gap-2 md:gap-4">
                <Button_1.default className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4" onClick={function () { return navigate('/reservations'); }}>
                  <i className="ri-add-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">새 예약</span>
                  <span className="sm:hidden">예약</span>
                </Button_1.default>
              </div>}/>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {/* 생일 고객 알림 배너 */}
          {birthdayCustomers.length > 0 && (<div className="mb-6 bg-gradient-to-r from-yellow-50 to-yellow-100 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="ri-cake-2-line text-yellow-600 text-xl mr-3"></i>
                <div>
                  <h3 className="font-medium text-yellow-800">오늘이 생일인 고객이 있어요! 🎉</h3>
                  <p className="text-sm text-yellow-700 mt-1">
                    {birthdayCustomers.map(function (c) { return c.name; }).join(', ')}님의 생일입니다.
                  </p>
                </div>
              </div>
            </div>)}

          {/* 상단 요약 카드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
            <Card_1.default hover className="cursor-pointer" onClick={function () { return navigate('/customers'); }}>
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <i className="ri-user-line text-2xl text-blue-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">총 고객</p>
                  <p className="text-2xl font-bold text-gray-900">{totalCustomers}명</p>
                  <p className="text-xs text-gray-500 mt-1">클릭하여 관리</p>
                </div>
              </div>
            </Card_1.default>
            
            <Card_1.default hover className="cursor-pointer" onClick={function () { return navigate('/reservations'); }}>
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <i className="ri-calendar-event-line text-2xl text-green-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">오늘 예약</p>
                  <p className="text-2xl font-bold text-gray-900">{todayReservations}건</p>
                  <div className="flex gap-2 text-xs mt-1">
                    <span className="text-blue-600">예약 {reservationStats.scheduled}</span>
                    <span className="text-green-600">완료 {reservationStats.completed}</span>
                    <span className="text-red-600">취소 {reservationStats.cancelled}</span>
                  </div>
                </div>
              </div>
            </Card_1.default>
            
            <Card_1.default hover className="cursor-pointer" onClick={function () { return navigate('/staff'); }}>
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <i className="ri-team-line text-2xl text-purple-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">활성 직원</p>
                  <p className="text-2xl font-bold text-gray-900">{activeStaff}명</p>
                  <p className="text-xs text-gray-500 mt-1">재직 중인 직원</p>
                </div>
              </div>
            </Card_1.default>
            
            <Card_1.default hover className="cursor-pointer" onClick={function () { return navigate('/services'); }}>
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <i className="ri-scissors-line text-2xl text-orange-600"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">활성 서비스</p>
                  <p className="text-2xl font-bold text-gray-900">{activeServices}개</p>
                  <p className="text-xs text-gray-500 mt-1">운영 중인 서비스</p>
                </div>
              </div>
            </Card_1.default>
          </div>

          {/* 메인 컨텐츠 영역 */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 mb-8">
            {/* 좌측 영역 - 오늘의 예약 (60% 폭) */}
            <div className="lg:col-span-3">
              <Card_1.default>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">오늘의 예약</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        {currentTime.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            weekday: 'long'
        })}
                      </p>
                    </div>
                    <Button_1.default variant="outline" size="sm" onClick={function () { return navigate('/reservations'); }}>
                      전체 보기
                    </Button_1.default>
                  </div>
                  
                  {todayReservationList.length > 0 ? (<div className="space-y-3 max-h-96 overflow-y-auto">
                      {todayReservationList.map(function (reservation) { return (<div key={reservation.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={function () { return handleReservationClick(reservation.id); }}>
                          <div className="flex items-center flex-1">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                              <i className="ri-user-line text-blue-600"></i>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium text-gray-900 truncate">{reservation.customerName}</p>
                                <span className="text-sm font-medium text-blue-600">
                                  {reservation.startTime}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 text-sm text-gray-600">
                                <span>{reservation.employeeName}</span>
                                <span>•</span>
                                <span className="truncate">헤어컷</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusBadge(reservation.status))}>
                              {getStatusText(reservation.status)}
                            </span>
                            <i className="ri-arrow-right-s-line text-gray-400"></i>
                          </div>
                        </div>); })}
                    </div>) : (<div className="text-center py-12">
                      <i className="ri-calendar-line text-4xl text-gray-300 mb-3"></i>
                      <p className="text-gray-500 text-lg mb-2">오늘 예약이 없습니다</p>
                      <p className="text-gray-400 text-sm">새로운 예약을 추가해보세요</p>
                      <Button_1.default className="mt-4 bg-blue-600 hover:bg-blue-700 text-white" onClick={function () { return navigate('/reservations'); }}>
                        <i className="ri-add-line mr-2"></i>
                        새 예약 추가
                      </Button_1.default>
                    </div>)}
                </div>
              </Card_1.default>
            </div>

            {/* 우측 영역 - 빠른 작업 (40% 폭) */}
            <div className="lg:col-span-2">
              <Card_1.default>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h3>
                  <div className="space-y-3">
                    {quickActions.map(function (action, index) { return (<button key={index} onClick={action.action} className={"w-full flex items-center p-4 rounded-xl ".concat(action.color, " ").concat(action.hoverColor, " text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl")}>
                        <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
                          <i className={"".concat(action.icon, " text-xl")}></i>
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-white">{action.title}</p>
                          <p className="text-sm text-white text-opacity-90">{action.description}</p>
                        </div>
                        <i className="ri-arrow-right-s-line ml-auto text-white text-opacity-70"></i>
                      </button>); })}
                  </div>
                </div>
              </Card_1.default>
            </div>
          </div>

          {/* 하단 영역 - 최근 활동 */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* 최근 등록 고객 */}
            <Card_1.default>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">최근 등록 고객</h3>
                  <Button_1.default variant="outline" size="sm" onClick={function () { return navigate('/customers'); }}>
                    전체 보기
                  </Button_1.default>
                </div>
                
                <div className="space-y-3">
                  {recentCustomers.map(function (customer) { return (<div key={customer.id} className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer" onClick={function () { return handleCustomerClick(customer.id); }}>
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                        <i className="ri-user-line text-blue-600"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{customer.name}</p>
                        <p className="text-sm text-gray-600 truncate">{customer.phone}</p>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Math.floor((new Date().getTime() - new Date(customer.registeredDate).getTime()) / (1000 * 60 * 60 * 24))}일 전
                      </span>
                    </div>); })}
                </div>
              </div>
            </Card_1.default>

            {/* 이번 주 인기 서비스 */}
            <Card_1.default>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">인기 서비스 TOP 5</h3>
                  <span className="text-sm text-gray-500">이번 주</span>
                </div>
                
                <div className="space-y-3">
                  {popularServices.map(function (service, index) { return (<div key={service.id} className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mr-3 ".concat(index === 0 ? 'bg-yellow-100 text-yellow-800' :
                index === 1 ? 'bg-gray-100 text-gray-800' :
                    index === 2 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800')}>
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{service.name}</p>
                          <p className="text-sm text-gray-600">{service.basePrice.toLocaleString()}원</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-blue-600">{service.weeklyUsage}회</span>
                    </div>); })}
                </div>
              </div>
            </Card_1.default>

            {/* 장기 미방문 고객 알림 */}
            <Card_1.default>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">미방문 고객 알림</h3>
                  <span className="text-sm text-red-500">30일 이상</span>
                </div>
                
                {longAbsentCustomers.length > 0 ? (<div className="space-y-3">
                    {longAbsentCustomers.map(function (customer) {
                var daysSinceVisit = customer.lastVisit ?
                    Math.floor((new Date().getTime() - new Date(customer.lastVisit).getTime()) / (1000 * 60 * 60 * 24)) :
                    '미방문';
                return (<div key={customer.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg hover:bg-red-100 transition-colors cursor-pointer" onClick={function () { return handleCustomerClick(customer.id); }}>
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
                              <i className="ri-user-line text-red-600"></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{customer.name}</p>
                              <p className="text-sm text-gray-600">{customer.phone}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-red-600">
                              {typeof daysSinceVisit === 'number' ? "".concat(daysSinceVisit, "\uC77C") : daysSinceVisit}
                            </span>
                            <br />
                            <button className="text-xs text-blue-600 hover:text-blue-800" onClick={function (e) {
                        e.stopPropagation();
                        window.location.href = "tel:".concat(customer.phone);
                    }}>
                              연락하기
                            </button>
                          </div>
                        </div>);
            })}
                  </div>) : (<div className="text-center py-8">
                    <i className="ri-user-heart-line text-3xl text-green-400 mb-2"></i>
                    <p className="text-green-600 font-medium">모든 고객이 활발해요!</p>
                    <p className="text-sm text-gray-500 mt-1">장기 미방문 고객이 없습니다</p>
                  </div>)}
              </div>
            </Card_1.default>
          </div>
        </div>
      </div>
    </div>);
}
