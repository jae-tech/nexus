"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = SummaryStats;
var Card_1 = require("../../../../components/base/Card");
function SummaryStats(_a) {
    var customer = _a.customer;
    // 통계 계산
    var totalVisits = customer.visitHistory.length;
    var totalAmount = customer.visitHistory.reduce(function (sum, visit) { return sum + (visit.amount || 0); }, 0);
    var averageAmount = totalVisits > 0 ? Math.round(totalAmount / totalVisits) : 0;
    // 최근 방문일 계산
    var lastVisit = customer.visitHistory.length > 0
        ? new Date(customer.visitHistory[0].date)
        : null;
    var daysSinceLastVisit = lastVisit
        ? Math.floor((new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
        : 0;
    // 가장 많이 받은 서비스 계산
    var serviceCount = {};
    customer.visitHistory.forEach(function (visit) {
        visit.services.forEach(function (service) {
            serviceCount[service] = (serviceCount[service] || 0) + 1;
        });
    });
    var favoriteService = Object.keys(serviceCount).length > 0
        ? Object.keys(serviceCount).reduce(function (a, b) { return serviceCount[a] > serviceCount[b] ? a : b; })
        : '없음';
    var stats = [
        {
            icon: 'ri-calendar-check-line',
            label: '총 방문 횟수',
            value: "".concat(totalVisits, "\uD68C"),
            color: 'blue'
        },
        {
            icon: 'ri-money-dollar-circle-line',
            label: '총 결제 금액',
            value: "".concat(totalAmount.toLocaleString(), "\uC6D0"),
            color: 'green'
        },
        {
            icon: 'ri-bar-chart-line',
            label: '평균 결제 금액',
            value: "".concat(averageAmount.toLocaleString(), "\uC6D0"),
            color: 'purple'
        },
        {
            icon: 'ri-time-line',
            label: '마지막 방문',
            value: daysSinceLastVisit === 0 ? '오늘' : "".concat(daysSinceLastVisit, "\uC77C \uC804"),
            color: 'orange'
        },
        {
            icon: 'ri-heart-line',
            label: '선호 서비스',
            value: favoriteService,
            color: 'pink'
        }
    ];
    var getColorClasses = function (color) {
        var colorMap = {
            blue: 'bg-blue-100 text-blue-600',
            green: 'bg-green-100 text-green-600',
            purple: 'bg-purple-100 text-purple-600',
            orange: 'bg-orange-100 text-orange-600',
            pink: 'bg-pink-100 text-pink-600'
        };
        return colorMap[color] || 'bg-gray-100 text-gray-600';
    };
    return (<div className="p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">고객 통계</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map(function (stat, index) { return (<Card_1.default key={index} hover className="text-center">
            <div className={"w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ".concat(getColorClasses(stat.color))}>
              <i className={"".concat(stat.icon, " text-xl")}></i>
            </div>
            <div className="text-2xl font-bold text-gray-800 mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600">
              {stat.label}
            </div>
          </Card_1.default>); })}
      </div>

      {/* 추가 인사이트 */}
      {totalVisits > 0 && (<div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card_1.default>
            <h4 className="font-semibold text-gray-800 mb-3">방문 패턴</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">첫 방문:</span>
                <span className="font-medium">
                  {new Date(customer.registeredAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">방문 주기:</span>
                <span className="font-medium">
                  {totalVisits > 1 ? "\uC57D ".concat(Math.round(daysSinceLastVisit / totalVisits), "\uC77C") : '신규 고객'}
                </span>
              </div>
            </div>
          </Card_1.default>

          <Card_1.default>
            <h4 className="font-semibold text-gray-800 mb-3">서비스 이용 현황</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">이용 서비스 수:</span>
                <span className="font-medium">{Object.keys(serviceCount).length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">선호 서비스:</span>
                <span className="font-medium">{favoriteService}</span>
              </div>
            </div>
          </Card_1.default>
        </div>)}
    </div>);
}
