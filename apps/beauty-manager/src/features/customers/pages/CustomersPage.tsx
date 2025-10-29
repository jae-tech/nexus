import { useState, useMemo, useCallback } from 'react';
import { CalendarDays, Download, Phone, Plus, User, UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';
import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterBar from '@/components/common/FilterBar';
import SearchBar from '@/components/common/SearchBar';
import FloatingButton from '@/components/common/FloatingButton';
import AddCustomerModal from '@/features/customers/components/AddCustomerModal';
import Toast from '@/components/ui/toast';
import { useToast } from '@/hooks/useToast';
import { useCustomers } from '@/hooks';
import type { Customer } from '@/types/electron';

type FilterType = 'all' | 'recent' | 'regular' | 'new';
type SortType = 'name' | 'lastVisit' | 'visitCount' | 'registered';
type GenderFilter = 'all' | 'male' | 'female';

export default function CustomersPage() {
  const navigate = useNavigate();
  const { toasts, removeToast, success, error: showError } = useToast();

  // useCustomers Hook 사용
  const {
    customers,
    loading,
    error,
    refetch,
    createCustomer,
    creating,
    createError,
    deleteCustomer,
    deleting,
    deleteError,
    searchCustomers,
    filterByGender,
  } = useCustomers();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [genderFilter, setGenderFilter] = useState<GenderFilter>('all');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [showAddModal, setShowAddModal] = useState(false);

  // 검색 및 필터링
  const filteredAndSortedCustomers = useMemo(() => {
    let result = customers;

    // 검색
    if (searchQuery.trim()) {
      result = searchCustomers(searchQuery);
    }

    // 성별 필터
    if (genderFilter !== 'all') {
      result = result.filter(c => c.gender === genderFilter);
    }

    // 타입 필터
    const today = new Date();
    result = result.filter((customer) => {
      switch (selectedFilter) {
        case 'recent': {
          // 최근 30일 내 방문한 고객
          // TODO: 마지막 방문일 정보가 필요 (예약 이력에서 가져와야 함)
          return true;
        }
        case 'regular':
          // 정기 고객 (5회 이상 방문) - 추후 예약 이력 기반으로 판단
          return true;
        case 'new': {
          // 신규 고객 (30일 이내 등록)
          if (!customer.created_at) return true;
          const createdDate = new Date(customer.created_at);
          const daysSince = Math.floor(
            (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
          );
          return daysSince <= 30;
        }
        default:
          return true;
      }
    });

    // 정렬
    result.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'lastVisit':
          // TODO: 마지막 방문일 정렬 (예약 이력 필요)
          return 0;
        case 'visitCount':
          // TODO: 방문 횟수 정렬 (예약 이력 필요)
          return 0;
        case 'registered':
          if (!a.created_at && !b.created_at) return 0;
          if (!a.created_at) return 1;
          if (!b.created_at) return -1;
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        default:
          return 0;
      }
    });

    return result;
  }, [customers, searchQuery, selectedFilter, genderFilter, sortBy, searchCustomers]);

  // 새 고객 추가
  const handleAddCustomer = useCallback(async (newCustomer: Omit<Customer, 'id'>) => {
    try {
      await createCustomer(newCustomer);
      setShowAddModal(false);
      success('새 고객이 성공적으로 등록되었습니다.');
      refetch();
    } catch (err) {
      showError('고객 등록에 실패했습니다.');
    }
  }, [createCustomer, success, showError, refetch]);

  // 고객 삭제
  const handleDeleteCustomer = useCallback(async (customerId: number, e: React.MouseEvent) => {
    e.stopPropagation();

    if (!confirm('정말 이 고객을 삭제하시겠습니까?\n관련된 모든 예약 정보도 함께 삭제됩니다.')) {
      return;
    }

    try {
      await deleteCustomer(customerId);
      success('고객이 삭제되었습니다.');
    } catch (err) {
      showError('고객 삭제에 실패했습니다.');
    }
  }, [deleteCustomer, success, showError]);

  const handleCustomerClick = (customerId: number) => {
    navigate({ to: `/customers/${customerId}` });
  };

  const handlePhoneCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const handleBookAppointment = (customer: Customer, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate({ to: '/appointments', search: { customerId: customer.id } });
  };

  const getCustomerTypeLabel = (customer: Customer) => {
    if (!customer.created_at) return null;

    const today = new Date();
    const createdDate = new Date(customer.created_at);
    const daysSinceCreated = Math.floor(
      (today.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (daysSinceCreated <= 30) {
      return { text: 'NEW', color: 'bg-green-100 text-green-800' };
    }

    // TODO: VIP, 단골 판단은 예약 이력 기반으로
    return null;
  };

  const formatGender = (gender: string) => {
    return gender === 'male' ? '남성' : gender === 'female' ? '여성' : '기타';
  };

  // 로딩 스피너
  if (loading && customers.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-blue-600" />
          <p className="mt-4 text-gray-600">고객 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태
  if (error && customers.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-600" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">데이터를 불러올 수 없습니다</h3>
          <p className="mt-2 text-gray-600">{error.message}</p>
          <Button onClick={() => refetch()} className="mt-4">
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header
        title="고객 관리"
        subtitle={`전체 ${customers.length}명`}
        searchBar={
          <div className="w-full md:w-80">
            <SearchBar
              placeholder="고객명, 연락처 검색..."
              onSearch={setSearchQuery}
              value={searchQuery}
            />
          </div>
        }
        actions={
          <div className="flex flex-wrap items-center gap-2 md:gap-4">
            <Button
              variant="outline"
              className="px-2 text-xs md:px-3 md:text-sm"
              onClick={() => {
                /* TODO: 엑셀 내보내기 구현 */
                showError('엑셀 내보내기 기능은 준비 중입니다.');
              }}
            >
              <Download size={18} className="mr-1" />
              <span className="hidden sm:inline">엑셀 내보내기</span>
              <span className="sm:hidden">내보내기</span>
            </Button>
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
              disabled={creating}
            >
              {creating ? (
                <Loader2 className="mr-1 h-4 w-4 animate-spin" />
              ) : (
                <Plus size={20} className="mr-1" />
              )}
              <span className="hidden sm:inline">새 고객 추가</span>
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
              {/* 성별 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">성별:</span>
                <select
                  value={genderFilter}
                  onChange={(e) => setGenderFilter(e.target.value as GenderFilter)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="all">전체</option>
                  <option value="male">남성</option>
                  <option value="female">여성</option>
                </select>
              </div>

              {/* 타입 필터 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">유형:</span>
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value as FilterType)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="all">전체</option>
                  <option value="new">신규 고객</option>
                  <option value="regular">정기 고객</option>
                  <option value="recent">최근 방문</option>
                </select>
              </div>

              {/* 정렬 */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 sm:text-sm">정렬:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortType)}
                  className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                >
                  <option value="name">이름순</option>
                  <option value="registered">등록일순</option>
                  <option value="lastVisit">최근 방문순</option>
                  <option value="visitCount">방문횟수순</option>
                </select>
              </div>
            </div>

            {/* 새로고침 버튼 */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => refetch()}
              disabled={loading}
              className="ml-auto"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                '새로고침'
              )}
            </Button>
          </div>
        </FilterBar>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
        {/* Customer Grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {filteredAndSortedCustomers.map((customer) => {
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
                      <User size={24} className="text-blue-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate font-semibold text-gray-800">
                        {customer.name}
                      </h3>
                      <p className="truncate text-sm text-gray-600">
                        {customer.phone || '연락처 없음'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Customer Details */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">성별</span>
                    <span className="text-gray-800">{formatGender(customer.gender)}</span>
                  </div>

                  {customer.email && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">이메일</span>
                      <span className="truncate text-gray-800 ml-2">{customer.email}</span>
                    </div>
                  )}

                  {customer.birth_date && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">생년월일</span>
                      <span className="text-gray-800">{customer.birth_date}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-2">
                  {customer.phone && (
                    <button
                      onClick={(e) => handlePhoneCall(customer.phone, e)}
                      className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
                      title="전화걸기"
                    >
                      <Phone size={16} />
                      <span className="hidden sm:inline">전화</span>
                    </button>
                  )}
                  <button
                    onClick={(e) => handleBookAppointment(customer, e)}
                    className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                    title="예약하기"
                  >
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:inline">예약</span>
                  </button>
                </div>

                {/* Memo Preview */}
                {customer.notes && (
                  <div className="mt-3 border-t border-gray-100 pt-3">
                    <p className="line-clamp-2 text-xs text-gray-500">
                      {customer.notes}
                    </p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredAndSortedCustomers.length === 0 && !loading && (
          <div className="py-12 text-center">
            <User className="mx-auto mb-4 h-16 w-16 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-600">
              {searchQuery || selectedFilter !== 'all' || genderFilter !== 'all'
                ? '검색 결과가 없습니다'
                : '등록된 고객이 없습니다'}
            </h3>
            <p className="mb-4 text-gray-500">
              {searchQuery || selectedFilter !== 'all' || genderFilter !== 'all'
                ? '다른 검색어나 필터를 시도해보세요'
                : '첫 번째 고객을 등록해보세요'}
            </p>
            <Button variant="primary" onClick={() => setShowAddModal(true)}>
              <UserPlus size={18} className="mr-2" />
              신규 고객 등록
            </Button>
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      <FloatingButton
        onClick={() => setShowAddModal(true)}
        icon="ri-user-add-line"
        label="신규 고객 등록"
      />

      {/* Add Customer Modal */}
      <AddCustomerModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddCustomer}
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
