import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, MessageCircle, Plus, X } from 'lucide-react';
import {
  format,
  startOfWeek,
  addDays,
  addWeeks,
  subWeeks,
  isSameDay,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { mockReservations } from '@/features/reservations/api/mock';
import AddReservationModal from '@/features/reservations/components/AddReservationModal';
import { mockCustomers } from '@/features/customers/api/mock';
import { mockStaff } from '@/features/staff/api/mock';
import { mockServices } from '@/features/services/api/mock';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Staff {
  id: string;
  name: string;
  role: string;
}

interface StaffScheduleModalProps {
  staff: Staff;
  open: boolean;
  onClose: () => void;
  onAddReservation?: () => void;
}

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

interface WorkingHours {
  start: string;
  end: string;
  lunchStart?: string;
  lunchEnd?: string;
  isWorking: boolean;
}

// 시간대 슬롯
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

// 직원별 기본 근무시간 설정
const getStaffWorkingHours = (
  staffId: string,
  dayIndex: number
): WorkingHours => {
  // 일요일(0)과 월요일(1)은 휴무
  if (dayIndex === 0 || dayIndex === 1) {
    return { start: '09:00', end: '18:00', isWorking: false };
  }

  // 토요일은 단축 근무
  if (dayIndex === 6) {
    return {
      start: '10:00',
      end: '17:00',
      lunchStart: '12:30',
      lunchEnd: '13:30',
      isWorking: true,
    };
  }

  // 평일은 정상 근무
  return {
    start: '09:00',
    end: '18:00',
    lunchStart: '12:00',
    lunchEnd: '13:00',
    isWorking: true,
  };
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-50 text-blue-800 border-l-blue-400';
    case 'completed':
      return 'bg-green-50 text-green-800 border-l-green-400';
    case 'cancelled':
      return 'bg-red-50 text-red-800 border-l-red-400';
    case 'no-show':
      return 'bg-gray-50 text-gray-800 border-l-gray-400';
    default:
      return 'bg-gray-50 text-gray-800 border-l-gray-400';
  }
};

const getServiceCategoryColor = (serviceName: string) => {
  if (
    serviceName.includes('컷') ||
    serviceName.includes('염색') ||
    serviceName.includes('펌') ||
    serviceName.includes('트리트먼트')
  ) {
    return 'bg-blue-50 border-l-blue-400';
  } else if (serviceName.includes('네일') || serviceName.includes('젤')) {
    return 'bg-pink-50 border-l-pink-400';
  } else if (
    serviceName.includes('케어') ||
    serviceName.includes('마사지') ||
    serviceName.includes('페이셜')
  ) {
    return 'bg-green-50 border-l-green-400';
  }
  return 'bg-purple-50 border-l-purple-400';
};

const isTimeInRange = (time: string, start: string, end: string) => {
  const timeMinutes =
    parseInt(time.split(':')[0]) * 60 + parseInt(time.split(':')[1]);
  const startMinutes =
    parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
  const endMinutes =
    parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
  return timeMinutes >= startMinutes && timeMinutes < endMinutes;
};

