import { useState } from 'react';
import { Clock, Plus, PlusCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface PriceOption {
  id: string;
  name: string;
  additionalPrice: number;
  description?: string;
}

interface Service {
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description?: string;
  isActive: boolean;
  priceOptions?: PriceOption[];
}

interface AddServiceModalProps {
  open: boolean;
  categories: Category[];
  onSave: (service: Service) => void;
  onClose: () => void;
}

export default function AddServiceModal({
  open,
  categories,
  onSave,
  onClose,
}: AddServiceModalProps) {
  const [currentTab, setCurrentTab] = useState<'basic' | 'options' | 'preview'>(
    'basic'
  );
  const [formData, setFormData] = useState({
    name: '',
    categoryId: '',
    basePrice: '',
    duration: '',
    description: '',
    isActive: true,
  });
  const [priceOptions, setPriceOptions] = useState<Omit<PriceOption, 'id'>[]>(
    []
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = '서비스명을 입력해주세요';
    }
    if (!formData.categoryId) {
      newErrors.categoryId = '카테고리를 선택해주세요';
    }
    if (!formData.basePrice || parseInt(formData.basePrice) <= 0) {
      newErrors.basePrice = '올바른 가격을 입력해주세요';
    }
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = '소요시간을 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const selectedCategory = categories.find(
      (c) => c.id === formData.categoryId
    );

    const serviceData: Service = {
      name: formData.name.trim(),
      categoryId: formData.categoryId,
      categoryName: selectedCategory?.name || '',
      basePrice: parseInt(formData.basePrice),
      duration: parseInt(formData.duration),
      description: formData.description.trim() || undefined,
      isActive: formData.isActive,
      priceOptions:
        priceOptions.length > 0
          ? priceOptions.map((opt, index) => ({
              ...opt,
              id: `new-${index}`,
            }))
          : undefined,
    };

    onSave(serviceData);
  };

  const addPriceOption = () => {
    setPriceOptions([
      ...priceOptions,
      { name: '', additionalPrice: 0, description: '' },
    ]);
  };

  const updatePriceOption = (
    index: number,
    field: keyof Omit<PriceOption, 'id'>,
    value: string | number
  ) => {
    const updated = [...priceOptions];
    updated[index] = { ...updated[index], [field]: value };
    setPriceOptions(updated);
  };

  const removePriceOption = (index: number) => {
    setPriceOptions(priceOptions.filter((_, i) => i !== index));
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;

    if (hours > 0 && mins > 0) {
      return `${hours}시간 ${mins}분`;
    } else if (hours > 0) {
      return `${hours}시간`;
    } else {
      return `${mins}분`;
    }
  };

  const totalPrice =
    parseInt(formData.basePrice || '0') +
    priceOptions.reduce((sum, opt) => sum + opt.additionalPrice, 0);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl p-6">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <DialogTitle>새 서비스 추가</DialogTitle>
                <div className="flex rounded-lg bg-gray-100 p-1">
                  {[
                    {
                      key: 'basic',
                      label: '기본 정보',
                      icon: 'ri-information-line',
                    },
                    {
                      key: 'options',
                      label: '가격 옵션',
                      icon: 'ri-add-circle-line',
                    },
                    { key: 'preview', label: '미리보기', icon: 'ri-eye-line' },
                  ].map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setCurrentTab(tab.key as any)}
                      className={`flex items-center gap-2 rounded px-3 py-1.5 text-sm font-medium transition-colors ${
                        currentTab === tab.key
                          ? 'bg-white text-blue-600 shadow-sm'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      <i className={tab.icon} />
                      {tab.label}
                    </button>
                  ))}
                </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto">
              {currentTab === 'basic' && (
                <div className="space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      서비스명 *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="예: 여성 컷, 젤네일, 페이셜 케어"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      카테고리 *
                    </label>
                    <select
                      value={formData.categoryId}
                      onChange={(e) =>
                        setFormData({ ...formData, categoryId: e.target.value })
                      }
                      className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                        errors.categoryId ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">카테고리 선택</option>
                      {categories.map((category) => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                    {errors.categoryId && (
                      <p className="mt-1 text-sm text-red-500">
                        {errors.categoryId}
                      </p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        기본 가격 (원) *
                      </label>
                      <input
                        type="number"
                        value={formData.basePrice}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            basePrice: e.target.value,
                          })
                        }
                        className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                          errors.basePrice
                            ? 'border-red-300'
                            : 'border-gray-300'
                        }`}
                        placeholder="30000"
                        min="0"
                        step="1000"
                      />
                      {errors.basePrice && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.basePrice}
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-700">
                        소요시간 (분) *
                      </label>
                      <input
                        type="number"
                        value={formData.duration}
                        onChange={(e) =>
                          setFormData({ ...formData, duration: e.target.value })
                        }
                        className={`w-full rounded-lg border px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500 ${
                          errors.duration ? 'border-red-300' : 'border-gray-300'
                        }`}
                        placeholder="60"
                        min="15"
                        step="15"
                      />
                      {errors.duration && (
                        <p className="mt-1 text-sm text-red-500">
                          {errors.duration}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      서비스 설명
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                      placeholder="서비스에 대한 간단한 설명을 입력해주세요"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <label className="flex cursor-pointer items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            isActive: e.target.checked,
                          })
                        }
                        className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">
                        서비스 활성화
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {currentTab === 'options' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">
                      가격 옵션
                    </h3>
                    <button
                      onClick={addPriceOption}
                      className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                    >
                      <Plus size={20} className="text-white" />
                      옵션 추가
                    </button>
                  </div>

                  {priceOptions.length === 0 ? (
                    <div className="py-8 text-center text-gray-500">
                      <PlusCircle size={18} className="mb-2 text-gray-600" />
                      <p>추가 가격 옵션이 없습니다</p>
                      <p className="text-sm">
                        고객이 선택할 수 있는 추가 옵션을 만들어보세요
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {priceOptions.map((option, index) => (
                        <div
                          key={index}
                          className="rounded-lg border border-gray-200 p-4"
                        >
                          <div className="mb-3 flex items-start justify-between">
                            <h4 className="font-medium text-gray-900">
                              옵션 {index + 1}
                            </h4>
                            <button
                              onClick={() => removePriceOption(index)}
                              className="p-1 text-red-500 hover:text-red-700"
                            >
                              <Trash2 size={20} className="text-gray-600 hover:text-red-600" />
                            </button>
                          </div>
                          <div className="mb-3 grid grid-cols-2 gap-3">
                            <input
                              type="text"
                              value={option.name}
                              onChange={(e) =>
                                updatePriceOption(index, 'name', e.target.value)
                              }
                              placeholder="옵션명 (예: 긴 머리 추가)"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="number"
                              value={option.additionalPrice}
                              onChange={(e) =>
                                updatePriceOption(
                                  index,
                                  'additionalPrice',
                                  parseInt(e.target.value) || 0
                                )
                              }
                              placeholder="추가 금액"
                              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                              min="0"
                              step="1000"
                            />
                          </div>
                          <input
                            type="text"
                            value={option.description || ''}
                            onChange={(e) =>
                              updatePriceOption(
                                index,
                                'description',
                                e.target.value
                              )
                            }
                            placeholder="옵션 설명 (선택사항)"
                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {currentTab === 'preview' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    미리보기
                  </h3>

                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                      <div className="mb-3 flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {formData.name || '서비스명'}
                          </h3>
                          <span className="mt-1 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                            {categories.find(
                              (c) => c.id === formData.categoryId
                            )?.name || '카테고리'}
                          </span>
                        </div>
                        <div
                          className={`h-3 w-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-gray-400'}`}
                        />
                      </div>

                      <div className="mb-4">
                        <div className="mb-2 flex items-baseline gap-2">
                          <span className="text-2xl font-bold text-gray-900">
                            {formData.basePrice
                              ? formatPrice(parseInt(formData.basePrice))
                              : '0'}
                          </span>
                          <span className="text-sm text-gray-500">원</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Clock size={18} className="text-gray-600" />
                            <span>
                              {formData.duration
                                ? formatDuration(parseInt(formData.duration))
                                : '시간 미정'}
                            </span>
                          </div>
                          {priceOptions.length > 0 && (
                            <div className="flex items-center gap-1">
                              <PlusCircle size={18} className="text-gray-600" />
                              <span>옵션 {priceOptions.length}개</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {formData.description && (
                        <p className="mb-4 text-sm text-gray-600">
                          {formData.description}
                        </p>
                      )}

                      {priceOptions.length > 0 && (
                        <div className="border-t border-gray-100 pt-4">
                          <h4 className="mb-2 font-medium text-gray-900">
                            추가 옵션
                          </h4>
                          <div className="space-y-2">
                            {priceOptions.map((option, index) => (
                              <div
                                key={index}
                                className="flex items-center justify-between text-sm"
                              >
                                <div>
                                  <span className="text-gray-900">
                                    {option.name || `옵션 ${index + 1}`}
                                  </span>
                                  {option.description && (
                                    <span className="ml-2 text-gray-500">
                                      ({option.description})
                                    </span>
                                  )}
                                </div>
                                <span className="font-medium text-gray-900">
                                  +{formatPrice(option.additionalPrice)}원
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
        </div>

        {/* 하단 액션 */}
        <div className="border-t border-gray-200 px-6 pb-6 pt-4">
          <div className="mb-3 text-sm text-gray-500">
            {formData.basePrice && (
              <span>
                총 가격: <strong>{formatPrice(totalPrice)}원</strong>
                {priceOptions.length > 0 && ' (옵션 포함)'}
              </span>
            )}
          </div>
          <DialogFooter className="flex-row justify-end space-x-2">
            <Button onClick={onClose} variant="outline">
              취소
            </Button>
            <Button onClick={handleSubmit} variant="default">
              서비스 추가
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
