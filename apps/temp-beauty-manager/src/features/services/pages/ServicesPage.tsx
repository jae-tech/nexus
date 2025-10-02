import { useState, useMemo } from 'react';
import Sidebar from '@/shared/components/Sidebar';
import PageHeader from '@/shared/components/PageHeader';
import FilterBar from '@/shared/components/FilterBar';
import SearchBar from '@/shared/components/SearchBar';
import Button from '@/shared/components/Button';
import Toast from '@/shared/components/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { mockServices } from '@/features/services/api/mock';
import { mockServiceCategories } from '@/features/services/api/mock-categories';
import AddServiceModal from '@/features/services/components/AddServiceModal';
import EditServiceModal from '@/features/services/components/EditServiceModal';
import CategoryManagementModal from '@/features/services/components/CategoryManagementModal';
import BulkPriceModal from '@/features/services/components/BulkPriceModal';
import CategoryTabs from '@/features/services/components/CategoryTabs';
import PriceRangeFilter from '@/features/services/components/PriceRangeFilter';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceTable from '@/features/services/components/ServiceTable';

type ViewMode = 'card' | 'table';
type StatusFilter = 'all' | 'active' | 'inactive';
type SortOption = 'name' | 'price' | 'popularity' | 'newest';

interface Service {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description?: string;
  isActive: boolean;
  monthlyUsage: number;
  totalRevenue: number;
  isPopular?: boolean;
  priceOptions?: any[];
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
}

