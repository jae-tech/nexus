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
exports.default = ServiceTable;
var react_1 = require("react");
var categoryColors = {
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-pink-100 text-pink-800',
    '3': 'bg-green-100 text-green-800',
    '4': 'bg-gray-100 text-gray-800',
};
function ServiceTable(_a) {
    var services = _a.services, onToggleActive = _a.onToggleActive, onEdit = _a.onEdit, onDelete = _a.onDelete;
    var formatPrice = function (price) {
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    var formatDuration = function (minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        if (hours > 0 && mins > 0) {
            return "".concat(hours, "h ").concat(mins, "m");
        }
        else if (hours > 0) {
            return "".concat(hours, "h");
        }
        else {
            return "".concat(mins, "m");
        }
    };
    return (<div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                서비스명
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                카테고리
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                가격
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                소요시간
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                상태
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                이번달 이용
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                만족도
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                액션
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {services.map(function (service) { return (<tr key={service.id} className={"hover:bg-gray-50 ".concat(!service.isActive ? 'opacity-60' : '')}>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900">{service.name}</div>
                    {service.monthlyUsage > 30 && (<span className="bg-red-100 text-red-600 text-xs px-2 py-1 rounded-full font-medium">
                        HOT
                      </span>)}
                  </div>
                  {service.description && (<div className="text-sm text-gray-500 mt-1 line-clamp-1">
                      {service.description}
                    </div>)}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span className={"inline-block px-2 py-1 rounded-full text-xs font-medium ".concat(categoryColors[service.categoryId] || 'bg-gray-100 text-gray-800')}>
                    {service.categoryName}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-semibold text-gray-900">
                    {formatPrice(service.basePrice)}원
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{formatDuration(service.duration)}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <button onClick={function () { return onToggleActive(service.id); }} className={"relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ".concat(service.isActive ? 'bg-blue-600' : 'bg-gray-200')}>
                    <span className={"inline-block h-4 w-4 transform rounded-full bg-white transition-transform ".concat(service.isActive ? 'translate-x-6' : 'translate-x-1')}/>
                  </button>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{service.monthlyUsage}회</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-1">
                    <div className="flex text-yellow-400">
                      {__spreadArray([], Array(5), true).map(function (_, i) { return (<i key={i} className={"text-xs ".concat(i < Math.floor(service.averageRating)
                    ? 'ri-star-fill'
                    : i === Math.floor(service.averageRating) &&
                        service.averageRating % 1 >= 0.5
                        ? 'ri-star-half-fill'
                        : 'ri-star-line text-gray-300')}/>); })}
                    </div>
                    <span className="text-xs text-gray-600 ml-1">
                      {service.averageRating.toFixed(1)}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-2">
                    <button onClick={function () { return onEdit(service); }} className="p-1 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors" title="수정">
                      <i className="ri-edit-line text-sm"></i>
                    </button>
                    <button onClick={function () { return onDelete(service.id); }} className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors" title="삭제">
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                </td>
              </tr>); })}
          </tbody>
        </table>
      </div>
    </div>);
}
