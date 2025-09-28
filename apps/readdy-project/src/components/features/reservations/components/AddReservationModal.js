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
exports.default = AddReservationModal;
var react_1 = require("react");
var date_fns_1 = require("date-fns");
var locale_1 = require("date-fns/locale");
var timeSlots = [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00'
];
function AddReservationModal(_a) {
    var onClose = _a.onClose, onAdd = _a.onAdd, customers = _a.customers, staff = _a.staff, services = _a.services;
    var _b = (0, react_1.useState)(1), step = _b[0], setStep = _b[1];
    var _c = (0, react_1.useState)(null), selectedCustomer = _c[0], setSelectedCustomer = _c[1];
    var _d = (0, react_1.useState)(''), customerSearch = _d[0], setCustomerSearch = _d[1];
    var _e = (0, react_1.useState)((0, date_fns_1.format)(new Date(), 'yyyy-MM-dd')), selectedDate = _e[0], setSelectedDate = _e[1];
    var _f = (0, react_1.useState)('10:00'), selectedTime = _f[0], setSelectedTime = _f[1];
    var _g = (0, react_1.useState)([]), selectedServices = _g[0], setSelectedServices = _g[1];
    var _h = (0, react_1.useState)(null), selectedEmployee = _h[0], setSelectedEmployee = _h[1];
    var _j = (0, react_1.useState)(''), memo = _j[0], setMemo = _j[1];
    var _k = (0, react_1.useState)(''), customAmount = _k[0], setCustomAmount = _k[1];
    var _l = (0, react_1.useState)(false), showNewCustomerForm = _l[0], setShowNewCustomerForm = _l[1];
    var _m = (0, react_1.useState)({
        name: '',
        phone: '',
        gender: '여성',
        birthday: '',
        memo: ''
    }), newCustomer = _m[0], setNewCustomer = _m[1];
    // 검색된 고객 목록
    var filteredCustomers = customers.filter(function (customer) {
        return customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
            customer.phone.includes(customerSearch);
    });
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
    var handleNext = function () {
        if (step < 5)
            setStep(step + 1);
    };
    var handlePrev = function () {
        if (step > 1)
            setStep(step - 1);
    };
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
    var handleNewCustomerSubmit = function () {
        if (!newCustomer.name || !newCustomer.phone) {
            alert('이름과 전화번호는 필수입니다.');
            return;
        }
        // 전화번호 중복 체크
        var existingCustomer = customers.find(function (c) { return c.phone === newCustomer.phone; });
        if (existingCustomer) {
            alert('이미 등록된 전화번호입니다.');
            return;
        }
        var customer = __assign(__assign({ id: Date.now() }, newCustomer), { registeredDate: new Date().toISOString().split('T')[0], visitCount: 0, lastVisit: '', lastService: '', mainStaff: '' });
        setSelectedCustomer(customer);
        setShowNewCustomerForm(false);
        setNewCustomer({ name: '', phone: '', gender: '여성', birthday: '', memo: '' });
    };
    var handleSave = function () {
        if (!selectedCustomer || !selectedEmployee || selectedServices.length === 0) {
            alert('필수 정보를 모두 입력해주세요.');
            return;
        }
        var reservation = {
            customerId: selectedCustomer.id.toString(),
            customerName: selectedCustomer.name,
            customerPhone: selectedCustomer.phone,
            date: selectedDate,
            startTime: selectedTime,
            endTime: calculateEndTime(selectedTime, totalDuration),
            services: selectedServices.map(function (service) { return ({
                id: service.id,
                name: service.name,
                duration: service.duration,
                price: service.price
            }); }),
            employeeId: selectedEmployee.id,
            employeeName: selectedEmployee.name,
            status: 'scheduled',
            memo: memo.trim() || undefined,
            amount: customAmount ? parseInt(customAmount, 10) : totalAmount
        };
        onAdd(reservation);
    };
    var canProceed = function () {
        switch (step) {
            case 1: return selectedCustomer !== null;
            case 2: return !!selectedDate && !!selectedTime;
            case 3: return selectedServices.length > 0;
            case 4: return selectedEmployee !== null;
            case 5: return true;
            default: return false;
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex">
        {/* 메인 컨텐츠 */}
        <div className="flex-1 flex flex-col">
          {/* 헤더 */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">새 예약 추가</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* 진행 단계 */}
            <div className="flex items-center mt-4">
              {[1, 2, 3, 4, 5].map(function (stepNum) { return (<div key={stepNum} className="flex items-center">
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ".concat(stepNum === step ? 'bg-blue-500 text-white' :
                stepNum < step ? 'bg-green-500 text-white' :
                    'bg-gray-200 text-gray-600')}>
                    {stepNum < step ? <i className="ri-check-line"></i> : stepNum}
                  </div>
                  {stepNum < 5 && (<div className={"w-12 h-1 mx-2 ".concat(stepNum < step ? 'bg-green-500' : 'bg-gray-200')}></div>)}
                </div>); })}
            </div>
          </div>

          {/* 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            {/* Step 1: 고객 선택 */}
            {step === 1 && (<div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">고객 선택</h3>
                
                {!showNewCustomerForm ? (<>
                    <div className="mb-4 flex gap-2">
                      <input type="text" placeholder="고객명 또는 전화번호로 검색" value={customerSearch} onChange={function (e) { return setCustomerSearch(e.target.value); }} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      <button onClick={function () { return setShowNewCustomerForm(true); }} className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors">
                        신규 등록
                      </button>
                    </div>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {filteredCustomers.map(function (customer) { return (<div key={customer.id} onClick={function () { return setSelectedCustomer(customer); }} className={"p-4 border rounded-lg cursor-pointer transition-colors ".concat((selectedCustomer === null || selectedCustomer === void 0 ? void 0 : selectedCustomer.id) === customer.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300')}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-gray-900">{customer.name}</div>
                              <div className="text-sm text-gray-600">{customer.phone}</div>
                              <div className="text-sm text-gray-500">
                                최근 방문: {customer.lastVisit || '없음'} ({customer.lastService || '없음'})
                              </div>
                            </div>
                            <div className="text-sm text-gray-500">
                              방문 {customer.visitCount}회
                            </div>
                          </div>
                        </div>); })}
                    </div>
                  </>) : (<div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="text-md font-medium text-gray-900">신규 고객 등록</h4>
                      <button onClick={function () { return setShowNewCustomerForm(false); }} className="text-gray-500 hover:text-gray-700">
                        <i className="ri-close-line"></i>
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          이름 *
                        </label>
                        <input type="text" value={newCustomer.name} onChange={function (e) { return setNewCustomer(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="고객 이름"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          전화번호 *
                        </label>
                        <input type="tel" value={newCustomer.phone} onChange={function (e) { return setNewCustomer(function (prev) { return (__assign(__assign({}, prev), { phone: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="010-0000-0000"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          성별
                        </label>
                        <select value={newCustomer.gender} onChange={function (e) { return setNewCustomer(function (prev) { return (__assign(__assign({}, prev), { gender: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="여성">여성</option>
                          <option value="남성">남성</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          생년월일
                        </label>
                        <input type="date" value={newCustomer.birthday} onChange={function (e) { return setNewCustomer(function (prev) { return (__assign(__assign({}, prev), { birthday: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        메모
                      </label>
                      <textarea value={newCustomer.memo} onChange={function (e) { return setNewCustomer(function (prev) { return (__assign(__assign({}, prev), { memo: e.target.value })); }); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="특이사항이나 메모를 입력하세요"/>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={handleNewCustomerSubmit} className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        등록하고 선택
                      </button>
                      <button onClick={function () { return setShowNewCustomerForm(false); }} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors">
                        취소
                      </button>
                    </div>
                  </div>)}
              </div>)}

            {/* Step 2: 날짜/시간 선택 */}
            {step === 2 && (<div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">날짜 및 시간 선택</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      날짜
                    </label>
                    <input type="date" value={selectedDate} onChange={function (e) { return setSelectedDate(e.target.value); }} min={(0, date_fns_1.format)(new Date(), 'yyyy-MM-dd')} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
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
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <div className="text-sm text-blue-800">
                    <i className="ri-calendar-line mr-1"></i>
                    선택된 일정: {(0, date_fns_1.format)(new Date(selectedDate), 'yyyy년 M월 d일 EEEE', { locale: locale_1.ko })} {selectedTime}
                  </div>
                </div>
              </div>)}

            {/* Step 3: 서비스 선택 */}
            {step === 3 && (<div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">서비스 선택</h3>
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

                {selectedServices.length > 0 && (<div className="mt-4 p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800">
                      <div className="font-medium mb-1">선택된 서비스:</div>
                      {selectedServices.map(function (service) { return (<div key={service.id}>• {service.name} ({service.duration}분, {service.price.toLocaleString()}원)</div>); })}
                      <div className="mt-2 font-medium">
                        총 소요시간: {totalDuration}분 | 총 금액: {totalAmount.toLocaleString()}원
                      </div>
                    </div>
                  </div>)}
              </div>)}

            {/* Step 4: 담당 직원 선택 */}
            {step === 4 && (<div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">담당 직원 선택</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {staff.filter(function (employee) { return employee.status === 'active'; }).map(function (employee) { return (<div key={employee.id} onClick={function () { return setSelectedEmployee(employee); }} className={"p-4 border rounded-lg cursor-pointer transition-colors ".concat((selectedEmployee === null || selectedEmployee === void 0 ? void 0 : selectedEmployee.id) === employee.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300')}>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                          <i className="ri-user-line text-gray-600 text-xl"></i>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{employee.name}</div>
                          <div className="text-sm text-gray-600">{employee.role}</div>
                          <div className="text-sm text-gray-500">
                            이번 달 담당 고객: {employee.monthlyCustomers}명
                          </div>
                        </div>
                      </div>
                    </div>); })}
                </div>
              </div>)}

            {/* Step 5: 상세 정보 입력 */}
            {step === 5 && (<div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">상세 정보 입력</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      시술 메모 (선택사항)
                    </label>
                    <textarea value={memo} onChange={function (e) { return setMemo(e.target.value); }} placeholder="특별한 요청사항이나 주의사항을 입력하세요" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      금액 (선택사항)
                    </label>
                    <input type="number" value={customAmount} onChange={function (e) { return setCustomAmount(e.target.value); }} placeholder={"\uAE30\uBCF8 \uAE08\uC561: ".concat(totalAmount.toLocaleString(), "\uC6D0")} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <p className="text-sm text-gray-500 mt-1">
                      입력하지 않으면 서비스 기본 금액이 적용됩니다.
                    </p>
                  </div>
                </div>
              </div>)}
          </div>

          {/* 하단 버튼 */}
          <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
            <button onClick={handlePrev} disabled={step === 1} className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
              이전
            </button>
            <div className="flex items-center gap-2">
              {step < 5 ? (<button onClick={handleNext} disabled={!canProceed()} className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  다음
                </button>) : (<button onClick={handleSave} disabled={!canProceed()} className="px-6 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed">
                  예약 추가
                </button>)}
            </div>
          </div>
        </div>

        {/* 우측 미리보기 사이드바 */}
        <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">예약 미리보기</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">고객</div>
              <div className="font-medium text-gray-900">
                {selectedCustomer ? selectedCustomer.name : '선택되지 않음'}
              </div>
              {selectedCustomer && (<div className="text-sm text-gray-600">{selectedCustomer.phone}</div>)}
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
                      총 {totalDuration}분 · {totalAmount.toLocaleString()}원
                    </div>
                  </div>
                </div>) : (<div className="text-gray-500">선택되지 않음</div>)}
            </div>

            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-sm text-gray-600 mb-1">담당 직원</div>
              <div className="font-medium text-gray-900">
                {selectedEmployee ? selectedEmployee.name : '선택되지 않음'}
              </div>
              {selectedEmployee && (<div className="text-sm text-gray-600">{selectedEmployee.role}</div>)}
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
