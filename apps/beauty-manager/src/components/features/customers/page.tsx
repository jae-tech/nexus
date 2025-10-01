import { useState, useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Plus, Download, User, Phone, Calendar, UserPlus } from "lucide-react";
import { toast } from "sonner";
import PageHeader from "@/components/common/PageHeader";
import FilterBar from "@/components/common/FilterBar";
import SearchBar from "@/components/ui/SearchBar";
import { Card, Button, Badge, Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@nexus/ui";
import AddCustomerModal from "@/components/common/AddCustomerModal";
import FloatingButton from "@/components/common/FloatingButton";
import { mockCustomers } from "@/mocks/customers";
import { useUIStore } from "@/stores/ui-store";
import { cn } from "@/lib/utils";
import type { Customer } from "@/types";

type FilterType = "all" | "recent" | "regular" | "new";
type SortType = "name" | "lastVisit" | "visitCount" | "registered";
type GradeFilter = "all" | "VIP" | "골드" | "실버" | "브론즈";
type SortOption = "name" | "recent" | "totalSpent" | "visitCount";

export function Customers() {
  const { isSidebarOpen } = useUIStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortType>("name");
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>(mockCustomers);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>("all");
  const [sortOption, setSortOption] = useState<SortOption>("name");

  const filteredAndSortedCustomers = useMemo(() => {
    let filtered = customerList.filter((customer) => {
      const matchesSearch =
        customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        customer.phone.includes(searchQuery);

      if (!matchesSearch) return false;

      const today = new Date();
      const lastVisitDate = customer.lastVisit
        ? new Date(customer.lastVisit)
        : null;
      const registeredDate = new Date(customer.registeredDate);

      switch (selectedFilter) {
        case "recent": {
          if (!lastVisitDate) return false;
          const daysSinceVisit = Math.floor(
            (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceVisit <= 30;
        }
        case "regular":
          return customer.visitCount >= 5;
        case "new": {
          const daysSinceRegistered = Math.floor(
            (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceRegistered <= 30;
        }
        default:
          return true;
      }
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "lastVisit":
          if (!a.lastVisit && !b.lastVisit) return 0;
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        case "visitCount":
          return b.visitCount - a.visitCount;
        case "registered":
          return (
            new Date(b.registeredDate).getTime() -
            new Date(a.registeredDate).getTime()
          );
        default:
          return 0;
      }
    });

    return filtered;
  }, [customerList, searchQuery, selectedFilter, sortBy]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleNewCustomer = () => {
    console.log("새 고객 추가 버튼 클릭됨");
    console.log("현재 showAddModal 상태:", showAddModal);
    setShowAddModal(true);
    console.log("setShowAddModal(true) 호출 완료");
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomerList((prev) => [...prev, newCustomer]);
    setShowAddModal(false);
    toast.success("새 고객이 성공적으로 등록되었습니다.");
  };

  const handlePhoneCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = `tel:${phone}`;
  };

  const handleBookAppointment = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    window.location.href = "/reservations?preselectedCustomer=" + customer.id;
  };

  const getVisitStatus = (lastVisit?: string) => {
    if (!lastVisit) return { text: "방문 기록 없음", color: "text-gray-500" };

    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7)
      return { text: `${diffDays}일 전`, color: "text-green-600" };
    if (diffDays <= 30)
      return { text: `${diffDays}일 전`, color: "text-yellow-600" };
    return { text: `${diffDays}일 전`, color: "text-red-600" };
  };

  const getCustomerTypeLabel = (customer: Customer) => {
    const today = new Date();
    const registeredDate = new Date(customer.registeredDate);
    const daysSinceRegistered = Math.floor(
      (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceRegistered <= 30)
      return { text: "NEW", color: "bg-green-100 text-green-800" };
    if (customer.visitCount >= 10)
      return { text: "VIP", color: "bg-purple-100 text-purple-800" };
    if (customer.visitCount >= 5)
      return { text: "단골", color: "bg-blue-100 text-blue-800" };
    return null;
  };

  return (
    <div className={cn("transition-all duration-300 pt-20")}>
      <PageHeader
        title="고객 관리"
        searchBar={
          <div className="w-full md:w-80">
            <SearchBar
              placeholder="고객명, 연락처 검색..."
              onSearch={setSearchQuery}
            />
          </div>
        }
        actions={
          <div className="flex items-center gap-2 md:gap-4 flex-wrap">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {/* 엑셀 내보내기 */}}
              className="text-xs md:text-sm px-2 md:px-3"
            >
              <Download size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">엑셀 내보내기</span>
              <span className="sm:hidden">내보내기</span>
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4"
            >
              <Plus size={16} className="mr-1 md:mr-2" />
              <span className="hidden sm:inline">새 고객 추가</span>
              <span className="sm:hidden">추가</span>
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="sticky top-20 z-30 bg-white border-b border-gray-200">
        <FilterBar>
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4 w-full">
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">등급:</span>
                <Select value={gradeFilter} onValueChange={(value) => setGradeFilter(value as GradeFilter)}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="전체 등급" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">전체 등급</SelectItem>
                    <SelectItem value="VIP">VIP</SelectItem>
                    <SelectItem value="골드">골드</SelectItem>
                    <SelectItem value="실버">실버</SelectItem>
                    <SelectItem value="브론즈">브론즈</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm text-gray-600">정렬:</span>
                <Select value={sortOption} onValueChange={(value) => setSortOption(value as SortOption)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="이름순" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">이름순</SelectItem>
                    <SelectItem value="recent">최근 방문순</SelectItem>
                    <SelectItem value="totalSpent">총 결제금액순</SelectItem>
                    <SelectItem value="visitCount">방문횟수순</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 엑셀 내보내기 버튼 */}
            <div className="flex items-center">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  /* 엑셀 내보내기 */
                }}
                className="flex items-center gap-1 sm:gap-2"
              >
                <Download size={16} />
                <span className="text-xs sm:text-sm">엑셀 내보내기</span>
              </Button>
            </div>
          </div>
        </FilterBar>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* Customer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {filteredAndSortedCustomers.map((customer) => {
            const visitStatus = getVisitStatus(customer.lastVisit);
            const customerType = getCustomerTypeLabel(customer);

            return (
              <Link
                key={customer.id}
                to="/customers/$id"
                params={{ id: customer.id }}
              >
                <Card
                  hover
                  className="relative cursor-pointer"
                >
                {/* Customer Type Badge */}
                {customerType && (
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${customerType.color}`}>
                      {customerType.text}
                    </span>
                  </div>
                )}

                {/* Customer Info */}
                <div className="mb-4">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User size={20} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-800 truncate">
                        {customer.name}
                      </h3>
                      <p className="text-sm text-gray-600 truncate">
                        {customer.phone}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Visit Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">최근 방문</span>
                    <span className={visitStatus.color}>
                      {visitStatus.text}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">최근 서비스</span>
                    <span className="text-gray-800 truncate ml-2">
                      {customer.lastService || "없음"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">담당 직원</span>
                    <span className="text-gray-800 truncate ml-2">
                      {customer.mainStaff || "없음"}
                    </span>
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
                  <button
                    onClick={(e) => handlePhoneCall(customer.phone, e)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                    title="전화걸기"
                  >
                    <Phone size={16} />
                    <span className="hidden sm:inline">전화</span>
                  </button>
                  <button
                    onClick={(e) => handleBookAppointment(customer, e)}
                    className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                    title="예약하기"
                  >
                    <Calendar size={16} />
                    <span className="hidden sm:inline">예약</span>
                  </button>
                </div>

                {/* Memo Preview */}
                {customer.memo && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-500 line-clamp-2">
                      {customer.memo}
                    </p>
                  </div>
                )}
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAndSortedCustomers.length === 0 && (
          <div className="text-center py-12">
            <User size={48} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">
              {searchQuery || selectedFilter !== "all"
                ? "검색 결과가 없습니다"
                : "등록된 고객이 없습니다"}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchQuery || selectedFilter !== "all"
                ? "다른 검색어나 필터를 시도해보세요"
                : "첫 번째 고객을 등록해보세요"}
            </p>
            <Button variant="primary" onClick={handleNewCustomer}>
              <UserPlus size={20} className="mr-2" />
              신규 고객 등록
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        onClick={handleNewCustomer}
        icon={UserPlus}
        label="신규 고객 등록"
      />

      {/* Add Customer Modal */}
      {console.log("AddCustomerModal 렌더링, open:", showAddModal)}
      <AddCustomerModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCustomer}
        existingCustomers={customerList}
      />
    </div>
  );
}
