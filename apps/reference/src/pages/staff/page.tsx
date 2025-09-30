
import { useState, useMemo } from 'react';
import Sidebar from '../../components/feature/Sidebar';
import PageHeader from '../../components/feature/PageHeader';
import FilterBar from '../../components/feature/FilterBar';
import Card from '../../components/base/Card';
import Button from '../../components/base/Button';
import SearchBar from '../../components/base/SearchBar';
import { mockStaff, Staff } from '../../mocks/staff';
import AddStaffModal from './components/AddStaffModal';
import EditStaffModal from './components/EditStaffModal';
import StaffDetailModal from './components/StaffDetailModal';
import StaffScheduleModal from './components/StaffScheduleModal';

type ViewMode = 'card' | 'table';
type StatusFilter = 'all' | 'active' | 'on_leave' | 'terminated';
type RoleFilter = 'all' | '헤어 디자이너' | '네일 아티스트' | '피부 관리사' | '어시스턴트' | '기타';
type PositionFilter = 'all' | 'owner' | 'manager' | 'senior' | 'junior' | 'intern';
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
    let filtered = staffList.filter(staff => {
      const matchesSearch = staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           staff.phone.includes(searchQuery);
      const matchesStatus = statusFilter === 'all' || staff.status === statusFilter;
      const matchesRole = roleFilter === 'all' || staff.role === roleFilter;
      const matchesPosition = positionFilter === 'all' || staff.position === positionFilter;
      
      return matchesSearch && matchesStatus && matchesRole && matchesPosition;
    });

    filtered.sort((a, b) => {
      switch (sortOption) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'hireDate':
          return new Date(b.hireDate).getTime() - new Date(a.hireDate).getTime();
        case 'performance':
          return b.monthlyCustomers - a.monthlyCustomers;
        default:
          return 0;
      }
    });

    return filtered;
  }, [staffList, searchQuery, statusFilter, roleFilter, positionFilter, sortOption]);

  const handleStatusToggle = (staffId: string) => {
    setStaffList(prev => prev.map(staff => 
      staff.id === staffId 
        ? { ...staff, status: staff.status === 'active' ? 'terminated' : 'active' }
        : staff
    ));
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
      setStaffList(prev => prev.filter(s => s.id !== staffId));
    }
    setShowMenuId(null);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case '헤어 디자이너': return 'bg-blue-100 text-blue-800';
      case '네일 아티스트': return 'bg-pink-100 text-pink-800';
      case '피부 관리사': return 'bg-green-100 text-green-800';
      case '어시스턴트': return 'bg-gray-100 text-gray-800';
      default: return 'bg-purple-100 text-purple-800';
    }
  };

  const getPositionBadgeColor = (position: Staff['position']) => {
    switch (position) {
      case 'owner': return 'bg-yellow-100 text-yellow-800';
      case 'manager': return 'bg-gray-100 text-gray-800';
      case 'senior': return 'bg-orange-100 text-orange-800';
      case 'junior': return 'bg-green-100 text-green-800';
      case 'intern': return 'bg-gray-100 text-gray-600';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPositionLabel = (position: Staff['position']) => {
    switch (position) {
      case 'owner': return '사장';
      case 'manager': return '매니저';
      case 'senior': return '시니어';
      case 'junior': return '주니어';
      case 'intern': return '인턴';
      default: return position;
    }
  };

  const getInitials = (name: string) => {
    return name.charAt(0);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      
      <div className="lg:ml-60 md:ml-48 transition-all duration-300">
        {/* Sticky Header */}
        <div className="sticky top-0 z-40 bg-white shadow-sm">
          {/* Header */}
          <PageHeader
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
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs md:text-sm px-2 md:px-4"
                >
                  <i className="ri-add-line mr-1 md:mr-2"></i>
                  <span className="hidden sm:inline">새 직원 추가</span>
                  <span className="sm:hidden">추가</span>
                </Button>
              </div>
            }
          />

          {/* Filter Bar */}
          <FilterBar>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full">
              <div className="flex flex-wrap items-center gap-2 sm:gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">직급:</span>
                  <select
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value as PositionFilter)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                  <span className="text-xs sm:text-sm text-gray-600">근무 상태:</span>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">전체 상태</option>
                    <option value="active">재직중</option>
                    <option value="on_leave">휴직</option>
                    <option value="terminated">퇴사</option>
                  </select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs sm:text-sm text-gray-600">정렬:</span>
                  <select
                    value={sortOption}
                    onChange={(e) => setSortOption(e.target.value as SortOption)}
                    className="text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
                  <div className="absolute top-3 right-3">
                    <button
                      onClick={(e) => handleMenuToggle(staff.id, e)}
                      className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      <i className="ri-more-2-line text-gray-400"></i>
                    </button>
                    
                    {showMenuId === staff.id && (
                      <div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleEditStaff(staff);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <i className="ri-edit-line mr-2"></i>
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleStatusToggle(staff.id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <i className={`${staff.status === 'active' ? 'ri-pause-line' : 'ri-play-line'} mr-2`}></i>
                          {staff.status === 'active' ? '비활성화' : '활성화'}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteStaff(staff.id);
                          }}
                          className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                        >
                          <i className="ri-delete-bin-line mr-2"></i>
                          삭제
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 직원 정보 */}
                  <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white text-lg font-bold">{getInitials(staff.name)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">{staff.name}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(staff.role)}`}>
                            {staff.role}
                          </span>
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionBadgeColor(staff.position)}`}>
                            {getPositionLabel(staff.position)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      staff.status === 'active' ? 'bg-green-100 text-green-800' : 
                      staff.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {staff.status === 'active' ? '재직중' : 
                       staff.status === 'on_leave' ? '휴직' : '퇴사'}
                    </span>
                  </div>

                  {/* 연락처 정보 */}
                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <i className="ri-phone-line mr-2"></i>
                      <button
                        onClick={(e) => handlePhoneCall(staff.phone, e)}
                        className="hover:text-blue-600 underline"
                      >
                        {staff.phone}
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      <i className="ri-mail-line mr-2"></i>
                      <button
                        onClick={(e) => handleEmailClick(staff.email, e)}
                        className="hover:text-blue-600 underline"
                      >
                        {staff.email}
                      </button>
                    </p>
                    <p className="text-sm text-gray-600">
                      <i className="ri-calendar-line mr-2"></i>
                      입사: {new Date(staff.hireDate).toLocaleDateString('ko-KR')}
                    </p>
                  </div>

                  {/* 실적 정보 */}
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">이번 달 담당</span>
                        <span className="font-semibold text-gray-900">{staff.monthlyCustomers}명</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">총 서비스</span>
                        <span className="font-semibold text-gray-900">{staff.monthlyServices}건</span>
                      </div>
                    </div>
                  </div>

                  {/* 스케줄 버튼 */}
                  <button
                    onClick={(e) => handleViewSchedule(staff, e)}
                    className="w-full flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    <i className="ri-calendar-line"></i>
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
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">이름</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">역할</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">직급</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">연락처</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">입사일</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">상태</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">이번달 실적</th>
                      <th className="text-left py-3 px-4 font-semibold text-gray-900">액션</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAndSortedStaff.map((staff) => (
                      <tr key={staff.id} className={`border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${staff.status === 'terminated' ? 'opacity-60' : ''}`}
                          onClick={() => handleViewDetail(staff)}>
                        <td className="py-3 px-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                              <span className="text-white text-sm font-bold">{getInitials(staff.name)}</span>
                            </div>
                            <span className="font-medium text-gray-900">{staff.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(staff.role)}`}>
                            {staff.role}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionBadgeColor(staff.position)}`}>
                            {getPositionLabel(staff.position)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
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
                                onClick={(e) => handleEmailClick(staff.email, e)}
                                className="hover:underline"
                              >
                                {staff.email}
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(staff.hireDate).toLocaleDateString('ko-KR')}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            staff.status === 'active' ? 'bg-green-100 text-green-800' : 
                            staff.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }`}>
                            {staff.status === 'active' ? '재직중' : 
                             staff.status === 'on_leave' ? '휴직' : '퇴사'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="text-sm">
                            <div className="font-medium text-gray-900">{staff.monthlyCustomers}명</div>
                            <div className="text-gray-500">{staff.monthlyServices}건</div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetail(staff);
                              }}
                              className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                              title="상세보기"
                            >
                              <i className="ri-eye-line"></i>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleEditStaff(staff);
                              }}
                              className="p-1 text-gray-400 hover:text-green-600 transition-colors"
                              title="수정"
                            >
                              <i className="ri-edit-line"></i>
                            </button>
                            <button
                              onClick={(e) => handleViewSchedule(staff, e)}
                              className="p-1 text-gray-400 hover:text-purple-600 transition-colors"
                              title="스케줄"
                            >
                              <i className="ri-calendar-line"></i>
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
            <div className="text-center py-12">
              <i className="ri-team-line text-6xl text-gray-300 mb-4"></i>
              <h3 className="text-lg font-medium text-gray-900 mb-2">검색 결과가 없습니다</h3>
              <p className="text-gray-500 mb-4">다른 검색어나 필터를 시도해보세요.</p>
              <Button variant="primary" onClick={() => setShowAddModal(true)}>
                <i className="ri-user-add-line mr-2"></i>
                신규 직원 등록
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* 모달들 */}
      {showAddModal && (
        <AddStaffModal
          onClose={() => setShowAddModal(false)}
          onAdd={(newStaff) => {
            setStaffList(prev => [...prev, { ...newStaff, id: Date.now().toString() }]);
            setShowAddModal(false);
          }}
        />
      )}

      {showEditModal && selectedStaff && (
        <EditStaffModal
          staff={selectedStaff}
          onClose={() => {
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
          onSave={(updatedStaff) => {
            setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
            setShowEditModal(false);
            setSelectedStaff(null);
          }}
        />
      )}

      {showDetailModal && selectedStaff && (
        <StaffDetailModal
          staff={selectedStaff}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedStaff(null);
          }}
          onUpdate={(updatedStaff) => {
            setStaffList(prev => prev.map(s => s.id === updatedStaff.id ? updatedStaff : s));
          }}
        />
      )}

      {showScheduleModal && selectedStaff && (
        <StaffScheduleModal
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
    </div>
  );
}
