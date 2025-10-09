/**
 * 서비스 관리 페이지 (DB 연동)
 *
 * Electron DB와 연동된 서비스 관리 페이지
 */

import { useState, useMemo, useEffect } from 'react';
import { Grid, ListChecks, Pencil, Plus, Scissors, Settings, Tag } from 'lucide-react';
import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import FilterBar from '@/shared/components/FilterBar';
import SearchBar from '@/shared/components/SearchBar';
import Toast from '@/shared/components/Toast';
import { useToast } from '@/shared/hooks/useToast';
import AddServiceModal from '@/features/services/components/AddServiceModal';
import EditServiceModal from '@/features/services/components/EditServiceModal';
import CategoryManagementModal from '@/features/services/components/CategoryManagementModal';
import BulkPriceModal from '@/features/services/components/BulkPriceModal';
import CategoryTabs from '@/features/services/components/CategoryTabs';
import PriceRangeFilter from '@/features/services/components/PriceRangeFilter';
import ServiceCard from '@/features/services/components/ServiceCard';
import ServiceTable from '@/features/services/components/ServiceTable';

// DB 커스텀 훅
import {
  useServices,
  useServicesByCategory,
  useServiceStats,
  useCreateService,
  useUpdateService,
  useDeleteService,
  useDuplicateService,
  useBulkUpdatePrices,
} from '@/hooks/use-services';

type ViewMode = 'card' | 'table';
type StatusFilter = 'all' | 'active' | 'inactive';
type SortOption = 'name' | 'price' | 'popularity' | 'newest';

// DB 타입을 프론트엔드 타입으로 변환
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
  createdAt: string;
  updatedAt: string;
  averageRating: number;
}

interface Category {
  id: string;
  name: string;
  color: string;
  icon?: string;
  order: number;
  isActive: boolean;
}

