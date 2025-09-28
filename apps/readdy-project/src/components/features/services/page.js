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
exports.default = ServicesPage;
var react_1 = require("react");
var Sidebar_1 = require("../../components/feature/Sidebar");
var PageHeader_1 = require("../../components/feature/PageHeader");
var FilterBar_1 = require("../../components/feature/FilterBar");
var SearchBar_1 = require("../../components/base/SearchBar");
var Button_1 = require("../../components/base/Button");
var Toast_1 = require("../../components/common/Toast");
var useToast_1 = require("../../hooks/useToast");
var services_1 = require("../../mocks/services");
var serviceCategories_1 = require("../../mocks/serviceCategories");
var AddServiceModal_1 = require("./components/AddServiceModal");
var EditServiceModal_1 = require("./components/EditServiceModal");
var CategoryManagementModal_1 = require("./components/CategoryManagementModal");
var BulkPriceModal_1 = require("./components/BulkPriceModal");
var CategoryTabs_1 = require("./components/CategoryTabs");
var PriceRangeFilter_1 = require("./components/PriceRangeFilter");
var ServiceCard_1 = require("./components/ServiceCard");
var ServiceTable_1 = require("./components/ServiceTable");
function ServicesPage() {
    var _a = (0, useToast_1.useToast)(), toasts = _a.toasts, removeToast = _a.removeToast, success = _a.success, error = _a.error;
    var _b = (0, react_1.useState)('card'), viewMode = _b[0], setViewMode = _b[1];
    var _c = (0, react_1.useState)(''), searchQuery = _c[0], setSearchQuery = _c[1];
    var _d = (0, react_1.useState)('all'), selectedCategory = _d[0], setSelectedCategory = _d[1];
    var _e = (0, react_1.useState)('all'), statusFilter = _e[0], setStatusFilter = _e[1];
    var _f = (0, react_1.useState)('name'), sortOption = _f[0], setSortOption = _f[1];
    var _g = (0, react_1.useState)([0, 200000]), priceRange = _g[0], setPriceRange = _g[1];
    var _h = (0, react_1.useState)(false), showAddModal = _h[0], setShowAddModal = _h[1];
    var _j = (0, react_1.useState)(false), showEditModal = _j[0], setShowEditModal = _j[1];
    var _k = (0, react_1.useState)(false), showDetailModal = _k[0], setShowDetailModal = _k[1];
    var _l = (0, react_1.useState)(false), showCategoryModal = _l[0], setShowCategoryModal = _l[1];
    var _m = (0, react_1.useState)(false), showBulkPriceModal = _m[0], setShowBulkPriceModal = _m[1];
    var _o = (0, react_1.useState)(null), selectedService = _o[0], setSelectedService = _o[1];
    var _p = (0, react_1.useState)(serviceCategories_1.mockServiceCategories.map(function (cat) { return (__assign(__assign({}, cat), { color: 'blue' })); })), categories = _p[0], setCategories = _p[1];
    var _q = (0, react_1.useState)(services_1.mockServices.map(function (service) {
        var _a;
        return (__assign(__assign({}, service), { categoryName: ((_a = serviceCategories_1.mockServiceCategories.find(function (cat) { return cat.id === service.categoryId; })) === null || _a === void 0 ? void 0 : _a.name) || '기타', monthlyUsage: Math.floor(Math.random() * 50) + 10, totalRevenue: Math.floor(Math.random() * 2000000) + 500000, isPopular: Math.random() > 0.7, priceOptions: [] }));
    })), serviceList = _q[0], setServiceList = _q[1];
    var filteredAndSortedServices = (0, react_1.useMemo)(function () {
        var filtered = serviceList.filter(function (service) {
            var _a;
            var matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                ((_a = service.description) === null || _a === void 0 ? void 0 : _a.toLowerCase().includes(searchQuery.toLowerCase()));
            var matchesCategory = selectedCategory === 'all' || service.categoryId === selectedCategory;
            var matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && service.isActive) ||
                (statusFilter === 'inactive' && !service.isActive);
            var matchesPrice = service.basePrice >= priceRange[0] && service.basePrice <= priceRange[1];
            return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
        });
        filtered.sort(function (a, b) {
            switch (sortOption) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'price':
                    return a.basePrice - b.basePrice;
                case 'popularity':
                    return b.monthlyUsage - a.monthlyUsage;
                case 'newest':
                    return b.id.localeCompare(a.id);
                default:
                    return 0;
            }
        });
        return filtered;
    }, [serviceList, searchQuery, selectedCategory, statusFilter, sortOption, priceRange]);
    var handleStatusToggle = function (serviceId) {
        setServiceList(function (prev) { return prev.map(function (service) {
            return service.id === serviceId
                ? __assign(__assign({}, service), { isActive: !service.isActive }) : service;
        }); });
        success('서비스 상태가 변경되었습니다.');
    };
    var handleEditService = function (service) {
        setSelectedService(service);
        setShowEditModal(true);
    };
    var handleServiceCardClick = function (service) {
        setSelectedService(service);
        setShowDetailModal(true);
    };
    var handleDuplicateService = function (service) {
        var newService = __assign(__assign({}, service), { id: Date.now().toString(), name: "".concat(service.name, " (\uBCF5\uC0AC\uBCF8)") });
        setServiceList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [newService], false); });
        success('서비스가 복제되었습니다.');
    };
    var handleDeleteService = function (serviceId) {
        if (confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
            setServiceList(function (prev) { return prev.filter(function (s) { return s.id !== serviceId; }); });
            success('서비스가 삭제되었습니다.');
        }
    };
    var handleCategorySave = function (updatedCategories) {
        setCategories(updatedCategories);
        success('카테고리가 저장되었습니다.');
    };
    var handleBulkPriceApply = function (selectedServices, adjustmentType, adjustmentValue, direction) {
        setServiceList(function (prev) { return prev.map(function (service) {
            if (!selectedServices.includes(service.id))
                return service;
            var newPrice = service.basePrice;
            if (adjustmentType === 'fixed') {
                newPrice = direction === 'increase'
                    ? service.basePrice + adjustmentValue
                    : Math.max(0, service.basePrice - adjustmentValue);
            }
            else {
                var multiplier = direction === 'increase'
                    ? 1 + (adjustmentValue / 100)
                    : 1 - (adjustmentValue / 100);
                newPrice = Math.max(0, Math.round(service.basePrice * multiplier));
            }
            return __assign(__assign({}, service), { basePrice: newPrice });
        }); });
        success("".concat(selectedServices.length, "\uAC1C \uC11C\uBE44\uC2A4\uC758 \uAC00\uACA9\uC774 \uC218\uC815\uB418\uC5C8\uC2B5\uB2C8\uB2E4."));
    };
    return (<div className="min-h-screen bg-gray-50">
      <Sidebar_1.default />
      
      <div className="lg:ml-60 md:ml-48 transition-all duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <PageHeader_1.default title="서비스 관리" searchBar={<div className="w-full md:w-80">
                <SearchBar_1.default placeholder="서비스명 검색..." onSearch={setSearchQuery}/>
              </div>} actions={<div className="flex items-center gap-2 md:gap-4 flex-wrap">
                <Button_1.default variant="outline" className="text-xs md:text-sm px-2 md:px-3" onClick={function () { return setShowCategoryModal(true); }}>
                  <i className="ri-settings-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">카테고리 관리</span>
                  <span className="sm:hidden">카테고리</span>
                </Button_1.default>
                <Button_1.default variant="outline" className="text-xs md:text-sm px-2 md:px-3" onClick={function () { return setShowBulkPriceModal(true); }}>
                  <i className="ri-price-tag-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">일괄 가격 수정</span>
                  <span className="sm:hidden">가격</span>
                </Button_1.default>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button onClick={function () { return setViewMode('card'); }} className={"px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewMode === 'card'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900')}>
                    <i className="ri-grid-line mr-1"></i>
                    <span className="hidden sm:inline">카드</span>
                  </button>
                  <button onClick={function () { return setViewMode('table'); }} className={"px-2 md:px-3 py-1.5 rounded-md text-xs md:text-sm font-medium transition-colors ".concat(viewMode === 'table'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900')}>
                    <i className="ri-list-check mr-1"></i>
                    <span className="hidden sm:inline">테이블</span>
                  </button>
                </div>
                <Button_1.default onClick={function () { return setShowAddModal(true); }} className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4">
                  <i className="ri-add-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">새 서비스 추가</span>
                  <span className="sm:hidden">추가</span>
                </Button_1.default>
              </div>}/>

          {/* Filter Bar */}
          <FilterBar_1.default>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">상태:</span>
                  <select value={statusFilter} onChange={function (e) { return setStatusFilter(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="all">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">정렬:</span>
                  <select value={sortOption} onChange={function (e) { return setSortOption(e.target.value); }} className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="name">이름순</option>
                    <option value="price">가격순</option>
                    <option value="popularity">인기순</option>
                    <option value="newest">최신순</option>
                  </select>
                </div>
                <PriceRangeFilter_1.default value={priceRange} onChange={setPriceRange} min={0} max={200000}/>
              </div>
            </div>
          </FilterBar_1.default>

          {/* Category Tabs */}
          <div className="bg-white border-b border-gray-200 px-4 md:px-8 py-4">
            <CategoryTabs_1.default categories={categories} selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} serviceCounts={serviceList.reduce(function (acc, service) {
            acc[service.categoryId] = (acc[service.categoryId] || 0) + 1;
            return acc;
        }, {})}/>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {viewMode === 'card' ? (<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedServices.map(function (service) { return (<ServiceCard_1.default key={service.id} service={service} onEdit={handleEditService} onDuplicate={handleDuplicateService} onDelete={handleDeleteService} onStatusToggle={handleStatusToggle} onCardClick={handleServiceCardClick}/>); })}
            </div>) : (<div className="overflow-x-auto">
              <ServiceTable_1.default services={filteredAndSortedServices} onEdit={handleEditService} onDuplicate={handleDuplicateService} onDelete={handleDeleteService} onStatusToggle={handleStatusToggle}/>
            </div>)}

          {/* Empty State */}
          {filteredAndSortedServices.length === 0 && (<div className="text-center py-12">
              <i className="ri-scissors-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
            </div>)}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (<AddServiceModal_1.default onClose={function () { return setShowAddModal(false); }} onAdd={function (newService) {
                setServiceList(function (prev) { return __spreadArray(__spreadArray([], prev, true), [__assign(__assign({}, newService), { id: Date.now().toString(), monthlyUsage: 0, totalRevenue: 0, priceOptions: [] })], false); });
                setShowAddModal(false);
                success('새 서비스가 추가되었습니다.');
            }} categories={categories}/>)}

      {showEditModal && selectedService && (<EditServiceModal_1.default service={selectedService} onClose={function () {
                setShowEditModal(false);
                setSelectedService(null);
            }} onSave={function (updatedService) {
                setServiceList(function (prev) { return prev.map(function (s) { return s.id === updatedService.id ? updatedService : s; }); });
                setShowEditModal(false);
                setSelectedService(null);
                success('서비스 정보가 수정되었습니다.');
            }} categories={categories}/>)}

      {/* 서비스 상세 모달 */}
      {showDetailModal && selectedService && (<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">서비스 상세 정보</h2>
              <button onClick={function () {
                setShowDetailModal(false);
                setSelectedService(null);
            }} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>
            
            <div className="p-6">
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">기본 정보</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">서비스명</label>
                      <p className="text-gray-900">{selectedService.name}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">카테고리</label>
                      <p className="text-gray-900">{selectedService.categoryName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">가격</label>
                      <p className="text-gray-900">{new Intl.NumberFormat('ko-KR').format(selectedService.basePrice)}원</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">소요시간</label>
                      <p className="text-gray-900">{selectedService.duration}분</p>
                    </div>
                  </div>
                </div>

                {/* 서비스 설명 */}
                {selectedService.description && (<div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">서비스 설명</h3>
                    <p className="text-gray-700">{selectedService.description}</p>
                  </div>)}

                {/* 이용 통계 */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">이용 통계</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-600 font-medium">이번 달 이용</p>
                      <p className="text-2xl font-bold text-blue-900">{selectedService.monthlyUsage}회</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-600 font-medium">총 매출</p>
                      <p className="text-2xl font-bold text-green-900">{Math.floor(selectedService.totalRevenue / 10000)}만원</p>
                    </div>
                    <div className="bg-purple-50 p-4 rounded-lg">
                      <p className="text-sm text-purple-600 font-medium">상태</p>
                      <p className={"text-2xl font-bold ".concat(selectedService.isActive ? 'text-green-900' : 'text-red-900')}>
                        {selectedService.isActive ? '활성' : '비활성'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="flex items-center gap-3 mt-8 pt-6 border-t border-gray-200">
                <Button_1.default onClick={function () {
                setShowDetailModal(false);
                handleEditService(selectedService);
            }} className="bg-blue-600 hover:bg-blue-700 text-white">
                  <i className="ri-edit-line mr-2"></i>
                  수정
                </Button_1.default>
                <Button_1.default variant="outline" onClick={function () {
                setShowDetailModal(false);
                setSelectedService(null);
            }}>
                  닫기
                </Button_1.default>
              </div>
            </div>
          </div>
        </div>)}

      {showCategoryModal && (<CategoryManagementModal_1.default categories={categories} onClose={function () { return setShowCategoryModal(false); }} onSave={handleCategorySave} serviceCounts={serviceList.reduce(function (acc, service) {
                acc[service.categoryId] = (acc[service.categoryId] || 0) + 1;
                return acc;
            }, {})}/>)}

      {showBulkPriceModal && (<BulkPriceModal_1.default services={serviceList} onClose={function () { return setShowBulkPriceModal(false); }} onApply={handleBulkPriceApply}/>)}

      {/* Toast Messages */}
      {toasts.map(function (toast) { return (<Toast_1.default key={toast.id} message={toast.message} type={toast.type} duration={toast.duration} onClose={function () { return removeToast(toast.id); }}/>); })}
    </div>);
}
