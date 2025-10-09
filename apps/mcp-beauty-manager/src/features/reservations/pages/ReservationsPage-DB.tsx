/**
 * 예약 관리 페이지 (DB 연동 버전)
 *
 * Electron DB와 연동하여 예약 데이터를 관리합니다.
 */

import { useState, useMemo } from "react";
import { Calendar, ListChecks, Plus } from "lucide-react";
import { Header } from "@/components/layouts";
import { Button } from "@/components/ui/button";
import FilterBar from "@/shared/components/FilterBar";
import SearchBar from "@/shared/components/SearchBar";
import CalendarView from "@/features/reservations/components/CalendarView";
import ListView from "@/features/reservations/components/ListView";
import AddReservationModal from "@/features/reservations/components/AddReservationModal";
import EditReservationModal from "@/features/reservations/components/EditReservationModal";
import { useReservations, useCreateReservation, useUpdateReservation, useDeleteReservation } from "@/hooks/use-reservations";
import { useCustomers, useStaff, useServices, useIsElectron } from "@/hooks/use-database";
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

type ViewMode = "calendar" | "list";
type DateRangeType = "today" | "week" | "month" | "lastWeek" | "lastMonth" | "custom";
type StatusFilter = "all" | "pending" | "confirmed" | "completed" | "cancelled";
type CalendarViewType = "month" | "week" | "day";

