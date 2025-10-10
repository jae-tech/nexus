import { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Staff {
  id: string;
  name: string;
  role: string;
  phone: string;
  email?: string;
  hireDate: string;
  status: 'active' | 'on_leave' | 'terminated';
  specialties: string[];
  personalMemo?: string;
  monthlyCustomers: number;
  monthlyServices?: number;
  monthlyRevenue?: number;
  customerRating?: number;
  position?: string;
  holidays?: any[];
  workingDays?: number;
  annualLeaveUsed?: number;
  annualLeaveTotal?: number;
}

interface EditStaffModalProps {
  staff: Staff;
  open: boolean;
  onClose: () => void;
  onSave: (staff: Staff) => void;
}

export default function EditStaffModal({
  staff,
  open,
  onClose,
  onSave,
}: EditStaffModalProps) {
  const [formData, setFormData] = useState({
    name: staff.name,
    role: staff.role,
    phone: staff.phone,
    email: staff.email || '',
    hireDate: staff.hireDate,
    specialties: [...staff.specialties],
    personalMemo: staff.personalMemo || '',
    status: staff.status,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showTerminateConfirm, setShowTerminateConfirm] = useState(false);

  const roles = [
    '헤어 디자이너',
    '네일 아티스트',
    '피부 관리사',
    '어시스턴트',
    '매니저',
    '기타',
  ];

  const specialtyOptions = {
    '헤어 디자이너': ['컷', '염색', '펌', '트리트먼트', '스타일링'],
    '네일 아티스트': ['젤네일', '네일아트', '페디큐어', '네일케어'],
    '피부 관리사': ['페이셜', '마사지', '스킨케어', '여드름케어'],
    어시스턴트: ['샴푸', '고객응대', '청소', '예약관리'],
    매니저: ['매장관리', '직원관리', '고객관리', '매출관리'],
    기타: ['기타'],
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
      ...formData,
    };

    onSave(updatedStaff);
  };

  const handleSpecialtyToggle = (specialty: string) => {
    setFormData((prev) => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty],
    }));
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7)
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  const handleTerminate = () => {
    const updatedStaff = {
      ...staff,
      ...formData,
      status: 'terminated' as const,
    };
    onSave(updatedStaff);
    setShowTerminateConfirm(false);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-2xl p-6">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900">
            직원 정보 수정
          </DialogTitle>
        </DialogHeader>

        <div>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 기본 정보 */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  이름 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="직원 이름을 입력하세요"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  역할 <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.role}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      role: e.target.value,
                      specialties: [],
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {roles.map((role) => (
                    <option key={role} value={role}>
                      {role}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  전화번호 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="010-0000-0000"
                  maxLength={13}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  이메일
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="example@salon.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                입사일 <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.hireDate}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, hireDate: e.target.value }))
                }
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.hireDate ? 'border-red-500' : 'border-gray-300'
                }`}
                max={new Date().toISOString().split('T')[0]}
              />
              {errors.hireDate && (
                <p className="mt-1 text-sm text-red-500">{errors.hireDate}</p>
              )}
            </div>

            {/* 전문 분야 */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                전문 분야
              </label>
              <div className="flex flex-wrap gap-2">
                {specialtyOptions[
                  formData.role as keyof typeof specialtyOptions
                ]?.map((specialty) => (
                  <button
                    key={specialty}
                    type="button"
                    onClick={() => handleSpecialtyToggle(specialty)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
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
              <label className="mb-2 block text-sm font-medium text-gray-700">
                개인 메모
              </label>
              <textarea
                value={formData.personalMemo}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    personalMemo: e.target.value,
                  }))
                }
                rows={3}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="특기, 자격증, 특이사항 등을 입력하세요"
                maxLength={500}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.personalMemo.length}/500자
              </p>
            </div>

            {/* 재직 상태 */}
            <div className="rounded-lg bg-gray-50 p-4">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                재직 상태
              </label>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <label className="flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={formData.status === 'active'}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          status: e.target.checked ? 'active' : 'on_leave',
                        }))
                      }
                      className="sr-only"
                    />
                    <div
                      className={`relative h-6 w-11 rounded-full transition-colors ${
                        formData.status === 'active'
                          ? 'bg-green-500'
                          : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                          formData.status === 'active'
                            ? 'translate-x-5'
                            : 'translate-x-0'
                        }`}
                      />
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
                    className="rounded-lg px-3 py-1 text-sm text-red-600 transition-colors hover:bg-red-50"
                  >
                    퇴사 처리
                  </button>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 pb-6 pt-4">
              <DialogFooter className="flex-row justify-end space-x-2">
                <Button type="button" onClick={onClose} variant="outline">
                  취소
                </Button>
                <Button type="submit" variant="default">
                  저장
                </Button>
              </DialogFooter>
            </div>
          </form>
        </div>
      </DialogContent>

      {/* 퇴사 확인 모달 */}
      {showTerminateConfirm && (
        <div className="z-60 fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <AlertCircle className="h-8 w-8" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-gray-900">
                퇴사 처리 확인
              </h3>
              <p className="mb-6 text-gray-600">
                {staff.name} 직원을 퇴사 처리하시겠습니까?
                <br />
                퇴사 후에는 새로운 예약 배정이 불가능합니다.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowTerminateConfirm(false)}
                  className="flex-1 bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  취소
                </Button>
                <Button
                  onClick={handleTerminate}
                  className="flex-1 bg-red-600 text-white hover:bg-red-700"
                >
                  퇴사 처리
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Dialog>
  );
}
