import { useState, useEffect } from 'react';
import { Filter } from 'lucide-react';

interface PriceRangeFilterProps {
  value: [number, number];
  onChange: (range: [number, number]) => void;
  min: number;
  max: number;
}

export default function PriceRangeFilter({
  value,
  onChange,
  min,
  max,
}: PriceRangeFilterProps) {
  const [localRange, setLocalRange] = useState<[number, number]>(value);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    setLocalRange(value);
  }, [value]);

  const handleRangeChange = (index: 0 | 1, inputValue: string) => {
    const numValue = parseInt(inputValue, 10);
    if (Number.isNaN(numValue)) return;

    const newRange: [number, number] = [...localRange];
    newRange[index] = numValue;

    if (index === 0 && numValue > newRange[1]) {
      newRange[1] = numValue;
    } else if (index === 1 && numValue < newRange[0]) {
      newRange[0] = numValue;
    }

    setLocalRange(newRange);
  };

  const applyFilter = () => {
    onChange(localRange);
    setShowFilter(false);
  };

  const resetFilter = () => {
    const resetRange: [number, number] = [min, max];
    setLocalRange(resetRange);
    onChange(resetRange);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('ko-KR').format(price);

  const isFiltered = value[0] !== min || value[1] !== max;

  return (
    <div className="relative">
      <button
        onClick={() => setShowFilter(!showFilter)}
        className={`flex items-center gap-1 rounded-lg px-2 py-1.5 text-xs font-medium transition-colors md:gap-2 md:px-3 md:py-2 md:text-sm ${
          isFiltered
            ? 'border border-blue-200 bg-blue-100 text-blue-700'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <Filter size={18} className="text-gray-600" />
        <span className="hidden sm:inline">가격 필터</span>
        <span className="sm:hidden">가격</span>
        {isFiltered && (
          <span className="hidden rounded-full bg-blue-600 px-1.5 py-0.5 text-xs text-white md:inline md:px-2">
            {formatPrice(value[0])} - {formatPrice(value[1])}
          </span>
        )}
      </button>

      {showFilter && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setShowFilter(false)}
          />
          <div className="absolute left-0 top-full z-20 mt-2 w-72 rounded-lg border border-gray-200 bg-white p-4 shadow-lg md:w-80">
            <h4 className="mb-4 font-medium text-gray-900">가격 범위</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    최소 금액
                  </label>
                  <input
                    type="number"
                    value={localRange[0]}
                    onChange={(e) => handleRangeChange(0, e.target.value)}
                    min={min}
                    max={max}
                    step={1000}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-gray-500">
                    최대 금액
                  </label>
                  <input
                    type="number"
                    value={localRange[1]}
                    onChange={(e) => handleRangeChange(1, e.target.value)}
                    min={min}
                    max={max}
                    step={1000}
                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="relative">
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={localRange[0]}
                  onChange={(e) => handleRangeChange(0, e.target.value)}
                  className="slider-thumb absolute h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                  style={{ zIndex: 1 }}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={localRange[1]}
                  onChange={(e) => handleRangeChange(1, e.target.value)}
                  className="slider-thumb absolute h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200"
                  style={{ zIndex: 2 }}
                />
                <div className="relative h-2 rounded-lg bg-gray-200">
                  <div
                    className="absolute h-2 rounded-lg bg-blue-600"
                    style={{
                      left: `${((localRange[0] - min) / (max - min)) * 100}%`,
                      right: `${100 - ((localRange[1] - min) / (max - min)) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatPrice(min)}원</span>
                <span>{formatPrice(max)}원</span>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={applyFilter}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  적용
                </button>
                <button
                  onClick={resetFilter}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
                >
                  초기화
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <style>{`
        .slider-thumb::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        .slider-thumb::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: #3B82F6;
          cursor: pointer;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
      `}</style>
    </div>
  );
}
