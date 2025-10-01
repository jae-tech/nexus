
import { useState, useMemo } from 'react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, addDays, subDays, addWeeks, subWeeks, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Plus, Trash2, Phone, Scissors, User, ArrowLeft, ArrowRight, MessageCircle } from 'lucide-react';

interface Reservation {
  id: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  date: string;
  startTime: string;
  endTime: string;
  services: Array<{
    id: string;
    name: string;
    duration: number;
    price: number;
  }>;
  employeeId: string;
  employeeName: string;
  status: 'scheduled' | 'completed' | 'cancelled' | 'no-show';
  memo?: string;
  amount?: number;
  createdAt: string;
}

interface CalendarViewProps {
  reservations: Reservation[];
  viewType: 'month' | 'week' | 'day';
  onViewTypeChange: (type: 'month' | 'week' | 'day') => void;
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  onReservationClick: (reservation: Reservation) => void;
  onStatusChange: (reservationId: string, status: Reservation['status']) => void;
  onDeleteReservation: (reservationId: string) => void;
  onAddReservation: () => void;
}

const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
  '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];

const getStatusColor = (status: string) => {
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

const getServiceCategoryColor = (serviceName: string) => {
  if (serviceName.includes('컷') || serviceName.includes('염색') || serviceName.includes('펌')) {
    return 'bg-blue-50 border-l-blue-400';
  } else if (serviceName.includes('네일')) {
    return 'bg-pink-50 border-l-pink-400';
  } else if (serviceName.includes('케어') || serviceName.includes('마사지')) {
    return 'bg-green-50 border-l-green-400';
  }
  return 'bg-gray-50 border-l-gray-400';
};

export default function CalendarView({
  reservations,
  viewType,
  onViewTypeChange,
  selectedDate,
  onDateChange,
  onReservationClick,
  onStatusChange,
  onDeleteReservation,
  onAddReservation
}: CalendarViewProps) {
  // 날짜 네비게이션
  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewType === 'month') {
      onDateChange(direction === 'prev' ? subMonths(selectedDate, 1) : addMonths(selectedDate, 1));
    } else if (viewType === 'week') {
      onDateChange(direction === 'prev' ? subWeeks(selectedDate, 1) : addWeeks(selectedDate, 1));
    } else {
      onDateChange(direction === 'prev' ? subDays(selectedDate, 1) : addDays(selectedDate, 1));
    }
  };

  // 월간 뷰 렌더링
  const renderMonthView = () => {
    const monthStart = startOfMonth(selectedDate);
    const monthEnd = endOfMonth(selectedDate);
    const calendarStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div key={day} className={`p-2 md:p-3 text-center text-xs md:text-sm font-medium ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'}`}>
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayReservations = reservations.filter(res => 
              isSameDay(new Date(res.date), day)
            );
            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[80px] md:min-h-[120px] p-1 md:p-2 border-r border-b border-gray-100 ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div className={`text-xs md:text-sm font-medium mb-1 ${
                  !isCurrentMonth ? 'text-gray-400' : 
                  isToday ? 'text-blue-600' :
                  index % 7 === 0 ? 'text-red-600' :
                  index % 7 === 6 ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {format(day, 'd')}
                </div>
                
                {/* 예약 개수 배지 */}
                {dayReservations.length > 0 && (
                  <div className="mb-1">
                    <span className="inline-flex items-center px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {dayReservations.length}건
                    </span>
                  </div>
                )}

                {/* 예약 미리보기 */}
                <div className="space-y-1">
                  {dayReservations.slice(0, window.innerWidth < 768 ? 1 : 2).map(reservation => (
                    <div
                      key={reservation.id}
                      onClick={() => onReservationClick(reservation)}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity bg-blue-100 text-blue-800 border border-blue-200"
                    >
                      <div className="font-medium truncate">{reservation.startTime} {reservation.customerName}</div>
                      <div className="truncate opacity-75 hidden md:block">{reservation.services[0]?.name}</div>
                    </div>
                  ))}
                  {dayReservations.length > (window.innerWidth < 768 ? 1 : 2) && (
                    <div className="text-xs text-gray-500 text-center">
                      +{dayReservations.length - (window.innerWidth < 768 ? 1 : 2)}개 더
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // 주간 뷰 렌더링
  const renderWeekView = () => {
    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ start: weekStart, end: addDays(weekStart, 6) });

    return (
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="p-2 md:p-3 text-center text-xs md:text-sm font-medium text-gray-700 border-r border-gray-200">
            시간
          </div>
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div key={day.toISOString()} className={`p-2 md:p-3 text-center border-r border-gray-200 ${isToday ? 'bg-blue-50' : ''}`}>
                <div className={`text-xs md:text-sm font-medium ${
                  isToday ? 'text-blue-600' :
                  index === 0 ? 'text-red-600' :
                  index === 6 ? 'text-blue-600' : 'text-gray-700'
                }`}>
                  {format(day, 'E', { locale: ko })}
                </div>
                <div className={`text-sm md:text-lg font-bold ${isToday ? 'text-blue-600' : 'text-gray-900'}`}>
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* 시간대별 그리드 */}
        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto">
          {timeSlots.map(timeSlot => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-gray-100">
              <div className="p-2 md:p-3 text-xs md:text-sm text-gray-600 border-r border-gray-200 bg-gray-50">
                {timeSlot}
              </div>
              {weekDays.map(day => {
                const dayReservations = reservations.filter(res => 
                  isSameDay(new Date(res.date), day) && res.startTime === timeSlot
                );
                
                return (
                  <div key={`${day.toISOString()}-${timeSlot}`} className="p-0.5 md:p-1 border-r border-gray-100 min-h-[40px] md:min-h-[60px]">
                    {dayReservations.map(reservation => (
                      <div
                        key={reservation.id}
                        onClick={() => onReservationClick(reservation)}
                        className={`p-1 md:p-2 rounded text-xs cursor-pointer hover:opacity-80 transition-opacity border-l-4 ${getServiceCategoryColor(reservation.services[0]?.name || '')} ${getStatusColor(reservation.status)}`}
                      >
                        <div className="font-medium truncate">{reservation.customerName}</div>
                        <div className="truncate opacity-75 hidden md:block">{reservation.services[0]?.name}</div>
                        <div className="truncate opacity-75 hidden lg:block">{reservation.employeeName}</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // 일간 뷰 렌더링
  const renderDayView = () => {
    const dayReservations = reservations.filter(res => 
      isSameDay(new Date(res.date), selectedDate)
    ).sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-3 md:p-4 border-b border-gray-200">
          <h3 className="text-base md:text-lg font-semibold text-gray-900">
            {format(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
          </h3>
          <p className="text-xs md:text-sm text-gray-600 mt-1">
            총 {dayReservations.length}건의 예약
          </p>
        </div>

        <div className="max-h-[400px] md:max-h-[600px] overflow-y-auto">
          {timeSlots.map(timeSlot => {
            const slotReservations = dayReservations.filter(res => res.startTime === timeSlot);
            
            return (
              <div key={timeSlot} className="flex border-b border-gray-100">
                <div className="w-16 md:w-20 p-2 md:p-4 text-xs md:text-sm text-gray-600 bg-gray-50 border-r border-gray-200">
                  {timeSlot}
                </div>
                <div className="flex-1 p-2 md:p-4 min-h-[60px] md:min-h-[80px]">
                  {slotReservations.length === 0 ? (
                    <button
                      onClick={onAddReservation}
                      className="w-full h-full text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 hover:border-gray-300 transition-colors text-xs md:text-sm"
                    >
                      <Plus size={16} className="mr-1 inline" />
                      예약 추가
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {slotReservations.map(reservation => (
                        <div
                          key={reservation.id}
                          className={`p-2 md:p-3 rounded-lg border-l-4 cursor-pointer hover:shadow-md transition-shadow ${getServiceCategoryColor(reservation.services[0]?.name || '')} ${getStatusColor(reservation.status)}`}
                          onClick={() => onReservationClick(reservation)}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="font-medium text-gray-900 text-sm md:text-base">{reservation.customerName}</div>
                            <div className="flex items-center gap-2">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(reservation.status)}`}>
                                {reservation.status === 'scheduled' ? '예약됨' :
                                 reservation.status === 'completed' ? '완료' :
                                 reservation.status === 'cancelled' ? '취소' : '노쇼'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteReservation(reservation.id);
                                }}
                                className="text-gray-400 hover:text-red-600 transition-colors p-1"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <Phone size={16} className="mr-1 inline" />
                            {reservation.customerPhone}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <Scissors size={16} className="mr-1 inline" />
                            {reservation.services.map(s => s.name).join(', ')}
                          </div>
                          <div className="text-xs md:text-sm text-gray-600 mb-1">
                            <User size={16} className="mr-1 inline" />
                            {reservation.employeeName}
                          </div>
                          {reservation.memo && (
                            <div className="text-xs md:text-sm text-gray-600">
                              <MessageCircle size={12} className="mr-1 inline" />
                              {reservation.memo}
                            </div>
                          )}
                          {reservation.amount && (
                            <div className="text-xs md:text-sm font-medium text-gray-900 mt-2">
                              {reservation.amount.toLocaleString()}원
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* 캘린더 헤더 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 md:mb-6 gap-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          {/* 뷰 타입 선택 */}
          <div className="flex bg-white rounded-lg border border-gray-200 p-1">
            <button
              onClick={() => onViewTypeChange('month')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                viewType === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => onViewTypeChange('week')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                viewType === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => onViewTypeChange('day')}
              className={`px-2 md:px-3 py-1.5 md:py-2 rounded-md text-xs md:text-sm font-medium transition-colors ${
                viewType === 'day'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              일간
            </button>
          </div>

          {/* 날짜 네비게이션 */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateDate('prev')}
              className="p-1.5 md:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={16} />
            </button>
            <h2 className="text-sm md:text-lg font-semibold text-gray-900 min-w-[150px] md:min-w-[200px] text-center">
              {viewType === 'month' && format(selectedDate, 'yyyy년 M월', { locale: ko })}
              {viewType === 'week' && `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: ko })} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: ko })}`}
              {viewType === 'day' && format(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="p-1.5 md:p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        {/* 오늘로 이동 버튼 */}
        <button
          onClick={() => onDateChange(new Date())}
          className="px-3 md:px-4 py-1.5 md:py-2 text-xs md:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          오늘
        </button>
      </div>

      {/* 캘린더 컨텐츠 */}
      {viewType === 'month' && renderMonthView()}
      {viewType === 'week' && renderWeekView()}
      {viewType === 'day' && renderDayView()}
    </div>
  );
}