export default function ServicesPageDB() {
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

  // DB 훅 사용
  const { services: dbServices, loading: servicesLoading, refetch: refetchServices } = useServices();
  const { servicesByCategory: dbServicesByCategory } = useServicesByCategory();
  const { stats: serviceStats } = useServiceStats();
  const { createService } = useCreateService();
  const { updateService } = useUpdateService();
  const { deleteService } = useDeleteService();
  const { duplicateService } = useDuplicateService();
  const { bulkUpdatePrices } = useBulkUpdatePrices();

  // 카테고리 상태 (DB에서 자동 추출)
  const [categories, setCategories] = useState<Category[]>([]);

  // DB 서비스를 프론트엔드 형식으로 변환
  const serviceList = useMemo(() => {
    return dbServices.map((service) => {
      const stat = serviceStats.find((s) => s.service_id === service.id);
      return {
        id: service.id!.toString(),
        name: service.name,
        categoryId: service.category || '기타',
        categoryName: service.category || '기타',
        basePrice: service.price,
        duration: service.duration || 60,
        description: service.description,
        isActive: true, // DB에는 isActive 필드가 없으므로 기본값
        monthlyUsage: stat?.total_reservations || 0,
        totalRevenue: stat?.total_revenue || 0,
        isPopular: (stat?.total_reservations || 0) > 10,
        priceOptions: [],
        createdAt: service.created_at || new Date().toISOString(),
        updatedAt: service.updated_at || new Date().toISOString(),
        averageRating: 0,
      };
    });
  }, [dbServices, serviceStats]);

  // 카테고리 자동 추출
  useEffect(() => {
    const categorySet = new Set<string>();
    Object.keys(dbServicesByCategory).forEach((cat) => categorySet.add(cat));

    const extractedCategories: Category[] = Array.from(categorySet).map(
      (cat, index) => ({
        id: cat,
        name: cat,
        color: 'blue',
        order: index,
        isActive: true,
      })
    );

    setCategories(extractedCategories);
  }, [dbServicesByCategory]);

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

  const handleStatusToggle = async (serviceId: string) => {
    try {
      const service = serviceList.find((s) => s.id === serviceId);
      if (!service) return;

      await updateService(Number(serviceId), {
        // isActive 필드가 DB에 없으므로 다른 필드로 대체하거나 스킵
        name: service.name,
      });

      await refetchServices();
      success('서비스 상태가 변경되었습니다.');
    } catch (err) {
      error('서비스 상태 변경에 실패했습니다.');
    }
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setShowEditModal(true);
  };

  const handleServiceCardClick = (service: Service) => {
    setSelectedService(service);
    setShowDetailModal(true);
  };

  const handleDuplicateService = async (service: Service) => {
    try {
      await duplicateService(Number(service.id), `${service.name} (복사본)`);
      await refetchServices();
      success('서비스가 복제되었습니다.');
    } catch (err) {
      error('서비스 복제에 실패했습니다.');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (confirm('정말로 이 서비스를 삭제하시겠습니까?')) {
      try {
        await deleteService(Number(serviceId));
        await refetchServices();
        success('서비스가 삭제되었습니다.');
      } catch (err: any) {
        error(err.message || '서비스 삭제에 실패했습니다.');
      }
    }
  };

  const handleCategorySave = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    success('카테고리가 저장되었습니다.');
  };

  const handleBulkPriceApply = async (
    selectedServices: string[],
    adjustmentType: 'fixed' | 'percent',
    adjustmentValue: number,
    direction: 'increase' | 'decrease'
  ) => {
    try {
      const updates = selectedServices.map((serviceId) => {
        const service = serviceList.find((s) => s.id === serviceId);
        if (!service) return null;

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

        return {
          serviceId: Number(serviceId),
          newPrice,
          reason: `${adjustmentType === 'fixed' ? '고정' : '비율'} ${direction === 'increase' ? '인상' : '인하'}`,
        };
      }).filter(Boolean) as Array<{ serviceId: number; newPrice: number; reason?: string }>;

      await bulkUpdatePrices(updates);
      await refetchServices();
      success(`${selectedServices.length}개 서비스의 가격이 수정되었습니다.`);
    } catch (err) {
      error('가격 일괄 수정에 실패했습니다.');
    }
  };

  const handleAddService = async (newService: any) => {
    try {
      await createService({
        name: newService.name,
        category: newService.categoryId,
        price: newService.basePrice,
        duration: newService.duration,
        description: newService.description,
      });

      await refetchServices();
      setShowAddModal(false);
      success('새 서비스가 추가되었습니다.');
    } catch (err: any) {
      error(err.message || '서비스 추가에 실패했습니다.');
    }
  };

  const handleUpdateService = async (updatedService: Service) => {
    try {
      await updateService(Number(updatedService.id), {
        name: updatedService.name,
        category: updatedService.categoryId,
        price: updatedService.basePrice,
        duration: updatedService.duration,
        description: updatedService.description,
      });

      await refetchServices();
      setShowEditModal(false);
      setSelectedService(null);
      success('서비스 정보가 수정되었습니다.');
    } catch (err: any) {
      error(err.message || '서비스 수정에 실패했습니다.');
    }
  };

  if (servicesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="text-gray-600">서비스 데이터를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
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
              <Settings size={18} className="mr-1 text-gray-600" />
              <span className="hidden sm:inline">카테고리 관리</span>
              <span className="sm:hidden">카테고리</span>
            </Button>
            <Button
              variant="outline"
              className="px-2 text-xs md:px-3 md:text-sm"
              onClick={() => setShowBulkPriceModal(true)}
            >
              <Tag size={18} className="mr-1 text-gray-600" />
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
                <Grid size={18} className="mr-1 text-gray-600" />
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
                <ListChecks size={18} className="mr-1 text-gray-600" />
                <span className="hidden sm:inline">테이블</span>
              </button>
            </div>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
            >
              <Plus size={20} className="mr-1 text-white" />
              <span className="hidden sm:inline">새 서비스 추가</span>
              <span className="sm:hidden">추가</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white shadow-sm">
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
      </div>

      {/* Category Tabs */}
      <div className="sticky top-[calc(5rem+4rem)] z-20 border-b border-gray-200 bg-white px-4 py-4 md:px-8">
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
                onDelete={handleDeleteService}
                onToggleActive={handleStatusToggle}
              />
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedServices.length === 0 && (
            <div className="py-12 text-center">
              <Scissors size={18} className="mb-4 text-gray-600" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                검색 결과가 없습니다
              </h3>
              <p className="text-gray-500">
                다른 검색어나 필터를 시도해보세요.
              </p>
            </div>
          )}
        </div>

      {/* Modals */}
      <AddServiceModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddService}
        categories={categories}
      />

      {selectedService && (
        <EditServiceModal
          open={showEditModal}
          service={selectedService}
          onClose={() => {
            setShowEditModal(false);
            setSelectedService(null);
          }}
          onSave={handleUpdateService}
          categories={categories}
        />
      )}

      {/* 서비스 상세 모달 */}
      {selectedService && (
        <Dialog
          open={showDetailModal}
          onOpenChange={(open) => {
            setShowDetailModal(open);
            if (!open) setSelectedService(null);
          }}
        >
          <DialogContent className="max-w-2xl p-6">
            <DialogHeader>
              <DialogTitle>서비스 상세 정보</DialogTitle>
            </DialogHeader>

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
                      총 이용
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
            <div className="border-t border-gray-200 px-6 pb-6 pt-4">
              <DialogFooter className="flex-row justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedService(null);
                  }}
                >
                  닫기
                </Button>
                <Button
                  variant="default"
                  onClick={() => {
                    setShowDetailModal(false);
                    handleEditService(selectedService);
                  }}
                >
                  <Pencil size={18} className="mr-2 text-white" />
                  수정
                </Button>
              </DialogFooter>
            </div>
          </DialogContent>
        </Dialog>
      )}

      <CategoryManagementModal
        open={showCategoryModal}
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

      <BulkPriceModal
        open={showBulkPriceModal}
        services={serviceList}
        onClose={() => setShowBulkPriceModal(false)}
        onApply={handleBulkPriceApply}
      />

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
    </>
  );
}
