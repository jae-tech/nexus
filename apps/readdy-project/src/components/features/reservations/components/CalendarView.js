"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CalendarView;
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];
var getStatusColor = function (status) {
    switch (status) {
        case 'scheduled':
            return 'bg-blue-100 text-blue-800 border-blue-200';
        case 'completed':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'cancelled':
            return 'bg-red-100 text-red-800 border-red-200';
        case 'no-show':
            return 'bg-gray-100 text-gray-800 border-gray-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};
var getServiceCategoryColor = function (serviceName) {
    if (serviceName.includes('컷') || serviceName.includes('염색') || serviceName.includes('펌')) {
        return 'bg-blue-50 border-l-blue-400';
    }
    else if (serviceName.includes('네일')) {
        return 'bg-pink-50 border-l-pink-400';
    }
    else if (serviceName.includes('케어') || serviceName.includes('마사지')) {
        return 'bg-green-50 border-l-green-400';
    }
    return 'bg-gray-50 border-l-gray-400';
};
function CalendarView(_a) {
    var reservations = _a.reservations, viewType = _a.viewType, onViewTypeChange = _a.onViewTypeChange, selectedDate = _a.selectedDate, onDateChange = _a.onDateChange, onReservationClick = _a.onReservationClick, onStatusChange = _a.onStatusChange, onDeleteReservation = _a.onDeleteReservation, onAddReservation = _a.onAddReservation;
    // 날짜 네비게이션
    var navigateDate = function (direction) {
        if (viewType === 'month') {
            onDateChange(direction === 'prev' ? (0, date_fns_1.subMonths)(selectedDate, 1) : (0, date_fns_1.addMonths)(selectedDate, 1));
        }
        else if (viewType === 'week') {
            onDateChange(direction === 'prev' ? (0, date_fns_1.subWeeks)(selectedDate, 1) : (0, date_fns_1.addWeeks)(selectedDate, 1));
        }
        else {
            onDateChange(direction === 'prev' ? (0, date_fns_1.subDays)(selectedDate, 1) : (0, date_fns_1.addDays)(selectedDate, 1));
        }
    };
    // 월간 뷰 렌더링
    var renderMonthView = function () {
        var monthStart = (0, date_fns_1.startOfMonth)(selectedDate);
        var monthEnd = (0, date_fns_1.endOfMonth)(selectedDate);
        var calendarStart = (0, date_fns_1.startOfWeek)(monthStart, { weekStartsOn: 0 });
        var calendarEnd = (0, date_fns_1.endOfWeek)(monthEnd, { weekStartsOn: 0 });
        var days = (0, date_fns_1.eachDayOfInterval)({ start: calendarStart, end: calendarEnd });
        return (<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map(function (day, index) { return (<div key={day} className={"p-2 md:p-3 text-center text-xs md:text-sm font-medium ".concat(index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700')}>
              {day}
            </div>); })}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {days.map(function (day, index) {
                var dayReservations = reservations.filter(function (res) {
                    return (0, date_fns_1.isSameDay)(new Date(res.date), day);
                });
                var isCurrentMonth = day.getMonth() === selectedDate.getMonth();
                var isToday = (0, date_fns_1.isSameDay)(day, new Date());
                return (<div key={day.toISOString()} className={"min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-gray-100 ".concat(!isCurrentMonth ? 'bg-gray-50' : '', " ").concat(isToday ? 'bg-blue-50' : '')}>
                <div className={"text-xs md:text-sm font-medium mb-1 ".concat(!isCurrentMonth ? 'text-gray-400' :
                        isToday ? 'text-blue-600' :
                            index % 7 === 0 ? 'text-red-600' :
                                index % 7 === 6 ? 'text-blue-600' : 'text-gray-900')}>
                  {(0, date_fns_1.format)(day, 'd')}
                </div>
                
                {/* 예약 개수 배지 */}
                {dayReservations.length > 0 && (<div className="mb-1">
                    <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dayReservations.length}건
                    </span>
                  </div>)}

                {/* 예약 미리보기 */}
                <div className="space-y-1">
                  {dayReservations.slice(0, window.innerWidth < 768 ? 1 : 2).map(function (reservation) {
                        var _a;
                        return (<div key={reservation.id} onClick={function () { return onReservationClick(reservation); }} className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity bg-blue-100 text-blue-800 border border-blue-200">
                      <div className="font-medium truncate">{reservation.startTime} {reservation.customerName}</div>
                      <div className="truncate opacity-75 hidden md:block">{(_a = reservation.services[0]) === null || _a === void 0 ? void 0 : _a.name}</div>
                    </div>);
                    })}
                  {dayReservations.length > (window.innerWidth < 768 ? 1 : 2) && (<div className="text-xs text-gray-500 text-center">
                      +{dayReservations.length - (window.innerWidth < 768 ? 1 : 2)}개 더
                    </div>)}
                </div>
              </div>);
            })}
        </div>
      </div>);
    };
    // 주간 뷰 렌더링
    var renderWeekView = function () {
        var weekStart = (0, date_fns_1.startOfWeek)(selectedDate, { weekStartsOn: 0 });
        var weekDays = (0, date_fns_1.eachDayOfInterval)({ start: weekStart, end: (0, date_fns_1.addDays)(weekStart, 6) });
        return (<div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700 border-r border-gray-200">
            시간
          </div>
          {weekDays.map(function (day, index) {
                var isToday = (0, date_fns_1.isSameDay)(day, new Date());
                return (<div key={day.toISOString()} className={"p-2 md:p-3 text-center border-r border-gray-200 ".concat(isToday ? 'bg-blue-50' : '')}>
                <div className={"text-xs md:text-sm font-medium ".concat(isToday ? 'text-blue-600' :
                        index === 0 ? 'text-red-600' :
                            index === 6 ? 'text-blue-600' : 'text-gray-700')}>
                  {(0, date_fns_1.format)(day, 'E', { locale: locale_1.ko })}
                </div>
                <div className={"text-sm md:text-lg font-bold ".concat(isToday ? 'text-blue-600' : 'text-gray-900')}>
                  {(0, date_fns_1.format)(day, 'd')}
                </div>
              </div>);
            })}
        </div>

        {/* 시간대별 그리드 */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto">
          {timeSlots.map(function (timeSlot) { return (<div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 md:p-3 text-xs md:text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                {timeSlot}
              </div>
              {weekDays.map(function (day) {
                    var dayReservations = reservations.filter(function (res) {
                        return (0, date_fns_1.isSameDay)(new Date(res.date), day) && res.startTime === timeSlot;
                    });
                    return (<div key={"".concat(day.toISOString(), "-").concat(timeSlot)} className="p-0.5 md:p-1 border-r border-gray-100 min-h-[40px] md:min-h-[60px]">
                    {dayReservations.map(function (reservation) {
                            var _a, _b;
                            return (<div key={reservation.id} onClick={function () { return onReservationClick(reservation); }} className={"p-1 md:p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border-l-4 ".concat(getServiceCategoryColor(((_a = reservation.services[0]) === null || _a === void 0 ? void 0 : _a.name) || ''), " ").concat(getStatusColor(reservation.status))}>
                        <div className="font-medium truncate">{reservation.customerName}</div>
                        <div className="truncate opacity-75 hidden md:block">{(_b = reservation.services[0]) === null || _b === void 0 ? void 0 : _b.name}</div>
                        <div className="truncate opacity-75 hidden lg:block">{reservation.employeeName}</div>
                      </div>);
                        })}
                  </div>);
                })}
            </div>); })}
        </div>
      </div>);
    };
    // 일간 뷰 렌더링
    var renderDayView = function () {
        var dayReservations = reservations.filter(function (res) {
            return (0, date_fns_1.isSameDay)(new Date(res.date), selectedDate);
        }).sort(function (a, b) { return a.startTime.localeCompare(b.startTime); });
        return (<div className="bg-white rounded-lg border border-gray-200">
        <div className="p-3 md:p-4 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {(0, date_fns_1.format)(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: locale_1.ko })}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            총 {dayReservations.length}건의 예약
          </p>
        </div>

        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto">
          {timeSlots.map(function (timeSlot) {
                var slotReservations = dayReservations.filter(function (res) { return res.startTime === timeSlot; });
                return (<div key={timeSlot} className="flex border-b border-gray-100">
                <div className="w-16 md:w-20 p-2 md:p-4 text-xs md:text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                  {timeSlot}
                </div>
                <div className="flex-1 p-2 md:p-4 min-h-[60px] md:min-h-[80px]">
                  {slotReservations.length === 0 ? (<button onClick={onAddReservation} className="w-full h-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors text-xs md:text-sm">
                      <i className="ri-add-line mr-1"></i>
                      예약 추가
                    </button>) : (<div className="space-y-2">
                      {slotReservations.map(function (reservation) {
                            var _a;
                            return (<div key={reservation.id} className={"p-2 md:p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ".concat(getServiceCategoryColor(((_a = reservation.services[0]) === null || _a === void 0 ? void 0 : _a.name) || ''), " ").concat(getStatusColor(reservation.status))} onClick={function () { return onReservationClick(reservation); }}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900 text-sm md:text-base">{reservation.customerName}</div>
                            <div className="flex items-center gap-2">
                              <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(getStatusColor(reservation.status))}>
                                {reservation.status === 'scheduled' ? '예약됨' :
                                    reservation.status === 'completed' ? '완료' :
                                        reservation.status === 'cancelled' ? '취소' : '노쇼'}
                              </span>
                              <button onClick={function (e) {
                                    e.stopPropagation();
                                    onDeleteReservation(reservation.id);
                                }} className="text-gray-400 hover:text-red-600 transition-colors p-1">
                                <i className="ri-delete-bin-line text-sm"></i>
                              </button>
                            </div>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <i className="ri-phone-line mr-1"></i>
                            {reservation.customerPhone}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <i className="ri-scissors-line mr-1"></i>
                            {reservation.services.map(function (s) { return s.name; }).join(', ')}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <i className="ri-user-line mr-1"></i>
                            {reservation.employeeName}
                          </div>
                          {reservation.memo && (<div className="text-xs md:text-sm text-gray-600">
                              <i className="ri-chat-3-line mr-1"></i>
                              {reservation.memo}
                            </div>)}
                          {reservation.amount && (<div className="text-xs md:text-sm font-medium text-gray-900 mt-2">
                              {reservation.amount.toLocaleString()}원
                            </div>)}
                        </div>);
                        })}
                    </div>)}
                </div>
              </div>);
            })}
        </div>
      </div>);
    };
    return (<div>
      {/* 캘린더 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* 뷰 타입 선택 */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button onClick={function () { return onViewTypeChange('month'); }} className={"px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewType === 'month'
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-gray-900')}>
              월간
            </button>
            <button onClick={function () { return onViewTypeChange('week'); }} className={"px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewType === 'week'
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-gray-900')}>
              주간
            </button>
            <button onClick={function () { return onViewTypeChange('day'); }} className={"px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewType === 'day'
            ? 'bg-blue-500 text-white'
            : 'text-gray-600 hover:text-gray-900')}>
              일간
            </button>
          </div>

          {/* 날짜 네비게이션 */}
          <div className="flex items-center gap-2">
            <button onClick={function () { return navigateDate('prev'); }} className="p-1.5 md:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-arrow-left-line text-sm md:text-base"></i>
            </button>
            <h2 className="text-sm md:text-lg font-semibold text-gray-900 min-w-[150px] md:min-w-[200px] text-center">
              {viewType === 'month' && (0, date_fns_1.format)(selectedDate, 'yyyy년 M월', { locale: locale_1.ko })}
              {viewType === 'week' && "".concat((0, date_fns_1.format)((0, date_fns_1.startOfWeek)(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: locale_1.ko }), " - ").concat((0, date_fns_1.format)((0, date_fns_1.endOfWeek)(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: locale_1.ko }))}
              {viewType === 'day' && (0, date_fns_1.format)(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: locale_1.ko })}
            </h2>
            <button onClick={function () { return navigateDate('next'); }} className="p-1.5 md:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-arrow-right-line text-sm md:text-base"></i>
            </button>
          </div>
        </div>

        {/* 오늘로 이동 버튼 */}
        <button onClick={function () { return onDateChange(new Date()); }} className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
          오늘
        </button>
      </div>

      {/* 캘린더 컨텐츠 */}
      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>);
}
