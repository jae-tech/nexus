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
exports.default = CustomersPage;
var react_1 = require("react");
var react_router_dom_1 = require("react-router-dom");
var Sidebar_1 = require("../../components/feature/Sidebar");
var PageHeader_1 = require("../../components/feature/PageHeader");
var FilterBar_1 = require("../../components/feature/FilterBar");
var SearchBar_1 = require("../../components/base/SearchBar");
var Card_1 = require("../../components/base/Card");
var Button_1 = require("../../components/base/Button");
var FloatingButton_1 = require("../../components/feature/FloatingButton");
var AddCustomerModal_1 = require("../../components/common/AddCustomerModal");
var Toast_1 = require("../../components/common/Toast");
var useToast_1 = require("../../hooks/useToast");
var customers_1 = require("../../mocks/customers");
function CustomersPage() {
    var navigate = (0, react_router_dom_1.useNavigate)();
    var _a = (0, useToast_1.useToast)(), toasts = _a.toasts, removeToast = _a.removeToast, success = _a.success, error = _a.error;
    var _b = (0, react_1.useState)(''), searchQuery = _b[0], setSearchQuery = _b[1];
    var _c = (0, react_1.useState)('all'), selectedFilter = _c[0], setSelectedFilter = _c[1];
    var _d = (0, react_1.useState)('name'), sortBy = _d[0], setSortBy = _d[1];
    var _e = (0, react_1.useState)(false), showAddModal = _e[0], setShowAddModal = _e[1];
    var _f = (0, react_1.useState)(customers_1.mockCustomers), customerList = _f[0], setCustomerList = _f[1];
    var _g = (0, react_1.useState)('all'), gradeFilter = _g[0], setGradeFilter = _g[1];
    var _h = (0, react_1.useState)('name'), sortOption = _h[0], setSortOption = _h[1];
    var filteredAndSortedCustomers = (0, react_1.useMemo)(function () {
        var filtered = customerList.filter(function (customer) {
            var matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                customer.phone.includes(searchQuery);
            if (!matchesSearch)
                return false;
            var today = new Date();
            var lastVisitDate = customer.lastVisit ? new Date(customer.lastVisit) : null;
            var registeredDate = new Date(customer.registeredDate);
            switch (selectedFilter) {
                case 'recent':
                    if (!lastVisitDate)
                        return false;
                    var daysSinceVisit = Math.floor((today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24));
                    return daysSinceVisit <= 30;
                case 'regular':
                    return customer.visitCount >= 5;
                case 'new':
                    var daysSinceRegistered = Math.floor((today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
                    return daysSinceRegistered <= 30;
                default:
                    return true;
            }
        });
        filtered.sort(function (a, b) {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'lastVisit':
                    if (!a.lastVisit && !b.lastVisit)
                        return 0;
                    if (!a.lastVisit)
                        return 1;
                    if (!b.lastVisit)
                        return -1;
                    return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
                case 'visitCount':
                    return b.visitCount - a.visitCount;
                case 'registered':
                    return new Date(b.registeredDate).getTime() - new Date(a.registeredDate).getTime();
                default:
                    return 0;
            }
        });
        return filtered;
    }, [customerList, searchQuery, selectedFilter, sortBy]);
    var handleSearch = function (query) {
        setSearchQuery(query);
    };
    var handleNewCustomer = function () {
        setShowAddModal(true);
    };
    var handleAddCustomer = function (newCustomer) {
        setCustomerList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newCustomer], false); });
        setShowAddModal(false);
        success('새 고객이 성공적으로 등록되었습니다.');
    };
    var handleCustomerClick = function (customerId) {
        navigate("/customers/".concat(customerId));
    };
    var handlePhoneCall = function (phone, e) {
        e.stopPropagation();
        window.location.href = "tel:".concat(phone);
    };
    var handleBookAppointment = function (customer, e) {
        e.stopPropagation();
        navigate('/reservations', { state: { preselectedCustomer: customer } });
    };
    var getVisitStatus = function (lastVisit) {
        if (!lastVisit)
            return { text: '방문 기록 없음', color: 'text-gray-500' };
        var lastVisitDate = new Date(lastVisit);
        var today = new Date();
        var diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
        var diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        if (diffDays <= 7)
            return { text: "".concat(diffDays, "\uC77C \uC804"), color: 'text-green-600' };
        if (diffDays <= 30)
            return { text: "".concat(diffDays, "\uC77C \uC804"), color: 'text-yellow-600' };
        return { text: "".concat(diffDays, "\uC77C \uC804"), color: 'text-red-600' };
    };
    var getCustomerTypeLabel = function (customer) {
        var today = new Date();
        var registeredDate = new Date(customer.registeredDate);
        var daysSinceRegistered = Math.floor((today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24));
        if (daysSinceRegistered <= 30)
            return { text: 'NEW', color: 'bg-green-100 text-green-800' };
        if (customer.visitCount >= 10)
            return { text: 'VIP', color: 'bg-purple-100 text-purple-800' };
        if (customer.visitCount >= 5)
            return { text: '단골', color: 'bg-blue-100 text-blue-800' };
        return null;
    };
    return (<div className="min-h-screen bg-gray-50">
      <Sidebar_1.default />
      
      <div className="lg:ml-60 md:ml-48 transition-all duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <PageHeader_1.default title="고객 관리" searchBar={<div className="w-full md:w-80">
                <SearchBar_1.default placeholder="고객명, 연락처 검색..." onSearch={setSearchQuery}/>
              </div>} actions={<div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <Button_1.default variant="outline" className="text-xs md:text-sm px-2 md:px-3" onClick={function () { }}>
                  <i className="ri-download-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">엑셀 내보내기</span>
                  <span className="sm:hidden">내보내기</span>
                </Button_1.default>
                <Button_1.default onClick={function () { return setShowAddModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4">
                  <i className="ri-add-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">새 고객 추가</span>
                  <span className="sm:hidden">추가</span>
                </Button_1.default>
              </div>}/>

          {/* Filter Bar */}
          <FilterBar_1.default>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">등급:</span>
                  <select value={gradeFilter} onChange={function (e) { return setGradeFilter(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 등급</option>
                    <option value="VIP">VIP</option>
                    <option value="골드">골드</option>
                    <option value="실버">실버</option>
                    <option value="브론즈">브론즈</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">정렬:</span>
                  <select value={sortOption} onChange={function (e) { return setSortOption(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="name">이름순</option>
                    <option value="recent">최근 방문순</option>
                    <option value="totalSpent">총 결제금액순</option>
                    <option value="visitCount">방문횟수순</option>
                  </select>
                </div>
              </div>
            </div>
          </FilterBar_1.default>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {/* Customer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredAndSortedCustomers.map(function (customer) {
            var visitStatus = getVisitStatus(customer.lastVisit);
            var customerType = getCustomerTypeLabel(customer);
            return (<Card_1.default key={customer.id} hover className="relative cursor-pointer" onClick={function () { return handleCustomerClick(customer.id); }}>
                  {/* Customer Type Badge */}
                  {customerType && (<div className="absolute top-3 right-3">
                      <span className={"px-2 py-1 rounded-full text-xs font-medium ".concat(customerType.color)}>
                        {customerType.text}
                      </span>
                    </div>)}

                  {/* Customer Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="ri-user-line text-blue-600 text-xl"></i>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-800 truncate">{customer.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{customer.phone}</p>
                      </div>
                    </div>
                  </div>

                  {/* Visit Info */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">최근 방문</span>
                      <span className={visitStatus.color}>{visitStatus.text}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">최근 서비스</span>
                      <span className="text-gray-800 truncate ml-2">{customer.lastService || '없음'}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">담당 직원</span>
                      <span className="text-gray-800 truncate ml-2">{customer.mainStaff || '없음'}</span>
                    </div>
                  </div>

                  {/* Visit Count Badge */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      총 {customer.visitCount}회 방문
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button onClick={function (e) { return handlePhoneCall(customer.phone, e); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="전화걸기">
                      <i className="ri-phone-line"></i>
                      <span className="hidden sm:inline">전화</span>
                    </button>
                    <button onClick={function (e) { return handleBookAppointment(customer, e); }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors" title="예약하기">
                      <i className="ri-calendar-event-line"></i>
                      <span className="hidden sm:inline">예약</span>
                    </button>
                  </div>

                  {/* Memo Preview */}
                  {customer.memo && (<div className="mt-3 pt-3 border-t border-gray-100">
                      <p className="text-xs text-gray-500 line-clamp-2">{customer.memo}</p>
                    </div>)}
                </Card_1.default>);
        })}
          </div>

          {/* Empty State */}
          {filteredAndSortedCustomers.length === 0 && (<div className="text-center py-12">
              <i className="ri-user-line text-6xl text-gray-300 mb-4 block"></i>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchQuery || selectedFilter !== 'all' ? '검색 결과가 없습니다' : '등록된 고객이 없습니다'}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery || selectedFilter !== 'all' ? '다른 검색어나 필터를 시도해보세요' : '첫 번째 고객을 등록해보세요'}
              </p>
              <Button_1.default variant="primary" onClick={handleNewCustomer}>
                <i className="ri-user-add-line mr-2"></i>
                신규 고객 등록
              </Button_1.default>
            </div>)}
        </div>

        {/* Floating Action Button */}
        <FloatingButton_1.default onClick={handleNewCustomer} icon="ri-user-add-line" label="신규 고객 등록"/>

        {/* Add Customer Modal */}
        {showAddModal && (<AddCustomerModal_1.default onClose={function () { return setShowAddModal(false); }} onAdd={handleAddCustomer} existingCustomers={customerList}/>)}

        {/* Toast Messages */}
        {toasts.map(function (toast) { return (<Toast_1.default key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={function () { return removeToast(toast.id); }}/>); })}
      </div>
    </div>);
}
