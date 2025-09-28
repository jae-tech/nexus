"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = StatsCards;
function StatsCards(_a) {
    var stats = _a.stats, _b = _a.className, className = _b === void 0 ? '' : _b;
    return (<div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-6 bg-gray-50 ".concat(className)}>
      {stats.map(function (stat, index) { return (<div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={"p-3 rounded-lg ".concat(stat.bgColor)}>
              <i className={"".concat(stat.icon, " text-2xl ").concat(stat.iconColor)}></i>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>); })}
    </div>);
}
