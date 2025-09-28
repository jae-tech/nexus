"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.default = EditReservationModal;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];
function EditReservationModal(_a) {
    var _b;
    var reservation = _a.reservation, onClose = _a.onClose, onSave = _a.onSave, customers = _a.customers, staff = _a.staff, services = _a.services;
    var _c = (0, react_1.useState)(null), selectedCustomer = _c[0], setSelectedCustomer = _c[1];
    var _d = (0, react_1.useState)(reservation.date), selectedDate = _d[0], setSelectedDate = _d[1];
    var _e = (0, react_1.useState)(reservation.startTime), selectedTime = _e[0], setSelectedTime = _e[1];
    var _f = (0, react_1.useState)([]), selectedServices = _f[0], setSelectedServices = _f[1];
    var _g = (0, react_1.useState)(null), selectedEmployee = _g[0], setSelectedEmployee = _g[1];
    var _h = (0, react_1.useState)(reservation.status), selectedStatus = _h[0], setSelectedStatus = _h[1];
    var _j = (0, react_1.useState)(reservation.memo || ''), memo = _j[0], setMemo = _j[1];
    var _k = (0, react_1.useState)(((_b = reservation.amount) === null || _b === void 0 ? void 0 : _b.toString()) || ''), customAmount = _k[0], setCustomAmount = _k[1];
    // 초기 데이터 설정
    (0, react_1.useEffect)(function () {
        // 고객 설정
        var customer = customers.find(function (c) { return c.id.toString() === reservation.customerId; });
        if (customer) {
            setSelectedCustomer(customer);
        }
        // 직원 설정
        var employee = staff.find(function (s) { return s.id === reservation.employeeId; });
        if (employee) {
            setSelectedEmployee(employee);
        }
        // 서비스 설정
        var reservationServices = reservation.services.map(function (resService) {
            return services.find(function (s) { return s.id === resService.id; });
        }).filter(Boolean);
        setSelectedServices(reservationServices);
    }, [reservation, customers, staff, services]);
    // 선택된 서비스들의 총 소요시간 계산
    var totalDuration = selectedServices.reduce(function (sum, service) { return sum + service.duration; }, 0);
    // 종료 시간 계산
    var calculateEndTime = function (startTime, duration) {
        var _a = startTime.split(':').map(Number), hours = _a[0], minutes = _a[1];
        var totalMinutes = hours * 60 + minutes + duration;
        var endHours = Math.floor(totalMinutes / 60);
        var endMinutes = totalMinutes % 60;
        return "".concat(endHours.toString().padStart(2, '0'), ":").concat(endMinutes.toString().padStart(2, '0'));
    };
    // 총 금액 계산
    var totalAmount = selectedServices.reduce(function (sum, service) { return sum + service.price; }, 0);
    var handleServiceToggle = function (service) {
        setSelectedServices(function (prev) {
            var exists = prev.find(function (s) { return s.id === service.id; });
            if (exists) {
                return prev.filter(function (s) { return s.id !== service.id; });
            }
            else {
                return __spreadArray(__spreadArray([], prev, true), [service], false);
            }
        });
    };
    var handleSave = function () {
        if (!selectedCustomer || !selectedEmployee || selectedServices.length === 0) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        var updatedReservation = __assign(__assign({}, reservation), { customerId: selectedCustomer.id.toString(), customerName: selectedCustomer.name, customerPhone: selectedCustomer.phone, date: selectedDate, startTime: selectedTime, endTime: calculateEndTime(selectedTime, totalDuration), services: selectedServices.map(function (service) { return ({
                id: service.id,
                name: service.name,
                duration: service.duration,
                price: service.price
            }); }), employeeId: selectedEmployee.id, employeeName: selectedEmployee.name, status: selectedStatus, memo: memo.trim() || undefined, amount: customAmount ? parseInt(customAmount) : totalAmount });
        onSave(updatedReservation);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">예약 수정</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {/* 고객 정보 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">고객 정보</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-900">{selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.name}</div>
                  <div className="text-sm text-gray-600">{selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.phone}</div>
                </div>
              </div>

              {/* 날짜 및 시간 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">날짜 및 시간</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      날짜
                    </label>
                    <input type="date" value={selectedDate} onChange={function (e) { return setSelectedDate(e.target.value); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시작 시간
                    </label>
                    <select value={selectedTime} onChange={function (e) { return setSelectedTime(e.target.value); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                      {timeSlots.map(function (time) { return (<option key={time} value={time}>{time}</option>); })}
                    </select>
                  </div>
                </div>
              </div>

              {/* 서비스 선택 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">서비스</h3>
                <div className="space-y-4">
                  {['헤어', '네일', '케어'].map(function (category) {
            var categoryServices = services.filter(function (service) { return service.category === category; });
            if (categoryServices.length === 0)
                return null;
            return (<div key={category}>
                        <h4 className="font-medium text-gray-900 mb-2">{category}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {categoryServices.map(function (service) { return (<div key={service.id} onClick={function () { return handleServiceToggle(service); }} className={"p-3 border rounded-lg cursor-pointer transition-colors ".concat(selectedServices.find(function (s) { return s.id === service.id; })
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300')}>
                              <div className="flex items-center justify-between">
                                <div>
                                  <div className="font-medium text-gray-900">{service.name}</div>
                                  <div className="text-sm text-gray-600">
                                    {service.duration}분 · {service.price.toLocaleString()}원
                                  </div>
                                </div>
                                {selectedServices.find(function (s) { return s.id === service.id; }) && (<i className="ri-check-line text-blue-500"></i>)}
                              </div>
                            </div>); })}
                        </div>
                      </div>);
        })}
                </div>
              </div>

              {/* 담당 직원 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">담당 직원</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.map(function (employee) { return (<div key={employee.id} onClick={function () { return setSelectedEmployee(employee); }} className={"p-4 border rounded-lg cursor-pointer transition-colors ".concat((selectedEmployee === null || selectedEmployee === void 0 ? void 0 : selectedEmployee.id) === employee.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300')}>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-gray-600"></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.role}</div>
                        </div>
                      </div>
                    </div>); })}
                </div>
              </div>

              {/* 예약 상태 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">예약 상태</h3>
                <select value={selectedStatus} onChange={function (e) { return setSelectedStatus(e.target.value); }} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="scheduled">예약됨</option>
                  <option value="completed">완료</option>
                  <option value="cancelled">취소</option>
                  <option value="no-show">노쇼</option>
                </select>
              </div>

              {/* 메모 및 금액 */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    메모
                  </label>
                  <textarea value={memo} onChange={function (e) { return setMemo(e.target.value); }} placeholder="특별한 요청사항이나 주의사항" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    금액
                  </label>
                  <input type="number" value={customAmount} onChange={function (e) { return setCustomAmount(e.target.value); }} placeholder={"\uAE30\uBCF8 \uAE08\uC561: ".concat(totalAmount.toLocaleString(), "\uC6D0")} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                </div>
              </div>
            </div>
          </div>

          {/* 하단 버튼 */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end gap-3">
            <button onClick={onClose} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50">
              취소
            </button>
            <button onClick={handleSave} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              저장
            </button>
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">예약 정보</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">고객</div>
              <div className="font-medium text-gray-900">{selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.name}</div>
              <div className="text-sm text-gray-600">{selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.phone}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">일정</div>
              <div className="font-medium text-gray-900">
                {(0, date_fns_1.format)(new Date(selectedDate), 'M월 d일 (E)', { locale: locale_1.ko })}
              </div>
              <div className="text-sm text-gray-600">
                {selectedTime} - {totalDuration > 0 ? calculateEndTime(selectedTime, totalDuration) : '미정'}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">서비스</div>
              {selectedServices.length > 0 ? (<div className="space-y-1">
                  {selectedServices.map(function (service) { return (<div key={service.id} className="text-sm">
                      <div className="font-medium text-gray-900">{service.name}</div>
                      <div className="text-gray-600">{service.duration}분 · {service.price.toLocaleString()}원</div>
                    </div>); })}
                  <div className="pt-2 border-t border-gray-200 mt-2">
                    <div className="text-sm font-medium text-gray-900">
                      총 {totalDuration}분 · {(customAmount ? parseInt(customAmount) : totalAmount).toLocaleString()}원
                    </div>
                  </div>
                </div>) : (<div className="text-gray-500">선택되지 않음</div>)}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">담당 직원</div>
              <div className="font-medium text-gray-900">{selectedEmployee === null || selectedEmployee === void 0 ? void 0 : selectedEmployee.name}</div>
              <div className="text-sm text-gray-600">{selectedEmployee === null || selectedEmployee === void 0 ? void 0 : selectedEmployee.role}</div>
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">상태</div>
              <div className={"inline-flex px-2 py-1 rounded-full text-xs font-medium ".concat(selectedStatus === 'scheduled' ? 'bg-blue-100 text-blue-800' :
            selectedStatus === 'completed' ? 'bg-green-100 text-green-800' :
                selectedStatus === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800')}>
                {selectedStatus === 'scheduled' ? '예약됨' :
            selectedStatus === 'completed' ? '완료' :
                selectedStatus === 'cancelled' ? '취소' : '노쇼'}
              </div>
            </div>

            {memo && (<div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-sm text-gray-600 mb-1">메모</div>
                <div className="text-sm text-gray-900">{memo}</div>
              </div>)}
          </div>
        </div>
      </div>
    </div>);
}