export default function ReservationsPageDB() {
  const isElectron = useIsElectron();

  const [viewMode, setViewMode] = useState<ViewMode>("calendar");
  const [calendarViewType, setCalendarViewType] = useState<CalendarViewType>("week");
  const [selectedDate, setSelectedDate] = useState(new Date());

  // 필터 상태
  const [dateRangeType, setDateRangeType] = useState<DateRangeType>("week");
  const [customDateRange, setCustomDateRange] = useState({
    start: format(startOfWeek(new Date()), "yyyy-MM-dd"),
    end: format(endOfWeek(new Date()), "yyyy-MM-dd"),
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [customDateMode, setCustomDateMode] = useState(false);
  const [customStartDate, setCustomStartDate] = useState(format(startOfWeek(new Date()), "yyyy-MM-dd"));
  const [customEndDate, setCustomEndDate] = useState(format(endOfWeek(new Date()), "yyyy-MM-dd"));
  const [selectedEmployee, setSelectedEmployee] = useState("all");
  const [serviceTypeFilter, setServiceTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // 모달 상태
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedReservation, setSelectedReservation] = useState<any | null>(null);

  // 날짜 범위 계산
  const getDateRange = () => {
    const today = new Date();

    switch (dateRangeType) {
      case "today":
        return {
          start: format(startOfDay(today), "yyyy-MM-dd"),
          end: format(endOfDay(today), "yyyy-MM-dd"),
        };
      case "week":
        return {
          start: format(startOfWeek(today), "yyyy-MM-dd"),
          end: format(endOfWeek(today), "yyyy-MM-dd"),
        };
      case "month":
        return {
          start: format(startOfMonth(today), "yyyy-MM-dd"),
          end: format(endOfMonth(today), "yyyy-MM-dd"),
        };
      case "lastWeek":
        const lastWeek = subWeeks(today, 1);
        return {
          start: format(startOfWeek(lastWeek), "yyyy-MM-dd"),
          end: format(endOfWeek(lastWeek), "yyyy-MM-dd"),
        };
      case "lastMonth":
        const lastMonth = subMonths(today, 1);
        return {
          start: format(startOfMonth(lastMonth), "yyyy-MM-dd"),
          end: format(endOfMonth(lastMonth), "yyyy-MM-dd"),
        };
      case "custom":
        return customDateRange;
      default:
        return {
          start: format(startOfWeek(today), "yyyy-MM-dd"),
          end: format(endOfWeek(today), "yyyy-MM-dd"),
        };
    }
  };

  const dateRange = getDateRange();

  // DB 데이터 조회
  const { reservations: dbReservations, loading: reservationsLoading, refetch: refetchReservations } = useReservations(dateRange.start, dateRange.end);
  const { customers, loading: customersLoading } = useCustomers();
  const { staff, loading: staffLoading } = useStaff();
  const { services, loading: servicesLoading } = useServices();

  // 예약 CRUD 훅
  const { createReservation, creating } = useCreateReservation();
  const { updateReservation, updating } = useUpdateReservation();
  const { deleteReservation, deleting } = useDeleteReservation();

  // 프론트엔드 형식으로 변환
  const reservations = useMemo(() => {
    return dbReservations.map((r) => ({
      id: r.id.toString(),
      customerId: r.customer_id.toString(),
      customerName: r.customer_name,
      customerPhone: r.customer_phone,
      date: r.reservation_date,
      startTime: r.start_time,
      endTime: r.end_time || "",
      services: [
        {
          id: r.service_id.toString(),
          name: r.service_name,
          duration: r.service_duration || 60,
          price: r.service_price,
        },
      ],
      employeeId: r.staff_id?.toString() || "",
      employeeName: r.staff_name || "미지정",
      status: r.status as any,
      memo: r.notes,
      amount: r.service_price,
      createdAt: r.created_at,
    }));
  }, [dbReservations]);

  // 필터링된 예약 목록
  const filteredReservations = useMemo(() => {
    let filtered = [...reservations];

    // 직원 필터
    if (selectedEmployee !== "all") {
      filtered = filtered.filter((r) => r.employeeId === selectedEmployee);
    }

    // 서비스 타입 필터
    if (serviceTypeFilter !== "all") {
      filtered = filtered.filter((r) => r.services.some((s) => s.id === serviceTypeFilter));
    }

    // 상태 필터
    if (statusFilter !== "all") {
      filtered = filtered.filter((r) => r.status === statusFilter);
    }

    // 검색 필터
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.customerName.toLowerCase().includes(query) ||
          r.customerPhone.includes(query) ||
          r.services.some((s) => s.name.toLowerCase().includes(query)) ||
          r.employeeName.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [reservations, selectedEmployee, serviceTypeFilter, statusFilter, searchQuery]);

  // 이벤트 핸들러
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

  const handleAddReservation = async (newReservation: any) => {
    const result = await createReservation({
      customer_id: parseInt(newReservation.customerId),
      staff_id: newReservation.employeeId ? parseInt(newReservation.employeeId) : undefined,
      service_id: parseInt(newReservation.services[0].id),
      reservation_date: newReservation.date,
      start_time: newReservation.startTime,
      end_time: newReservation.endTime,
      status: newReservation.status as any,
      notes: newReservation.memo,
    });

    if (result.success) {
      setShowAddModal(false);
      refetchReservations();
    } else {
      alert(result.error);
    }
  };

  const handleEditReservation = (reservation: any) => {
    setSelectedReservation(reservation);
    setShowEditModal(true);
  };

  const handleUpdateReservation = async (updatedReservation: any) => {
    if (!selectedReservation) return;

    const result = await updateReservation(parseInt(selectedReservation.id), {
      customer_id: parseInt(updatedReservation.customerId),
      staff_id: updatedReservation.employeeId ? parseInt(updatedReservation.employeeId) : undefined,
      service_id: parseInt(updatedReservation.services[0].id),
      reservation_date: updatedReservation.date,
      start_time: updatedReservation.startTime,
      end_time: updatedReservation.endTime,
      status: updatedReservation.status as any,
      notes: updatedReservation.memo,
    });

    if (result.success) {
      setShowEditModal(false);
      setSelectedReservation(null);
      refetchReservations();
    } else {
      alert(result.error);
    }
  };

  const handleDeleteReservation = async (reservationId: string) => {
    if (!confirm("정말로 이 예약을 삭제하시겠습니까?")) return;

    const result = await deleteReservation(parseInt(reservationId));
    if (result.success) {
      refetchReservations();
    } else {
      alert(result.error);
    }
  };

  const handleStatusChange = async (reservationId: string, newStatus: any) => {
    const result = await updateReservation(parseInt(reservationId), {
      status: newStatus,
    });

    if (result.success) {
      refetchReservations();
    } else {
      alert(result.error);
    }
  };

  const getDateRangeText = () => {
    if (dateRangeType === "today") {
      return format(new Date(dateRange.start), "M월 d일");
    } else if (dateRangeType === "custom") {
      return `${format(new Date(dateRange.start), "M/d")} - ${format(new Date(dateRange.end), "M/d")}`;
    } else {
      return `${format(new Date(dateRange.start), "M/d")} - ${format(new Date(dateRange.end), "M/d")}`;
    }
  };

  // Electron 환경이 아닌 경우
  if (!isElectron) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Electron 환경이 필요합니다</h1>
          <p className="mt-2 text-gray-600">이 기능은 Electron 앱에서만 사용할 수 있습니다.</p>
        </div>
      </div>
    );
  }

  // 로딩 중
  if (reservationsLoading || customersLoading || staffLoading || servicesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        title="예약 관리"
        searchBar={
          <div className="w-full md:w-80">
            <SearchBar placeholder="고객명, 연락처, 서비스명 검색..." onSearch={setSearchQuery} />
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <div className="flex rounded-lg bg-gray-100 p-1">
              <button
                onClick={() => setViewMode("calendar")}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                  viewMode === "calendar" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <Calendar size={18} className="mr-1 text-gray-600" />
                <span className="hidden sm:inline">캘린더</span>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                  viewMode === "list" ? "bg-white text-gray-900 shadow-sm" : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <ListChecks size={18} className="mr-1 text-gray-600" />
                <span className="hidden sm:inline">리스트</span>
              </button>
            </div>
            <Button onClick={() => setShowAddModal(true)} className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm">
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
              {/* 날짜 범위 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">날짜 범위:</span>
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
                          <button onClick={() => handleDateRangeSelect("today")} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                            오늘
                          </button>
                          <button onClick={() => handleDateRangeSelect("week")} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                            이번 주
                          </button>
                          <button onClick={() => handleDateRangeSelect("month")} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                            이번 달
                          </button>
                          <button onClick={() => handleDateRangeSelect("lastWeek")} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                            지난 주
                          </button>
                          <button onClick={() => handleDateRangeSelect("lastMonth")} className="rounded-lg bg-gray-100 px-3 py-2 text-sm hover:bg-gray-200">
                            지난 달
                          </button>
                          <button onClick={() => setCustomDateMode(true)} className="rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 hover:bg-blue-200">
                            사용자 지정
                          </button>
                        </div>

                        {customDateMode && (
                          <div className="border-t pt-3">
                            <div className="mb-3 grid grid-cols-2 gap-2">
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">시작일</label>
                                <input
                                  type="date"
                                  value={customStartDate}
                                  onChange={(e) => setCustomStartDate(e.target.value)}
                                  className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                                />
                              </div>
                              <div>
                                <label className="mb-1 block text-xs text-gray-600">종료일</label>
                                <input
                                  type="date"
                                  value={customEndDate}
                                  onChange={(e) => setCustomEndDate(e.target.value)}
                                  className="w-full rounded border border-gray-200 px-2 py-1 text-sm"
                                />
                              </div>
                            </div>
                            <button onClick={handleCustomDateApply} className="w-full rounded-lg bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700">
                              적용
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 직원 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">담당 직원:</span>
                <select
                  value={selectedEmployee}
                  onChange={(e) => setSelectedEmployee(e.target.value)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="all">전체 직원</option>
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 서비스 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">서비스:</span>
                <select
                  value={serviceTypeFilter}
                  onChange={(e) => setServiceTypeFilter(e.target.value)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="all">전체 서비스</option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* 상태 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">상태:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="all">전체 상태</option>
                  <option value="pending">대기</option>
                  <option value="confirmed">확정</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
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
            onAddReservation={() => setShowAddModal(true)}
          />
        ) : (
          <ListView
            reservations={filteredReservations}
            onReservationClick={handleEditReservation}
            onEditReservation={handleEditReservation}
            onDeleteReservation={handleDeleteReservation}
            onStatusChange={handleStatusChange}
            onBulkStatusChange={async () => {}}
            onBulkDelete={async () => {}}
          />
        )}
      </div>

      {/* Modals */}
      <AddReservationModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddReservation}
        customers={customers.map((c) => ({
          id: c.id!.toString(),
          name: c.name,
          phone: c.phone,
          email: c.email || "",
          totalVisits: 0,
        }))}
        staff={staff.map((s) => ({
          id: s.id!.toString(),
          name: s.name,
          position: s.position,
          isActive: true,
        }))}
        services={services.map((s) => ({
          id: s.id!.toString(),
          name: s.name,
          category: s.category || "",
          basePrice: s.price,
          duration: s.duration || 60,
          active: true,
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
          onSave={handleUpdateReservation}
          customers={customers.map((c) => ({
            id: c.id!.toString(),
            name: c.name,
            phone: c.phone,
            email: c.email || "",
            totalVisits: 0,
          }))}
          staff={staff.map((s) => ({
            id: s.id!.toString(),
            name: s.name,
            position: s.position,
            isActive: true,
          }))}
          services={services.map((s) => ({
            id: s.id!.toString(),
            name: s.name,
            category: s.category || "",
            basePrice: s.price,
            duration: s.duration || 60,
            active: true,
          }))}
        />
      )}
    </>
  );
}
