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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ReservationsPage;
var react_1 = require("react");
var Sidebar_1 = require("../../components/feature/Sidebar");
var PageHeader_1 = require("../../components/feature/PageHeader");
var FilterBar_1 = require("../../components/feature/FilterBar");
var SearchBar_1 = require("../../components/base/SearchBar");
var Button_1 = require("../../components/base/Button");
var CalendarView_1 = require("./components/CalendarView");
var ListView_1 = require("./components/ListView");
var AddReservationModal_1 = require("./components/AddReservationModal");
var EditReservationModal_1 = require("./components/EditReservationModal");
var reservations_1 = require("../../mocks/reservations");
var staff_1 = require("../../mocks/staff");
var services_1 = require("../../mocks/services");
var customers_1 = require("../../mocks/customers");
var date_fns_1 = require("date-fns");
function ReservationsPage() {
    var _a;
    var _b = (0, react_1.useState)('calendar'), viewMode = _b[0], setViewMode = _b[1];
    var _c = (0, react_1.useState)('week'), calendarViewType = _c[0], setCalendarViewType = _c[1];
    var _d = (0, react_1.useState)(new Date()), selectedDate = _d[0], setSelectedDate = _d[1];
    // 필터 상태
    var _e = (0, react_1.useState)('week'), dateRangeType = _e[0], setDateRangeType = _e[1];
    var _f = (0, react_1.useState)({
        start: (0, date_fns_1.format)((0, date_fns_1.startOfWeek)(new Date()), 'yyyy-MM-dd'),
        end: (0, date_fns_1.format)((0, date_fns_1.endOfWeek)(new Date()), 'yyyy-MM-dd')
    }), customDateRange = _f[0], setCustomDateRange = _f[1];
    var _g = (0, react_1.useState)(false), showDatePicker = _g[0], setShowDatePicker = _g[1];
    var _h = (0, react_1.useState)(false), customDateMode = _h[0], setCustomDateMode = _h[1];
    var _j = (0, react_1.useState)((0, date_fns_1.format)((0, date_fns_1.startOfWeek)(new Date()), 'yyyy-MM-dd')), customStartDate = _j[0], setCustomStartDate = _j[1];
    var _k = (0, react_1.useState)((0, date_fns_1.format)((0, date_fns_1.endOfWeek)(new Date()), 'yyyy-MM-dd')), customEndDate = _k[0], setCustomEndDate = _k[1];
    var _l = (0, react_1.useState)('all'), selectedEmployee = _l[0], setSelectedEmployee = _l[1];
    var _m = (0, react_1.useState)('all'), serviceTypeFilter = _m[0], setServiceTypeFilter = _m[1];
    var _o = (0, react_1.useState)('all'), statusFilter = _o[0], setStatusFilter = _o[1];
    var _p = (0, react_1.useState)(''), searchQuery = _p[0], setSearchQuery = _p[1];
    // 모달 상태
    var _q = (0, react_1.useState)(false), showAddModal = _q[0], setShowAddModal = _q[1];
    var _r = (0, react_1.useState)(false), showEditModal = _r[0], setShowEditModal = _r[1];
    var _s = (0, react_1.useState)(null), selectedReservation = _s[0], setSelectedReservation = _s[1];
    var _t = (0, react_1.useState)(false), showDetailModal = _t[0], setShowDetailModal = _t[1];
    // 예약 데이터
    var _u = (0, react_1.useState)(reservations_1.mockReservations.map(function (reservation) { return (__assign(__assign({}, reservation), { services: [
            {
                id: '1',
                name: '헤어컷',
                duration: 60,
                price: 25000
            }
        ], amount: 25000, createdAt: new Date().toISOString() })); })), reservationList = _u[0], setReservationList = _u[1];
    // 날짜 범위 계산
    var getDateRange = function () {
        var today = new Date();
        switch (dateRangeType) {
            case 'today':
                return {
                    start: (0, date_fns_1.startOfDay)(today),
                    end: (0, date_fns_1.endOfDay)(today)
                };
            case 'week':
                return {
                    start: (0, date_fns_1.startOfWeek)(today),
                    end: (0, date_fns_1.endOfWeek)(today)
                };
            case 'month':
                return {
                    start: (0, date_fns_1.startOfMonth)(today),
                    end: (0, date_fns_1.endOfMonth)(today)
                };
            case 'lastWeek':
                var lastWeek = (0, date_fns_1.subWeeks)(today, 1);
                return {
                    start: (0, date_fns_1.startOfWeek)(lastWeek),
                    end: (0, date_fns_1.endOfWeek)(lastWeek)
                };
            case 'lastMonth':
                var lastMonth = (0, date_fns_1.subMonths)(today, 1);
                return {
                    start: (0, date_fns_1.startOfMonth)(lastMonth),
                    end: (0, date_fns_1.endOfMonth)(lastMonth)
                };
            case 'custom':
                return {
                    start: new Date(customDateRange.start),
                    end: new Date(customDateRange.end)
                };
            default:
                return {
                    start: (0, date_fns_1.startOfWeek)(today),
                    end: (0, date_fns_1.endOfWeek)(today)
                };
        }
    };
    // 필터링된 예약 목록
    var filteredReservations = (0, react_1.useMemo)(function () {
        var filtered = __spreadArray([], reservationList, true);
        // 날짜 범위 필터
        var dateRange = getDateRange();
        filtered = filtered.filter(function (reservation) {
            var reservationDate = new Date(reservation.date);
            return (0, date_fns_1.isWithinInterval)(reservationDate, { start: dateRange.start, end: dateRange.end });
        });
        // 직원 필터
        if (selectedEmployee !== 'all') {
            filtered = filtered.filter(function (reservation) { return reservation.employeeId === selectedEmployee; });
        }
        // 서비스 타입 필터
        if (serviceTypeFilter !== 'all') {
            filtered = filtered.filter(function (reservation) {
                return reservation.services.some(function (service) {
                    if (serviceTypeFilter === 'hair')
                        return service.name.includes('컷') || service.name.includes('염색') || service.name.includes('펌');
                    if (serviceTypeFilter === 'nail')
                        return service.name.includes('네일');
                    if (serviceTypeFilter === 'care')
                        return service.name.includes('케어') || service.name.includes('마사지');
                    return true;
                });
            });
        }
        // 상태 필터
        if (statusFilter !== 'all') {
            filtered = filtered.filter(function (reservation) { return reservation.status === statusFilter; });
        }
        // 검색 필터
        if (searchQuery.trim()) {
            var query_1 = searchQuery.toLowerCase();
            filtered = filtered.filter(function (reservation) {
                return reservation.customerName.toLowerCase().includes(query_1) ||
                    reservation.customerPhone.includes(query_1) ||
                    reservation.services.some(function (service) { return service.name.toLowerCase().includes(query_1); }) ||
                    reservation.employeeName.toLowerCase().includes(query_1);
            });
        }
        return filtered;
    }, [reservationList, dateRangeType, customDateRange, selectedEmployee, serviceTypeFilter, statusFilter, searchQuery]);
    var handleDateRangeSelect = function (type) {
        setDateRangeType(type);
        if (type !== 'custom') {
            setShowDatePicker(false);
            setCustomDateMode(false);
        }
    };
    var handleCustomDateApply = function () {
        setCustomDateRange({
            start: customStartDate,
            end: customEndDate
        });
        setDateRangeType('custom');
        setShowDatePicker(false);
        setCustomDateMode(false);
    };
    var handleAddReservation = function (selectedDateTime) {
        setShowAddModal(true);
    };
    var handleEditReservation = function (reservation) {
        setSelectedReservation(reservation);
        setShowEditModal(true);
    };
    var handleViewReservation = function (reservation) {
        setSelectedReservation(reservation);
        setShowDetailModal(true);
    };
    var handleDeleteReservation = function (reservationId, reason) {
        if (confirm('정말로 이 예약을 삭제하시겠습니까?')) {
            setReservationList(function (prev) { return prev.filter(function (r) { return r.id !== reservationId; }); });
        }
    };
    var handleStatusChange = function (reservationId, newStatus) {
        setReservationList(function (prev) { return prev.map(function (r) {
            return r.id === reservationId ? __assign(__assign({}, r), { status: newStatus }) : r;
        }); });
    };
    var handleBulkStatusChange = function (reservationIds, newStatus) {
        setReservationList(function (prev) { return prev.map(function (r) {
            return reservationIds.includes(r.id) ? __assign(__assign({}, r), { status: newStatus }) : r;
        }); });
    };
    var handleBulkDelete = function (reservationIds) {
        if (confirm("\uC120\uD0DD\uD55C ".concat(reservationIds.length, "\uAC1C\uC758 \uC608\uC57D\uC744 \uC0AD\uC81C\uD558\uC2DC\uACA0\uC2B5\uB2C8\uAE4C?"))) {
            setReservationList(function (prev) { return prev.filter(function (r) { return !reservationIds.includes(r.id); }); });
        }
    };
    var getDateRangeText = function () {
        var range = getDateRange();
        if (dateRangeType === 'today') {
            return (0, date_fns_1.format)(range.start, 'M월 d일');
        }
        else if (dateRangeType === 'custom') {
            return "".concat((0, date_fns_1.format)(range.start, 'M/d'), " - ").concat((0, date_fns_1.format)(range.end, 'M/d'));
        }
        else {
            return "".concat((0, date_fns_1.format)(range.start, 'M/d'), " - ").concat((0, date_fns_1.format)(range.end, 'M/d'));
        }
    };
    return (<div className="min-h-screen bg-gray-50">
      <Sidebar_1.default />
      
      <div className="lg:ml-60 md:ml-48 transition-all duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <PageHeader_1.default title="예약 관리" searchBar={<div className="w-full md:w-80">
                <SearchBar_1.default placeholder="고객명, 연락처, 서비스명 검색..." onSearch={setSearchQuery}/>
              </div>} actions={<div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={function () { return setViewMode('calendar'); }} className={"px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewMode === 'calendar'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900')}>
                    <i className="ri-calendar-line mr-1"></i>
                    <span className="hidden sm:inline">캘린더</span>
                  </button>
                  <button onClick={function () { return setViewMode('list'); }} className={"px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewMode === 'list'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900')}>
                    <i className="ri-list-check mr-1"></i>
                    <span className="hidden sm:inline">리스트</span>
                  </button>
                </div>
                <Button_1.default onClick={function () { return setShowAddModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4">
                  <i className="ri-add-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">새 예약 추가</span>
                  <span className="sm:hidden">추가</span>
                </Button_1.default>
              </div>}/>

          {/* Filter Bar */}
          <FilterBar_1.default>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">날짜 범위:</span>
                  <div className="relative">
                    <button onClick={function () { return setShowDatePicker(!showDatePicker); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center gap-2">
                      <span>{getDateRangeText()}</span>
                      <i className="ri-calendar-line"></i>
                    </button>
                    
                    {showDatePicker && (<div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <button onClick={function () { return handleDateRangeSelect('today'); }} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                              오늘
                            </button>
                            <button onClick={function () { return handleDateRangeSelect('week'); }} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                              이번 주
                            </button>
                            <button onClick={function () { return handleDateRangeSelect('month'); }} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                              이번 달
                            </button>
                            <button onClick={function () { return handleDateRangeSelect('lastWeek'); }} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                              지난 주
                            </button>
                            <button onClick={function () { return handleDateRangeSelect('lastMonth'); }} className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg">
                              지난 달
                            </button>
                            <button onClick={function () { return setCustomDateMode(true); }} className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg">
                              사용자 지정
                            </button>
                          </div>
                          
                          {customDateMode && (<div className="border-t pt-3">
                              <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">시작일</label>
                                  <input type="date" value={customStartDate} onChange={function (e) { return setCustomStartDate(e.target.value); }} className="w-full px-2 py-1 text-sm border border-gray-200 rounded"/>
                                </div>
                                <div>
                                  <label className="block text-xs text-gray-600 mb-1">종료일</label>
                                  <input type="date" value={customEndDate} onChange={function (e) { return setCustomEndDate(e.target.value); }} className="w-full px-2 py-1 text-sm border border-gray-200 rounded"/>
                                </div>
                              </div>
                              <button onClick={handleCustomDateApply} className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                적용
                              </button>
                            </div>)}
                        </div>
                      </div>)}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">담당 직원:</span>
                  <select value={selectedEmployee} onChange={function (e) { return setSelectedEmployee(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 직원</option>
                    {staff_1.mockStaff.map(function (staff) { return (<option key={staff.id} value={staff.id}>{staff.name}</option>); })}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">서비스:</span>
                  <select value={serviceTypeFilter} onChange={function (e) { return setServiceTypeFilter(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 서비스</option>
                    {services_1.mockServices.map(function (service) { return (<option key={service.id} value={service.id}>{service.name}</option>); })}
                  </select>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">상태:</span>
                  <select value={statusFilter} onChange={function (e) { return setStatusFilter(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 상태</option>
                    <option value="scheduled">예약됨</option>
                    <option value="completed">완료</option>
                    <option value="cancelled">취소</option>
                    <option value="no-show">노쇼</option>
                  </select>
                </div>
              </div>
            </div>
          </FilterBar_1.default>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {viewMode === 'calendar' ? (<CalendarView_1.default reservations={filteredReservations} viewType={calendarViewType} onViewTypeChange={setCalendarViewType} selectedDate={selectedDate} onDateChange={setSelectedDate} onReservationClick={handleEditReservation} onStatusChange={handleStatusChange} onDeleteReservation={handleDeleteReservation} onAddReservation={handleAddReservation}/>) : (<ListView_1.default reservations={filteredReservations} onReservationClick={handleViewReservation} onEditReservation={handleEditReservation} onDeleteReservation={handleDeleteReservation} onStatusChange={handleStatusChange} onBulkStatusChange={handleBulkStatusChange} onBulkDelete={handleBulkDelete}/>)}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (<AddReservationModal_1.default onClose={function () { return setShowAddModal(false); }} onAdd={function (newReservation) {
                setReservationList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, newReservation), { id: Date.now().toString(), createdAt: new Date().toISOString() })], false); });
                setShowAddModal(false);
            }} customers={customers_1.mockCustomers} staff={staff_1.mockStaff} services={services_1.mockServices}/>)}

      {showEditModal && selectedReservation && (<EditReservationModal_1.default reservation={selectedReservation} onClose={function () {
                setShowEditModal(false);
                setSelectedReservation(null);
            }} onSave={function (updatedReservation) {
                setReservationList(function (prev) { return prev.map(function (r) {
                    return r.id === updatedReservation.id ? updatedReservation : r;
                }); });
                setShowEditModal(false);
                setSelectedReservation(null);
            }} onDelete={function () {
                if (selectedReservation) {
                    handleDeleteReservation(selectedReservation.id);
                    setShowEditModal(false);
                    setSelectedReservation(null);
                }
            }} staff={staff_1.mockStaff} services={services_1.mockServices}/>)}

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedReservation && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">예약 상세 정보</h2>
              <button onClick={function () { return setShowDetailModal(false); }} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              <div className="space-y-6">
                {/* 고객 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">고객 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">고객명</div>
                      <div className="font-medium">{selectedReservation.customerName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">연락처</div>
                      <div className="font-medium">
                        <a href={"tel:".concat(selectedReservation.customerPhone)} className="text-blue-600 hover:text-blue-800">
                          {selectedReservation.customerPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 예약 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">예약 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">날짜</div>
                      <div className="font-medium">{(0, date_fns_1.format)(new Date(selectedReservation.date), 'yyyy년 M월 d일')}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">시간</div>
                      <div className="font-medium">{selectedReservation.startTime} - {selectedReservation.endTime}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">담당 직원</div>
                      <div className="font-medium">{selectedReservation.employeeName}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">상태</div>
                      <div className={"inline-flex px-2 py-1 rounded-full text-xs font-medium ".concat(selectedReservation.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                selectedReservation.status === 'completed' ? 'bg-green-100 text-green-800' :
                    selectedReservation.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800')}>
                        {selectedReservation.status === 'scheduled' ? '예약됨' :
                selectedReservation.status === 'completed' ? '완료' :
                    selectedReservation.status === 'cancelled' ? '취소' : '노쇼'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서비스 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">서비스 정보</h3>
                  <div className="space-y-2">
                    {selectedReservation.services.map(function (service, index) { return (<div key={index} className="flex justify-between items-center">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-600">{service.duration}분</div>
                        </div>
                        <div className="font-medium">{service.price.toLocaleString()}원</div>
                      </div>); })}
                    <div className="border-t pt-2 flex justify-between items-center font-semibold">
                      <div>총 금액</div>
                      <div>{((_a = selectedReservation.amount) === null || _a === void 0 ? void 0 : _a.toLocaleString()) || 0}원</div>
                    </div>
                  </div>
                </div>

                {/* 메모 */}
                {selectedReservation.memo && (<div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">메모</h3>
                    <div className="text-gray-700">{selectedReservation.memo}</div>
                  </div>)}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button onClick={function () {
                setShowDetailModal(false);
                handleEditReservation(selectedReservation);
            }} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                수정
              </button>
              <button onClick={function () { return setShowDetailModal(false); }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                닫기
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
