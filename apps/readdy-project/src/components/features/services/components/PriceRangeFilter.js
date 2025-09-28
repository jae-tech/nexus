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
exports.default = PriceRangeFilter;
var react_1 = require("react");
function PriceRangeFilter(_a) {
    var value = _a.value, onChange = _a.onChange, min = _a.min, max = _a.max;
    var _b = (0, react_1.useState)(value), localRange = _b[0], setLocalRange = _b[1];
    var _c = (0, react_1.useState)(false), showFilter = _c[0], setShowFilter = _c[1];
    (0, react_1.useEffect)(function () {
        setLocalRange(value);
    }, [value]);
    var handleRangeChange = function (index, inputValue) {
        var numValue = parseInt(inputValue, 10);
        if (Number.isNaN(numValue))
            return;
        var newRange = __spreadArray([], localRange, true);
        newRange[index] = numValue;
        if (index === 0 && numValue > newRange[1]) {
            newRange[1] = numValue;
        }
        else if (index === 1 && numValue < newRange[0]) {
            newRange[0] = numValue;
        }
        setLocalRange(newRange);
    };
    var applyFilter = function () {
        onChange(localRange);
        setShowFilter(false);
    };
    var resetFilter = function () {
        var resetRange = [min, max];
        setLocalRange(resetRange);
        onChange(resetRange);
    };
    var formatPrice = function (price) {
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    var isFiltered = value[0] !== min || value[1] !== max;
    return (<div className="relative">
      <button onClick={function () { return setShowFilter(!showFilter); }} className={"flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ".concat(isFiltered
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200')}>
        <i className="ri-filter-line"></i>
        <span className="hidden sm:inline">가격 필터</span>
        <span className="sm:hidden">가격</span>
        {isFiltered && (<span className="bg-blue-600 text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full hidden md:inline">
            {formatPrice(value[0])} - {formatPrice(value[1])}
          </span>)}
      </button>

      {showFilter && (<>
          <div className="fixed inset-0 z-10" onClick={function () { return setShowFilter(false); }}/>
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72 md:w-80 z-20">
            <h4 className="font-medium text-gray-900 mb-4">가격 범위</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    최소 금액
                  </label>
                  <input type="number" value={localRange[0]} onChange={function (e) { return handleRangeChange(0, e.target.value); }} min={min} max={max} step={1000} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    최대 금액
                  </label>
                  <input type="number" value={localRange[1]} onChange={function (e) { return handleRangeChange(1, e.target.value); }} min={min} max={max} step={1000} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                </div>
              </div>

              <div className="relative">
                <input type="range" min={min} max={max} value={localRange[0]} onChange={function (e) { return handleRangeChange(0, e.target.value); }} className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb" style={{ zIndex: 1 }}/>
                <input type="range" min={min} max={max} value={localRange[1]} onChange={function (e) { return handleRangeChange(1, e.target.value); }} className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb" style={{ zIndex: 2 }}/>
                <div className="relative h-2 bg-gray-200 rounded-lg">
                  <div className="absolute h-2 bg-blue-600 rounded-lg" style={{
                left: "".concat(((localRange[0] - min) / (max - min)) * 100, "%"),
                right: "".concat(100 - ((localRange[1] - min) / (max - min)) * 100, "%"),
            }}/>
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatPrice(min)}원</span>
                <span>{formatPrice(max)}원</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button onClick={applyFilter} className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors">
                  적용
                </button>
                <button onClick={resetFilter} className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium">
                  초기화
                </button>
              </div>
            </div>
          </div>
        </>)}

      <style>{"\n        .slider-thumb::-webkit-slider-thumb {\n          appearance: none;\n          height: 20px;\n          width: 20px;\n          border-radius: 50%;\n          background: #3B82F6;\n          cursor: pointer;\n          border: 2px solid white;\n          box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n        }\n        .slider-thumb::-moz-range-thumb {\n          height: 20px;\n          width: 20px;\n          border-radius: 50%;\n          background: #3B82F6;\n          cursor: pointer;\n          border: 2px solid white;\n          box-shadow: 0 2px 4px rgba(0,0,0,0.1);\n        }\n      "}</style>
    </div>);
}
