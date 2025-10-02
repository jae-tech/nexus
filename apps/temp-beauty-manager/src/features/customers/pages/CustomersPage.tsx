import { useState, useMemo } from 'react';
import { useNavigate } from '@tanstack/react-router';
import Sidebar from '@/shared/components/Sidebar';
import PageHeader from '@/shared/components/PageHeader';
import FilterBar from '@/shared/components/FilterBar';
import SearchBar from '@/shared/components/SearchBar';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import FloatingButton from '@/shared/components/FloatingButton';
import AddCustomerModal from '@/features/customers/components/AddCustomerModal';
import Toast from '@/shared/components/Toast';
import { useToast } from '@/shared/hooks/useToast';
import { mockCustomers } from '@/features/customers/api/mock';

type FilterType = 'all' | 'recent' | 'regular' | 'new';
type SortType = 'name' | 'lastVisit' | 'visitCount' | 'registered';
type GradeFilter = 'all' | 'VIP' | '골드' | '실버' | '브론즈';
type SortOption = 'name' | 'recent' | 'totalSpent' | 'visitCount';

interface Customer {
  id: number;
  name: string;
  phone: string;
  gender: string;
  birthday: string;
  registeredDate: string;
  memo: string;
  visitCount: number;
  lastVisit: string;
  lastService: string;
  mainStaff: string;
}

