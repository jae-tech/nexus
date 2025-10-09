import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import type { Customer } from '@/features/customers/api/mock-detail';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface EditCustomerModalProps {
  customer: Customer;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCustomerModal({
  customer,
  open,
  onClose,
  onSuccess,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender || '',
    birthDate: customer.birthDate || '',
    personalMemo: customer.personalMemo,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름을 입력해주세요.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호를 입력해주세요.';
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = '올바른 전화번호 형식이 아닙니다. (010-0000-0000)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      // 실제로는 API 호출로 고객 정보 업데이트
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 시뮬레이션
      onSuccess();
    } catch (error) {
      console.error('고객 정보 업데이트 실패:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    // 전화번호 자동 포맷팅
    if (name === 'phone') {
      const formatted = value
        .replace(/[^\d]/g, '')
        .replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>고객 정보 수정</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="edit-customer-name"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              이름 <span className="text-red-500">*</span>
            </label>
            <Input
              id="edit-customer-name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-300' : ''}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-customer-phone"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              전화번호 <span className="text-red-500">*</span>
            </label>
            <Input
              id="edit-customer-phone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className={errors.phone ? 'border-red-300' : ''}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
            )}
          </div>

          <div>
            <label
              htmlFor="edit-customer-gender"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              성별
            </label>
            <select
              id="edit-customer-gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              disabled={isSubmitting}
            >
              <option value="">선택하세요</option>
              <option value="female">여성</option>
              <option value="male">남성</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="edit-customer-birthdate"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              생년월일
            </label>
            <Input
              id="edit-customer-birthdate"
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label
              htmlFor="edit-customer-memo"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              개인 메모
            </label>
            <textarea
              id="edit-customer-memo"
              name="personalMemo"
              value={formData.personalMemo}
              onChange={handleChange}
              rows={4}
              placeholder="알레르기, 특이사항, 선호스타일 등을 기록하세요..."
              className="flex w-full resize-none rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="mt-1 text-xs text-gray-500">
              {formData.personalMemo.length}/500자
            </div>
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
      </DialogContent>
    </Dialog>
  );
}
