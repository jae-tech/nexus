import { useState, useMemo } from 'react';
import { Calendar, Eye, Mail, MoreVertical, Pencil, Phone, Plus, Trash2, UserPlus, Users } from 'lucide-react';
import { Header } from '@/components/layouts';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import FilterBar from '@/shared/components/FilterBar';
import SearchBar from '@/shared/components/SearchBar';
import type { Staff } from '@/features/staff/api/mock';
import { mockStaff } from '@/features/staff/api/mock';
import AddStaffModal from '@/features/staff/components/AddStaffModal';
import EditStaffModal from '@/features/staff/components/EditStaffModal';
import StaffDetailModal from '@/features/staff/components/StaffDetailModal';
import StaffScheduleModal from '@/features/staff/components/StaffScheduleModal';

type ViewMode = 'card' | 'table';
type StatusFilter = 'all' | 'active' | 'on_leave' | 'terminated';
type RoleFilter =
  | 'all'
  | '헤어 디자이너'
  | '네일 아티스트'
  | '피부 관리사'
  | '어시스턴트'
  | '기타';
type PositionFilter =
  | 'all'
  | 'owner'
  | 'manager'
  | 'senior'
  | 'junior'
  | 'intern';
type SortOption = 'name' | 'hireDate' | 'performance';

