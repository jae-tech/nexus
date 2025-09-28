"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TreatmentHistory;
var react_1 = require("react");
var Card_1 = require("../../../../components/base/Card");
var Button_1 = require("../../../../components/base/Button");
var useToast_1 = require("../../../../hooks/useToast");
function TreatmentHistory(_a) {
    var visitHistory = _a.visitHistory, onAddTreatment = _a.onAddTreatment;
    var showToast = (0, useToast_1.useToast)().showToast;
    var _b = (0, react_1.useState)('all'), filter = _b[0], setFilter = _b[1];
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        var weekdays = ['일', '월', '화', '수', '목', '금', '토'];
        var weekday = weekdays[date.getDay()];
        return {
            date: date.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            weekday: weekday,
            dayMonth: "".concat(date.getMonth() + 1, "\uC6D4 ").concat(date.getDate(), "\uC77C")
        };
    };
    var formatAmount = function (amount) {
        if (!amount)
            return '';
        return amount.toLocaleString('ko-KR') + '원';
    };
    var handleEditTreatment = function (visitId) {
        console.log('시술 수정:', visitId);
        showToast('시술 수정 기능을 준비 중입니다.', 'info');
    };
    var handleDeleteTreatment = function (visitId) {
        if (confirm('정말 이 시술 기록을 삭제하시겠습니까?')) {
            console.log('시술 삭제:', visitId);
            showToast('시술 기록이 삭제되었습니다.', 'success');
        }
    };
    var filteredHistory = visitHistory.filter(function (visit) {
        if (searchQuery) {
            var searchLower_1 = searchQuery.toLowerCase();
            return visit.services.some(function (service) {
                return service.toLowerCase().includes(searchLower_1);
            }) || visit.employee.name.toLowerCase().includes(searchLower_1);
        }
        return true;
    });
    return (<div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">시술 이력</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <i className="ri-search-line absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
              <input type="text" placeholder="서비스명 또는 담당직원으로 검색" value={searchQuery} onChange={function (e) { return setSearchQuery(e.target.value); }} className="w-80 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
            </div>
            <Button_1.default variant="primary" onClick={onAddTreatment}>
              <i className="ri-add-line"></i>
              새 시술/예약 추가
            </Button_1.default>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">기간:</span>
              <select value={filter} onChange={function (e) { return setFilter(e.target.value); }} className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="all">전체</option>
                <option value="6months">최근 6개월</option>
                <option value="1year">최근 1년</option>
              </select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold text-blue-600">{filteredHistory.length}</span>건
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {filteredHistory.length > 0 ? (<div className="space-y-8">
              {filteredHistory.map(function (visit, index) {
                var _a = formatDate(visit.date), date = _a.date, weekday = _a.weekday, dayMonth = _a.dayMonth;
                return (<div key={visit.id} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex flex-col items-center w-20 flex-shrink-0">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                      <div className="text-center mt-3">
                        <div className="text-sm font-semibold text-gray-800">
                          {dayMonth}
                        </div>
                        <div className="text-xs text-gray-500">({weekday}요일)</div>
                      </div>
                    </div>

                    {/* Treatment Card */}
                    <div className="flex-1">
                      <Card_1.default hover className="relative">
                        {/* Amount and Actions */}
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                          {visit.amount && (<span className="text-lg font-semibold text-green-600">
                              {formatAmount(visit.amount)}
                            </span>)}
                          <div className="flex items-center gap-1">
                            <Button_1.default variant="icon" size="sm" onClick={function () { return handleEditTreatment(visit.id); }}>
                              <i className="ri-edit-line text-gray-500 hover:text-blue-600"></i>
                            </Button_1.default>
                            <Button_1.default variant="icon" size="sm" onClick={function () { return handleDeleteTreatment(visit.id); }}>
                              <i className="ri-delete-bin-line text-gray-500 hover:text-red-600"></i>
                            </Button_1.default>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="mb-4 pr-40">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            {visit.services.join(' + ')}
                          </h3>
                          
                          {/* Employee */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                              {visit.employee.avatar ? (<img src={visit.employee.avatar} alt={visit.employee.name} className="w-full h-full object-cover"/>) : (<div className="w-full h-full flex items-center justify-center">
                                  <i className="ri-user-line text-gray-500 text-sm"></i>
                                </div>)}
                            </div>
                            <span className="text-sm text-gray-600">
                              담당: <span className="font-medium text-gray-800">{visit.employee.name}</span>
                            </span>
                          </div>

                          {/* Memo */}
                          {visit.memo && (<div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700 leading-relaxed">
                                {visit.memo}
                              </p>
                            </div>)}
                        </div>
                      </Card_1.default>
                    </div>
                  </div>);
            })}
            </div>) : (
        /* Empty State */
        <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-scissors-line text-3xl text-gray-400"></i>
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchQuery ? '검색 결과가 없습니다' : '첫 번째 시술을 기록해보세요'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? '다른 검색어로 시도해보세요' : '고객님의 시술 이력을 관리하여 더 나은 서비스를 제공하세요'}
              </p>
              <Button_1.default variant="primary" onClick={onAddTreatment}>
                <i className="ri-add-line"></i>
                첫 시술 기록하기
              </Button_1.default>
            </div>)}
        </div>
      </div>
    </div>);
}
