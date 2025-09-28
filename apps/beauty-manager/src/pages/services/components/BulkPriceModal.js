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
exports.default = BulkPriceModal;
var react_1 = require("react");
var Button_1 = require("../../../components/base/Button");
function BulkPriceModal(_a) {
    var services = _a.services, onClose = _a.onClose, onApply = _a.onApply;
    var _b = (0, react_1.useState)(1), step = _b[0], setStep = _b[1];
    var _c = (0, react_1.useState)([]), selectedServices = _c[0], setSelectedServices = _c[1];
    var _d = (0, react_1.useState)('fixed'), adjustmentType = _d[0], setAdjustmentType = _d[1];
    var _e = (0, react_1.useState)(0), adjustmentValue = _e[0], setAdjustmentValue = _e[1];
    var _f = (0, react_1.useState)('increase'), direction = _f[0], setDirection = _f[1];
    var categories = Array.from(new Set(services.map(function (s) { return s.categoryName; })));
    var handleServiceToggle = function (serviceId) {
        setSelectedServices(function (prev) {
            return prev.includes(serviceId)
                ? prev.filter(function (id) { return id !== serviceId; })
                : __spreadArray(__spreadArray([], prev, true), [serviceId], false);
        });
    };
    var handleCategoryToggle = function (categoryName) {
        var categoryServices = services.filter(function (s) { return s.categoryName === categoryName; }).map(function (s) { return s.id; });
        var allSelected = categoryServices.every(function (id) { return selectedServices.includes(id); });
        if (allSelected) {
            setSelectedServices(function (prev) { return prev.filter(function (id) { return !categoryServices.includes(id); }); });
        }
        else {
            setSelectedServices(function (prev) { return __spreadArray([], new Set(__spreadArray(__spreadArray([], prev, true), categoryServices, true)), true); });
        }
    };
    var handleSelectAll = function () {
        if (selectedServices.length === services.length) {
            setSelectedServices([]);
        }
        else {
            setSelectedServices(services.map(function (s) { return s.id; }));
        }
    };
    var calculateNewPrice = function (currentPrice) {
        if (adjustmentType === 'fixed') {
            return direction === 'increase'
                ? currentPrice + adjustmentValue
                : Math.max(0, currentPrice - adjustmentValue);
        }
        else {
            var multiplier = direction === 'increase'
                ? 1 + (adjustmentValue / 100)
                : 1 - (adjustmentValue / 100);
            return Math.max(0, Math.round(currentPrice * multiplier));
        }
    };
    var selectedServiceData = services.filter(function (s) { return selectedServices.includes(s.id); });
    var handleApply = function () {
        onApply(selectedServices, adjustmentType, adjustmentValue, direction);
        onClose();
    };
    return (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">일괄 가격 수정</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map(function (stepNum) { return (<div key={stepNum} className="flex items-center">
                  <div className={"w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ".concat(step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600')}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (<div className={"w-8 h-0.5 ".concat(step > stepNum ? 'bg-blue-600' : 'bg-gray-200')}></div>)}
                </div>); })}
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="p-6 max-h-[600px] overflow-y-auto">
          {step === 1 && (<div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">1단계: 서비스 선택</h3>
              
              <div className="flex items-center justify-between mb-4">
                <button onClick={handleSelectAll} className="text-blue-600 hover:text-blue-700 font-medium">
                  {selectedServices.length === services.length ? '전체 해제' : '전체 선택'}
                </button>
                <span className="text-sm text-gray-600">
                  선택된 서비스: {selectedServices.length}개
                </span>
              </div>

              {/* 카테고리별 선택 */}
              <div className="space-y-4">
                {categories.map(function (categoryName) {
                var categoryServices = services.filter(function (s) { return s.categoryName === categoryName; });
                var selectedCount = categoryServices.filter(function (s) { return selectedServices.includes(s.id); }).length;
                var allSelected = selectedCount === categoryServices.length;
                var someSelected = selectedCount > 0 && selectedCount < categoryServices.length;
                return (<div key={categoryName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={allSelected} ref={function (el) {
                        if (el)
                            el.indeterminate = someSelected;
                    }} onChange={function () { return handleCategoryToggle(categoryName); }} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                          <span className="ml-2 font-medium text-gray-900">{categoryName}</span>
                        </label>
                        <span className="text-sm text-gray-500">
                          {selectedCount}/{categoryServices.length}개 선택
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                        {categoryServices.map(function (service) { return (<label key={service.id} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input type="checkbox" checked={selectedServices.includes(service.id)} onChange={function () { return handleServiceToggle(service.id); }} className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"/>
                            <div className="ml-2 flex-1">
                              <span className="text-sm text-gray-900">{service.name}</span>
                              <span className="ml-2 text-sm text-gray-500">
                                {service.basePrice.toLocaleString()}원
                              </span>
                            </div>
                          </label>); })}
                      </div>
                    </div>);
            })}
              </div>
            </div>)}

          {step === 2 && (<div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">2단계: 가격 조정 방식</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">조정 방식</label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="adjustmentType" value="fixed" checked={adjustmentType === 'fixed'} onChange={function (e) { return setAdjustmentType(e.target.value); }} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                      <span className="ml-2">고정 금액 추가/차감</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="adjustmentType" value="percent" checked={adjustmentType === 'percent'} onChange={function (e) { return setAdjustmentType(e.target.value); }} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                      <span className="ml-2">퍼센트 증감</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">조정 방향</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="direction" value="increase" checked={direction === 'increase'} onChange={function (e) { return setDirection(e.target.value); }} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                      <span className="ml-2 text-green-600">증가</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="radio" name="direction" value="decrease" checked={direction === 'decrease'} onChange={function (e) { return setDirection(e.target.value); }} className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"/>
                      <span className="ml-2 text-red-600">감소</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {adjustmentType === 'fixed' ? '금액' : '퍼센트'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input type="number" value={adjustmentValue} onChange={function (e) { return setAdjustmentValue(Number(e.target.value)); }} min="0" className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"/>
                    <span className="text-gray-600">
                      {adjustmentType === 'fixed' ? '원' : '%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>)}

          {step === 3 && (<div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">3단계: 미리보기</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-information-line text-yellow-600"></i>
                  <span className="text-sm text-yellow-800">
                    총 {selectedServices.length}개 서비스의 가격이 변경됩니다.
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">서비스명</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">카테고리</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">현재 가격</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">신규 가격</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">변경액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServiceData.map(function (service) {
                var newPrice = calculateNewPrice(service.basePrice);
                var difference = newPrice - service.basePrice;
                return (<tr key={service.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{service.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{service.categoryName}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {service.basePrice.toLocaleString()}원
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {newPrice.toLocaleString()}원
                          </td>
                          <td className={"py-3 px-4 text-sm font-medium ".concat(difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600')}>
                            {difference > 0 ? '+' : ''}{difference.toLocaleString()}원
                          </td>
                        </tr>);
            })}
                  </tbody>
                </table>
              </div>
            </div>)}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="flex gap-2">
            {step > 1 && (<Button_1.default variant="outline" onClick={function () { return setStep(step - 1); }}>
                이전
              </Button_1.default>)}
          </div>
          
          <div className="flex gap-2">
            <Button_1.default variant="outline" onClick={onClose}>
              취소
            </Button_1.default>
            {step < 3 ? (<Button_1.default onClick={function () { return setStep(step + 1); }} disabled={step === 1 && selectedServices.length === 0} className="bg-blue-600 hover:bg-blue-700 text-white">
                다음
              </Button_1.default>) : (<Button_1.default onClick={handleApply} className="bg-blue-600 hover:bg-blue-700 text-white">
                적용
              </Button_1.default>)}
          </div>
        </div>
      </div>
    </div>);
}
