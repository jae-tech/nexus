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
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AddCustomerModal;
var react_1 = require("react");
function AddCustomerModal(_a) {
    var onClose = _a.onClose, onAdd = _a.onAdd, existingCustomers = _a.existingCustomers;
    var _b = (0, react_1.useState)({
        name: '',
        phone: '',
        gender: '여성',
        birthday: '',
        memo: ''
    }), formData = _b[0], setFormData = _b[1];
    var _c = (0, react_1.useState)({}), errors = _c[0], setErrors = _c[1];
    var validateForm = function () {
        var newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = '이름은 필수입니다.';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = '전화번호는 필수입니다.';
        }
        else {
            var phoneRegex = /^010-\d{4}-\d{4}$/;
            if (!phoneRegex.test(formData.phone)) {
                newErrors.phone = '전화번호 형식이 올바르지 않습니다. (010-0000-0000)';
            }
            else {
                var existingCustomer = existingCustomers.find(function (c) { return c.phone === formData.phone; });
                if (existingCustomer) {
                    newErrors.phone = '이미 등록된 전화번호입니다.';
                }
            }
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        var newCustomer = __assign(__assign({ id: Date.now() }, formData), { registeredDate: new Date().toISOString().split('T')[0], visitCount: 0, lastVisit: '', lastService: '', mainStaff: '' });
        onAdd(newCustomer);
    };
    var handlePhoneChange = function (value) {
        // 숫자만 추출
        var numbers = value.replace(/\D/g, '');
        // 010-0000-0000 형식으로 포맷팅
        var formatted = numbers;
        if (numbers.length >= 3) {
            formatted = numbers.slice(0, 3) + '-';
            if (numbers.length >= 7) {
                formatted += numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
            }
            else {
                formatted += numbers.slice(3);
            }
        }
        setFormData(function (prev) { return (__assign(__assign({}, prev), { phone: formatted })); });
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">신규 고객 등록</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              <i className="ri-close-line text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input type="text" value={formData.name} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.name ? 'border-red-300' : 'border-gray-300')} placeholder="고객 이름"/>
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호 *
              </label>
              <input type="tel" value={formData.phone} onChange={function (e) { return handlePhoneChange(e.target.value); }} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.phone ? 'border-red-300' : 'border-gray-300')} placeholder="010-0000-0000" maxLength={13}/>
              {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                성별
              </label>
              <select value={formData.gender} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { gender: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="여성">여성</option>
                <option value="남성">남성</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                생년월일
              </label>
              <input type="date" value={formData.birthday} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { birthday: e.target.value })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                메모
              </label>
              <textarea value={formData.memo} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { memo: e.target.value })); }); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="특이사항이나 메모를 입력하세요"/>
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
              취소
            </button>
            <button type="submit" className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              등록
            </button>
          </div>
        </form>
      </div>
    </div>);
}
