import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@nexus/ui";
import type { Customer } from "@/types";

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
    name: "",
    phone: "",
    gender: "여성",
    birthday: "",
    memo: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름은 필수입니다.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호는 필수입니다.";
    } else {
      const phoneRegex = /^010-\d{4}-\d{4}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "전화번호 형식이 올바르지 않습니다. (010-0000-0000)";
      } else {
        const existingCustomer = existingCustomers.find(
          (c) => c.phone === formData.phone
        );
        if (existingCustomer) {
          newErrors.phone = "이미 등록된 전화번호입니다.";
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
      registeredDate: new Date().toISOString().split("T")[0],
      visitCount: 0,
      lastVisit: "",
      lastService: "",
      mainStaff: "",
    };

    onAdd(newCustomer);
  };

  const handlePhoneChange = (value: string) => {
    // 숫자만 추출
    const numbers = value.replace(/\D/g, "");

    // 010-0000-0000 형식으로 포맷팅
    let formatted = numbers;
    if (numbers.length >= 3) {
      formatted = numbers.slice(0, 3) + "-";
      if (numbers.length >= 7) {
        formatted += numbers.slice(3, 7) + "-" + numbers.slice(7, 11);
      } else {
        formatted += numbers.slice(3);
      }
    }

    setFormData((prev) => ({ ...prev, phone: formatted }));
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        {/* Header */}
        <DialogHeader>
          <DialogTitle>신규 고객 등록</DialogTitle>
        </DialogHeader>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                이름 *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                  errors.name ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="고객 이름"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                전화번호 *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus-ring ${
                  errors.phone ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="010-0000-0000"
                maxLength={13}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                성별
              </label>
              <select
                value={formData.gender}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, gender: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
              >
                <option value="여성">여성</option>
                <option value="남성">남성</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                생년월일
              </label>
              <input
                type="date"
                value={formData.birthday}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, birthday: e.target.value }))
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                메모
              </label>
              <textarea
                value={formData.memo}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, memo: e.target.value }))
                }
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus-ring"
                placeholder="특이사항이나 메모를 입력하세요"
              />
            </div>
          </div>

          {/* Footer - 통일된 버튼 배치 */}
          <DialogFooter className="mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              등록
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