export default function StaffScheduleModal({
  staff,
  open,
  onClose,
  onAddReservation,
}: StaffScheduleModalProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [showReservationDetail, setShowReservationDetail] = useState<
    string | null
  >(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedDateTime, setSelectedDateTime] = useState<{
    date: string;
    time: string;
  } | null>(null);
  const [detailPosition, setDetailPosition] = useState({ x: 0, y: 0 });

  const weekStart = startOfWeek(currentWeek, { weekStartsOn: 0 });
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  // 해당 직원의 예약 데이터 로드
  useEffect(() => {
    const staffReservations = mockReservations.filter(
      (res) => res.employeeId === staff.id
    );
    setReservations(staffReservations);
  }, [staff.id]);

  const navigateWeek = (direction: 'prev' | 'next' | 'today') => {
    if (direction === 'today') {
      setCurrentWeek(new Date());
    } else {
      setCurrentWeek(
        direction === 'prev'
          ? subWeeks(currentWeek, 1)
          : addWeeks(currentWeek, 1)
      );
    }
  };

  const getReservationsForTimeSlot = (date: Date, timeSlot: string) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return reservations.filter((res) => {
      if (res.date !== dateStr) return false;

      // 예약 시작 시간이 현재 시간 슬롯과 일치하는지 확인
      return res.startTime === timeSlot;
    });
  };

  const handleTimeSlotClick = (
    date: Date,
    timeSlot: string,
    event: React.MouseEvent
  ) => {
    const workingHours = getStaffWorkingHours(staff.id, date.getDay());

    // 근무시간 외 클릭 방지
    if (
      !workingHours.isWorking ||
      !isTimeInRange(timeSlot, workingHours.start, workingHours.end) ||
      (workingHours.lunchStart &&
        workingHours.lunchEnd &&
        isTimeInRange(timeSlot, workingHours.lunchStart, workingHours.lunchEnd))
    ) {
      return;
    }

    const dateStr = format(date, 'yyyy-MM-dd');
    const existingReservations = getReservationsForTimeSlot(date, timeSlot);

    if (existingReservations.length === 0) {
      // 빈 슬롯 클릭 - 새 예약 추가
      setSelectedDateTime({ date: dateStr, time: timeSlot });
      setShowAddModal(true);
    }
  };

  const handleReservationClick = (
    reservation: Reservation,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setDetailPosition({
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
    });
    setShowReservationDetail(reservation.id);
  };

  const handleReservationAction = (
    reservationId: string,
    action: 'edit' | 'complete' | 'cancel' | 'delete'
  ) => {
    setReservations((prev) => {
      if (action === 'delete') {
        return prev.filter((r) => r.id !== reservationId);
      } else if (action === 'complete') {
        return prev.map((r) =>
          r.id === reservationId ? { ...r, status: 'completed' as const } : r
        );
      } else if (action === 'cancel') {
        return prev.map((r) =>
          r.id === reservationId ? { ...r, status: 'cancelled' as const } : r
        );
      }
      return prev;
    });
    setShowReservationDetail(null);
  };

  const getWeekStats = () => {
    const weekReservations = reservations.filter((res) => {
      const resDate = new Date(res.date);
      return resDate >= weekStart && resDate <= addDays(weekStart, 6);
    });

    const totalCount = weekReservations.length;
    const completedCount = weekReservations.filter(
      (r) => r.status === 'completed'
    ).length;
    const totalRevenue = weekReservations
      .filter((r) => r.status === 'completed')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    return { totalCount, completedCount, totalRevenue };
  };

  const stats = getWeekStats();
  const selectedReservation = reservations.find(
    (r) => r.id === showReservationDetail
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="flex w-full max-w-7xl flex-col overflow-hidden p-0">
        <DialogHeader className="border-b border-gray-200 bg-white p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
              <span className="text-lg font-bold text-white">
                {staff.name.charAt(0)}
              </span>
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">
                {staff.name}의 일정
              </DialogTitle>
              <p className="text-sm text-gray-600">{staff.role}</p>
            </div>
          </div>
        </DialogHeader>

        {/* 주간 통계 */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalCount}
                </div>
                <div className="text-xs text-gray-600">총 예약</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.completedCount}
                </div>
                <div className="text-xs text-gray-600">완료</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {stats.totalRevenue.toLocaleString()}원
                </div>
                <div className="text-xs text-gray-600">이번 주 매출</div>
              </div>
            </div>
          </div>
        </div>

        {/* 주간 네비게이션 */}
        <div className="flex items-center justify-between border-b border-gray-200 bg-white p-6">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigateWeek('prev')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateWeek('today')}
              className="rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
            >
              오늘
            </button>
            <button
              onClick={() => navigateWeek('next')}
              className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>

          <h3 className="text-lg font-semibold text-gray-900">
            {format(weekStart, 'M월 d일', { locale: ko })} -{' '}
            {format(addDays(weekStart, 6), 'M월 d일', { locale: ko })}
          </h3>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
          >
            <Plus size={20} className="mr-2 text-white" />새 예약 추가
          </button>
        </div>

        {/* 스케줄 그리드 */}
        <div className="flex-1 overflow-auto">
          <div className="min-w-[900px]">
            {/* 요일 헤더 */}
            <div className="sticky top-0 z-10 grid grid-cols-8 border-b border-gray-200 bg-gray-50">
              <div className="border-r border-gray-200 p-4 text-sm font-medium text-gray-700">
                시간
              </div>
              {weekDays.map((day, index) => {
                const dayIsToday = isToday(day);
                const workingHours = getStaffWorkingHours(
                  staff.id,
                  day.getDay()
                );

                return (
                  <div
                    key={day.toISOString()}
                    className={`border-r border-gray-200 p-4 text-center ${
                      dayIsToday
                        ? 'bg-blue-50'
                        : workingHours.isWorking
                          ? 'bg-white'
                          : 'bg-gray-100'
                    }`}
                  >
                    <div
                      className={`text-sm font-medium ${
                        dayIsToday
                          ? 'text-blue-600'
                          : index === 0
                            ? 'text-red-600'
                            : index === 6
                              ? 'text-blue-600'
                              : workingHours.isWorking
                                ? 'text-gray-700'
                                : 'text-gray-400'
                      }`}
                    >
                      {format(day, 'E', { locale: ko })}
                    </div>
                    <div
                      className={`text-xl font-bold ${dayIsToday ? 'text-blue-600' : workingHours.isWorking ? 'text-gray-900' : 'text-gray-400'}`}
                    >
                      {format(day, 'd')}
                    </div>
                    {!workingHours.isWorking && (
                      <div className="mt-1 text-xs text-red-500">휴무</div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* 시간대별 그리드 */}
            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot}
                className="grid grid-cols-8 border-b border-gray-100 hover:bg-gray-50"
              >
                <div className="border-r border-gray-200 bg-gray-50 p-3 text-sm font-medium text-gray-600">
                  {timeSlot}
                </div>
                {weekDays.map((day) => {
                  const reservations = getReservationsForTimeSlot(
                    day,
                    timeSlot
                  );
                  const workingHours = getStaffWorkingHours(
                    staff.id,
                    day.getDay()
                  );
                  const isWorkingTime =
                    workingHours.isWorking &&
                    isTimeInRange(
                      timeSlot,
                      workingHours.start,
                      workingHours.end
                    );
                  const isLunchTime =
                    workingHours.lunchStart &&
                    workingHours.lunchEnd &&
                    isTimeInRange(
                      timeSlot,
                      workingHours.lunchStart,
                      workingHours.lunchEnd
                    );

                  return (
                    <div
                      key={`${day.toISOString()}-${timeSlot}`}
                      className={`relative min-h-[60px] border-r border-gray-100 p-1 ${
                        !isWorkingTime || isLunchTime
                          ? 'bg-gray-100'
                          : 'cursor-pointer hover:bg-blue-50'
                      }`}
                      onClick={(e) => handleTimeSlotClick(day, timeSlot, e)}
                    >
                      {!isWorkingTime ? (
                        <div className="mt-4 text-center text-xs text-gray-400">
                          {isLunchTime ? '점심시간' : '근무시간 외'}
                        </div>
                      ) : reservations.length > 0 ? (
                        reservations.map((reservation) => (
                          <div
                            key={reservation.id}
                            onClick={(e) =>
                              handleReservationClick(reservation, e)
                            }
                            className={`cursor-pointer rounded border-l-4 p-2 text-xs transition-all hover:opacity-80 ${getServiceCategoryColor(
                              reservation.services[0]?.name || ''
                            )} ${getStatusColor(reservation.status)} shadow-sm`}
                          >
                            <div className="truncate font-medium text-gray-900">
                              {reservation.customerName}
                            </div>
                            <div className="mt-1 truncate text-gray-600 opacity-75">
                              {reservation.services[0]?.name}
                            </div>
                            <div className="mt-1 text-xs text-gray-500 opacity-60">
                              {reservation.startTime} - {reservation.endTime}
                            </div>
                            {reservation.memo && (
                              <div className="mt-1">
                                <MessageCircle className="h-3 w-3" />
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="flex h-full w-full items-center justify-center rounded border-2 border-dashed border-gray-200 text-gray-300 transition-all hover:border-blue-300 hover:bg-white hover:text-gray-500">
                          <Plus size={20} className="text-white" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* 범례 */}
        <div className="flex items-center justify-between border-t border-gray-200 bg-gray-50 p-6">
          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border-l-4 border-l-blue-400 bg-blue-50" />
              <span className="text-gray-600">헤어 서비스</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border-l-4 border-l-pink-400 bg-pink-50" />
              <span className="text-gray-600">네일 서비스</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-sm border-l-4 border-l-green-400 bg-green-50" />
              <span className="text-gray-600">케어 서비스</span>
            </div>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div>📞 클릭 시 전화 걸기</div>
            <div>✏️ 예약 블록 클릭 시 상세 정보</div>
          </div>
        </div>

        {/* 예약 상세 정보 팝오버 */}
      {showReservationDetail && selectedReservation && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowReservationDetail(null)}
          />
          <div
            className="fixed z-50 w-80 rounded-lg border border-gray-200 bg-white p-4 shadow-xl"
            style={{
              left: Math.max(
                10,
                Math.min(window.innerWidth - 330, detailPosition.x - 160)
              ),
              top: Math.max(10, detailPosition.y - 200),
            }}
          >
            <div className="mb-3 flex items-center justify-between">
              <h4 className="font-semibold text-gray-900">예약 상세 정보</h4>
            </div>

            <div className="space-y-3">
              <div>
                <div className="text-sm text-gray-600">고객</div>
                <div className="font-medium text-gray-900">
                  {selectedReservation.customerName}
                </div>
                <button
                  onClick={() =>
                    (window.location.href = `tel:${selectedReservation.customerPhone}`)
                  }
                  className="text-sm text-blue-600 hover:underline"
                >
                  📞 {selectedReservation.customerPhone}
                </button>
              </div>

              <div>
                <div className="text-sm text-gray-600">서비스</div>
                <div className="font-medium text-gray-900">
                  {selectedReservation.services.map((s) => s.name).join(', ')}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">시간</div>
                <div className="font-medium text-gray-900">
                  {selectedReservation.startTime} -{' '}
                  {selectedReservation.endTime}
                </div>
              </div>

              <div>
                <div className="text-sm text-gray-600">금액</div>
                <div className="font-medium text-gray-900">
                  {selectedReservation.amount?.toLocaleString()}원
                </div>
              </div>

              {selectedReservation.memo && (
                <div>
                  <div className="text-sm text-gray-600">메모</div>
                  <div className="rounded bg-gray-50 p-2 text-sm text-gray-900">
                    {selectedReservation.memo}
                  </div>
                </div>
              )}

              <div className="border-t border-gray-200 pt-3">
                <div className="flex gap-2">
                  {selectedReservation.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() =>
                          handleReservationAction(
                            selectedReservation.id,
                            'complete'
                          )
                        }
                        className="flex-1 rounded bg-green-100 px-3 py-2 text-xs text-green-700 transition-colors hover:bg-green-200"
                      >
                        완료
                      </button>
                      <button
                        onClick={() =>
                          handleReservationAction(
                            selectedReservation.id,
                            'cancel'
                          )
                        }
                        className="flex-1 rounded bg-red-100 px-3 py-2 text-xs text-red-700 transition-colors hover:bg-red-200"
                      >
                        취소
                      </button>
                    </>
                  )}
                  <button
                    onClick={() =>
                      handleReservationAction(selectedReservation.id, 'delete')
                    }
                    className="flex-1 rounded bg-gray-100 px-3 py-2 text-xs text-gray-700 transition-colors hover:bg-gray-200"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* 새 예약 추가 모달 */}
      <AddReservationModal
        open={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setSelectedDateTime(null);
        }}
        onAdd={(newReservation) => {
          const reservation = {
            ...newReservation,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            employeeId: staff.id,
            employeeName: staff.name,
          };
          setReservations((prev) => [...prev, reservation]);
          setShowAddModal(false);
          setSelectedDateTime(null);
        }}
        customers={mockCustomers}
        staff={mockStaff.filter((s) => s.id === staff.id)}
        services={mockServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.categoryName,
          basePrice: s.basePrice,
          duration: s.duration,
          active: s.isActive,
        }))}
      />
      </DialogContent>
    </Dialog>
  );
}
