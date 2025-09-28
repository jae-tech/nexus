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
exports.default = EditStaffModal;
var react_1 = require("react");
var Button_1 = require("../../../components/base/Button");
function EditStaffModal(_a) {
    var _b;
    var staff = _a.staff, onClose = _a.onClose, onSave = _a.onSave;
    var _c = (0, react_1.useState)({
        name: staff.name,
        role: staff.role,
        phone: staff.phone,
        email: staff.email || '',
        hireDate: staff.hireDate,
        specialties: __spreadArray([], staff.specialties, true),
        personalMemo: staff.personalMemo || '',
        status: staff.status
    }), formData = _c[0], setFormData = _c[1];
    var _d = (0, react_1.useState)({}), errors = _d[0], setErrors = _d[1];
    var _e = (0, react_1.useState)(false), showTerminateConfirm = _e[0], setShowTerminateConfirm = _e[1];
    var roles = [
        '헤어 디자이너',
        '네일 아티스트',
        '피부 관리사',
        '어시스턴트',
        '매니저',
        '기타'
    ];
    var specialtyOptions = {
        '헤어 디자이너': ['컷', '염색', '펌', '트리트먼트', '스타일링'],
        '네일 아티스트': ['젤네일', '네일아트', '페디큐어', '네일케어'],
        '피부 관리사': ['페이셜', '마사지', '스킨케어', '여드름케어'],
        '어시스턴트': ['샴푸', '고객응대', '청소', '예약관리'],
        '매니저': ['매장관리', '직원관리', '고객관리', '매출관리'],
        '기타': ['기타']
    };
    var validateForm = function () {
        var newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = '이름을 입력해주세요.';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = '전화번호를 입력해주세요.';
        }
        else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
            newErrors.phone = '올바른 전화번호 형식이 아닙니다. (010-0000-0000)';
        }
        if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = '올바른 이메일 형식이 아닙니다.';
        }
        if (!formData.hireDate) {
            newErrors.hireDate = '입사일을 선택해주세요.';
        }
        else if (new Date(formData.hireDate) > new Date()) {
            newErrors.hireDate = '입사일은 오늘 이후로 설정할 수 없습니다.';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }
        var updatedStaff = __assign(__assign({}, staff), formData);
        onSave(updatedStaff);
    };
    var handleSpecialtyToggle = function (specialty) {
        setFormData(function (prev) { return (__assign(__assign({}, prev), { specialties: prev.specialties.includes(specialty)
                ? prev.specialties.filter(function (s) { return s !== specialty; })
                : __spreadArray(__spreadArray([], prev.specialties, true), [specialty], false) })); });
    };
    var formatPhoneNumber = function (value) {
        var numbers = value.replace(/[^\d]/g, '');
        if (numbers.length <= 3)
            return numbers;
        if (numbers.length <= 7)
            return "".concat(numbers.slice(0, 3), "-").concat(numbers.slice(3));
        return "".concat(numbers.slice(0, 3), "-").concat(numbers.slice(3, 7), "-").concat(numbers.slice(7, 11));
    };
    var handlePhoneChange = function (e) {
        var formatted = formatPhoneNumber(e.target.value);
        setFormData(function (prev) { return (__assign(__assign({}, prev), { phone: formatted })); });
    };
    var handleTerminate = function () {
        var updatedStaff = __assign(__assign(__assign({}, staff), formData), { status: 'inactive' });
        onSave(updatedStaff);
        setShowTerminateConfirm(false);
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">직원 정보 수정</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <i className="ri-close-line text-xl text-gray-500"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input type="text" value={formData.name} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { name: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.name ? 'border-red-500' : 'border-gray-300')} placeholder="직원 이름을 입력하세요"/>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  역할 <span className="text-red-500">*</span>
                </label>
                <select value={formData.role} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { role: e.target.value, specialties: [] })); }); }} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {roles.map(function (role) { return (<option key={role} value={role}>{role}</option>); })}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input type="tel" value={formData.phone} onChange={handlePhoneChange} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.phone ? 'border-red-500' : 'border-gray-300')} placeholder="010-0000-0000" maxLength={13}/>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input type="email" value={formData.email} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { email: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.email ? 'border-red-500' : 'border-gray-300')} placeholder="example@salon.com"/>
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입사일 <span className="text-red-500">*</span>
              </label>
              <input type="date" value={formData.hireDate} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { hireDate: e.target.value })); }); }} className={"w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ".concat(errors.hireDate ? 'border-red-500' : 'border-gray-300')} max={new Date().toISOString().split('T')[0]}/>
              {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
            </div>

            {/* 전문 분야 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전문 분야
              </label>
              <div className="flex flex-wrap gap-2">
                {(_b = specialtyOptions[formData.role]) === null || _b === void 0 ? void 0 : _b.map(function (specialty) { return (<button key={specialty} type="button" onClick={function () { return handleSpecialtyToggle(specialty); }} className={"px-3 py-1 rounded-full text-sm font-medium transition-colors ".concat(formData.specialties.includes(specialty)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
                    {specialty}
                  </button>); })}
              </div>
            </div>

            {/* 개인 메모 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                개인 메모
              </label>
              <textarea value={formData.personalMemo} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { personalMemo: e.target.value })); }); }} rows={3} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="특기, 자격증, 특이사항 등을 입력하세요" maxLength={500}/>
              <p className="text-sm text-gray-500 mt-1">
                {formData.personalMemo.length}/500자
              </p>
            </div>

            {/* 재직 상태 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                재직 상태
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input type="checkbox" checked={formData.status === 'active'} onChange={function (e) { return setFormData(function (prev) { return (__assign(__assign({}, prev), { status: e.target.checked ? 'active' : 'inactive' })); }); }} className="sr-only"/>
                    <div className={"relative w-11 h-6 rounded-full transition-colors ".concat(formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300')}>
                      <div className={"absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ".concat(formData.status === 'active' ? 'translate-x-5' : 'translate-x-0')}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.status === 'active' ? '재직중' : '퇴사'}
                    </span>
                  </label>
                </div>
                {staff.status === 'active' && (<button type="button" onClick={function () { return setShowTerminateConfirm(true); }} className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                    퇴사 처리
                  </button>)}
              </div>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3 pt-4">
              <Button_1.default type="button" onClick={onClose} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                취소
              </Button_1.default>
              <Button_1.default type="submit" className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                저장
              </Button_1.default>
            </div>
          </form>
        </div>
      </div>

      {/* 퇴사 확인 모달 */}
      {showTerminateConfirm && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <i className="ri-alert-line text-2xl text-red-600"></i>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">퇴사 처리 확인</h3>
              <p className="text-gray-600 mb-6">
                {staff.name} 직원을 퇴사 처리하시겠습니까?<br />
                퇴사 후에는 새로운 예약 배정이 불가능합니다.
              </p>
              <div className="flex gap-3">
                <Button_1.default onClick={function () { return setShowTerminateConfirm(false); }} className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200">
                  취소
                </Button_1.default>
                <Button_1.default onClick={handleTerminate} className="flex-1 bg-red-600 text-white hover:bg-red-700">
                  퇴사 처리
                </Button_1.default>
              </div>
            </div>
          </div>
        </div>)}
    </div>);
}
