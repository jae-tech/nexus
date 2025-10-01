
import { useState } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowDown, ArrowUp, Edit, Trash2, Calendar, MessageSquare } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@nexus/ui";

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

interface ListViewProps {
  reservations: Reservation[];
  onReservationClick: (reservation: Reservation) => void;
  onEditReservation: (reservation: Reservation) => void;
  onStatusChange: (reservationId: string, status: Reservation['status']) => void;
  onDeleteReservation: (reservationId: string, reason?: string) => void;
  onBulkStatusChange: (reservationIds: string[], status: Reservation['status']) => void;
  onBulkDelete: (reservationIds: string[]) => void;
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
  reservations,
  onReservationClick,
  onEditReservation,
  onStatusChange,
  onDeleteReservation,
  onBulkStatusChange,
  onBulkDelete
}: ListViewProps) {
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteReservationId, setDeleteReservationId] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  
  const itemsPerPage = 10;

  // 정렬 처리
  const sortedReservations = [...reservations].sort((a, b) => {
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
  const totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedReservations = sortedReservations.slice(startIndex, startIndex + itemsPerPage);

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
      setSelectedIds(paginatedReservations.map(r => r.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds(prev => [...prev, id]);
    } else {
      setSelectedIds(prev => prev.filter(selectedId => selectedId !== id));
    }
  };

  const handleStatusChange = (reservationId: string, newStatus: Reservation['status']) => {
    onStatusChange(reservationId, newStatus);
  };

  const handleDeleteClick = (reservationId: string) => {
    setDeleteReservationId(reservationId);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    if (deleteReservationId) {
      onDeleteReservation(deleteReservationId, deleteReason);
      setShowDeleteModal(false);
      setDeleteReservationId(null);
      setDeleteReason('');
    }
  };

  const handleBulkAction = (action: 'status' | 'delete', value?: string) => {
    if (selectedIds.length === 0) {
      alert('선택된 예약이 없습니다.');
      return;
    }

    if (action === 'status' && value) {
      onBulkStatusChange(selectedIds, value as Reservation['status']);
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
    <div className="bg-white rounded-lg border border-gray-200">
      {/* 일괄 작업 툴바 */}
      {selectedIds.length > 0 && (
        <div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length}개 선택됨
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button
                  onClick={() => setShowBulkActions(!showBulkActions)}
                  className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1"
                >
                  일괄 작업
                  <ArrowDown size={16} />
                </button>
                {showBulkActions && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowBulkActions(false)}></div>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">상태 변경</div>
                        <button
                          onClick={() => handleBulkAction('status', 'completed')}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          완료로 변경
                        </button>
                        <button
                          onClick={() => handleBulkAction('status', 'cancelled')}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          취소로 변경
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button
                          onClick={() => handleBulkAction('delete')}
                          className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                        >
                          <Trash2 size={16} />
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
            className="text-blue-600 hover:text-blue-800 text-sm"
          >
            선택 해제
          </button>
        </div>
      )}

      {/* 테이블 헤더 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedIds.length === paginatedReservations.length && paginatedReservations.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-gray-300 text-blue-600 focus-ring"
                />
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center gap-1">
                  날짜/시간
                  {sortField === 'date' && (
                    sortDirection === 'asc' ? <ArrowUp size={16} className="text-gray-400" /> : <ArrowDown size={16} className="text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('customerName')}
              >
                <div className="flex items-center gap-1">
                  고객명
                  {sortField === 'customerName' && (
                    sortDirection === 'asc' ? <ArrowUp size={16} className="text-gray-400" /> : <ArrowDown size={16} className="text-gray-400" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서비스
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('employeeName')}
              >
                <div className="flex items-center gap-1">
                  담당직원
                  {sortField === 'employeeName' && (
                    sortDirection === 'asc' ? <ArrowUp size={16} className="text-gray-400" /> : <ArrowDown size={16} className="text-gray-400" />
                  )}
                </div>
              </th>
              <th 
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('status')}
              >
                <div className="flex items-center gap-1">
                  상태
                  {sortField === 'status' && (
                    sortDirection === 'asc' ? <ArrowUp size={16} className="text-gray-400" /> : <ArrowDown size={16} className="text-gray-400" />
                  )}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                금액
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {paginatedReservations.map((reservation) => (
              <tr 
                key={reservation.id} 
                className={`hover:bg-gray-50 cursor-pointer ${selectedIds.includes(reservation.id) ? 'bg-blue-50' : ''}`}
                onClick={() => onReservationClick(reservation)}
              >
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(reservation.id)}
                    onChange={(e) => handleSelectOne(reservation.id, e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus-ring"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {format(new Date(reservation.date), 'M월 d일 (E)', { locale: ko })}
                  </div>
                  <div className="text-sm text-gray-500">
                    {reservation.startTime} - {reservation.endTime}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.customerName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2">
                    <a 
                      href={`tel:${reservation.customerPhone}`}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                      title="전화걸기"
                    >
                      {reservation.customerPhone}
                    </a>
                    <button
                      onClick={() => sendSMS(reservation.customerPhone)}
                      className="text-gray-400 hover:text-gray-600 transition-colors"
                      title="SMS 보내기"
                    >
                      <MessageSquare size={14} />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {reservation.services.map(service => service.name).join(', ')}
                  </div>
                  {reservation.memo && (
                    <div className="text-sm text-gray-500 mt-1 truncate max-w-[200px]">
                      {reservation.memo}
                    </div>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.employeeName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                  <Select
                    value={reservation.status}
                    onValueChange={(value) => handleStatusChange(reservation.id, value as Reservation['status'])}
                  >
                    <SelectTrigger className={`text-xs font-medium px-2 py-1 rounded-full border-0 ${getStatusColor(reservation.status)} w-auto`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">예약됨</SelectItem>
                      <SelectItem value="completed">완료</SelectItem>
                      <SelectItem value="cancelled">취소</SelectItem>
                      <SelectItem value="no-show">노쇼</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.amount ? `${reservation.amount.toLocaleString()}원` : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEditReservation(reservation)}
                      className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                      title="수정"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteClick(reservation.id)}
                      className="text-red-600 hover:text-red-800 transition-colors p-1"
                      title="삭제"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 빈 상태 */}
      {reservations.length === 0 && (
        <div className="text-center py-12">
          <Calendar size={48} className="text-gray-300 mb-4 mx-auto" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">예약이 없습니다</h3>
          <p className="text-gray-500">새로운 예약을 추가해보세요.</p>
        </div>
      )}

      {/* 페이지네이션 */}
      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              총 {reservations.length}건 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, reservations.length)}건 표시
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
                      className={`px-3 py-1 text-sm border rounded-md ${
                        currentPage === pageNum
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>

              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                다음
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">예약 삭제</h3>
            </div>
            
            <div className="p-6">
              <p className="text-gray-700 mb-4">
                정말로 이 예약을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  삭제 사유 (선택사항)
                </label>
                <Select
                  value={deleteReason}
                  onValueChange={(value) => setDeleteReason(value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="사유 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="customer_cancel">고객 취소</SelectItem>
                    <SelectItem value="staff_unavailable">직원 사정</SelectItem>
                    <SelectItem value="duplicate">중복 예약</SelectItem>
                    <SelectItem value="other">기타</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteReservationId(null);
                  setDeleteReason('');
                }}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
