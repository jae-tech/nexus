import { useState, useMemo } from 'react';
import { Calendar, ListChecks, Plus, X } from 'lucide-react';
import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import FilterBar from '@/shared/components/FilterBar';
import SearchBar from '@/shared/components/SearchBar';
import CalendarView from '@/features/reservations/components/CalendarView';
import ListView from '@/features/reservations/components/ListView';
import AddReservationModal from '@/features/reservations/components/AddReservationModal';
import EditReservationModal from '@/features/reservations/components/EditReservationModal';
import { mockReservations } from '@/features/reservations/api/mock';
import { mockStaff } from '@/features/staff/api/mock';
import { mockServices } from '@/features/services/api/mock';
import { mockCustomers } from '@/features/customers/api/mock';
import {
  format,
  startOfDay,
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  subWeeks,
  subMonths,
  isWithinInterval,
} from 'date-fns';

type ViewMode = 'calendar' | 'list';
type DateRangeType =
  | 'today'
  | 'week'
  | 'month'
  | 'lastWeek'
  | 'lastMonth'
  | 'custom';
type StatusFilter = 'all' | 'scheduled' | 'completed' | 'cancelled' | 'no-show';
type CalendarViewType = 'month' | 'week' | 'day';

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

export default function ReservationsPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('calendar');
  const [calendarViewType, setCalendarViewType] =
    useState<CalendarViewType>('week');
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 필터 상태
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>('week');
  const [customDateRange, setCustomDateRange] = useState({
    start: format(startOfWeek(new Date()), 'yyyy-MM-dd'),
    end: format(endOfWeek(new Date()), 'yyyy-MM-dd'),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(
    format(startOfWeek(new Date()), 'yyyy-MM-dd')
  );
  const [customEndDate, setCustomEndDate] = useState(
    format(endOfWeek(new Date()), 'yyyy-MM-dd')
  );
  const [selectedEmployee, setSelectedEmployee] = useState('all');
  const [serviceTypeFilter, setServiceTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] =
    useState<Reservation | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  // 예약 데이터
  const [reservationList, setReservationList] = useState<Reservation[]>(
    mockReservations.map((reservation) => ({
      ...reservation,
      services: [
        {
          id: '1',
          name: '헤어컷',
          duration: 60,
          price: 25000,
        },
      ],
      amount: 25000,
      createdAt: new Date().toISOString(),
    }))
  );

  // 날짜 범위 계산
  const getDateRange = () => {
    const today = new Date();

    switch (dateRangeType) {
      case 'today':
        return {
          start: startOfDay(today),
          end: endOfDay(today),
        };
      case 'week':
        return {
          start: startOfWeek(today),
          end: endOfWeek(today),
        };
      case 'month':
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
        };
      case 'lastWeek':
        const lastWeek = subWeeks(today, 1);
        return {
          start: startOfWeek(lastWeek),
          end: endOfWeek(lastWeek),
        };
      case 'lastMonth':
        const lastMonth = subMonths(today, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      case 'custom':
        return {
          start: new Date(customDateRange.start),
          end: new Date(customDateRange.end),
        };
      default:
        return {
          start: startOfWeek(today),
          end: endOfWeek(today),
        };
    }
  };

  // 필터링된 예약 목록
  const filteredReservations = useMemo(() => {
    let filtered = [...reservationList];

    // 날짜 범위 필터
    const dateRange = getDateRange();
    filtered = filtered.filter((reservation) => {
      const reservationDate = new Date(reservation.date);
      return isWithinInterval(reservationDate, {
        start: dateRange.start,
        end: dateRange.end,
      });
    });

    // 직원 필터
    if (selectedEmployee !== 'all') {
      filtered = filtered.filter(
        (reservation) => reservation.employeeId === selectedEmployee
      );
    }

    // 서비스 타입 필터
    if (serviceTypeFilter !== 'all') {
      filtered = filtered.filter((reservation) => {
        return reservation.services.some((service) => {
          if (serviceTypeFilter === 'hair')
            return (
              service.name.includes('컷') ||
              service.name.includes('염색') ||
              service.name.includes('펌')
            );
          if (serviceTypeFilter === 'nail')
            return service.name.includes('네일');
          if (serviceTypeFilter === 'care')
            return (
              service.name.includes('케어') || service.name.includes('마사지')
            );
          return true;
        });
      });
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter(
        (reservation) => reservation.status === statusFilter
      );
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (reservation) =>
          reservation.customerName.toLowerCase().includes(query) ||
          reservation.customerPhone.includes(query) ||
          reservation.services.some((service) =>
            service.name.toLowerCase().includes(query)
          ) ||
          reservation.employeeName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [
    reservationList,
    dateRangeType,
    customDateRange,
    selectedEmployee,
    serviceTypeFilter,
    statusFilter,
    searchQuery,
  ]);

  const handleDateRangeSelect = (type: DateRangeType) => {
    setDateRangeType(type);
    if (type !== 'custom') {
      setShowDatePicker(false);
      setCustomDateMode(false);
    }
  };

  const handleCustomDateApply = () => {
    setCustomDateRange({
      start: customStartDate,
      end: customEndDate,
    });
    setDateRangeType('custom');
    setShowDatePicker(false);
    setCustomDateMode(false);
  };

  const handleAddReservation = (selectedDateTime?: {
    date: string;
    time: string;
  }) => {
    setShowAddModal(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleViewReservation = (reservation: Reservation) => {
    setSelectedReservation(reservation);
    setShowDetailModal(true);
  };

  const handleDeleteReservation = (reservationId: string, reason?: string) => {
    if (confirm('정말로 이 예약을 삭제하시겠습니까?')) {
      setReservationList((prev) => prev.filter((r) => r.id !== reservationId));
    }
  };

  const handleStatusChange = (
    reservationId: string,
    newStatus: Reservation['status']
  ) => {
    setReservationList((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      )
    );
  };

  const handleBulkStatusChange = (
    reservationIds: string[],
    newStatus: Reservation['status']
  ) => {
    setReservationList((prev) =>
      prev.map((r) =>
        reservationIds.includes(r.id) ? { ...r, status: newStatus } : r
      )
    );
  };

  const handleBulkDelete = (reservationIds: string[]) => {
    if (
      confirm(`선택한 ${reservationIds.length}개의 예약을 삭제하시겠습니까?`)
    ) {
      setReservationList((prev) =>
        prev.filter((r) => !reservationIds.includes(r.id))
      );
    }
  };

  const getDateRangeText = () => {
    const range = getDateRange();
    if (dateRangeType === 'today') {
      return format(range.start, 'M월 d일');
    } else if (dateRangeType === 'custom') {
      return `${format(range.start, 'M/d')} - ${format(range.end, 'M/d')}`;
    } else {
      return `${format(range.start, 'M/d')} - ${format(range.end, 'M/d')}`;
    }
  };

  return (
    <>
      <Header
        title="예약 관리"
        searchBar={
          <div className="w-full md:w-80">
            <SearchBar
              placeholder="고객명, 연락처, 서비스명 검색..."
              onSearch={setSearchQuery}
            />
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setViewMode('calendar')}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                  viewMode === 'calendar'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Calendar size={18} className="mr-1 text-gray-600" />
                <span className="hidden sm:inline">캘린더</span>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                  viewMode === 'list'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ListChecks size={18} className="mr-1 text-gray-600" />
                <span className="hidden sm:inline">리스트</span>
              </button>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
            >
              <Plus size={20} className="mr-1 text-white" />
              <span className="hidden sm:inline">새 예약 추가</span>
              <span className="sm:hidden">추가</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white shadow-sm">
        <FilterBar>
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    날짜 범위:
                  </span>
                  <div className="relative">
                    <button
                      onClick={() => setShowDatePicker(!showDatePicker)}
                      className="flex items-center gap-2 rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                    >
                      <span>{getDateRangeText()}</span>
                      <Calendar size={18} className="text-gray-600" />
                    </button>

                    {showDatePicker && (
                      <div className="absolute left-0 top-full z-50 mt-1 min-w-[300px] rounded-lg border border-gray-200 bg-white p-4 shadow-lg">
                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => handleDateRangeSelect('today')}
                              className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                            >
                              오늘
                            </button>
                            <button
                              onClick={() => handleDateRangeSelect('week')}
                              className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                            >
                              이번 주
                            </button>
                            <button
                              onClick={() => handleDateRangeSelect('month')}
                              className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                            >
                              이번 달
                            </button>
                            <button
                              onClick={() => handleDateRangeSelect('lastWeek')}
                              className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                            >
                              지난 주
                            </button>
                            <button
                              onClick={() => handleDateRangeSelect('lastMonth')}
                              className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200"
                            >
                              지난 달
                            </button>
                            <button
                              onClick={() => setCustomDateMode(true)}
                              className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200"
                            >
                              사용자 지정
                            </button>
                          </div>

                          {customDateMode && (
                            <div className="border-t pt-3">
                              <div className="mb-3 grid grid-cols-2 gap-2">
                                <div>
                                  <label className="mb-1 block text-xs text-gray-600">
                                    시작일
                                  </label>
                                  <input
                                    type="date"
                                    value={customStartDate}
                                    onChange={(e) =>
                                      setCustomStartDate(e.target.value)
                                    }
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                                  />
                                </div>
                                <div>
                                  <label className="mb-1 block text-xs text-gray-600">
                                    종료일
                                  </label>
                                  <input
                                    type="date"
                                    value={customEndDate}
                                    onChange={(e) =>
                                      setCustomEndDate(e.target.value)
                                    }
                                    className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                                  />
                                </div>
                              </div>
                              <button
                                onClick={handleCustomDateApply}
                                className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700"
                              >
                                적용
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    담당 직원:
                  </span>
                  <select
                    value={selectedEmployee}
                    onChange={(e) => setSelectedEmployee(e.target.value)}
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 직원</option>
                    {mockStaff.map((staff) => (
                      <option key={staff.id} value={staff.id}>
                        {staff.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    서비스:
                  </span>
                  <select
                    value={serviceTypeFilter}
                    onChange={(e) => setServiceTypeFilter(e.target.value)}
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 서비스</option>
                    {mockServices.map((service) => (
                      <option key={service.id} value={service.id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    상태:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as StatusFilter)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="scheduled">예약됨</option>
                    <option value="completed">완료</option>
                    <option value="cancelled">취소</option>
                    <option value="no-show">노쇼</option>
                  </select>
                </div>
              </div>
            </div>
          </FilterBar>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
          {viewMode === 'calendar' ? (
            <CalendarView
              reservations={filteredReservations}
              viewType={calendarViewType}
              onViewTypeChange={setCalendarViewType}
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
              onReservationClick={handleEditReservation}
              onStatusChange={handleStatusChange}
              onDeleteReservation={handleDeleteReservation}
              onAddReservation={handleAddReservation}
            />
          ) : (
            <ListView
              reservations={filteredReservations}
              onReservationClick={handleViewReservation}
              onEditReservation={handleEditReservation}
              onDeleteReservation={handleDeleteReservation}
              onStatusChange={handleStatusChange}
              onBulkStatusChange={handleBulkStatusChange}
              onBulkDelete={handleBulkDelete}
            />
          )}
        </div>

      {/* Modals */}
      <AddReservationModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newReservation) => {
          setReservationList((prev) => [
            ...prev,
            {
              ...newReservation,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
            },
          ]);
          setShowAddModal(false);
        }}
        customers={mockCustomers}
        staff={mockStaff}
        services={mockServices.map((s) => ({
          id: s.id,
          name: s.name,
          category: s.categoryName,
          basePrice: s.basePrice,
          duration: s.duration,
          active: s.isActive,
        }))}
      />

      {selectedReservation && (
        <EditReservationModal
          open={showEditModal}
          reservation={selectedReservation}
          onClose={() => {
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          onSave={(updatedReservation) => {
            setReservationList((prev) =>
              prev.map((r) =>
                r.id === updatedReservation.id ? updatedReservation : r
              )
            );
            setShowEditModal(false);
            setSelectedReservation(null);
          }}
          customers={mockCustomers}
          staff={mockStaff}
          services={mockServices.map((s) => ({
            id: s.id,
            name: s.name,
            category: s.categoryName,
            basePrice: s.basePrice,
            duration: s.duration,
            active: s.isActive,
          }))}
        />
      )}

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-lg bg-white">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                예약 상세 정보
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={16} className="text-gray-600 hover:text-gray-800" />
              </button>
            </div>

            <div className="overflow-y-auto p-6">
              <div className="space-y-6">
                {/* 고객 정보 */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-medium text-gray-900">고객 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">고객명</div>
                      <div className="font-medium">
                        {selectedReservation.customerName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">연락처</div>
                      <div className="font-medium">
                        <a
                          href={`tel:${selectedReservation.customerPhone}`}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          {selectedReservation.customerPhone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 예약 정보 */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-medium text-gray-900">예약 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">날짜</div>
                      <div className="font-medium">
                        {format(
                          new Date(selectedReservation.date),
                          'yyyy년 M월 d일'
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">시간</div>
                      <div className="font-medium">
                        {selectedReservation.startTime} -{' '}
                        {selectedReservation.endTime}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">담당 직원</div>
                      <div className="font-medium">
                        {selectedReservation.employeeName}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">상태</div>
                      <div
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-medium ${
                          selectedReservation.status === 'scheduled'
                            ? 'bg-blue-100 text-blue-800'
                            : selectedReservation.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : selectedReservation.status === 'cancelled'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {selectedReservation.status === 'scheduled'
                          ? '예약됨'
                          : selectedReservation.status === 'completed'
                            ? '완료'
                            : selectedReservation.status === 'cancelled'
                              ? '취소'
                              : '노쇼'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서비스 정보 */}
                <div className="rounded-lg bg-gray-50 p-4">
                  <h3 className="mb-3 font-medium text-gray-900">
                    서비스 정보
                  </h3>
                  <div className="space-y-2">
                    {selectedReservation.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <div className="text-sm text-gray-600">
                            {service.duration}분
                          </div>
                        </div>
                        <div className="font-medium">
                          {service.price.toLocaleString()}원
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-between border-t pt-2 font-semibold">
                      <div>총 금액</div>
                      <div>
                        {selectedReservation.amount?.toLocaleString() || 0}원
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메모 */}
                {selectedReservation.memo && (
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="mb-3 font-medium text-gray-900">메모</h3>
                    <div className="text-gray-700">
                      {selectedReservation.memo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditReservation(selectedReservation);
                }}
                className="rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