export default function ServicesPage() {
  const { toasts, removeToast, success, error } = useToast();
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>(
    mockServiceCategories.map((cat) => ({ ...cat, color: 'blue' }))
  );
  const [serviceList, setServiceList] = useState<Service[]>(
    mockServices.map((service) => ({
      ...service,
      categoryName:
        mockServiceCategories.find((cat) => cat.id === service.categoryId)
          ?.name || '기타',
      monthlyUsage: Math.floor(Math.random() * 50) + 10,
      totalRevenue: Math.floor(Math.random() * 2000000) + 500000,
      isPopular: Math.random() > 0.7,
      priceOptions: [],
    }))
  );

  const filteredAndSortedServices = useMemo(() => {
    const filtered = serviceList.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || service.categoryId === selectedCategory;
      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && service.isActive) ||
        (statusFilter === 'inactive' && !service.isActive);
      const matchesPrice =
        service.basePrice >= priceRange[0] &&
        service.basePrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    filtered.sort((a, b) => {
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
  }, [
    serviceList,
    searchQuery,
    selectedCategory,
    statusFilter,
    sortOption,
    priceRange,
  ]);

  const handleStatusToggle = (serviceId: string) => {
    setServiceList((prev) =>
      prev.map((service) =>
        service.id === serviceId
          ? { ...service, isActive: !service.isActive }
          : service
      )
    );
    success('서비스 상태가 변경되었습니다.');
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleServiceCardClick = (service: Service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  const handleDuplicateService = (service: Service) => {
    const newService = {
      ...service,
      id: Date.now().toString(),
      name: `${service.name} (복사본)`,
    };
    setServiceList((prev) => [...prev, newService]);
    success('서비스가 복제되었습니다.');
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
      setServiceList((prev) => prev.filter((s) => s.id !== serviceId));
      success('서비스가 삭제되었습니다.');
    }
  };

  const handleCategorySave = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    success('카테고리가 저장되었습니다.');
  };

  const handleBulkPriceApply = (
    selectedServices: string[],
    adjustmentType: 'fixed' | 'percent',
    adjustmentValue: number,
    direction: 'increase' | 'decrease'
  ) => {
    setServiceList((prev) =>
      prev.map((service) => {
        if (!selectedServices.includes(service.id)) return service;

        let newPrice = service.basePrice;
        if (adjustmentType === 'fixed') {
          newPrice =
            direction === 'increase'
              ? service.basePrice + adjustmentValue
              : Math.max(0, service.basePrice - adjustmentValue);
        } else {
          const multiplier =
            direction === 'increase'
              ? 1 + adjustmentValue / 100
              : 1 - adjustmentValue / 100;
          newPrice = Math.max(0, Math.round(service.basePrice * multiplier));
        }

        return { ...service, basePrice: newPrice };
      })
    );
    success(`${selectedServices.length}개 서비스의 가격이 수정되었습니다.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="transition-all duration-300 md:ml-48 lg:ml-60">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <PageHeader
            title="서비스 관리"
            searchBar={
              <div className="w-full md:w-80">
                <SearchBar
                  placeholder="서비스명 검색..."
                  onSearch={setSearchQuery}
                />
              </div>
            }
            actions={
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Button
                  variant="outline"
                  className="px-2 text-xs md:px-3 md:text-sm"
                  onClick={() => setShowCategoryModal(true)}
                >
                  <i className="ri-settings-line mr-1 md:mr-2" />
                  <span className="hidden sm:inline">카테고리 관리</span>
                  <span className="sm:hidden">카테고리</span>
                </Button>
                <Button
                  variant="outline"
                  className="px-2 text-xs md:px-3 md:text-sm"
                  onClick={() => setShowBulkPriceModal(true)}
                >
                  <i className="ri-price-tag-line mr-1 md:mr-2" />
                  <span className="hidden sm:inline">일괄 가격 수정</span>
                  <span className="sm:hidden">가격</span>
                </Button>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  <button
                    onClick={() => setViewMode('card')}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                      viewMode === 'card'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <i className="ri-grid-line mr-1" />
                    <span className="hidden sm:inline">카드</span>
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    className={`rounded-md px-2 py-1.5 text-xs font-medium transition-colors md:px-3 md:text-sm ${
                      viewMode === 'table'
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <i className="ri-list-check mr-1" />
                    <span className="hidden sm:inline">테이블</span>
                  </button>
                </div>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
                >
                  <i className="ri-add-line mr-1 md:mr-2" />
                  <span className="hidden sm:inline">새 서비스 추가</span>
                  <span className="sm:hidden">추가</span>
                </Button>
              </div>
            }
          />

          {/* Filter Bar */}
          <FilterBar>
            <div className="flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-4">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    상태:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as StatusFilter)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">활성</option>
                    <option value="inactive">비활성</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    정렬:
                  </span>
                  <select
                    value={sortOption}
                    onChange={(e) =>
                      setSortOption(e.target.value as SortOption)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="name">이름순</option>
                    <option value="price">가격순</option>
                    <option value="popularity">인기순</option>
                    <option value="newest">최신순</option>
                  </select>
                </div>
                <PriceRangeFilter
                  value={priceRange}
                  onChange={setPriceRange}
                  min={0}
                  max={200000}
                />
              </div>
            </div>
          </FilterBar>

          {/* Category Tabs */}
          <div className="border-b border-gray-200 bg-white px-4 py-4 md:px-8">
            <CategoryTabs
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
              serviceCounts={serviceList.reduce(
                (acc, service) => {
                  acc[service.categoryId] = (acc[service.categoryId] || 0) + 1;
                  return acc;
                },
                {} as Record<string, number>
              )}
            />
          </div>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onEdit={handleEditService}
                  onDuplicate={handleDuplicateService}
                  onDelete={handleDeleteService}
                  onStatusToggle={handleStatusToggle}
                  onCardClick={handleServiceCardClick}
                />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <ServiceTable
                services={filteredAndSortedServices}
                onEdit={handleEditService}
                onDuplicate={handleDuplicateService}
                onDelete={handleDeleteService}
                onStatusToggle={handleStatusToggle}
              />
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedServices.length === 0 && (
            <div className="py-12 text-center">
              <i className="ri-scissors-line mb-4 text-6xl text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 필터를 시도해보세요.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddServiceModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newService) => {
            setServiceList((prev) => [
              ...prev,
              {
                ...newService,
                id: Date.now().toString(),
                monthlyUsage: 0,
                totalRevenue: 0,
                priceOptions: [],
              },
            ]);
            setShowAddModal(false);
            success('새 서비스가 추가되었습니다.');
          }}
          categories={categories}
        />
      )}

      {showEditModal && selectedService && (
        <EditServiceModal
          service={selectedService}
          onClose={() => {
            setShowEditModal(false);
            setSelectedService(null);
          }}
          onSave={(updatedService) => {
            setServiceList((prev) =>
              prev.map((s) => (s.id === updatedService.id ? updatedService : s))
            );
            setShowEditModal(false);
            setSelectedService(null);
            success('서비스 정보가 수정되었습니다.');
          }}
          categories={categories}
        />
      )}

      {/* 서비스 상세 모달 */}
      {showDetailModal && selectedService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white">
            <div className="sticky top-0 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
              <h2 className="text-xl font-semibold text-gray-900">
                서비스 상세 정보
              </h2>
              <button
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedService(null);
                }}
                className="rounded-lg p-2 transition-colors hover:bg-gray-100"
              >
                <i className="ri-close-line text-xl text-gray-500" />
              </button>
            </div>

            <div className="p-6">
              <div className="space-y-6">
                {/* 기본 정보 */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    기본 정보
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        서비스명
                      </label>
                      <p className="text-gray-900">{selectedService.name}</p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        카테고리
                      </label>
                      <p className="text-gray-900">
                        {selectedService.categoryName}
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        가격
                      </label>
                      <p className="text-gray-900">
                        {new Intl.NumberFormat('ko-KR').format(
                          selectedService.basePrice
                        )}
                        원
                      </p>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        소요시간
                      </label>
                      <p className="text-gray-900">
                        {selectedService.duration}분
                      </p>
                    </div>
                  </div>
                </div>

                {/* 서비스 설명 */}
                {selectedService.description && (
                  <div>
                    <h3 className="mb-4 text-lg font-medium text-gray-900">
                      서비스 설명
                    </h3>
                    <p className="text-gray-700">
                      {selectedService.description}
                    </p>
                  </div>
                )}

                {/* 이용 통계 */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    이용 통계
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4">
                      <p className="text-sm font-medium text-blue-600">
                        이번 달 이용
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {selectedService.monthlyUsage}회
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4">
                      <p className="text-sm font-medium text-green-600">
                        총 매출
                      </p>
                      <p className="text-2xl font-bold text-green-900">
                        {Math.floor(selectedService.totalRevenue / 10000)}만원
                      </p>
                    </div>
                    <div className="rounded-lg bg-purple-50 p-4">
                      <p className="text-sm font-medium text-purple-600">
                        상태
                      </p>
                      <p
                        className={`text-2xl font-bold ${selectedService.isActive ? 'text-green-900' : 'text-red-900'}`}
                      >
                        {selectedService.isActive ? '활성' : '비활성'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼 */}
              <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
                <Button
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditService(selectedService);
                  }}
                  className="bg-blue-600 text-white hover:bg-blue-700"
                >
                  <i className="ri-edit-line mr-2" />
                  수정
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedService(null);
                  }}
                >
                  닫기
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showCategoryModal && (
        <CategoryManagementModal
          categories={categories}
          onClose={() => setShowCategoryModal(false)}
          onSave={handleCategorySave}
          serviceCounts={serviceList.reduce(
            (acc, service) => {
              acc[service.categoryId] = (acc[service.categoryId] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          )}
        />
      )}

      {showBulkPriceModal && (
        <BulkPriceModal
          services={serviceList}
          onClose={() => setShowBulkPriceModal(false)}
          onApply={handleBulkPriceApply}
        />
      )}

      {/* Toast Messages */}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </div>
  );
}
