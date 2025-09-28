"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceStats;
var react_1 = require("react");
/**
 * ServiceStats component displays a set of statistical cards.
 *
 * @param totalServices   Number of all services (default: 0)
 * @param activeServices  Number of currently active services (default: 0)
 * @param totalRevenue    Total revenue amount (default: 0)
 * @param averageRating   Average rating value (default: 0)
 */
function ServiceStats(_a) {
    var _b = _a.totalServices, totalServices = _b === void 0 ? 0 : _b, _c = _a.activeServices, activeServices = _c === void 0 ? 0 : _c, _d = _a.totalRevenue, totalRevenue = _d === void 0 ? 0 : _d, _e = _a.averageRating, averageRating = _e === void 0 ? 0 : _e;
    /**
     * Formats a numeric price into a more readable Korean string.
     * Handles large numbers (K, M) and ensures graceful fallback for invalid inputs.
     */
    var formatPrice = function (price) {
        if (!Number.isFinite(price) || price < 0) {
            return '0';
        }
        if (price >= 1000000) {
            return "".concat((price / 1000000).toFixed(1), "M");
        }
        if (price >= 1000) {
            return "".concat((price / 1000).toFixed(0), "K");
        }
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    var stats = [
        {
            title: '전체 서비스',
            value: totalServices.toString(),
            icon: 'ri-service-line',
            color: 'text-blue-600',
            bgColor: 'bg-blue-50',
        },
        {
            title: '활성 서비스',
            value: activeServices.toString(),
            icon: 'ri-check-line',
            color: 'text-green-600',
            bgColor: 'bg-green-50',
        },
        {
            title: '총 매출',
            value: "".concat(formatPrice(totalRevenue), "\uC6D0"),
            icon: 'ri-money-dollar-circle-line',
            color: 'text-purple-600',
            bgColor: 'bg-purple-50',
        },
        {
            title: '평균 만족도',
            value: Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0',
            icon: 'ri-star-line',
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
        },
    ];
    return (<div className="px-4 py-4">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(function (stat, index) { return (<div key={index} className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={"w-12 h-12 rounded-lg ".concat(stat.bgColor, " flex items-center justify-center")}>
                <i className={"".concat(stat.icon, " text-xl ").concat(stat.color)}></i>
              </div>
            </div>
          </div>); })}
      </div>
    </div>);
}
