import { useState } from 'react';
import { Loader2, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useServices } from '@/hooks/useServices';
import { useStaff } from '@/hooks/useStaff';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface AddTreatmentModalProps {
  customerId: string;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTreatmentModal({
  customerId: _customerId,
  open,
  onClose,
  onSuccess,
}: AddTreatmentModalProps) {
  // Store에서 서비스와 직원 데이터 가져오기
  const { services: mockServices } = useServices();
  const { staff: mockStaff } = useStaff();

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    services: [] as string[],
    employeeId: '',
    memo: '',
    amount: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.date) {
      newErrors.date = '날짜를 선택해주세요.';
    }

    if (formData.services.length === 0) {
      newErrors.services = '최소 하나의 서비스를 선택해주세요.';
    }

    if (!formData.employeeId) {
      newErrors.employeeId = '담당 직원을 선택해주세요.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 실제로는 API 호출로 새 시술 기록 추가
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 시뮬레이션
      onSuccess();
    } catch (error) {
      console.error('시술 추가 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData((prev) => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter((s) => s !== serviceName)
        : [...prev.services, serviceName],
    }));

    // 에러 제거
    if (errors.services) {
      setErrors((prev) => ({ ...prev, services: '' }));
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setFormData((prev) => ({ ...prev, employeeId }));

    // 에러 제거
    if (errors.employeeId) {
      setErrors((prev) => ({ ...prev, employeeId: '' }));
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.services.reduce((total, serviceName) => {
      const service = mockServices.find((s) => s.name === serviceName);
      return total + (service?.basePrice || 0);
    }, 0);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <DialogTitle>새 시술 기록</DialogTitle>
        </DialogHeader>

        <div className="flex">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 space-y-6 p-6">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* 날짜 */}
              <div>
                <label
                  htmlFor="treatment-date"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  날짜 <span className="text-red-500">*</span>
                </label>
                <Input
                  id="treatment-date"
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={errors.date ? 'border-red-300' : ''}
                  disabled={isSubmitting}
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-destructive">{errors.date}</p>
                )}
              </div>

              {/* 시간 */}
              <div>
                <label
                  htmlFor="treatment-time"
                  className="mb-2 block text-sm font-medium text-gray-700"
                >
                  시간
                </label>
                <Input
                  id="treatment-time"
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 서비스 선택 */}
            <div className="mt-6">
              <p className="mb-3 block text-sm font-medium text-gray-700">
                서비스 <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {mockServices.map((service) => (
                  <div
                    key={service.id}
                    role="button"
                    tabIndex={isSubmitting ? -1 : 0}
                    onClick={() =>
                      !isSubmitting && handleServiceToggle(service.name)
                    }
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (!isSubmitting) {
                          handleServiceToggle(service.name);
                        }
                      }
                    }}
                    className={`cursor-pointer rounded-lg border p-3 transition-all duration-200 ${
                      formData.services.includes(service.name)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                  >
                    <div className="text-sm font-medium">{service.name}</div>
                    <div className="mt-1 text-xs text-gray-500">
                      {service.basePrice.toLocaleString()}원 · {service.duration}분
                    </div>
                  </div>
                ))}
              </div>
              {errors.services && (
                <p className="mt-2 text-xs text-red-500">{errors.services}</p>
              )}
            </div>

            {/* 담당 직원 */}
            <div className="mt-6">
              <p className="mb-3 block text-sm font-medium text-gray-700">
                담당 직원 <span className="text-red-500">*</span>
              </p>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {mockStaff
                  .filter((staff) => staff.status === 'active')
                  .map((staff) => (
                    <div
                      key={staff.id}
                      role="button"
                      tabIndex={isSubmitting ? -1 : 0}
                      onClick={() =>
                        !isSubmitting && handleEmployeeSelect(staff.id)
                      }
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          if (!isSubmitting) {
                            handleEmployeeSelect(staff.id);
                          }
                        }
                      }}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-all duration-200 ${
                        formData.employeeId === staff.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      } ${isSubmitting ? 'cursor-not-allowed opacity-50' : ''}`}
                    >
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                        <User size={18} className="text-gray-600" />
                      </div>
                      <div>
                        <div className="text-sm font-medium">{staff.name}</div>
                        <div className="text-xs text-gray-500">
                          {staff.role}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              {errors.employeeId && (
                <p className="mt-2 text-xs text-red-500">{errors.employeeId}</p>
              )}
            </div>

            {/* 메모 */}
            <div className="mt-6">
              <label
                htmlFor="treatment-memo"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                시술 메모
              </label>
              <textarea
                id="treatment-memo"
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                rows={3}
                placeholder="시술 상세 내용, 스타일 요청사항 등을 기록하세요..."
                className="flex w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                maxLength={300}
                disabled={isSubmitting}
              />
              <div className="mt-1 text-xs text-gray-500">
                {formData.memo.length}/300자
              </div>
            </div>

            {/* 금액 */}
            <div className="mt-6">
              <label
                htmlFor="treatment-amount"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                금액
              </label>
              <div className="relative">
                <Input
                  id="treatment-amount"
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={calculateTotalAmount().toLocaleString()}
                  className="pr-8"
                  disabled={isSubmitting}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 transform text-sm text-gray-500">
                  원
                </span>
              </div>
              {calculateTotalAmount() > 0 && (
                <p className="mt-1 text-xs text-gray-500">
                  선택한 서비스 기본 금액:{' '}
                  {calculateTotalAmount().toLocaleString()}원
                </p>
              )}
            </div>

            <div className="border-t border-gray-200 px-6 pb-6 pt-4">
              <DialogFooter className="flex-row justify-end space-x-2">
                <Button
                  variant="outline"
                  type="button"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  취소
                </Button>
                <Button variant="default" type="submit" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 size={18} className="animate-spin animate-spin text-gray-600" />
                      저장 중...
                    </>
                  ) : (
                    '저장'
                  )}
                </Button>
              </DialogFooter>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="w-80 border-l border-gray-200 bg-gray-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-800">
              미리보기
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-600">날짜</p>
                <p className="text-gray-800">
                  {formData.date
                    ? new Date(formData.date).toLocaleDateString('ko-KR')
                    : '선택되지 않음'}
                  {formData.time && ` ${formData.time}`}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">
                  선택된 서비스
                </p>
                {formData.services.length > 0 ? (
                  <div className="space-y-1">
                    {formData.services.map((serviceName) => {
                      const service = mockServices.find(
                        (s) => s.name === serviceName
                      );
                      return (
                        <div
                          key={serviceName}
                          className="flex justify-between text-sm"
                        >
                          <span>{serviceName}</span>
                          <span>{service?.basePrice.toLocaleString()}원</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">선택된 서비스 없음</p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-600">담당 직원</p>
                <p className="text-gray-800">
                  {formData.employeeId
                    ? mockStaff.find((s) => s.id === formData.employeeId)?.name
                    : '선택되지 않음'}
                </p>
              </div>

              {formData.memo && (
                <div>
                  <p className="text-sm font-medium text-gray-600">메모</p>
                  <p className="text-sm text-gray-800">{formData.memo}</p>
                </div>
              )}

              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-800">총 금액</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(formData.amount
                      ? parseInt(formData.amount)
                      : calculateTotalAmount()
                    ).toLocaleString()}
                    원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
