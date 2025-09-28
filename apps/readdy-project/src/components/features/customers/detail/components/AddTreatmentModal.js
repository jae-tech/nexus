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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
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
exports.default = AddTreatmentModal;
var react_1 = require("react");
var Button_1 = require("../../../../components/base/Button");
var services_1 = require("../../../../mocks/services");
var staff_1 = require("../../../../mocks/staff");
function AddTreatmentModal(_a) {
    var _this = this;
    var _b;
    var customerId = _a.customerId, onClose = _a.onClose, onSuccess = _a.onSuccess;
    var _c = (0, react_1.useState)({
        date: new Date().toISOString().split('T')[0],
        time: '',
        services: [],
        employeeId: '',
        memo: '',
        amount: ''
    }), formData = _c[0], setFormData = _c[1];
    var _d = (0, react_1.useState)(false), isSubmitting = _d[0], setIsSubmitting = _d[1];
    var _e = (0, react_1.useState)({}), errors = _e[0], setErrors = _e[1];
    var validateForm = function () {
        var newErrors = {};
        if (!formData.date) {
            newErrors.date = '날짜를 선택해주세요.';
        }
        if (formData.services.length === 0) {
            newErrors.services = '최소 하나의 서비스를 선택해주세요.';
        }
        if (!formData.employeeId) {
            newErrors.employeeId = '담당 직원을 선택해주세요.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) { return __awaiter(_this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    e.preventDefault();
                    if (!validateForm())
                        return [2 /*return*/];
                    setIsSubmitting(true);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, 4, 5]);
                    // 실제로는 API 호출로 새 시술 기록 추가
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    // 실제로는 API 호출로 새 시술 기록 추가
                    _a.sent(); // 시뮬레이션
                    console.log('새 시술 추가:', __assign({ customerId: customerId }, formData));
                    onSuccess();
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _a.sent();
                    console.error('시술 추가 실패:', error_1);
                    return [3 /*break*/, 5];
                case 4:
                    setIsSubmitting(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    var handleServiceToggle = function (serviceName) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { services: prev.services.includes(serviceName)
                ? prev.services.filter(function (s) { return s !== serviceName; })
                : __spreadArray(__spreadArray([], prev.services, true), [serviceName], false) })); });
        // 에러 제거
        if (errors.services) {
            setErrors(function (prev) { return (__assign(__assign({}, prev), { services: '' })); });
        }
    };
    var handleEmployeeSelect = function (employeeId) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { employeeId: employeeId })); });
        // 에러 제거
        if (errors.employeeId) {
            setErrors(function (prev) { return (__assign(__assign({}, prev), { employeeId: '' })); });
        }
    };
    var handleChange = function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormData(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        // 에러 제거
        if (errors[name]) {
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = '', _a)));
            });
        }
    };
    var calculateTotalAmount = function () {
        return formData.services.reduce(function (total, serviceName) {
            var service = services_1.mockServices.find(function (s) { return s.name === serviceName; });
            return total + ((service === null || service === void 0 ? void 0 : service.price) || 0);
        }, 0);
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">새 시술 기록</h2>
          <Button_1.default variant="icon" onClick={onClose} disabled={isSubmitting}>
            <i className="ri-close-line text-xl"></i>
          </Button_1.default>
        </div>

        <div className="flex">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 날짜 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜 <span className="text-red-500">*</span>
                </label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.date ? 'border-red-300' : 'border-gray-200')} disabled={isSubmitting}/>
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간
                </label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={isSubmitting}/>
              </div>
            </div>

            {/* 서비스 선택 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                서비스 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {services_1.mockServices.map(function (service) { return (<div key={service.id} onClick={function () { return !isSubmitting && handleServiceToggle(service.name); }} className={"p-3 border rounded-lg cursor-pointer transition-all duration-200 ".concat(formData.services.includes(service.name)
                ? 'border-blue-500 bg-blue-50 text-blue-700'
                : 'border-gray-200 hover:border-gray-300', " ").concat(isSubmitting ? 'opacity-50 cursor-not-allowed' : '')}>
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price.toLocaleString()}원 · {service.duration}분
                    </div>
                  </div>); })}
              </div>
              {errors.services && <p className="text-red-500 text-xs mt-2">{errors.services}</p>}
            </div>

            {/* 담당 직원 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                담당 직원 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {staff_1.mockStaff.filter(function (staff) { return staff.status === 'active'; }).map(function (staff) { return (<div key={staff.id} onClick={function () { return !isSubmitting && handleEmployeeSelect(staff.id); }} className={"p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ".concat(formData.employeeId === staff.id
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-200 hover:border-gray-300', " ").concat(isSubmitting ? 'opacity-50 cursor-not-allowed' : '')}>
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-gray-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </div>); })}
              </div>
              {errors.employeeId && <p className="text-red-500 text-xs mt-2">{errors.employeeId}</p>}
            </div>

            {/* 메모 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시술 메모
              </label>
              <textarea name="memo" value={formData.memo} onChange={handleChange} rows={3} placeholder="시술 상세 내용, 스타일 요청사항 등을 기록하세요..." className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" maxLength={300} disabled={isSubmitting}/>
              <div className="text-xs text-gray-500 mt-1">
                {formData.memo.length}/300자
              </div>
            </div>

            {/* 금액 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                금액
              </label>
              <div className="relative">
                <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder={calculateTotalAmount().toLocaleString()} className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" disabled={isSubmitting}/>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
              {calculateTotalAmount() > 0 && (<p className="text-xs text-gray-500 mt-1">
                  선택한 서비스 기본 금액: {calculateTotalAmount().toLocaleString()}원
                </p>)}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <Button_1.default variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
                취소
              </Button_1.default>
              <Button_1.default variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (<>
                    <i className="ri-loader-4-line animate-spin"></i>
                    저장 중...
                  </>) : ('저장')}
              </Button_1.default>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">미리보기</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">날짜</label>
                <p className="text-gray-800">
                  {formData.date ? new Date(formData.date).toLocaleDateString('ko-KR') : '선택되지 않음'}
                  {formData.time && " ".concat(formData.time)}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">선택된 서비스</label>
                {formData.services.length > 0 ? (<div className="space-y-1">
                    {formData.services.map(function (serviceName) {
                var service = services_1.mockServices.find(function (s) { return s.name === serviceName; });
                return (<div key={serviceName} className="flex justify-between text-sm">
                          <span>{serviceName}</span>
                          <span>{service === null || service === void 0 ? void 0 : service.price.toLocaleString()}원</span>
                        </div>);
            })}
                  </div>) : (<p className="text-gray-500 text-sm">선택된 서비스 없음</p>)}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">담당 직원</label>
                <p className="text-gray-800">
                  {formData.employeeId
            ? (_b = staff_1.mockStaff.find(function (s) { return s.id === formData.employeeId; })) === null || _b === void 0 ? void 0 : _b.name
            : '선택되지 않음'}
                </p>
              </div>

              {formData.memo && (<div>
                  <label className="text-sm font-medium text-gray-600">메모</label>
                  <p className="text-gray-800 text-sm">{formData.memo}</p>
                </div>)}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">총 금액</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(formData.amount ? parseInt(formData.amount) : calculateTotalAmount()).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
