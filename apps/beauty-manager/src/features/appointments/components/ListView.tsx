import { useState } from 'react';
import { Calendar, ChevronDown, MessageSquare, Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface Appointment {
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

interface ListViewProps {
  appointments: Appointment[];
  onAppointmentClick: (appointment: Appointment) => void;
  onEditAppointment: (appointment: Appointment) => void;
  onStatusChange: (
    appointmentId: string,
    status: Appointment['status']
  ) => void;
  onDeleteAppointment: (appointmentId: string, reason?: string) => void;
  onBulkStatusChange: (
    appointmentIds: string[],
    status: Appointment['status']
  ) => void;
  onBulkDelete: (appointmentIds: string[]) => void;
}

type SortField = 'date' | 'customerName' | 'employeeName' | 'status';
type SortDirection = 'asc' | 'desc';

const getStatusColor = (status: string) => {
  switch (status) {
    case 'scheduled':
      return 'bg-blue-100 text-blue-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    case 'no-show':
      return 'bg-gray-100 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusText = (status: string) => {
  switch (status) {
    case 'scheduled':
      return '예약됨';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    case 'no-show':
      return '노쇼';
    default:
      return '알 수 없음';
  }
};

export default function ListView({
  appointments,
  onAppointmentClick,
  onEditAppointment,
  onStatusChange,
  onDeleteAppointment,
  onBulkStatusChange,
  onBulkDelete,
}: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteAppointmentId, setDeleteAppointmentId] = useState<string | null>(
    null
  );
  const [deleteReason, setDeleteReason] = useState('');

  const itemsPerPage = 10;

  // 정렬 처리
  const sortedAppointments = [...appointments].sort((a, b) => {
    let aValue: string | number;
    let bValue: string | number;

    switch (sortField) {
      case 'date':
        aValue = `${a.date} ${a.startTime}`;
        bValue = `${b.date} ${b.startTime}`;
        break;
      case 'customerName':
        aValue = a.customerName;
        bValue = b.customerName;
        break;
      case 'employeeName':
        aValue = a.employeeName;
        bValue = b.employeeName;
        break;
      case 'status':
        aValue = a.status;
        bValue = b.status;
        break;
      default:
        aValue = a.date;
        bValue = b.date;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedAppointments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedAppointments = sortedAppointments.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedAppointments.map((r) => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((selectedId) => selectedId !== id));
    }
  };

  const handleStatusChange = (
    appointmentId: string,
    newStatus: Appointment['status']
  ) => {
    onStatusChange(appointmentId, newStatus);
  };

  const handleDeleteClick = (appointmentId: string) => {
    setDeleteAppointmentId(appointmentId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteAppointmentId) {
      onDeleteAppointment(deleteAppointmentId, deleteReason);
      setShowDeleteModal(false);
      setDeleteAppointmentId(null);
      setDeleteReason('');
    }
  };

  const handleBulkAction = (action: 'status' | 'delete', value?: string) => {
    if (selectedIds.length === 0) {
      alert('선택된 예약이 없습니다.');
      return;
    }

    if (action === 'status' && value) {
      onBulkStatusChange(selectedIds, value as Appointment['status']);
      setSelectedIds([]);
      setShowBulkActions(false);
    } else if (action === 'delete') {
      onBulkDelete(selectedIds);
      setSelectedIds([]);
      setShowBulkActions(false);
    }
  };

  const sendSMS = (phone: string) => {
    window.open(`sms:${phone}`, '_blank');
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white">
      {/* 일괄 작업 툴바 */}
      {selectedIds.length > 0 && (
        <div className="flex items-center justify-between border-b border-blue-200 bg-blue-50 px-6 py-3">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length}개 선택됨
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="flex items-center gap-1 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
                >
                  일괄 작업
                  <ChevronDown size={18} className="text-gray-600" />
                </button>
                {showBulkActions && (
                  <>
                    <div
                      className="fixed inset-0 z-10"
                      onClick={() => setShowBulkActions(false)}
                    />
                    <div className="absolute left-0 top-full z-20 mt-1 min-w-[160px] rounded-lg border border-gray-200 bg-white shadow-lg">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs font-medium uppercase tracking-wider text-gray-500">
                          상태 변경
                        </div>
                        <button
                          onClick={() =>
                            handleBulkAction('status', 'completed')
                          }
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <div className="h-2 w-2 rounded-full bg-green-400" />
                          완료로 변경
                        </button>
                        <button
                          onClick={() =>
                            handleBulkAction('status', 'cancelled')
                          }
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-gray-50"
                        >
                          <div className="h-2 w-2 rounded-full bg-red-400" />
                          취소로 변경
                        </button>
                        <div className="my-1 border-t border-gray-100" />
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-gray-50"
                        >
                          <Trash2 size={20} className="text-gray-600 hover:text-red-600" />
                          일괄 삭제
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedIds([])}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* 테이블 헤더 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={
                    selectedIds.length === paginatedAppointments.length &&
                    paginatedAppointments.length > 0
                  }
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  날짜/시간
                  {sortField === 'date' && (
                    <i
                      className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line text-gray-400`}
                    />
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-1">
                  고객명
                  {sortField === 'customerName' && (
                    <i
                      className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line text-gray-400`}
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                서비스
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('employeeName')}
              >
                <div className="flex items-center gap-1">
                  담당직원
                  {sortField === 'employeeName' && (
                    <i
                      className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line text-gray-400`}
                    />
                  )}
                </div>
              </th>
              <th
                className="cursor-pointer px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500 hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  상태
                  {sortField === 'status' && (
                    <i
                      className={`ri-arrow-${sortDirection === 'asc' ? 'up' : 'down'}-line text-gray-400`}
                    />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {paginatedAppointments.map((appointment) => (
              <tr
                key={appointment.id}
                className={`cursor-pointer hover:bg-gray-50 ${selectedIds.includes(appointment.id) ? 'bg-blue-50' : ''}`}
                onClick={() => onAppointmentClick(appointment)}
              >
                <td
                  className="whitespace-nowrap px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(appointment.id)}
                    onChange={(e) =>
                      handleSelectOne(appointment.id, e.target.checked)
                    }
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(appointment.date), 'M월 d일 (E)', {
                      locale: ko,
                    })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {appointment.startTime} - {appointment.endTime}
                  </div>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.customerName}
                  </div>
                </td>
                <td
                  className="whitespace-nowrap px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${appointment.customerPhone}`}
                      className="text-sm text-blue-600 hover:text-blue-800"
                      title="전화걸기"
                    >
                      {appointment.customerPhone}
                    </a>
                    <button
                      onClick={() => sendSMS(appointment.customerPhone)}
                      className="text-gray-400 transition-colors hover:text-gray-600"
                      title="SMS 보내기"
                    >
                      <MessageSquare className="h-4 w-4" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {appointment.services
                      .map((service) => service.name)
                      .join(', ')}
                  </div>
                  {appointment.memo && (
                    <div className="mt-1 max-w-[200px] truncate text-sm text-gray-500">
                      {appointment.memo}
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {appointment.employeeName}
                  </div>
                </td>
                <td
                  className="whitespace-nowrap px-6 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <select
                    value={appointment.status}
                    onChange={(e) =>
                      handleStatusChange(
                        appointment.id,
                        e.target.value as Appointment['status']
                      )
                    }
                    className={`cursor-pointer rounded-full border-0 px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-blue-500 ${getStatusColor(appointment.status)}`}
                  >
                    <option value="scheduled">예약됨</option>
                    <option value="completed">완료</option>
                    <option value="cancelled">취소</option>
                    <option value="no-show">노쇼</option>
                  </select>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {appointment.amount
                      ? `${appointment.amount.toLocaleString()}원`
                      : '-'}
                  </div>
                </td>
                <td
                  className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditAppointment(appointment)}
                      className="p-1 text-blue-600 transition-colors hover:text-blue-800"
                      title="수정"
                    >
                      <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(appointment.id)}
                      className="p-1 text-red-600 transition-colors hover:text-red-800"
                      title="삭제"
                    >
                      <Trash2 size={20} className="text-gray-600 hover:text-red-600" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 빈 상태 */}
      {appointments.length === 0 && (
        <div className="py-12 text-center">
          <Calendar size={18} className="mb-4 text-gray-600" />
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            예약이 없습니다
          </h3>
          <p className="text-gray-500">새로운 예약을 추가해보세요.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              총 {appointments.length}건 중 {startIndex + 1}-
              {Math.min(startIndex + itemsPerPage, appointments.length)}건 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                이전
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }

                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`rounded-md border px-3 py-1 text-sm ${
                        currentPage === pageNum
                          ? 'border-blue-500 bg-blue-500 text-white'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                disabled={currentPage === totalPages}
                className="rounded-md border border-gray-300 px-3 py-1 text-sm hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">예약 삭제</h3>
            </div>

            <div className="p-6">
              <p className="mb-4 text-gray-700">
                정말로 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  삭제 사유 (선택사항)
                </label>
                <select
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">사유 선택</option>
                  <option value="customer_cancel">고객 취소</option>
                  <option value="staff_unavailable">직원 사정</option>
                  <option value="duplicate">중복 예약</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteAppointmentId(null);
                  setDeleteReason('');
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
