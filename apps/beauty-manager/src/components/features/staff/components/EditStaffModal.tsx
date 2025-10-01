
import { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@nexus/ui";

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  hireDate: string;
  status: 'active' | 'inactive';
  specialties: string[];
  personalMemo?: string;
  monthlyCustomers: number;
  monthlyServices?: number;
  monthlyRevenue?: number;
  customerRating?: number;
}

interface EditStaffModalProps {
  staff: Staff;
  onClose: () => void;
  onSave: (staff: Staff) => void;
}

export default function EditStaffModal({ staff, onClose, onSave }: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    name: staff.name,
    role: staff.role,
    phone: staff.phone,
    email: staff.email || '',
    hireDate: staff.hireDate,
    specialties: [...staff.specialties],
    personalMemo: staff.personalMemo || '',
    status: staff.status
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  const roles = [
    '헤어 디자이너',
    '네일 아티스트', 
    '피부 관리사',
    '어시스턴트',
    '매니저',
    '기타'
  ];

  const specialtyOptions = {
    '헤어 디자이너': ['컷', '염색', '펌', '트리트먼트', '스타일링'],
    '네일 아티스트': ['젤네일', '네일아트', '페디큐어', '네일케어'],
    '피부 관리사': ['페이셜', '마사지', '스킨케어', '여드름케어'],
    '어시스턴트': ['샴푸', '고객응대', '청소', '예약관리'],
    '매니저': ['매장관리', '직원관리', '고객관리', '매출관리'],
    '기타': ['기타']
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (010-0000-0000)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.hireDate) {
      newErrors.hireDate = '입사일을 선택해주세요.';
    } else if (new Date(formData.hireDate) > new Date()) {
      newErrors.hireDate = '입사일은 오늘 이후로 설정할 수 없습니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const updatedStaff = {
      ...staff,
      ...formData
    };

    onSave(updatedStaff);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
  };

  const handleTerminate = () => {
    const updatedStaff = {
      ...staff,
      ...formData,
      status: 'inactive' as const
    };
    onSave(updatedStaff);
    setShowTerminateConfirm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">직원 정보 수정</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* 기본 정보 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="직원 이름을 입력하세요"
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  역할 <span className="text-red-500">*</span>
                </label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, role: value, specialties: [] }))}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="역할 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="010-0000-0000"
                  maxLength={13}
                />
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@salon.com"
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                입사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) => setFormData(prev => ({ ...prev, hireDate: e.target.value }))}
                className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                  errors.hireDate ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.hireDate && <p className="text-red-500 text-sm mt-1">{errors.hireDate}</p>}
            </div>

            {/* 전문 분야 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                전문 분야
              </label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions[formData.role as keyof typeof specialtyOptions]?.map(specialty => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      formData.specialties.includes(specialty)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* 개인 메모 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                개인 메모
              </label>
              <textarea
                value={formData.personalMemo}
                onChange={(e) => setFormData(prev => ({ ...prev, personalMemo: e.target.value }))}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                placeholder="특기, 자격증, 특이사항 등을 입력하세요"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                {formData.personalMemo.length}/500자
              </p>
            </div>

            {/* 재직 상태 */}
            <div className="bg-gray-50 rounded-lg p-4">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                재직 상태
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.status === 'active'}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        status: e.target.checked ? 'active' : 'inactive' 
                      }))}
                      className="sr-only"
                    />
                    <div className={`relative w-11 h-6 rounded-full transition-colors ${
                      formData.status === 'active' ? 'bg-green-500' : 'bg-gray-300'
                    }`}>
                      <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        formData.status === 'active' ? 'translate-x-5' : 'translate-x-0'
                      }`}></div>
                    </div>
                    <span className="ml-3 text-sm font-medium text-gray-700">
                      {formData.status === 'active' ? '재직중' : '퇴사'}
                    </span>
                  </label>
                </div>
                {staff.status === 'active' && (
                  <button
                    type="button"
                    onClick={() => setShowTerminateConfirm(true)}
                    className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    퇴사 처리
                  </button>
                )}
            </div>
          </div>
        </form>

        {/* Footer - 통일된 버튼 배치 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            저장
          </button>
        </div>
      </div>

      {/* 퇴사 확인 모달 */}
      {showTerminateConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">퇴사 처리 확인</h3>
              <p className="text-gray-600 mb-6">
                {staff.name} 직원을 퇴사 처리하시겠습니까?<br/>
                퇴사 후에는 새로운 예약 배정이 불가능합니다.
              </p>
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowTerminateConfirm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleTerminate}
                  className="bg-red-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                >
                  퇴사 처리
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