export default function StaffPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('card');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [roleFilter, setRoleFilter] = useState<RoleFilter>('all');
  const [positionFilter, setPositionFilter] = useState<PositionFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('name');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<Staff | null>(null);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [staffList, setStaffList] = useState<Staff[]>(mockStaff);

  const filteredAndSortedStaff = useMemo(() => {
    const filtered = staffList.filter((staff) => {
      const matchesSearch =
        staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        staff.phone.includes(searchQuery);
      const matchesStatus =
        statusFilter === 'all' || staff.status === statusFilter;
      const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
      const matchesPosition =
        positionFilter === 'all' || staff.position === positionFilter;

      return matchesSearch && matchesStatus && matchesRole && matchesPosition;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hireDate':
          return (
            new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime()
          );
        case 'performance':
          return b.monthlyCustomers - a.monthlyCustomers;
        default:
          return 0;
      }
    });

    return filtered;
  }, [
    staffList,
    searchQuery,
    statusFilter,
    roleFilter,
    positionFilter,
    sortOption,
  ]);

  const handleStatusToggle = (staffId: string) => {
    setStaffList((prev) =>
      prev.map((staff) =>
        staff.id === staffId
          ? {
              ...staff,
              status: staff.status === 'active' ? 'terminated' : 'active',
            }
          : staff
      )
    );
    setShowMenuId(null);
  };

  const handleEditStaff = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowEditModal(true);
    setShowMenuId(null);
  };

  const handleViewDetail = (staff: Staff) => {
    setSelectedStaff(staff);
    setShowDetailModal(true);
  };

  const handleViewSchedule = (staff: Staff, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStaff(staff);
    setShowScheduleModal(true);
  };

  const handlePhoneCall = (phone: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `tel:${phone}`;
  };

  const handleEmailClick = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    window.location.href = `mailto:${email}`;
  };

  const handleMenuToggle = (staffId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenuId(showMenuId === staffId ? null : staffId);
  };

  const handleDeleteStaff = (staffId: string) => {
    if (confirm('정말로 이 직원을 삭제하시겠습니까?')) {
      setStaffList((prev) => prev.filter((s) => s.id !== staffId));
    }
    setShowMenuId(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case '헤어 디자이너':
        return 'bg-blue-100 text-blue-800';
      case '네일 아티스트':
        return 'bg-pink-100 text-pink-800';
      case '피부 관리사':
        return 'bg-green-100 text-green-800';
      case '어시스턴트':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-purple-100 text-purple-800';
    }
  };

  const getPositionBadgeColor = (position: Staff['position']) => {
    switch (position) {
      case 'owner':
        return 'bg-yellow-100 text-yellow-800';
      case 'manager':
        return 'bg-gray-100 text-gray-800';
      case 'senior':
        return 'bg-orange-100 text-orange-800';
      case 'junior':
        return 'bg-green-100 text-green-800';
      case 'intern':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionLabel = (position: Staff['position']) => {
    switch (position) {
      case 'owner':
        return '사장';
      case 'manager':
        return '매니저';
      case 'senior':
        return '시니어';
      case 'junior':
        return '주니어';
      case 'intern':
        return '인턴';
      default:
        return position;
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  return (
    <>
      <Header
        title="직원 관리"
        searchBar={
          <div className="w-full md:w-80">
            <SearchBar
              placeholder="직원명, 연락처 검색..."
              onSearch={setSearchQuery}
            />
          </div>
        }
        actions={
          <div className="flex items-center gap-2 md:gap-4">
            <Button
              onClick={() => setShowAddModal(true)}
              className="bg-blue-600 px-2 text-xs text-white hover:bg-blue-700 md:px-4 md:text-sm"
            >
              <Plus size={20} className="mr-1 text-white" />
              <span className="hidden sm:inline">새 직원 추가</span>
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
                    직급:
                  </span>
                  <select
                    value={positionFilter}
                    onChange={(e) =>
                      setPositionFilter(e.target.value as PositionFilter)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 직급</option>
                    <option value="owner">사장</option>
                    <option value="manager">매니저</option>
                    <option value="senior">시니어</option>
                    <option value="junior">주니어</option>
                    <option value="intern">인턴</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 sm:text-sm">
                    근무 상태:
                  </span>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(e.target.value as StatusFilter)
                    }
                    className="rounded-lg border border-gray-200 px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 sm:px-3 sm:py-2 sm:text-sm"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">재직중</option>
                    <option value="on_leave">휴직</option>
                    <option value="terminated">퇴사</option>
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
                    <option value="hireDate">입사일순</option>
                    <option value="performance">실적순</option>
                  </select>
                </div>
              </div>
            </div>
          </FilterBar>
      </div>

      {/* Main Content */}
      <div className="p-4 md:p-8">
          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredAndSortedStaff.map((staff) => (
                <Card
                  key={staff.id}
                  hover
                  className={`relative cursor-pointer ${
                    staff.status === 'terminated' ? 'opacity-60' : ''
                  }`}
                  onClick={() => handleViewDetail(staff)}
                >
                  {/* 더보기 메뉴 */}
                  <div className="absolute right-3 top-3">
                    <button
                      onClick={(e) => handleMenuToggle(staff.id, e)}
                      className="rounded-full p-1 transition-colors hover:bg-gray-100"
                    >
                      <MoreVertical size={18} className="text-gray-600" />
                    </button>

                    {showMenuId === staff.id && (
                      <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStaff(staff);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Pencil size={20} className="mr-2 text-gray-600 hover:text-blue-600" />
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(staff.id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <i
                            className={`${staff.status === 'active' ? 'ri-pause-line' : 'ri-play-line'} mr-2`}
                          />
                          {staff.status === 'active' ? '비활성화' : '활성화'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStaff(staff.id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={20} className="mr-2 text-gray-600 hover:text-red-600" />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 직원 정보 */}
                  <div className="mb-4">
                    <div className="mb-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                        <span className="text-lg font-bold text-white">
                          {getInitials(staff.name)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate text-lg font-semibold text-gray-900">
                          {staff.name}
                        </h3>
                        <div className="mt-1 flex items-center gap-2">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(staff.role)}`}
                          >
                            {staff.role}
                          </span>
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPositionBadgeColor(staff.position)}`}
                          >
                            {getPositionLabel(staff.position)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <span
                      className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                        staff.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : staff.status === 'on_leave'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {staff.status === 'active'
                        ? '재직중'
                        : staff.status === 'on_leave'
                          ? '휴직'
                          : '퇴사'}
                    </span>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="mb-4 space-y-2">
                    <p className="text-sm text-gray-600">
                      <Phone size={18} className="mr-2 text-gray-600" />
                      <button
                        onClick={(e) => handlePhoneCall(staff.phone, e)}
                        className="underline hover:text-blue-600"
                      >
                        {staff.phone}
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      <Mail size={18} className="mr-2 text-gray-600" />
                      <button
                        onClick={(e) => handleEmailClick(staff.email, e)}
                        className="underline hover:text-blue-600"
                      >
                        {staff.email}
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      <Calendar size={18} className="mr-2 text-gray-600" />
                      입사:{' '}
                      {new Date(staff.hireDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>

                  {/* 실적 정보 */}
                  <div className="mb-4 rounded-lg bg-gray-50 p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">
                          이번 달 담당
                        </span>
                        <span className="font-semibold text-gray-900">
                          {staff.monthlyCustomers}명
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">총 서비스</span>
                        <span className="font-semibold text-gray-900">
                          {staff.monthlyServices}건
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 스케줄 버튼 */}
                  <button
                    onClick={(e) => handleViewSchedule(staff, e)}
                    className="flex w-full items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
                  >
                    <Calendar size={18} className="text-gray-600" />
                    스케줄
                  </button>
                </Card>
              ))}
            </div>
          ) : (
            /* 테이블 뷰 */
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        이름
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        역할
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        직급
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        연락처
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        입사일
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        상태
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        이번달 실적
                      </th>
                      <th className="px-4 py-3 text-left font-semibold text-gray-900">
                        액션
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedStaff.map((staff) => (
                      <tr
                        key={staff.id}
                        className={`cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${staff.status === 'terminated' ? 'opacity-60' : ''}`}
                        onClick={() => handleViewDetail(staff)}
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center">
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-full bg-blue-500">
                              <span className="text-sm font-bold text-white">
                                {getInitials(staff.name)}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {staff.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getRoleBadgeColor(staff.role)}`}
                          >
                            {staff.role}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${getPositionBadgeColor(staff.position)}`}
                          >
                            {getPositionLabel(staff.position)}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div>
                              <button
                                onClick={(e) => handlePhoneCall(staff.phone, e)}
                                className="text-blue-600 hover:underline"
                              >
                                {staff.phone}
                              </button>
                            </div>
                            <div className="text-gray-500">
                              <button
                                onClick={(e) =>
                                  handleEmailClick(staff.email, e)
                                }
                                className="hover:underline"
                              >
                                {staff.email}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">
                          {new Date(staff.hireDate).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`rounded-full px-2 py-1 text-xs font-medium ${
                              staff.status === 'active'
                                ? 'bg-green-100 text-green-800'
                                : staff.status === 'on_leave'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {staff.status === 'active'
                              ? '재직중'
                              : staff.status === 'on_leave'
                                ? '휴직'
                                : '퇴사'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">
                              {staff.monthlyCustomers}명
                            </div>
                            <div className="text-gray-500">
                              {staff.monthlyServices}건
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(staff);
                              }}
                              className="p-1 text-gray-400 transition-colors hover:text-blue-600"
                              title="상세보기"
                            >
                              <Eye size={18} className="text-gray-600" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStaff(staff);
                              }}
                              className="p-1 text-gray-400 transition-colors hover:text-green-600"
                              title="수정"
                            >
                              <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
                            </button>
                            <button
                              onClick={(e) => handleViewSchedule(staff, e)}
                              className="p-1 text-gray-400 transition-colors hover:text-purple-600"
                              title="스케줄"
                            >
                              <Calendar size={18} className="text-gray-600" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          )}

          {/* 검색 결과 없음 */}
          {filteredAndSortedStaff.length === 0 && (
            <div className="py-12 text-center">
              <Users size={18} className="mb-4 text-gray-600" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                검색 결과가 없습니다
              </h3>
              <p className="mb-4 text-gray-500">
                다른 검색어나 필터를 시도해보세요.
              </p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <UserPlus size={18} className="mr-2 text-gray-600" />
                신규 직원 등록
              </Button>
            </div>
          )}
        </div>

      {/* 모달들 */}
      <AddStaffModal
        open={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={(newStaff) => {
          setStaffList((prev) => [
            ...prev,
            { ...newStaff, id: Date.now().toString() },
          ]);
          setShowAddModal(false);
        }}
      />

      {selectedStaff && (
        <EditStaffModal
          open={showEditModal}
          staff={selectedStaff}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          onSave={(updatedStaff: any) => {
            setStaffList((prev) =>
              prev.map((s) => (s.id === updatedStaff.id ? { ...s, ...updatedStaff } : s))
            );
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {selectedStaff && (
        <StaffDetailModal
          open={showDetailModal}
          staff={selectedStaff}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStaff(null);
          }}
          onUpdate={(updatedStaff) => {
            setStaffList((prev) =>
              prev.map((s) => (s.id === updatedStaff.id ? updatedStaff : s))
            );
          }}
        />
      )}

      {selectedStaff && (
        <StaffScheduleModal
          open={showScheduleModal}
          staff={selectedStaff}
          onClose={() => {
            setShowScheduleModal(false);
            setSelectedStaff(null);
          }}
          onAddReservation={() => {
            console.log('새 예약 추가');
          }}
        />
      )}

      {/* 외부 클릭 시 메뉴 닫기 */}
      {showMenuId && (
        <div
          className="fixed inset-0 z-0"
          onClick={() => setShowMenuId(null)}
        />
      )}
    </>
  );
}
