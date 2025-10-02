import { useState } from 'react';
import Button from '@/shared/components/Button';

interface Service {
  id: string;
  name: string;
  categoryName: string;
  basePrice: number;
}

interface BulkPriceModalProps {
  services: Service[];
  onClose: () => void;
  onApply: (
    selectedServices: string[],
    adjustmentType: 'fixed' | 'percent',
    adjustmentValue: number,
    direction: 'increase' | 'decrease'
  ) => void;
}

export default function BulkPriceModal({
  services,
  onClose,
  onApply,
}: BulkPriceModalProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'percent'>(
    'fixed'
  );
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [direction, setDirection] = useState<'increase' | 'decrease'>(
    'increase'
  );

  const categories = Array.from(new Set(services.map((s) => s.categoryName)));

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCategoryToggle = (categoryName: string) => {
    const categoryServices = services
      .filter((s) => s.categoryName === categoryName)
      .map((s) => s.id);
    const allSelected = categoryServices.every((id) =>
      selectedServices.includes(id)
    );

    if (allSelected) {
      setSelectedServices((prev) =>
        prev.filter((id) => !categoryServices.includes(id))
      );
    } else {
      setSelectedServices((prev) => [
        ...new Set([...prev, ...categoryServices]),
      ]);
    }
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map((s) => s.id));
    }
  };

  const calculateNewPrice = (currentPrice: number) => {
    if (adjustmentType === 'fixed') {
      return direction === 'increase'
        ? currentPrice + adjustmentValue
        : Math.max(0, currentPrice - adjustmentValue);
    } else {
      const multiplier =
        direction === 'increase'
          ? 1 + adjustmentValue / 100
          : 1 - adjustmentValue / 100;
      return Math.max(0, Math.round(currentPrice * multiplier));
    }
  };

  const selectedServiceData = services.filter((s) =>
    selectedServices.includes(s.id)
  );

  const handleApply = () => {
    onApply(selectedServices, adjustmentType, adjustmentValue, direction);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">
              일괄 가격 수정
            </h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
                      step >= stepNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div
                      className={`h-0.5 w-8 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 transition-colors hover:text-gray-600"
          >
            <i className="ri-close-line text-xl" />
          </button>
        </div>

        <div className="max-h-[600px] overflow-y-auto p-6">
          {step === 1 && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                1단계: 서비스 선택
              </h3>

              <div className="mb-4 flex items-center justify-between">
                <button
                  onClick={handleSelectAll}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {selectedServices.length === services.length
                    ? '전체 해제'
                    : '전체 선택'}
                </button>
                <span className="text-sm text-gray-600">
                  선택된 서비스: {selectedServices.length}개
                </span>
              </div>

              {/* 카테고리별 선택 */}
              <div className="space-y-4">
                {categories.map((categoryName) => {
                  const categoryServices = services.filter(
                    (s) => s.categoryName === categoryName
                  );
                  const selectedCount = categoryServices.filter((s) =>
                    selectedServices.includes(s.id)
                  ).length;
                  const allSelected = selectedCount === categoryServices.length;
                  const someSelected =
                    selectedCount > 0 &&
                    selectedCount < categoryServices.length;

                  return (
                    <div
                      key={categoryName}
                      className="rounded-lg border border-gray-200 p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <label className="flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected;
                            }}
                            onChange={() => handleCategoryToggle(categoryName)}
                            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="ml-2 font-medium text-gray-900">
                            {categoryName}
                          </span>
                        </label>
                        <span className="text-sm text-gray-500">
                          {selectedCount}/{categoryServices.length}개 선택
                        </span>
                      </div>

                      <div className="ml-6 grid grid-cols-1 gap-2 md:grid-cols-2">
                        {categoryServices.map((service) => (
                          <label
                            key={service.id}
                            className="flex cursor-pointer items-center rounded p-2 hover:bg-gray-50"
                          >
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <div className="ml-2 flex-1">
                              <span className="text-sm text-gray-900">
                                {service.name}
                              </span>
                              <span className="ml-2 text-sm text-gray-500">
                                {service.basePrice.toLocaleString()}원
                              </span>
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                2단계: 가격 조정 방식
              </h3>

              <div className="space-y-6">
                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    조정 방식
                  </label>
                  <div className="space-y-2">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="fixed"
                        checked={adjustmentType === 'fixed'}
                        onChange={(e) =>
                          setAdjustmentType(e.target.value as 'fixed')
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">고정 금액 추가/차감</span>
                    </label>
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="percent"
                        checked={adjustmentType === 'percent'}
                        onChange={(e) =>
                          setAdjustmentType(e.target.value as 'percent')
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2">퍼센트 증감</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-3 block text-sm font-medium text-gray-700">
                    조정 방향
                  </label>
                  <div className="flex gap-4">
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="direction"
                        value="increase"
                        checked={direction === 'increase'}
                        onChange={(e) =>
                          setDirection(e.target.value as 'increase')
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-green-600">증가</span>
                    </label>
                    <label className="flex cursor-pointer items-center">
                      <input
                        type="radio"
                        name="direction"
                        value="decrease"
                        checked={direction === 'decrease'}
                        onChange={(e) =>
                          setDirection(e.target.value as 'decrease')
                        }
                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-red-600">감소</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    {adjustmentType === 'fixed' ? '금액' : '퍼센트'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={adjustmentValue}
                      onChange={(e) =>
                        setAdjustmentValue(Number(e.target.value))
                      }
                      min="0"
                      className="w-32 rounded-lg border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <span className="text-gray-600">
                      {adjustmentType === 'fixed' ? '원' : '%'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                3단계: 미리보기
              </h3>

              <div className="mb-4 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <div className="flex items-center gap-2">
                  <i className="ri-information-line text-yellow-600" />
                  <span className="text-sm text-yellow-800">
                    총 {selectedServices.length}개 서비스의 가격이 변경됩니다.
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto rounded-lg border border-gray-200">
                <table className="w-full">
                  <thead className="sticky top-0 bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">
                        서비스명
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">
                        카테고리
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">
                        현재 가격
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">
                        신규 가격
                      </th>
                      <th className="px-4 py-3 text-left font-medium text-gray-900">
                        변경액
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServiceData.map((service) => {
                      const newPrice = calculateNewPrice(service.basePrice);
                      const difference = newPrice - service.basePrice;

                      return (
                        <tr
                          key={service.id}
                          className="border-b border-gray-100"
                        >
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {service.name}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">
                            {service.categoryName}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-900">
                            {service.basePrice.toLocaleString()}원
                          </td>
                          <td className="px-4 py-3 text-sm font-medium text-gray-900">
                            {newPrice.toLocaleString()}원
                          </td>
                          <td
                            className={`px-4 py-3 text-sm font-medium ${
                              difference > 0
                                ? 'text-green-600'
                                : difference < 0
                                  ? 'text-red-600'
                                  : 'text-gray-600'
                            }`}
                          >
                            {difference > 0 ? '+' : ''}
                            {difference.toLocaleString()}원
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-200 p-6">
          <div className="flex gap-2">
            {step > 1 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>
                이전
              </Button>
            )}
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>
              취소
            </Button>
            {step < 3 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 && selectedServices.length === 0}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                다음
              </Button>
            ) : (
              <Button
                onClick={handleApply}
                className="bg-blue-600 text-white hover:bg-blue-700"
              >
                적용
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
