import { useState } from "react";
import { Customer } from "@/mocks/customerDetail";

interface EditCustomerModalProps {
  customer: Customer;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditCustomerModal({
  customer,
  onClose,
  onSuccess,
}: EditCustomerModalProps) {
  const [formData, setFormData] = useState({
    name: customer.name,
    phone: customer.phone,
    gender: customer.gender || "",
    birthDate: customer.birthDate || "",
    personalMemo: customer.personalMemo,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      newErrors.name = "이름을 입력해주세요.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "전화번호를 입력해주세요.";
    } else if (!/^010-\d{4}-\d{4}$/.test(formData.phone)) {
      newErrors.phone = "올바른 전화번호 형식이 아닙니다. (010-0000-0000)";
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
      // 고객 정보 업데이트: formData
      onSuccess();
    } catch (error) {
      console.error("고객 정보 업데이트 실패:", error);
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
    if (name === "phone") {
      const formatted = value
        .replace(/[^\d]/g, "")
        .replace(/(\d{3})(\d{4})(\d{4})/, "$1-$2-$3");
      setFormData((prev) => ({ ...prev, [name]: formatted }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    // 에러 제거
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onKeyDown={handleKeyDown}>
      <div className="bg-white rounded-xl w-full max-w-md max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          <h2 className="text-xl font-bold text-gray-900">
            고객 정보 수정
          </h2>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-lg focus-ring focus:border-transparent ${
                errors.name ? "border-red-300" : "border-gray-200"
              }`}
              disabled={isSubmitting}
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              전화번호 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="010-0000-0000"
              className={`w-full px-3 py-2 border rounded-lg focus-ring focus:border-transparent ${
                errors.phone ? "border-red-300" : "border-gray-200"
              }`}
              disabled={isSubmitting}
            />
            {errors.phone && (
              <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              성별
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring focus:border-transparent"
              disabled={isSubmitting}
            >
              <option value="">선택하세요</option>
              <option value="female">여성</option>
              <option value="male">남성</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              생년월일
            </label>
            <input
              type="date"
              name="birthDate"
              value={formData.birthDate}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring focus:border-transparent"
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              개인 메모
            </label>
            <textarea
              name="personalMemo"
              value={formData.personalMemo}
              onChange={handleChange}
              rows={4}
              placeholder="알레르기, 특이사항, 선호스타일 등을 기록하세요..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus-ring focus:border-transparent resize-none"
              maxLength={500}
              disabled={isSubmitting}
            />
            <div className="text-xs text-gray-500 mt-1">
              {formData.personalMemo.length}/500자
            </div>
          </div>
        </form>

        {/* Footer - 통일된 버튼 배치 */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-end gap-3 flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 font-medium transition-colors disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                저장 중...
              </>
            ) : (
              "저장"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