export default function CustomersPage() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [customerList, setCustomerList] = useState<Customer[]>(mockCustomers);
  const [gradeFilter, setGradeFilter] = useState<GradeFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');

  const filteredAndSortedCustomers = useMemo(() => {
    const filtered = customerList.filter((customer) => {
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
        case 'recent': {
          if (!lastVisitDate) return false;
          const daysSinceVisit = Math.floor(
            (today.getTime() - lastVisitDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSinceVisit <= 30;
        }
        case 'regular':
          return customer.visitCount >= 5;
        case 'new': {
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
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          if (!a.lastVisit && !b.lastVisit) return 0;
          if (!a.lastVisit) return 1;
          if (!b.lastVisit) return -1;
          return (
            new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime()
          );
        case 'visitCount':
          return b.visitCount - a.visitCount;
        case 'registered':
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
    setShowAddModal(true);
  };

  const handleAddCustomer = (newCustomer: Customer) => {
    setCustomerList((prev) => [...prev, newCustomer]);
    setShowAddModal(false);
    success('새 고객이 성공적으로 등록되었습니다.');
  };

  const handleCustomerClick = (customerId: number) => {
    navigate(`/customers/${customerId}`);
  };

  const handlePhoneCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleBookAppointment = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate('/reservations', { state: { preselectedCustomer: customer } });
  };

  const getVisitStatus = (lastVisit: string) => {
    if (!lastVisit) return { text: '방문 기록 없음', color: 'text-gray-500' };

    const lastVisitDate = new Date(lastVisit);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - lastVisitDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7)
      return { text: `${diffDays}일 전`, color: 'text-green-600' };
    if (diffDays <= 30)
      return { text: `${diffDays}일 전`, color: 'text-yellow-600' };
    return { text: `${diffDays}일 전`, color: 'text-red-600' };
  };

  const getCustomerTypeLabel = (customer: Customer) => {
    const today = new Date();
    const registeredDate = new Date(customer.registeredDate);
    const daysSinceRegistered = Math.floor(
      (today.getTime() - registeredDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceRegistered <= 30)
      return { text: 'NEW', color: 'bg-green-100 text-green-800' };
    if (customer.visitCount >= 10)
      return { text: 'VIP', color: 'bg-purple-100 text-purple-800' };
    if (customer.visitCount >= 5)
      return { text: '단골', color: 'bg-blue-100 text-blue-800' };
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />

      <div className="transition-all duration-300 md:ml-48 lg:ml-60">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
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
              <div className="flex flex-wrap items-center gap-2 md:gap-4">
                <Button
                  variant="outline"
                  className="px-2 text-xs md:px-3 md:text-sm"
                  onClick={() => {
                    /* 엑셀 내보내기 */
                  }}
                >
                  <i className="ri-download-line mr-1 md:mr-2" />
                  <span className="hidden sm:inline">엑셀 내보내기</span>
                  <span className="sm:hidden">내보내기</span>
                </Button>
                <Button
                  onClick={() => setShowAddModal(true)}
                  className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
                >
                  <i className="ri-add-line mr-1 md:mr-2" />
                  <span className="hidden sm:inline">새 고객 추가</span>
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
                    등급:
                  </span>
                  <select
                    value={gradeFilter}
                    onChange={(e) =>
                      setGradeFilter(e.target.value as GradeFilter)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 등급</option>
                    <option value="VIP">VIP</option>
                    <option value="골드">골드</option>
                    <option value="실버">실버</option>
                    <option value="브론즈">브론즈</option>
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
                    <option value="recent">최근 방문순</option>
                    <option value="totalSpent">총 결제금액순</option>
                    <option value="visitCount">방문횟수순</option>
                  </select>
                </div>
              </div>
            </div>
          </FilterBar>
        </div>

        {/* Main Content */}
        <div className="p-4 md:p-8">
          {/* Customer Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAndSortedCustomers.map((customer) => {
              const visitStatus = getVisitStatus(customer.lastVisit);
              const customerType = getCustomerTypeLabel(customer);

              return (
                <Card
                  key={customer.id}
                  hover
                  className="relative cursor-pointer"
                  onClick={() => handleCustomerClick(customer.id)}
                >
                  {/* Customer Type Badge */}
                  {customerType && (
                    <div className="absolute right-3 top-3">
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${customerType.color}`}
                      >
                        {customerType.text}
                      </span>
                    </div>
                  )}

                  {/* Customer Info */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                        <i className="ri-user-line text-xl text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-gray-800">
                          {customer.name}
                        </h3>
                        <p className="truncate text-sm text-gray-600">
                          {customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Visit Info */}
                  <div className="mb-4 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">최근 방문</span>
                      <span className={visitStatus.color}>
                        {visitStatus.text}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">최근 서비스</span>
                      <span className="ml-2 truncate text-gray-800">
                        {customer.lastService || '없음'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">담당 직원</span>
                      <span className="ml-2 truncate text-gray-800">
                        {customer.mainStaff || '없음'}
                      </span>
                    </div>
                  </div>

                  {/* Visit Count Badge */}
                  <div className="mb-3 flex items-center justify-between">
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                      총 {customer.visitCount}회 방문
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handlePhoneCall(customer.phone, e)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
                      title="전화걸기"
                    >
                      <i className="ri-phone-line" />
                      <span className="hidden sm:inline">전화</span>
                    </button>
                    <button
                      onClick={(e) => handleBookAppointment(customer, e)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                      title="예약하기"
                    >
                      <i className="ri-calendar-event-line" />
                      <span className="hidden sm:inline">예약</span>
                    </button>
                  </div>

                  {/* Memo Preview */}
                  {customer.memo && (
                    <div className="mt-3 border-t border-gray-100 pt-3">
                      <p className="line-clamp-2 text-xs text-gray-500">
                        {customer.memo}
                      </p>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredAndSortedCustomers.length === 0 && (
            <div className="py-12 text-center">
              <i className="ri-user-line mb-4 block text-6xl text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-600">
                {searchQuery || selectedFilter !== 'all'
                  ? '검색 결과가 없습니다'
                  : '등록된 고객이 없습니다'}
              </h3>
              <p className="mb-4 text-gray-500">
                {searchQuery || selectedFilter !== 'all'
                  ? '다른 검색어나 필터를 시도해보세요'
                  : '첫 번째 고객을 등록해보세요'}
              </p>
              <Button variant="primary" onClick={handleNewCustomer}>
                <i className="ri-user-add-line mr-2" />
                신규 고객 등록
              </Button>
            </div>
          )}
        </div>

        {/* Floating Action Button */}
        <FloatingButton
          onClick={handleNewCustomer}
          icon="ri-user-add-line"
          label="신규 고객 등록"
        />

        {/* Add Customer Modal */}
        {showAddModal && (
          <AddCustomerModal
            onClose={() => setShowAddModal(false)}
            onAdd={handleAddCustomer}
            existingCustomers={customerList}
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
    </div>
  );
}
