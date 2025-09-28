"use strict";
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
exports.default = ListView;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var getStatusColor = function (status) {
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
var getStatusText = function (status) {
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
function ListView(_a) {
    var reservations = _a.reservations, onReservationClick = _a.onReservationClick, onEditReservation = _a.onEditReservation, onStatusChange = _a.onStatusChange, onDeleteReservation = _a.onDeleteReservation, onBulkStatusChange = _a.onBulkStatusChange, onBulkDelete = _a.onBulkDelete;
    var _b = (0, react_1.useState)('date'), sortField = _b[0], setSortField = _b[1];
    var _c = (0, react_1.useState)('asc'), sortDirection = _c[0], setSortDirection = _c[1];
    var _d = (0, react_1.useState)(1), currentPage = _d[0], setCurrentPage = _d[1];
    var _e = (0, react_1.useState)([]), selectedIds = _e[0], setSelectedIds = _e[1];
    var _f = (0, react_1.useState)(false), showBulkActions = _f[0], setShowBulkActions = _f[1];
    var _g = (0, react_1.useState)(false), showDeleteModal = _g[0], setShowDeleteModal = _g[1];
    var _h = (0, react_1.useState)(null), deleteReservationId = _h[0], setDeleteReservationId = _h[1];
    var _j = (0, react_1.useState)(''), deleteReason = _j[0], setDeleteReason = _j[1];
    var itemsPerPage = 10;
    // 정렬 처리
    var sortedReservations = __spreadArray([], reservations, true).sort(function (a, b) {
        var aValue;
        var bValue;
        switch (sortField) {
            case 'date':
                aValue = "".concat(a.date, " ").concat(a.startTime);
                bValue = "".concat(b.date, " ").concat(b.startTime);
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
        }
        else {
            return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
    });
    // 페이지네이션
    var totalPages = Math.ceil(sortedReservations.length / itemsPerPage);
    var startIndex = (currentPage - 1) * itemsPerPage;
    var paginatedReservations = sortedReservations.slice(startIndex, startIndex + itemsPerPage);
    var handleSort = function (field) {
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        }
        else {
            setSortField(field);
            setSortDirection('asc');
        }
    };
    var handleSelectAll = function (checked) {
        if (checked) {
            setSelectedIds(paginatedReservations.map(function (r) { return r.id; }));
        }
        else {
            setSelectedIds([]);
        }
    };
    var handleSelectOne = function (id, checked) {
        if (checked) {
            setSelectedIds(function (prev) { return __spreadArray(__spreadArray([], prev, true), [id], false); });
        }
        else {
            setSelectedIds(function (prev) { return prev.filter(function (selectedId) { return selectedId !== id; }); });
        }
    };
    var handleStatusChange = function (reservationId, newStatus) {
        onStatusChange(reservationId, newStatus);
    };
    var handleDeleteClick = function (reservationId) {
        setDeleteReservationId(reservationId);
        setShowDeleteModal(true);
    };
    var handleConfirmDelete = function () {
        if (deleteReservationId) {
            onDeleteReservation(deleteReservationId, deleteReason);
            setShowDeleteModal(false);
            setDeleteReservationId(null);
            setDeleteReason('');
        }
    };
    var handleBulkAction = function (action, value) {
        if (selectedIds.length === 0) {
            alert('선택된 예약이 없습니다.');
            return;
        }
        if (action === 'status' && value) {
            onBulkStatusChange(selectedIds, value);
            setSelectedIds([]);
            setShowBulkActions(false);
        }
        else if (action === 'delete') {
            onBulkDelete(selectedIds);
            setSelectedIds([]);
            setShowBulkActions(false);
        }
    };
    var sendSMS = function (phone) {
        window.open("sms:".concat(phone), '_blank');
    };
    return (<div className="bg-white rounded-lg border border-gray-200">
      {/* 일괄 작업 툴바 */}
      {selectedIds.length > 0 && (<div className="px-6 py-3 bg-blue-50 border-b border-blue-200 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-blue-900">
              {selectedIds.length}개 선택됨
            </span>
            <div className="flex items-center gap-2">
              <div className="relative">
                <button onClick={function () { return setShowBulkActions(!showBulkActions); }} className="px-3 py-1.5 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 flex items-center gap-1">
                  일괄 작업
                  <i className="ri-arrow-down-s-line"></i>
                </button>
                {showBulkActions && (<>
                    <div className="fixed inset-0 z-10" onClick={function () { return setShowBulkActions(false); }}></div>
                    <div className="absolute top-full left-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-20 min-w-[160px]">
                      <div className="py-1">
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider">상태 변경</div>
                        <button onClick={function () { return handleBulkAction('status', 'completed'); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          완료로 변경
                        </button>
                        <button onClick={function () { return handleBulkAction('status', 'cancelled'); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-2">
                          <div className="w-2 h-2 bg-red-400 rounded-full"></div>
                          취소로 변경
                        </button>
                        <div className="border-t border-gray-100 my-1"></div>
                        <button onClick={function () { return handleBulkAction('delete'); }} className="w-full px-3 py-2 text-left text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2">
                          <i className="ri-delete-bin-line"></i>
                          일괄 삭제
                        </button>
                      </div>
                    </div>
                  </>)}
              </div>
            </div>
          </div>
          <button onClick={function () { return setSelectedIds([]); }} className="text-blue-600 hover:text-blue-800 text-sm">
            선택 해제
          </button>
        </div>)}

      {/* 테이블 헤더 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left">
                <input type="checkbox" checked={selectedIds.length === paginatedReservations.length && paginatedReservations.length > 0} onChange={function (e) { return handleSelectAll(e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={function () { return handleSort('date'); }}>
                <div className="flex items-center gap-1">
                  날짜/시간
                  {sortField === 'date' && (<i className={"ri-arrow-".concat(sortDirection === 'asc' ? 'up' : 'down', "-line text-gray-400")}></i>)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={function () { return handleSort('customerName'); }}>
                <div className="flex items-center gap-1">
                  고객명
                  {sortField === 'customerName' && (<i className={"ri-arrow-".concat(sortDirection === 'asc' ? 'up' : 'down', "-line text-gray-400")}></i>)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                연락처
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서비스
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={function () { return handleSort('employeeName'); }}>
                <div className="flex items-center gap-1">
                  담당직원
                  {sortField === 'employeeName' && (<i className={"ri-arrow-".concat(sortDirection === 'asc' ? 'up' : 'down', "-line text-gray-400")}></i>)}
                </div>
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100" onClick={function () { return handleSort('status'); }}>
                <div className="flex items-center gap-1">
                  상태
                  {sortField === 'status' && (<i className={"ri-arrow-".concat(sortDirection === 'asc' ? 'up' : 'down', "-line text-gray-400")}></i>)}
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
            {paginatedReservations.map(function (reservation) { return (<tr key={reservation.id} className={"hover:bg-gray-50 cursor-pointer ".concat(selectedIds.includes(reservation.id) ? 'bg-blue-50' : '')} onClick={function () { return onReservationClick(reservation); }}>
                <td className="px-6 py-4 whitespace-nowrap" onClick={function (e) { return e.stopPropagation(); }}>
                  <input type="checkbox" checked={selectedIds.includes(reservation.id)} onChange={function (e) { return handleSelectOne(reservation.id, e.target.checked); }} className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"/>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {(0, date_fns_1.format)(new Date(reservation.date), 'M월 d일 (E)', { locale: locale_1.ko })}
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
                <td className="px-6 py-4 whitespace-nowrap" onClick={function (e) { return e.stopPropagation(); }}>
                  <div className="flex items-center gap-2">
                    <a href={"tel:".concat(reservation.customerPhone)} className="text-blue-600 hover:text-blue-800 text-sm" title="전화걸기">
                      {reservation.customerPhone}
                    </a>
                    <button onClick={function () { return sendSMS(reservation.customerPhone); }} className="text-gray-400 hover:text-gray-600 transition-colors" title="SMS 보내기">
                      <i className="ri-message-2-line text-sm"></i>
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">
                    {reservation.services.map(function (service) { return service.name; }).join(', ')}
                  </div>
                  {reservation.memo && (<div className="text-sm text-gray-500 mt-1 truncate max-w-[200px]">
                      {reservation.memo}
                    </div>)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {reservation.employeeName}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap" onClick={function (e) { return e.stopPropagation(); }}>
                  <select value={reservation.status} onChange={function (e) { return handleStatusChange(reservation.id, e.target.value); }} className={"text-xs font-medium px-2 py-1 rounded-full border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ".concat(getStatusColor(reservation.status))}>
                    <option value="scheduled">예약됨</option>
                    <option value="completed">완료</option>
                    <option value="cancelled">취소</option>
                    <option value="no-show">노쇼</option>
                  </select>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {reservation.amount ? "".concat(reservation.amount.toLocaleString(), "\uC6D0") : '-'}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium" onClick={function (e) { return e.stopPropagation(); }}>
                  <div className="flex items-center justify-end gap-2">
                    <button onClick={function () { return onEditReservation(reservation); }} className="text-blue-600 hover:text-blue-800 transition-colors p-1" title="수정">
                      <i className="ri-edit-line"></i>
                    </button>
                    <button onClick={function () { return handleDeleteClick(reservation.id); }} className="text-red-600 hover:text-red-800 transition-colors p-1" title="삭제">
                      <i className="ri-delete-bin-line"></i>
                    </button>
                  </div>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>

      {/* 빈 상태 */}
      {reservations.length === 0 && (<div className="text-center py-12">
          <i className="ri-calendar-line text-4xl text-gray-300 mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">예약이 없습니다</h3>
          <p className="text-gray-500">새로운 예약을 추가해보세요.</p>
        </div>)}

      {/* 페이지네이션 */}
      {totalPages > 1 && (<div className="px-6 py-4 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-700">
              총 {reservations.length}건 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, reservations.length)}건 표시
            </div>
            <div className="flex items-center gap-2">
              <button onClick={function () { return setCurrentPage(Math.max(1, currentPage - 1)); }} disabled={currentPage === 1} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                이전
              </button>
              
              <div className="flex items-center gap-1">
                {Array.from({ length: Math.min(5, totalPages) }, function (_, i) {
                var pageNum;
                if (totalPages <= 5) {
                    pageNum = i + 1;
                }
                else if (currentPage <= 3) {
                    pageNum = i + 1;
                }
                else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                }
                else {
                    pageNum = currentPage - 2 + i;
                }
                return (<button key={pageNum} onClick={function () { return setCurrentPage(pageNum); }} className={"px-3 py-1 text-sm border rounded-md ".concat(currentPage === pageNum
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'border-gray-300 hover:bg-gray-50')}>
                      {pageNum}
                    </button>);
            })}
              </div>

              <button onClick={function () { return setCurrentPage(Math.min(totalPages, currentPage + 1)); }} disabled={currentPage === totalPages} className="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                다음
              </button>
            </div>
          </div>
        </div>)}

      {/* 삭제 확인 모달 */}
      {showDeleteModal && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
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
                <select value={deleteReason} onChange={function (e) { return setDeleteReason(e.target.value); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="">사유 선택</option>
                  <option value="customer_cancel">고객 취소</option>
                  <option value="staff_unavailable">직원 사정</option>
                  <option value="duplicate">중복 예약</option>
                  <option value="other">기타</option>
                </select>
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
              <button onClick={function () {
                setShowDeleteModal(false);
                setDeleteReservationId(null);
                setDeleteReason('');
            }} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
                취소
              </button>
              <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">
                삭제
              </button>
            </div>
          </div>
        </div>)}
    </div>);
}
