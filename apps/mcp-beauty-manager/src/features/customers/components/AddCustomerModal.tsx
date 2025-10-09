import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (customer: Customer) => void;
  existingCustomers: Customer[];
}

export default function AddCustomerModal({
  open,
  onClose,
  onAdd,
  existingCustomers,
}: AddCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    gender: '여성',
    birthday: '',
    memo: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '이름은 필수입니다.';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = '전화번호는 필수입니다.';
    } else {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = '전화번호 형식이 올바르지 않습니다. (010-0000-0000)';
      } else {
        const existingCustomer = existingCustomers.find(
          (c) => c.phone === formData.phone
        );
        if (existingCustomer) {
          newErrors.phone = '이미 등록된 전화번호입니다.';
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const newCustomer: Customer = {
      id: Date.now(),
      ...formData,
      registeredDate: new Date().toISOString().split('T')[0],
      visitCount: 0,
      lastVisit: '',
      lastService: '',
      mainStaff: '',
    };

    onAdd(newCustomer);
  };

  const handlePhoneChange = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, '');

    // 010-0000-0000 형식으로 포맷팅
    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 3) + '-';
      if (numbers.length >= 7) {
        formatted += numbers.slice(3, 7) + '-' + numbers.slice(7, 11);
      } else {
        formatted += numbers.slice(3);
      }
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md sm:max-w-lg p-6">
        <DialogHeader>
          <DialogTitle>신규 고객 등록</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customer-name"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                이름 *
              </label>
              <Input
                id="customer-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={errors.name ? 'border-red-300' : ''}
                placeholder="고객 이름"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                전화번호 *
              </label>
              <Input
                id="customer-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={errors.phone ? 'border-red-300' : ''}
                placeholder="010-0000-0000"
                maxLength={13}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-destructive">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-gender"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                성별
              </label>
              <select
                id="customer-gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <option value="여성">여성</option>
                <option value="남성">남성</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="customer-birthday"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                생년월일
              </label>
              <Input
                id="customer-birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthday: e.target.value }))
                }
              />
            </div>

            <div>
              <label
                htmlFor="customer-memo"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                메모
              </label>
              <textarea
                id="customer-memo"
                value={formData.memo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, memo: e.target.value }))
                }
                rows={3}
                className="flex w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                placeholder="특이사항이나 메모를 입력하세요"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 px-6 pb-6 pt-4">
            <DialogFooter className="flex-row justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                취소
              </Button>
              <Button
                type="submit"
                variant="default"
              >
                등록
              </Button>
            </DialogFooter>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
