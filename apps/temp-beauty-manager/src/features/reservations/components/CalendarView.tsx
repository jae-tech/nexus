import { useState, useMemo } from 'react';
import {
  format,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameDay,
  addDays,
  subDays,
  addWeeks,
  subWeeks,
  addMonths,
  subMonths,
  startOfMonth,
  endOfMonth,
} from 'date-fns';
import { ko } from 'date-fns/locale';

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
  onStatusChange: (
    reservationId: string,
    status: Reservation['status']
  ) => void;
  onDeleteReservation: (reservationId: string) => void;
  onAddReservation: () => void;
}

const timeSlots = [
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '12:30',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
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
  if (
    serviceName.includes('컷') ||
    serviceName.includes('염색') ||
    serviceName.includes('펌')
  ) {
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
  onAddReservation,
}: CalendarViewProps) {
  // 날짜 네비게이션
  const navigateDate = (direction: 'prev' | 'next') => {
    if (viewType === 'month') {
      onDateChange(
        direction === 'prev'
          ? subMonths(selectedDate, 1)
          : addMonths(selectedDate, 1)
      );
    } else if (viewType === 'week') {
      onDateChange(
        direction === 'prev'
          ? subWeeks(selectedDate, 1)
          : addWeeks(selectedDate, 1)
      );
    } else {
      onDateChange(
        direction === 'prev'
          ? subDays(selectedDate, 1)
          : addDays(selectedDate, 1)
      );
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
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-7 border-b border-gray-200">
          {['일', '월', '화', '수', '목', '금', '토'].map((day, index) => (
            <div
              key={day}
              className={`p-2 text-center text-xs font-medium md:p-3 md:text-sm ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'}`}
            >
              {day}
            </div>
          ))}
        </div>

        {/* 날짜 그리드 */}
        <div className="grid grid-cols-7">
          {days.map((day, index) => {
            const dayReservations = reservations.filter((res) =>
              isSameDay(new Date(res.date), day)
            );
            const isCurrentMonth = day.getMonth() === selectedDate.getMonth();
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={day.toISOString()}
                className={`min-h-[80px] border-b border-r border-gray-100 p-1 md:min-h-[120px] md:p-2 ${
                  !isCurrentMonth ? 'bg-gray-50' : ''
                } ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div
                  className={`mb-1 text-xs font-medium md:text-sm ${
                    !isCurrentMonth
                      ? 'text-gray-400'
                      : isToday
                        ? 'text-blue-600'
                        : index % 7 === 0
                          ? 'text-red-600'
                          : index % 7 === 6
                            ? 'text-blue-600'
                            : 'text-gray-900'
                  }`}
                >
                  {format(day, 'd')}
                </div>

                {/* 예약 개수 배지 */}
                {dayReservations.length > 0 && (
                  <div className="mb-1">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-1.5 py-0.5 text-xs font-medium text-blue-800 md:px-2 md:py-1">
                      {dayReservations.length}건
                    </span>
                  </div>
                )}

                {/* 예약 미리보기 */}
                <div className="space-y-1">
                  {dayReservations
                    .slice(0, window.innerWidth < 768 ? 1 : 2)
                    .map((reservation) => (
                      <div
                        key={reservation.id}
                        onClick={() => onReservationClick(reservation)}
                        className="cursor-pointer rounded border border-blue-200 bg-blue-100 p-1 text-xs text-blue-800 transition-opacity hover:opacity-80"
                      >
                        <div className="truncate font-medium">
                          {reservation.startTime} {reservation.customerName}
                        </div>
                        <div className="hidden truncate opacity-75 md:block">
                          {reservation.services[0]?.name}
                        </div>
                      </div>
                    ))}
                  {dayReservations.length >
                    (window.innerWidth < 768 ? 1 : 2) && (
                    <div className="text-center text-xs text-gray-500">
                      +
                      {dayReservations.length -
                        (window.innerWidth < 768 ? 1 : 2)}
                      개 더
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
    const weekDays = eachDayOfInterval({
      start: weekStart,
      end: addDays(weekStart, 6),
    });

    return (
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* 요일 헤더 */}
        <div className="grid grid-cols-8 border-b border-gray-200">
          <div className="border-r border-gray-200 p-2 text-center text-xs font-medium text-gray-700 md:p-3 md:text-sm">
            시간
          </div>
          {weekDays.map((day, index) => {
            const isToday = isSameDay(day, new Date());
            return (
              <div
                key={day.toISOString()}
                className={`border-r border-gray-200 p-2 text-center md:p-3 ${isToday ? 'bg-blue-50' : ''}`}
              >
                <div
                  className={`text-xs font-medium md:text-sm ${
                    isToday
                      ? 'text-blue-600'
                      : index === 0
                        ? 'text-red-600'
                        : index === 6
                          ? 'text-blue-600'
                          : 'text-gray-700'
                  }`}
                >
                  {format(day, 'E', { locale: ko })}
                </div>
                <div
                  className={`text-sm font-bold md:text-lg ${isToday ? 'text-blue-600' : 'text-gray-900'}`}
                >
                  {format(day, 'd')}
                </div>
              </div>
            );
          })}
        </div>

        {/* 시간대별 그리드 */}
        <div className="max-h-[400px] overflow-y-auto md:max-h-[600px]">
          {timeSlots.map((timeSlot) => (
            <div
              key={timeSlot}
              className="grid grid-cols-8 border-b border-gray-100"
            >
              <div className="border-r border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 md:p-3 md:text-sm">
                {timeSlot}
              </div>
              {weekDays.map((day) => {
                const dayReservations = reservations.filter(
                  (res) =>
                    isSameDay(new Date(res.date), day) &&
                    res.startTime === timeSlot
                );

                return (
                  <div
                    key={`${day.toISOString()}-${timeSlot}`}
                    className="min-h-[40px] border-r border-gray-100 p-0.5 md:min-h-[60px] md:p-1"
                  >
                    {dayReservations.map((reservation) => (
                      <div
                        key={reservation.id}
                        onClick={() => onReservationClick(reservation)}
                        className={`cursor-pointer rounded border-l-4 p-1 text-xs transition-opacity hover:opacity-80 md:p-2 ${getServiceCategoryColor(reservation.services[0]?.name || '')} ${getStatusColor(reservation.status)}`}
                      >
                        <div className="truncate font-medium">
                          {reservation.customerName}
                        </div>
                        <div className="hidden truncate opacity-75 md:block">
                          {reservation.services[0]?.name}
                        </div>
                        <div className="hidden truncate opacity-75 lg:block">
                          {reservation.employeeName}
                        </div>
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
    const dayReservations = reservations
      .filter((res) => isSameDay(new Date(res.date), selectedDate))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));

    return (
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 p-3 md:p-4">
          <h3 className="text-base font-semibold text-gray-900 md:text-lg">
            {format(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
          </h3>
          <p className="mt-1 text-xs text-gray-600 md:text-sm">
            총 {dayReservations.length}건의 예약
          </p>
        </div>

        <div className="max-h-[400px] overflow-y-auto md:max-h-[600px]">
          {timeSlots.map((timeSlot) => {
            const slotReservations = dayReservations.filter(
              (res) => res.startTime === timeSlot
            );

            return (
              <div key={timeSlot} className="flex border-b border-gray-100">
                <div className="w-16 border-r border-gray-200 bg-gray-50 p-2 text-xs text-gray-600 md:w-20 md:p-4 md:text-sm">
                  {timeSlot}
                </div>
                <div className="min-h-[60px] flex-1 p-2 md:min-h-[80px] md:p-4">
                  {slotReservations.length === 0 ? (
                    <button
                      onClick={onAddReservation}
                      className="h-full w-full rounded-lg border-2 border-dashed border-gray-200 text-xs text-gray-400 transition-colors hover:border-gray-300 hover:bg-gray-50 hover:text-gray-600 md:text-sm"
                    >
                      <i className="ri-add-line mr-1" />
                      예약 추가
                    </button>
                  ) : (
                    <div className="space-y-2">
                      {slotReservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className={`cursor-pointer rounded-lg border-l-4 p-2 transition-shadow hover:shadow-md md:p-3 ${getServiceCategoryColor(reservation.services[0]?.name || '')} ${getStatusColor(reservation.status)}`}
                          onClick={() => onReservationClick(reservation)}
                        >
                          <div className="mb-2 flex items-center justify-between">
                            <div className="text-sm font-medium text-gray-900 md:text-base">
                              {reservation.customerName}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(reservation.status)}`}
                              >
                                {reservation.status === 'scheduled'
                                  ? '예약됨'
                                  : reservation.status === 'completed'
                                    ? '완료'
                                    : reservation.status === 'cancelled'
                                      ? '취소'
                                      : '노쇼'}
                              </span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onDeleteReservation(reservation.id);
                                }}
                                className="p-1 text-gray-400 transition-colors hover:text-red-600"
                              >
                                <i className="ri-delete-bin-line text-sm" />
                              </button>
                            </div>
                          </div>
                          <div className="mb-1 text-xs text-gray-600 md:text-sm">
                            <i className="ri-phone-line mr-1" />
                            {reservation.customerPhone}
                          </div>
                          <div className="mb-1 text-xs text-gray-600 md:text-sm">
                            <i className="ri-scissors-line mr-1" />
                            {reservation.services.map((s) => s.name).join(', ')}
                          </div>
                          <div className="mb-1 text-xs text-gray-600 md:text-sm">
                            <i className="ri-user-line mr-1" />
                            {reservation.employeeName}
                          </div>
                          {reservation.memo && (
                            <div className="text-xs text-gray-600 md:text-sm">
                              <i className="ri-chat-3-line mr-1" />
                              {reservation.memo}
                            </div>
                          )}
                          {reservation.amount && (
                            <div className="mt-2 text-xs font-medium text-gray-900 md:text-sm">
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
      <div className="mb-4 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center md:mb-6">
        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
          {/* 뷰 타입 선택 */}
          <div className="flex rounded-lg border border-gray-200 bg-white p-1">
            <button
              onClick={() => onViewTypeChange('month')}
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:py-2 md:text-sm ${
                viewType === 'month'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              월간
            </button>
            <button
              onClick={() => onViewTypeChange('week')}
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:py-2 md:text-sm ${
                viewType === 'week'
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              주간
            </button>
            <button
              onClick={() => onViewTypeChange('day')}
              className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:py-2 md:text-sm ${
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
              className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:p-2"
            >
              <i className="ri-arrow-left-line text-sm md:text-base" />
            </button>
            <h2 className="min-w-[150px] text-center text-sm font-semibold text-gray-900 md:min-w-[200px] md:text-lg">
              {viewType === 'month' &&
                format(selectedDate, 'yyyy년 M월', { locale: ko })}
              {viewType === 'week' &&
                `${format(startOfWeek(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: ko })} - ${format(endOfWeek(selectedDate, { weekStartsOn: 0 }), 'M월 d일', { locale: ko })}`}
              {viewType === 'day' &&
                format(selectedDate, 'yyyy년 M월 d일 EEEE', { locale: ko })}
            </h2>
            <button
              onClick={() => navigateDate('next')}
              className="rounded-lg p-1.5 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 md:p-2"
            >
              <i className="ri-arrow-right-line text-sm md:text-base" />
            </button>
          </div>
        </div>

        {/* 오늘로 이동 버튼 */}
        <button
          onClick={() => onDateChange(new Date())}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 md:px-4 md:py-2 md:text-sm"
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
