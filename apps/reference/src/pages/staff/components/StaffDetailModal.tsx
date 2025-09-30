
import { useState } from 'react';
import Button from '../../../components/base/Button';
import Card from '../../../components/base/Card';
import { Staff, Holiday } from '../../../mocks/staff';

interface StaffDetailModalProps {
  staff: Staff;
  onClose: () => void;
  onUpdate: (updatedStaff: Staff) => void;
}

export default function StaffDetailModal({ staff, onClose, onUpdate }: StaffDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'performance' | 'customers' | 'holidays'>('info');
  const [currentStaff, setCurrentStaff] = useState<Staff>(staff);
  const [showAddHolidayForm, setShowAddHolidayForm] = useState(false);
  const [showPositionDropdown, setShowPositionDropdown] = useState(false);
  const [editingMemo, setEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(staff.personalMemo);
  const [newHoliday, setNewHoliday] = useState({
    startDate: '',
    endDate: '',
    type: 'annual' as Holiday['type'],
    isHalfDay: false,
    reason: ''
  });

  const getInitials = (name: string) => {
    return name.charAt(0);
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

  const calculateTenure = (hireDate: string) => {
    const hire = new Date(hireDate);
    const now = new Date();
    const months = (now.getFullYear() - hire.getFullYear()) * 12 + (now.getMonth() - hire.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    
    if (years > 0) {
      return `${years}년 ${remainingMonths}개월`;
    }
    return `${remainingMonths}개월`;
  };

  const getHolidayTypeLabel = (type: Holiday['type']) => {
    switch (type) {
      case 'annual': return '연차';
      case 'sick': return '병가';
      case 'personal': return '개인사유';
      case 'family': return '경조사';
      case 'other': return '기타';
      default: return type;
    }
  };

  const getHolidayTypeColor = (type: Holiday['type']) => {
    switch (type) {
      case 'annual': return 'bg-blue-100 text-blue-800';
      case 'sick': return 'bg-red-100 text-red-800';
      case 'personal': return 'bg-yellow-100 text-yellow-800';
      case 'family': return 'bg-purple-100 text-purple-800';
      case 'other': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Holiday['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: Holiday['status']) => {
    switch (status) {
      case 'approved': return '승인';
      case 'pending': return '대기';
      case 'rejected': return '거절';
      default: return status;
    }
  };

  const handlePositionChange = (newPosition: Staff['position']) => {
    if (confirm(`정말 ${staff.name}의 직급을 ${getPositionLabel(staff.position)}에서 ${getPositionLabel(newPosition)}으로 변경하시겠습니까?`)) {
      const updatedStaff = { ...currentStaff, position: newPosition };
      setCurrentStaff(updatedStaff);
      onUpdate(updatedStaff);
      setShowPositionDropdown(false);
    }
  };

  const handleMemoSave = () => {
    const updatedStaff = { ...currentStaff, personalMemo: memoText };
    setCurrentStaff(updatedStaff);
    onUpdate(updatedStaff);
    setEditingMemo(false);
  };

  const handleAddHoliday = () => {
    if (!newHoliday.startDate || !newHoliday.reason.trim()) return;

    const holiday: Holiday = {
      id: Date.now().toString(),
      startDate: newHoliday.startDate,
      endDate: newHoliday.endDate || newHoliday.startDate,
      type: newHoliday.type,
      isHalfDay: newHoliday.isHalfDay,
      reason: newHoliday.reason,
      status: 'pending',
      appliedAt: new Date().toISOString().split('T')[0]
    };

    const updatedStaff = {
      ...currentStaff,
      holidays: [...currentStaff.holidays, holiday]
    };

    setCurrentStaff(updatedStaff);
    onUpdate(updatedStaff);
    setNewHoliday({ startDate: '', endDate: '', type: 'annual', isHalfDay: false, reason: '' });
    setShowAddHolidayForm(false);
  };

  const handleHolidayAction = (holidayId: string, action: 'approve' | 'reject' | 'delete') => {
    let updatedHolidays;
    
    if (action === 'delete') {
      updatedHolidays = currentStaff.holidays.filter(h => h.id !== holidayId);
    } else {
      updatedHolidays = currentStaff.holidays.map(h => 
        h.id === holidayId 
          ? { ...h, status: action === 'approve' ? 'approved' : 'rejected' as Holiday['status'] }
          : h
      );
    }

    const updatedStaff = { ...currentStaff, holidays: updatedHolidays };
    setCurrentStaff(updatedStaff);
    onUpdate(updatedStaff);
  };

  // 임시 데이터
  const monthlyData = [
    { month: '1월', customers: 42, services: 68 },
    { month: '2월', customers: 38, services: 61 },
    { month: '3월', customers: 45, services: 72 },
    { month: '4월', customers: 41, services: 65 },
    { month: '5월', customers: 47, services: 75 },
    { month: '6월', customers: currentStaff.monthlyCustomers, services: currentStaff.monthlyServices }
  ];

  const recentCustomers = [
    { name: '김민지', lastVisit: '2024-06-15', service: '여성 컷' },
    { name: '이서연', lastVisit: '2024-06-14', service: '염색' },
    { name: '박지은', lastVisit: '2024-06-13', service: '펜' },
    { name: '최유진', lastVisit: '2024-06-12', service: '트리트먼트' },
    { name: '정하늘', lastVisit: '2024-06-11', service: '여성 컷' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden">
        <div className="flex flex-col h-full">
          {/* 헤더 */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mr-4">
                  <span className="text-white text-2xl font-bold">{getInitials(currentStaff.name)}</span>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStaff.name}</h2>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor(currentStaff.role)}`}>
                      {currentStaff.role}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionBadgeColor(currentStaff.position)}`}>
                      {getPositionLabel(currentStaff.position)}
                    </span>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                      currentStaff.status === 'active' ? 'bg-green-100 text-green-800' : 
                      currentStaff.status === 'on_leave' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-red-100 text-red-800'
                    }`}>
                      {currentStaff.status === 'active' ? '재직중' : 
                       currentStaff.status === 'on_leave' ? '휴직' : '퇴사'}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <i className="ri-close-line text-xl text-gray-500"></i>
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="px-6 border-b border-gray-200">
            <div className="flex space-x-8">
              {[
                { id: 'info', label: '기본 정보' },
                { id: 'performance', label: '실적 현황' },
                { id: 'customers', label: '담당 고객' },
                { id: 'holidays', label: '휴일 관리' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* 탭 컨텐츠 */}
          <div className="flex-1 overflow-y-auto p-6">
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 좌측 정보 영역 */}
                <div className="space-y-6">
                  {/* 기본 정보 카드 */}
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">기본 정보</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">전화번호</span>
                        <a href={`tel:${currentStaff.phone}`} className="text-blue-600 hover:underline">
                          {currentStaff.phone}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">이메일</span>
                        <a href={`mailto:${currentStaff.email}`} className="text-blue-600 hover:underline">
                          {currentStaff.email}
                        </a>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">입사일</span>
                        <span className="text-gray-900">
                          {new Date(currentStaff.hireDate).toLocaleDateString('ko-KR')}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">근무 기간</span>
                        <span className="text-gray-900">{calculateTenure(currentStaff.hireDate)}</span>
                      </div>
                    </div>
                  </Card>

                  {/* 직급 관리 섹션 */}
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">직급 관리</h3>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-gray-600">현재 직급</span>
                        <div className="mt-1">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPositionBadgeColor(currentStaff.position)}`}>
                            {getPositionLabel(currentStaff.position)}
                          </span>
                        </div>
                      </div>
                      <div className="relative">
                        <Button
                          variant="outline"
                          onClick={() => setShowPositionDropdown(!showPositionDropdown)}
                          className="text-sm"
                        >
                          변경
                          <i className="ri-arrow-down-s-line ml-1"></i>
                        </Button>
                        {showPositionDropdown && (
                          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-[120px]">
                            {(['owner', 'manager', 'senior', 'junior', 'intern'] as Staff['position'][]).map((position) => (
                              <button
                                key={position}
                                onClick={() => handlePositionChange(position)}
                                className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-50 ${
                                  position === currentStaff.position ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                                }`}
                                disabled={position === currentStaff.position}
                              >
                                {getPositionLabel(position)}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>

                  {/* 개인 메모 섹션 */}
                  <Card>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">개인 메모</h3>
                      <button
                        onClick={() => setEditingMemo(!editingMemo)}
                        className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <i className="ri-edit-line"></i>
                      </button>
                    </div>
                    {editingMemo ? (
                      <div>
                        <textarea
                          value={memoText}
                          onChange={(e) => setMemoText(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          rows={4}
                          placeholder="개인 메모를 입력하세요..."
                        />
                        <div className="flex items-center justify-end gap-2 mt-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setEditingMemo(false);
                              setMemoText(currentStaff.personalMemo);
                            }}
                            className="text-sm"
                          >
                            취소
                          </Button>
                          <Button
                            variant="primary"
                            onClick={handleMemoSave}
                            className="text-sm"
                          >
                            저장
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-700 leading-relaxed">{currentStaff.personalMemo}</p>
                    )}
                  </Card>
                </div>

                {/* 우측 통계 영역 */}
                <div>
                  <Card>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">이번 달 요약</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-blue-600">{currentStaff.workingDays}</p>
                        <p className="text-sm text-gray-600">총 근무 일수</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-green-600">{currentStaff.monthlyCustomers}</p>
                        <p className="text-sm text-gray-600">이번 달 담당 고객</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-purple-600">{currentStaff.monthlyServices}</p>
                        <p className="text-sm text-gray-600">이번 달 서비스</p>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg text-center">
                        <p className="text-2xl font-bold text-yellow-600">{currentStaff.annualLeaveUsed}</p>
                        <p className="text-sm text-gray-600">연차 사용</p>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'performance' && (
              <div className="space-y-6">
                {/* 월별 실적 테이블 */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">월별 실적 현황</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">월</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">담당 고객 수</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">서비스 건수</th>
                        </tr>
                      </thead>
                      <tbody>
                        {monthlyData.map((data, index) => (
                          <tr key={index} className="border-b border-gray-100">
                            <td className="py-3 px-4 font-medium text-gray-900">{data.month}</td>
                            <td className="py-3 px-4 text-blue-600 font-medium">{data.customers}명</td>
                            <td className="py-3 px-4 text-green-600 font-medium">{data.services}건</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* 서비스별 통계 */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">서비스별 통계</h3>
                  <div className="space-y-3">
                    {currentStaff.specialties.map((specialty, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <span className="text-gray-700">{specialty}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full" 
                              style={{ width: `${Math.random() * 80 + 20}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.floor(Math.random() * 20) + 5}건
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {activeTab === 'customers' && (
              <div className="space-y-6">
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">최근 담당 고객</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">고객명</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">서비스</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">최근 방문일</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentCustomers.map((customer, index) => (
                          <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                            <td className="py-3 px-4">
                              <div className="flex items-center">
                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                                  <span className="text-white text-sm font-bold">{customer.name.charAt(0)}</span>
                                </div>
                                <span className="font-medium text-gray-900">{customer.name}</span>
                              </div>
                            </td>
                            <td className="py-3 px-4 text-gray-600">{customer.service}</td>
                            <td className="py-3 px-4 text-gray-600">
                              {new Date(customer.lastVisit).toLocaleDateString('ko-KR')}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>

                {/* 고객 통계 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">156</p>
                      <p className="text-sm text-gray-600">총 담당 고객</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">89%</p>
                      <p className="text-sm text-gray-600">재방문율</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-purple-600">21일</p>
                      <p className="text-sm text-gray-600">평균 서비스 주기</p>
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {activeTab === 'holidays' && (
              <div className="space-y-6">
                {/* 휴일 현황 카드 */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-blue-600">
                        {currentStaff.holidays.filter(h => 
                          new Date(h.startDate).getMonth() === new Date().getMonth() &&
                          new Date(h.startDate).getFullYear() === new Date().getFullYear()
                        ).length}
                      </p>
                      <p className="text-sm text-gray-600">이번 달 총 휴가</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{currentStaff.annualLeaveUsed}</p>
                      <p className="text-sm text-gray-600">사용한 연차</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-yellow-600">{currentStaff.annualLeaveTotal - currentStaff.annualLeaveUsed}</p>
                      <p className="text-sm text-gray-600">남은 연차</p>
                    </div>
                  </Card>
                  <Card>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-red-600">
                        {currentStaff.holidays.filter(h => h.type === 'sick').length}
                      </p>
                      <p className="text-sm text-gray-600">이번 달 병가</p>
                    </div>
                  </Card>
                </div>

                {/* 휴일 등록 섹션 */}
                <Card>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">휴일 등록</h3>
                    <Button
                      variant="primary"
                      onClick={() => setShowAddHolidayForm(!showAddHolidayForm)}
                      className="text-sm"
                    >
                      <i className="ri-add-line mr-2"></i>
                      새 휴일 등록
                    </Button>
                  </div>

                  {showAddHolidayForm && (
                    <div className="border-t border-gray-200 pt-4 space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            시작일 <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={newHoliday.startDate}
                            onChange={(e) => setNewHoliday(prev => ({ ...prev, startDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            종료일 (선택사항)
                          </label>
                          <input
                            type="date"
                            value={newHoliday.endDate}
                            onChange={(e) => setNewHoliday(prev => ({ ...prev, endDate: e.target.value }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            휴일 종류 <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={newHoliday.type}
                            onChange={(e) => setNewHoliday(prev => ({ ...prev, type: e.target.value as Holiday['type'] }))}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          >
                            <option value="annual">연차</option>
                            <option value="sick">병가</option>
                            <option value="personal">개인사정</option>
                            <option value="family">경조사</option>
                            <option value="other">기타</option>
                          </select>
                        </div>
                        <div className="flex items-center">
                          <label className="flex items-center cursor-pointer">
                            <input
                              type="checkbox"
                              checked={newHoliday.isHalfDay}
                              onChange={(e) => setNewHoliday(prev => ({ ...prev, isHalfDay: e.target.checked }))}
                              className="sr-only"
                            />
                            <div className={`relative w-5 h-5 border-2 rounded ${
                              newHoliday.isHalfDay ? 'bg-blue-600 border-blue-600' : 'border-gray-300'
                            }`}>
                              {newHoliday.isHalfDay && (
                                <i className="ri-check-line text-white text-sm absolute inset-0 flex items-center justify-center"></i>
                              )}
                            </div>
                            <span className="ml-2 text-sm text-gray-700">반일 휴가</span>
                          </label>
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          사유 <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={newHoliday.reason}
                          onChange={(e) => setNewHoliday(prev => ({ ...prev, reason: e.target.value }))}
                          placeholder="휴일 신청 사유를 입력하세요..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                          maxLength={500}
                        />
                        <div className="text-xs text-gray-500 mt-1">
                          {newHoliday.reason.length}/500자
                        </div>
                      </div>
                      <div className="flex items-center justify-end gap-3">
                        <Button
                          variant="outline"
                          onClick={() => {
                            setShowAddHolidayForm(false);
                            setNewHoliday({ startDate: '', endDate: '', type: 'annual', isHalfDay: false, reason: '' });
                          }}
                          className="text-sm"
                        >
                          취소
                        </Button>
                        <Button
                          variant="primary"
                          onClick={handleAddHoliday}
                          disabled={!newHoliday.startDate || !newHoliday.reason.trim()}
                          className="text-sm"
                        >
                          등록
                        </Button>
                      </div>
                    </div>
                  )}
                </Card>

                {/* 등록된 휴일 목록 */}
                <Card>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">휴일 내역</h3>
                  <div className="space-y-3">
                    {currentStaff.holidays.length === 0 ? (
                      <div className="text-center py-8">
                        <i className="ri-calendar-line text-4xl text-gray-300 mb-2"></i>
                        <p className="text-gray-500">등록된 휴일이 없습니다.</p>
                      </div>
                    ) : (
                      currentStaff.holidays.map((holiday) => (
                        <div key={holiday.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <div className="text-center">
                              <div className="text-lg font-bold text-gray-900">
                                {new Date(holiday.startDate).getDate()}
                              </div>
                              <div className="text-xs text-gray-600">
                                {new Date(holiday.startDate).toLocaleDateString('ko-KR', { month: 'short' })}
                              </div>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getHolidayTypeColor(holiday.type)}`}>
                                  {getHolidayTypeLabel(holiday.type)}
                                </span>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(holiday.status)}`}>
                                  {getStatusLabel(holiday.status)}
                                </span>
                                {holiday.isHalfDay && (
                                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    반일
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-gray-700">{holiday.reason}</p>
                              <p className="text-xs text-gray-500 mt-1">
                                신청일: {new Date(holiday.appliedAt).toLocaleDateString('ko-KR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {holiday.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleHolidayAction(holiday.id, 'approve')}
                                  className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 transition-colors"
                                >
                                  승인
                                </button>
                                <button
                                  onClick={() => handleHolidayAction(holiday.id, 'reject')}
                                  className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors"
                                >
                                  거절
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => handleHolidayAction(holiday.id, 'delete')}
                              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                              title="삭제"
                            >
                              <i className="ri-delete-bin-line"></i>
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* 푸터 */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end">
              <Button
                onClick={onClose}
                variant="outline"
              >
                닫기
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 드롭다운 외부 클릭 시 닫기 */}
      {showPositionDropdown && (
        <div 
          className="fixed inset-0 z-10" 
          onClick={() => setShowPositionDropdown(false)}
        />
      )}
    </div>
  );
}
