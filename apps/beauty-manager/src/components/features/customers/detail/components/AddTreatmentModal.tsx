
import { useState } from 'react';
import Button from '@/components/ui/Button';
import { mockServices } from '@/mocks/services';
import { mockStaff } from '@/mocks/staff';

interface AddTreatmentModalProps {
  customerId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddTreatmentModal({ customerId, onClose, onSuccess }: AddTreatmentModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '',
    services: [] as string[],
    employeeId: '',
    memo: '',
    amount: ''
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
      await new Promise(resolve => setTimeout(resolve, 1000)); // 시뮬레이션
      console.log('새 시술 추가:', { customerId, ...formData });
      onSuccess();
    } catch (error) {
      console.error('시술 추가 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleServiceToggle = (serviceName: string) => {
    setFormData(prev => ({
      ...prev,
      services: prev.services.includes(serviceName)
        ? prev.services.filter(s => s !== serviceName)
        : [...prev.services, serviceName]
    }));

    // 에러 제거
    if (errors.services) {
      setErrors(prev => ({ ...prev, services: '' }));
    }
  };

  const handleEmployeeSelect = (employeeId: string) => {
    setFormData(prev => ({ ...prev, employeeId }));
    
    // 에러 제거
    if (errors.employeeId) {
      setErrors(prev => ({ ...prev, employeeId: '' }));
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));

    // 에러 제거
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const calculateTotalAmount = () => {
    return formData.services.reduce((total, serviceName) => {
      const service = mockServices.find(s => s.name === serviceName);
      return total + (service?.price || 0);
    }, 0);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-xl font-semibold text-gray-800">새 시술 기록</h2>
          <Button variant="icon" onClick={onClose} disabled={isSubmitting}>
            <i className="ri-close-line text-xl"></i>
          </Button>
        </div>

        <div className="flex">
          {/* Form */}
          <form onSubmit={handleSubmit} className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 날짜 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  날짜 <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                    errors.date ? 'border-red-300' : 'border-gray-200'
                  }`}
                  disabled={isSubmitting}
                />
                {errors.date && <p className="text-red-500 text-xs mt-1">{errors.date}</p>}
              </div>

              {/* 시간 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  시간
                </label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
              </div>
            </div>

            {/* 서비스 선택 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                서비스 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockServices.map((service) => (
                  <div
                    key={service.id}
                    onClick={() => !isSubmitting && handleServiceToggle(service.name)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      formData.services.includes(service.name)
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="font-medium text-sm">{service.name}</div>
                    <div className="text-xs text-gray-500 mt-1">
                      {service.price.toLocaleString()}원 · {service.duration}분
                    </div>
                  </div>
                ))}
              </div>
              {errors.services && <p className="text-red-500 text-xs mt-2">{errors.services}</p>}
            </div>

            {/* 담당 직원 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                담당 직원 <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {mockStaff.filter(staff => staff.status === 'active').map((staff) => (
                  <div
                    key={staff.id}
                    onClick={() => !isSubmitting && handleEmployeeSelect(staff.id)}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-3 ${
                      formData.employeeId === staff.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-user-line text-gray-500"></i>
                    </div>
                    <div>
                      <div className="font-medium text-sm">{staff.name}</div>
                      <div className="text-xs text-gray-500">{staff.role}</div>
                    </div>
                  </div>
                ))}
              </div>
              {errors.employeeId && <p className="text-red-500 text-xs mt-2">{errors.employeeId}</p>}
            </div>

            {/* 메모 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시술 메모
              </label>
              <textarea
                name="memo"
                value={formData.memo}
                onChange={handleChange}
                rows={3}
                placeholder="시술 상세 내용, 스타일 요청사항 등을 기록하세요..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                maxLength={300}
                disabled={isSubmitting}
              />
              <div className="text-xs text-gray-500 mt-1">
                {formData.memo.length}/300자
              </div>
            </div>

            {/* 금액 */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                금액
              </label>
              <div className="relative">
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  placeholder={calculateTotalAmount().toLocaleString()}
                  className="w-full px-3 py-2 pr-8 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isSubmitting}
                />
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">원</span>
              </div>
              {calculateTotalAmount() > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  선택한 서비스 기본 금액: {calculateTotalAmount().toLocaleString()}원
                </p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
              <Button variant="secondary" type="button" onClick={onClose} disabled={isSubmitting}>
                취소
              </Button>
              <Button variant="primary" type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <i className="ri-loader-4-line animate-spin"></i>
                    저장 중...
                  </>
                ) : (
                  '저장'
                )}
              </Button>
            </div>
          </form>

          {/* Preview Sidebar */}
          <div className="w-80 bg-gray-50 border-l border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">미리보기</h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">날짜</label>
                <p className="text-gray-800">
                  {formData.date ? new Date(formData.date).toLocaleDateString('ko-KR') : '선택되지 않음'}
                  {formData.time && ` ${formData.time}`}
                </p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">선택된 서비스</label>
                {formData.services.length > 0 ? (
                  <div className="space-y-1">
                    {formData.services.map(serviceName => {
                      const service = mockServices.find(s => s.name === serviceName);
                      return (
                        <div key={serviceName} className="flex justify-between text-sm">
                          <span>{serviceName}</span>
                          <span>{service?.price.toLocaleString()}원</span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">선택된 서비스 없음</p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">담당 직원</label>
                <p className="text-gray-800">
                  {formData.employeeId 
                    ? mockStaff.find(s => s.id === formData.employeeId)?.name 
                    : '선택되지 않음'
                  }
                </p>
              </div>

              {formData.memo && (
                <div>
                  <label className="text-sm font-medium text-gray-600">메모</label>
                  <p className="text-gray-800 text-sm">{formData.memo}</p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-800">총 금액</span>
                  <span className="text-lg font-bold text-blue-600">
                    {(formData.amount ? parseInt(formData.amount) : calculateTotalAmount()).toLocaleString()}원
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
