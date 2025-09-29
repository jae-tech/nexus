
import { useState, useEffect } from 'react';

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
        className={`flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1.5 md:py-2 rounded-lg text-xs md:text-sm font-medium transition-colors ${
          isFiltered
            ? 'bg-blue-100 text-blue-700 border border-blue-200'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
        }`}
      >
        <i className="ri-filter-line"></i>
        <span className="hidden sm:inline">가격 필터</span>
        <span className="sm:hidden">가격</span>
        {isFiltered && (
          <span className="bg-blue-600 text-white text-xs px-1.5 md:px-2 py-0.5 rounded-full hidden md:inline">
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
          <div className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 w-72 md:w-80 z-20">
            <h4 className="font-medium text-gray-900 mb-4">가격 범위</h4>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    최소 금액
                  </label>
                  <input
                    type="number"
                    value={localRange[0]}
                    onChange={(e) => handleRangeChange(0, e.target.value)}
                    min={min}
                    max={max}
                    step={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-ring focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">
                    최대 금액
                  </label>
                  <input
                    type="number"
                    value={localRange[1]}
                    onChange={(e) => handleRangeChange(1, e.target.value)}
                    min={min}
                    max={max}
                    step={1000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus-ring focus:border-transparent"
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
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{ zIndex: 1 }}
                />
                <input
                  type="range"
                  min={min}
                  max={max}
                  value={localRange[1]}
                  onChange={(e) => handleRangeChange(1, e.target.value)}
                  className="absolute w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider-thumb"
                  style={{ zIndex: 2 }}
                />
                <div className="relative h-2 bg-gray-200 rounded-lg">
                  <div
                    className="absolute h-2 bg-blue-600 rounded-lg"
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
                  className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  적용
                </button>
                <button
                  onClick={resetFilter}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800 text-sm font-medium"
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