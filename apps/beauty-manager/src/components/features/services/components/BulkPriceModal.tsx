
import { useState } from 'react';
import Button from '@/components/ui/Button';

interface Service {
  id: string;
  name: string;
  categoryName: string;
  basePrice: number;
}

interface BulkPriceModalProps {
  services: Service[];
  onClose: () => void;
  onApply: (selectedServices: string[], adjustmentType: 'fixed' | 'percent', adjustmentValue: number, direction: 'increase' | 'decrease') => void;
}

export default function BulkPriceModal({ services, onClose, onApply }: BulkPriceModalProps) {
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [adjustmentType, setAdjustmentType] = useState<'fixed' | 'percent'>('fixed');
  const [adjustmentValue, setAdjustmentValue] = useState<number>(0);
  const [direction, setDirection] = useState<'increase' | 'decrease'>('increase');

  const categories = Array.from(new Set(services.map(s => s.categoryName)));

  const handleServiceToggle = (serviceId: string) => {
    setSelectedServices(prev => 
      prev.includes(serviceId)
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const handleCategoryToggle = (categoryName: string) => {
    const categoryServices = services.filter(s => s.categoryName === categoryName).map(s => s.id);
    const allSelected = categoryServices.every(id => selectedServices.includes(id));
    
    if (allSelected) {
      setSelectedServices(prev => prev.filter(id => !categoryServices.includes(id)));
    } else {
      setSelectedServices(prev => [...new Set([...prev, ...categoryServices])]);
    }
  };

  const handleSelectAll = () => {
    if (selectedServices.length === services.length) {
      setSelectedServices([]);
    } else {
      setSelectedServices(services.map(s => s.id));
    }
  };

  const calculateNewPrice = (currentPrice: number) => {
    if (adjustmentType === 'fixed') {
      return direction === 'increase' 
        ? currentPrice + adjustmentValue
        : Math.max(0, currentPrice - adjustmentValue);
    } else {
      const multiplier = direction === 'increase' 
        ? 1 + (adjustmentValue / 100)
        : 1 - (adjustmentValue / 100);
      return Math.max(0, Math.round(currentPrice * multiplier));
    }
  };

  const selectedServiceData = services.filter(s => selectedServices.includes(s.id));

  const handleApply = () => {
    onApply(selectedServices, adjustmentType, adjustmentValue, direction);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-semibold text-gray-900">일괄 가격 수정</h2>
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNum) => (
                <div key={stepNum} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNum ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {stepNum}
                  </div>
                  {stepNum < 3 && (
                    <div className={`w-8 h-0.5 ${step > stepNum ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="ri-close-line text-xl"></i>
          </button>
        </div>

        <div className="p-6 max-h-[600px] overflow-y-auto">
          {step === 1 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">1단계: 서비스 선택</h3>
              
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={handleSelectAll}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  {selectedServices.length === services.length ? '전체 해제' : '전체 선택'}
                </button>
                <span className="text-sm text-gray-600">
                  선택된 서비스: {selectedServices.length}개
                </span>
              </div>

              {/* 카테고리별 선택 */}
              <div className="space-y-4">
                {categories.map((categoryName) => {
                  const categoryServices = services.filter(s => s.categoryName === categoryName);
                  const selectedCount = categoryServices.filter(s => selectedServices.includes(s.id)).length;
                  const allSelected = selectedCount === categoryServices.length;
                  const someSelected = selectedCount > 0 && selectedCount < categoryServices.length;

                  return (
                    <div key={categoryName} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <label className="flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={allSelected}
                            ref={(el) => {
                              if (el) el.indeterminate = someSelected;
                            }}
                            onChange={() => handleCategoryToggle(categoryName)}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus-ring"
                          />
                          <span className="ml-2 font-medium text-gray-900">{categoryName}</span>
                        </label>
                        <span className="text-sm text-gray-500">
                          {selectedCount}/{categoryServices.length}개 선택
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 ml-6">
                        {categoryServices.map((service) => (
                          <label key={service.id} className="flex items-center cursor-pointer p-2 hover:bg-gray-50 rounded">
                            <input
                              type="checkbox"
                              checked={selectedServices.includes(service.id)}
                              onChange={() => handleServiceToggle(service.id)}
                              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus-ring"
                            />
                            <div className="ml-2 flex-1">
                              <span className="text-sm text-gray-900">{service.name}</span>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">2단계: 가격 조정 방식</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">조정 방식</label>
                  <div className="space-y-2">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="fixed"
                        checked={adjustmentType === 'fixed'}
                        onChange={(e) => setAdjustmentType(e.target.value as 'fixed')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus-ring"
                      />
                      <span className="ml-2">고정 금액 추가/차감</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="adjustmentType"
                        value="percent"
                        checked={adjustmentType === 'percent'}
                        onChange={(e) => setAdjustmentType(e.target.value as 'percent')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus-ring"
                      />
                      <span className="ml-2">퍼센트 증감</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">조정 방향</label>
                  <div className="flex gap-4">
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="direction"
                        value="increase"
                        checked={direction === 'increase'}
                        onChange={(e) => setDirection(e.target.value as 'increase')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus-ring"
                      />
                      <span className="ml-2 text-green-600">증가</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="direction"
                        value="decrease"
                        checked={direction === 'decrease'}
                        onChange={(e) => setDirection(e.target.value as 'decrease')}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus-ring"
                      />
                      <span className="ml-2 text-red-600">감소</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {adjustmentType === 'fixed' ? '금액' : '퍼센트'}
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={adjustmentValue}
                      onChange={(e) => setAdjustmentValue(Number(e.target.value))}
                      min="0"
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus-ring"
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">3단계: 미리보기</h3>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-2">
                  <i className="ri-information-line text-yellow-600"></i>
                  <span className="text-sm text-yellow-800">
                    총 {selectedServices.length}개 서비스의 가격이 변경됩니다.
                  </span>
                </div>
              </div>

              <div className="max-h-96 overflow-y-auto border border-gray-200 rounded-lg">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">서비스명</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">카테고리</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">현재 가격</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">신규 가격</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">변경액</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedServiceData.map((service) => {
                      const newPrice = calculateNewPrice(service.basePrice);
                      const difference = newPrice - service.basePrice;
                      
                      return (
                        <tr key={service.id} className="border-b border-gray-100">
                          <td className="py-3 px-4 text-sm text-gray-900">{service.name}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{service.categoryName}</td>
                          <td className="py-3 px-4 text-sm text-gray-900">
                            {service.basePrice.toLocaleString()}원
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-gray-900">
                            {newPrice.toLocaleString()}원
                          </td>
                          <td className={`py-3 px-4 text-sm font-medium ${
                            difference > 0 ? 'text-green-600' : difference < 0 ? 'text-red-600' : 'text-gray-600'
                          }`}>
                            {difference > 0 ? '+' : ''}{difference.toLocaleString()}원
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
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
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
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                다음
              </Button>
            ) : (
              <Button 
                onClick={handleApply}
                className="bg-blue-600 hover:bg-blue-700 text-white"
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
