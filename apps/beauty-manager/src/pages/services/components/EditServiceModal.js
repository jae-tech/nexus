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
exports.default = EditServiceModal;
var react_1 = require("react");
function EditServiceModal(_a) {
    var service = _a.service, categories = _a.categories, onSave = _a.onSave, onClose = _a.onClose;
    var _b = (0, react_1.useState)('basic'), currentTab = _b[0], setCurrentTab = _b[1];
    var _c = (0, react_1.useState)({
        name: service.name,
        categoryId: service.categoryId,
        basePrice: service.basePrice.toString(),
        duration: service.duration.toString(),
        description: service.description || '',
        isActive: service.isActive
    }), formData = _c[0], setFormData = _c[1];
    var _d = (0, react_1.useState)(service.priceOptions || []), priceOptions = _d[0], setPriceOptions = _d[1];
    var _e = (0, react_1.useState)({}), errors = _e[0], setErrors = _e[1];
    var validateForm = function () {
        var newErrors = {};
        if (!formData.name.trim()) {
            newErrors.name = '서비스명을 입력해주세요';
        }
        if (!formData.categoryId) {
            newErrors.categoryId = '카테고리를 선택해주세요';
        }
        if (!formData.basePrice || parseInt(formData.basePrice) <= 0) {
            newErrors.basePrice = '올바른 가격을 입력해주세요';
        }
        if (!formData.duration || parseInt(formData.duration) <= 0) {
            newErrors.duration = '소요시간을 입력해주세요';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    var handleSubmit = function (e) {
        e.preventDefault();
        if (!validateForm())
            return;
        var selectedCategory = categories.find(function (c) { return c.id === formData.categoryId; });
        var updatedService = __assign(__assign({}, service), { name: formData.name.trim(), categoryId: formData.categoryId, categoryName: (selectedCategory === null || selectedCategory === void 0 ? void 0 : selectedCategory.name) || '', basePrice: parseInt(formData.basePrice), duration: parseInt(formData.duration), description: formData.description.trim() || undefined, isActive: formData.isActive, priceOptions: priceOptions.length > 0 ? priceOptions : undefined });
        onSave(updatedService);
    };
    var addPriceOption = function () {
        var newOption = {
            id: "new-".concat(Date.now()),
            name: '',
            additionalPrice: 0,
            description: ''
        };
        setPriceOptions(__spreadArray(__spreadArray([], priceOptions, true), [newOption], false));
    };
    var updatePriceOption = function (index, field, value) {
        var _a;
        var updated = __spreadArray([], priceOptions, true);
        updated[index] = __assign(__assign({}, updated[index]), (_a = {}, _a[field] = value, _a));
        setPriceOptions(updated);
    };
    var removePriceOption = function (index) {
        setPriceOptions(priceOptions.filter(function (_, i) { return i !== index; }));
    };
    var formatPrice = function (price) {
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    var formatDuration = function (minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        if (hours > 0 && mins > 0) {
            return "".concat(hours, "\uC2DC\uAC04 ").concat(mins, "\uBD84");
        }
        else if (hours > 0) {
            return "".concat(hours, "\uC2DC\uAC04");
        }
        else {
            return "".concat(mins, "\uBD84");
        }
    };
    var formatDate = function (dateString) {
        return new Date(dateString).toLocaleDateString('ko-KR');
    };
    return (<div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex h-full">
          {/* 메인 폼 영역 */}
          <div className="flex-1 flex flex-col">
            {/* 헤더 */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-bold text-gray-900">서비스 수정</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  {[
            { key: 'basic', label: '기본 정보', icon: 'ri-information-line' },
            { key: 'options', label: '가격 옵션', icon: 'ri-add-circle-line' },
            { key: 'stats', label: '통계', icon: 'ri-bar-chart-line' }
        ].map(function (tab) { return (<button key={tab.key} onClick={function () { return setCurrentTab(tab.key); }} className={"flex items-center gap-2 px-3 py-1.5 rounded text-sm font-medium transition-colors ".concat(currentTab === tab.key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900')}>
                      <i className={tab.icon}></i>
                      {tab.label}
                    </button>); })}
                </div>
              </div>
              <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="ri-close-line text-xl"></i>
              </button>
            </div>

            {/* 폼 내용 */}
            <div className="flex-1 overflow-y-auto p-6">
              {currentTab === 'basic' && (<div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      서비스명 *
                    </label>
                    <input type="text" value={formData.name} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { name: e.target.value })); }} className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.name ? 'border-red-300' : 'border-gray-300')} placeholder="예: 여성 컷, 젤네일, 페이셜 케어"/>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      카테고리 *
                    </label>
                    <select value={formData.categoryId} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { categoryId: e.target.value })); }} className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.categoryId ? 'border-red-300' : 'border-gray-300')}>
                      <option value="">카테고리 선택</option>
                      {categories.map(function (category) { return (<option key={category.id} value={category.id}>
                          {category.name}
                        </option>); })}
                    </select>
                    {errors.categoryId && <p className="text-red-500 text-sm mt-1">{errors.categoryId}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        기본 가격 (원) *
                      </label>
                      <input type="number" value={formData.basePrice} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { basePrice: e.target.value })); }} className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.basePrice ? 'border-red-300' : 'border-gray-300')} placeholder="30000" min="0" step="1000"/>
                      {errors.basePrice && <p className="text-red-500 text-sm mt-1">{errors.basePrice}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        소요시간 (분) *
                      </label>
                      <input type="number" value={formData.duration} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { duration: e.target.value })); }} className={"w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ".concat(errors.duration ? 'border-red-300' : 'border-gray-300')} placeholder="60" min="15" step="15"/>
                      {errors.duration && <p className="text-red-500 text-sm mt-1">{errors.duration}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      서비스 설명
                    </label>
                    <textarea value={formData.description} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { description: e.target.value })); }} rows={3} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" placeholder="서비스에 대한 간단한 설명을 입력해주세요"/>
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.isActive} onChange={function (e) { return setFormData(__assign(__assign({}, formData), { isActive: e.target.checked })); }} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                      <span className="text-sm text-gray-700">서비스 활성화</span>
                    </label>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-2">서비스 정보</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">등록일:</span>
                        <span className="ml-2 text-gray-900">{formatDate(service.createdAt)}</span>
                      </div>
                      <div>
                        <span className="text-gray-500">최종 수정:</span>
                        <span className="ml-2 text-gray-900">{formatDate(service.updatedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>)}

              {currentTab === 'options' && (<div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">가격 옵션</h3>
                    <button onClick={addPriceOption} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
                      <i className="ri-add-line"></i>
                      옵션 추가
                    </button>
                  </div>

                  {priceOptions.length === 0 ? (<div className="text-center py-8 text-gray-500">
                      <i className="ri-add-circle-line text-4xl mb-2"></i>
                      <p>추가 가격 옵션이 없습니다</p>
                      <p className="text-sm">고객이 선택할 수 있는 추가 옵션을 만들어보세요</p>
                    </div>) : (<div className="space-y-4">
                      {priceOptions.map(function (option, index) { return (<div key={option.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-start justify-between mb-3">
                            <h4 className="font-medium text-gray-900">옵션 {index + 1}</h4>
                            <button onClick={function () { return removePriceOption(index); }} className="text-red-500 hover:text-red-700 p-1">
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-3 mb-3">
                            <input type="text" value={option.name} onChange={function (e) { return updatePriceOption(index, 'name', e.target.value); }} placeholder="옵션명 (예: 긴 머리 추가)" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                            <input type="number" value={option.additionalPrice} onChange={function (e) { return updatePriceOption(index, 'additionalPrice', parseInt(e.target.value) || 0); }} placeholder="추가 금액" className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent" min="0" step="1000"/>
                          </div>
                          <input type="text" value={option.description || ''} onChange={function (e) { return updatePriceOption(index, 'description', e.target.value); }} placeholder="옵션 설명 (선택사항)" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                        </div>); })}
                    </div>)}
                </div>)}

              {currentTab === 'stats' && (<div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">서비스 통계</h3>
                  
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-blue-600 mb-1">이번 달 이용</p>
                          <p className="text-2xl font-bold text-blue-900">{service.monthlyUsage}회</p>
                        </div>
                        <i className="ri-calendar-line text-2xl text-blue-600"></i>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-green-600 mb-1">평균 만족도</p>
                          <p className="text-2xl font-bold text-green-900">{service.averageRating.toFixed(1)}</p>
                        </div>
                        <i className="ri-star-line text-2xl text-green-600"></i>
                      </div>
                    </div>
                    
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-purple-600 mb-1">총 매출</p>
                          <p className="text-2xl font-bold text-purple-900">{formatPrice(service.totalRevenue)}원</p>
                        </div>
                        <i className="ri-money-dollar-circle-line text-2xl text-purple-600"></i>
                      </div>
                    </div>
                    
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-yellow-600 mb-1">인기도</p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {service.monthlyUsage > 30 ? 'HOT' : service.monthlyUsage > 15 ? '인기' : '보통'}
                          </p>
                        </div>
                        <i className="ri-fire-line text-2xl text-yellow-600"></i>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">월별 이용 현황</h4>
                    <div className="h-32 flex items-end justify-between gap-2">
                      {__spreadArray([], Array(12), true).map(function (_, i) {
                var height = Math.random() * 80 + 20;
                var isCurrentMonth = i === new Date().getMonth();
                return (<div key={i} className="flex-1 flex flex-col items-center">
                            <div className={"w-full rounded-t ".concat(isCurrentMonth ? 'bg-blue-500' : 'bg-gray-300')} style={{ height: "".concat(height, "%") }}/>
                            <span className="text-xs text-gray-500 mt-1">{i + 1}월</span>
                          </div>);
            })}
                    </div>
                  </div>
                </div>)}
            </div>

            {/* 하단 액션 */}
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="text-sm text-gray-500">
                <span>
                  현재 가격: <strong>{formatPrice(parseInt(formData.basePrice || '0'))}원</strong>
                  {priceOptions.length > 0 && " (\uC635\uC158 ".concat(priceOptions.length, "\uAC1C)")}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={onClose} className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium">
                  취소
                </button>
                <button onClick={handleSubmit} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors">
                  변경사항 저장
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>);
}
