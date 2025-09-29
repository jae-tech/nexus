import { useState, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import FilterBar from "@/components/common/FilterBar";
import SearchBar from "@/components/ui/SearchBar";
import Button from "@/components/ui/Button";
import CalendarView from "./components/CalendarView";
import ListView from "./components/ListView";
import AddReservationModal from "./components/AddReservationModal";
import EditReservationModal from "./components/EditReservationModal";
import { mockReservations } from "@/mocks/reservations";
import { mockStaff } from "@/mocks/staff";
import { mockServices } from "@/mocks/services";
import { mockCustomers } from "@/mocks/customers";
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
} from "date-fns";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

type ViewMode = "calendar" | "list";
type DateRangeType =
  | "today"
  | "week"
  | "month"
  | "lastWeek"
  | "lastMonth"
  | "custom";
type StatusFilter = "all" | "scheduled" | "completed" | "cancelled" | "no-show";
type CalendarViewType = "month" | "week" | "day";

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
  status: "scheduled" | "completed" | "cancelled" | "no-show";
  memo?: string;
  amount?: number;
  createdAt: string;
}

export function Reservations() {
  const { isSidebarOpen } = useUIStore();
  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [calendarViewType, setCalendarViewType] =
    useState<CalendarViewType>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 필터 상태
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("week");
  const [customDateRange, setCustomDateRange] = useState({
    start: format(startOfWeek(new Date()), "yyyy-MM-dd"),
    end: format(endOfWeek(new Date()), "yyyy-MM-dd"),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(
    format(startOfWeek(new Date()), "yyyy-MM-dd")
  );
  const [customEndDate, setCustomEndDate] = useState(
    format(endOfWeek(new Date()), "yyyy-MM-dd")
  );
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

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
          id: "1",
          name: "헤어컷",
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
      case "today":
        return {
          start: startOfDay(today),
          end: endOfDay(today),
        };
      case "week":
        return {
          start: startOfWeek(today),
          end: endOfWeek(today),
        };
      case "month":
        return {
          start: startOfMonth(today),
          end: endOfMonth(today),
        };
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        return {
          start: startOfWeek(lastWeek),
          end: endOfWeek(lastWeek),
        };
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        return {
          start: startOfMonth(lastMonth),
          end: endOfMonth(lastMonth),
        };
      case "custom":
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
    if (selectedEmployee !== "all") {
      filtered = filtered.filter(
        (reservation) => reservation.employeeId === selectedEmployee
      );
    }

    // 서비스 타입 필터
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter((reservation) => {
        return reservation.services.some((service) => {
          if (serviceTypeFilter === "hair")
            return (
              service.name.includes("컷") ||
              service.name.includes("염색") ||
              service.name.includes("펌")
            );
          if (serviceTypeFilter === "nail")
            return service.name.includes("네일");
          if (serviceTypeFilter === "care")
            return (
              service.name.includes("케어") || service.name.includes("마사지")
            );
          return true;
        });
      });
    }

    // 상태 필터
    if (statusFilter !== "all") {
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
    if (type !== "custom") {
      setShowDatePicker(false);
      setCustomDateMode(false);
    }
  };

  const handleCustomDateApply = () => {
    setCustomDateRange({
      start: customStartDate,
      end: customEndDate,
    });
    setDateRangeType("custom");
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
    if (confirm("정말로 이 예약을 삭제하시겠습니까?")) {
      setReservationList((prev) => prev.filter((r) => r.id !== reservationId));
    }
  };

  const handleStatusChange = (
    reservationId: string,
    newStatus: Reservation["status"]
  ) => {
    setReservationList((prev) =>
      prev.map((r) =>
        r.id === reservationId ? { ...r, status: newStatus } : r
      )
    );
  };

  const handleBulkStatusChange = (
    reservationIds: string[],
    newStatus: Reservation["status"]
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
    if (dateRangeType === "today") {
      return format(range.start, "M월 d일");
    } else if (dateRangeType === "custom") {
      return `${format(range.start, "M/d")} - ${format(range.end, "M/d")}`;
    } else {
      return `${format(range.start, "M/d")} - ${format(range.end, "M/d")}`;
    }
  };

  return (
    <div className={cn("transition-all duration-300 pt-20")}>
      <PageHeader
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
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("calendar")}
                className={`px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  viewMode === "calendar"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-calendar-line mr-1"></i>
                <span className="hidden sm:inline">캘린더</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <i className="ri-list-check mr-1"></i>
                <span className="hidden sm:inline">리스트</span>
              </button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <i className="ri-add-line mr-1 md:mr-2"></i>
              <span className="hidden sm:inline">새 예약 추가</span>
              <span className="sm:hidden">추가</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200">
        <FilterBar>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">
                  날짜 범위:
                </span>
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus-ring flex items-center gap-2"
                  >
                    <span>{getDateRangeText()}</span>
                    <i className="ri-calendar-line"></i>
                  </button>

                  {showDatePicker && (
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-2">
                          <button
                            onClick={() => handleDateRangeSelect("today")}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
                            오늘
                          </button>
                          <button
                            onClick={() => handleDateRangeSelect("week")}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
                            이번 주
                          </button>
                          <button
                            onClick={() => handleDateRangeSelect("month")}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
                            이번 달
                          </button>
                          <button
                            onClick={() => handleDateRangeSelect("lastWeek")}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
                            지난 주
                          </button>
                          <button
                            onClick={() => handleDateRangeSelect("lastMonth")}
                            className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-lg"
                          >
                            지난 달
                          </button>
                          <button
                            onClick={() => setCustomDateMode(true)}
                            className="px-3 py-2 text-sm bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg"
                          >
                            사용자 지정
                          </button>
                        </div>

                        {customDateMode && (
                          <div className="border-t pt-3">
                            <div className="grid grid-cols-2 gap-2 mb-3">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  시작일
                                </label>
                                <input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) =>
                                    setCustomStartDate(e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  종료일
                                </label>
                                <input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) =>
                                    setCustomEndDate(e.target.value)
                                  }
                                  className="w-full px-2 py-1 text-sm border border-gray-200 rounded"
                                />
                              </div>
                            </div>
                            <button
                              onClick={handleCustomDateApply}
                              className="w-full px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
                <span className="text-xs sm:text-sm text-gray-600">
                  담당 직원:
                </span>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus-ring"
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
                <span className="text-xs sm:text-sm text-gray-600">
                  서비스:
                </span>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus-ring"
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
                <span className="text-xs sm:text-sm text-gray-600">상태:</span>
                <select
                  value={statusFilter}
                  onChange={(e) =>
                    setStatusFilter(e.target.value as StatusFilter)
                  }
                  className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus-ring"
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
        {viewMode === "calendar" ? (
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
      {showAddModal && (
        <AddReservationModal
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
          services={mockServices}
        />
      )}

      {showEditModal && selectedReservation && (
        <EditReservationModal
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
          onDelete={() => {
            if (selectedReservation) {
              handleDeleteReservation(selectedReservation.id);
              setShowEditModal(false);
              setSelectedReservation(null);
            }
          }}
          staff={mockStaff}
          services={mockServices}
        />
      )}

      {/* 예약 상세 모달 */}
      {showDetailModal && selectedReservation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                예약 상세 정보
              </h2>
              <button
                onClick={() => setShowDetailModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
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
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">예약 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-600">날짜</div>
                      <div className="font-medium">
                        {format(
                          new Date(selectedReservation.date),
                          "yyyy년 M월 d일"
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">시간</div>
                      <div className="font-medium">
                        {selectedReservation.startTime} -{" "}
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
                        className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${
                          selectedReservation.status === "scheduled"
                            ? "bg-blue-100 text-blue-800"
                            : selectedReservation.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : selectedReservation.status === "cancelled"
                                ? "bg-red-100 text-red-800"
                                : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {selectedReservation.status === "scheduled"
                          ? "예약됨"
                          : selectedReservation.status === "completed"
                            ? "완료"
                            : selectedReservation.status === "cancelled"
                              ? "취소"
                              : "노쇼"}
                      </div>
                    </div>
                  </div>
                </div>

                {/* 서비스 정보 */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-900 mb-3">
                    서비스 정보
                  </h3>
                  <div className="space-y-2">
                    {selectedReservation.services.map((service, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center"
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
                    <div className="border-t pt-2 flex justify-between items-center font-semibold">
                      <div>총 금액</div>
                      <div>
                        {selectedReservation.amount?.toLocaleString() || 0}원
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메모 */}
                {selectedReservation.memo && (
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-3">메모</h3>
                    <div className="text-gray-700">
                      {selectedReservation.memo}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  handleEditReservation(selectedReservation);
                }}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
              >
                수정
              </button>
              <button
                onClick={() => setShowDetailModal(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
