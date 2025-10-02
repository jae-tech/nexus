import { useState } from 'react';

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
  onClose: () => void;
  onAdd: (customer: Customer) => void;
  existingCustomers: Customer[];
}

export default function AddCustomerModal({
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              신규 고객 등록
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 transition-colors hover:text-gray-600"
            >
              <i className="ri-close-line text-xl" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label
                htmlFor="customer-name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                이름 *
              </label>
              <input
                id="customer-name"
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="고객 이름"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                전화번호 *
              </label>
              <input
                id="customer-phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full rounded-lg border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.phone ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="010-0000-0000"
                maxLength={13}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="customer-gender"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                성별
              </label>
              <select
                id="customer-gender"
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="여성">여성</option>
                <option value="남성">남성</option>
              </select>
            </div>

            <div>
              <label
                htmlFor="customer-birthday"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                생년월일
              </label>
              <input
                id="customer-birthday"
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthday: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label
                htmlFor="customer-memo"
                className="mb-1 block text-sm font-medium text-gray-700"
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
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="특이사항이나 메모를 입력하세요"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg bg-gray-100 px-4 py-2 text-gray-700 transition-colors hover:bg-gray-200"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600"
            >
              등록
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
