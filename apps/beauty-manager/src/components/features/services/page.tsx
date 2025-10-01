import { useState, useMemo } from "react";
import PageHeader from "@/components/common/PageHeader";
import FilterBar from "@/components/common/FilterBar";
import SearchBar from "@/components/ui/SearchBar";
import {
  Button,
  Toast,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Badge,
} from "@nexus/ui";
import { useToast } from "@/hooks/useToast";
import { mockServices, mockServiceCategories } from "@/mocks/services";
import { Settings, Tag, Grid, List, Plus, Scissors, X, Edit } from 'lucide-react';
import AddServiceModal from "./components/AddServiceModal";
import EditServiceModal from "./components/EditServiceModal";
import CategoryManagementModal from "./components/CategoryManagementModal";
import BulkPriceModal from "./components/BulkPriceModal";
import CategoryTabs from "./components/CategoryTabs";
import PriceRangeFilter from "./components/PriceRangeFilter";
import ServiceCard from "./components/ServiceCard";
import ServiceTable from "./components/ServiceTable";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";

type ViewMode = "card" | "table";
type StatusFilter = "all" | "active" | "inactive";
type SortOption = "name" | "price" | "popularity" | "newest";

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

export function Services() {
  const { toasts, removeToast, success, error } = useToast();
  const { isSidebarOpen } = useUIStore();
  const [viewMode, setViewMode] = useState<ViewMode>("card");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("name");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 200000]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showBulkPriceModal, setShowBulkPriceModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [categories, setCategories] = useState<Category[]>(
    mockServiceCategories.map((cat) => ({ ...cat, color: "blue" }))
  );
  const [serviceList, setServiceList] = useState<Service[]>(
    mockServices.map((service) => ({
      ...service,
      categoryName:
        mockServiceCategories.find((cat) => cat.id === service.categoryId)
          ?.name || "기타",
      monthlyUsage: Math.floor(Math.random() * 50) + 10,
      totalRevenue: Math.floor(Math.random() * 2000000) + 500000,
      isPopular: Math.random() > 0.7,
      priceOptions: [],
    }))
  );

  const filteredAndSortedServices = useMemo(() => {
    let filtered = serviceList.filter((service) => {
      const matchesSearch =
        service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || service.categoryId === selectedCategory;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" && service.isActive) ||
        (statusFilter === "inactive" && !service.isActive);
      const matchesPrice =
        service.basePrice >= priceRange[0] &&
        service.basePrice <= priceRange[1];

      return matchesSearch && matchesCategory && matchesStatus && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case "name":
          return a.name.localeCompare(b.name);
        case "price":
          return a.basePrice - b.basePrice;
        case "popularity":
          return b.monthlyUsage - a.monthlyUsage;
        case "newest":
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
    success("서비스 상태가 변경되었습니다.");
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
    success("서비스가 복제되었습니다.");
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm("정말로 이 서비스를 삭제하시겠습니까?")) {
      setServiceList((prev) => prev.filter((s) => s.id !== serviceId));
      success("서비스가 삭제되었습니다.");
    }
  };

  const handleCategorySave = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    success("카테고리가 저장되었습니다.");
  };

  const handleBulkPriceApply = (
    selectedServices: string[],
    adjustmentType: "fixed" | "percent",
    adjustmentValue: number,
    direction: "increase" | "decrease"
  ) => {
    setServiceList((prev) =>
      prev.map((service) => {
        if (!selectedServices.includes(service.id)) return service;

        let newPrice = service.basePrice;
        if (adjustmentType === "fixed") {
          newPrice =
            direction === "increase"
              ? service.basePrice + adjustmentValue
              : Math.max(0, service.basePrice - adjustmentValue);
        } else {
          const multiplier =
            direction === "increase"
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
    <div className={cn("transition-all duration-300 pt-20")}>
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
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCategoryModal(true)}
            >
              <Settings size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">카테고리 관리</span>
              <span className="sm:hidden">카테고리</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowBulkPriceModal(true)}
            >
              <Tag size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">일괄 가격 수정</span>
              <span className="sm:hidden">가격</span>
            </Button>
            <div className="flex bg-gray-100 rounded-lg p-1 border border-gray-200">
              <Button
                onClick={() => setViewMode("card")}
                variant="ghost"
                size="sm"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                  viewMode === "card"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Grid size={16} className="mr-1" />
                <span className="hidden sm:inline">카드</span>
              </Button>
              <Button
                onClick={() => setViewMode("table")}
                variant="ghost"
                size="sm"
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors flex items-center ${
                  viewMode === "table"
                    ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <List size={16} className="mr-1" />
                <span className="hidden sm:inline">테이블</span>
              </Button>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowAddModal(true)}
            >
              <Plus size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">새 서비스 추가</span>
              <span className="sm:hidden">추가</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200">
        <FilterBar>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">상태:</span>
                <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
                  <SelectTrigger className="w-[150px] text-sm">
                    <SelectValue placeholder="전체 상태" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 상태</SelectItem>
                    <SelectItem value="active">활성</SelectItem>
                    <SelectItem value="inactive">비활성</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">정렬:</span>
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[150px] text-sm">
                    <SelectValue placeholder="이름순" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="price">가격순</SelectItem>
                    <SelectItem value="popularity">인기순</SelectItem>
                    <SelectItem value="newest">최신순</SelectItem>
                  </SelectContent>
                </Select>
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
      <div className="sticky top-32 z-20 bg-white border-b border-gray-200 px-4 md:px-8 py-4">
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
        {viewMode === "card" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
          <div className="text-center py-12">
            <Scissors size={64} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              검색 결과가 없습니다
            </h3>
            <p className="text-gray-500">다른 검색어나 필터를 시도해보세요.</p>
          </div>
        )}
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
            success("새 서비스가 추가되었습니다.");
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
            success("서비스 정보가 수정되었습니다.");
          }}
          categories={categories}
        />
      )}

      {/* 서비스 상세 모달 */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>서비스 상세 정보</DialogTitle>
          </DialogHeader>

          {selectedService && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  기본 정보
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      서비스명
                    </label>
                    <p className="text-gray-900">{selectedService.name}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      카테고리
                    </label>
                    <p className="text-gray-900">
                      {selectedService.categoryName}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      가격
                    </label>
                    <p className="text-gray-900">
                      {new Intl.NumberFormat("ko-KR").format(
                        selectedService.basePrice
                      )}
                      원
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
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
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    서비스 설명
                  </h3>
                  <p className="text-gray-700">
                    {selectedService.description}
                  </p>
                </div>
              )}

              {/* 이용 통계 */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  이용 통계
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">
                      이번 달 이용
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {selectedService.monthlyUsage}회
                    </p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">
                      총 매출
                    </p>
                    <p className="text-2xl font-bold text-green-900">
                      {Math.floor(selectedService.totalRevenue / 10000)}만원
                    </p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">
                      상태
                    </p>
                    <p
                      className={`text-2xl font-bold ${selectedService.isActive ? "text-green-900" : "text-red-900"}`}
                    >
                      {selectedService.isActive ? "활성" : "비활성"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="mt-6">
            <Button
              onClick={() => {
                setShowDetailModal(false);
                if (selectedService) handleEditService(selectedService);
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white flex items-center"
            >
              <Edit size={16} className="mr-2" />
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
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <CategoryManagementModal
        categories={categories}
        open={showCategoryModal}
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
        services={serviceList}
        open={showBulkPriceModal}
        onClose={() => setShowBulkPriceModal(false)}
        onApply={handleBulkPriceApply}
      />

      {/* Toast Messages */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
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
    </div>
  );
}
