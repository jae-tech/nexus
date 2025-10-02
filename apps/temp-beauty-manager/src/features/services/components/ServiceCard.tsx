import { useState } from 'react';

interface Service {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  basePrice: number;
  duration: number;
  description?: string;
  isActive: boolean;
  monthlyUsage: number;
  totalRevenue: number;
  priceOptions?: any[];
}

interface ServiceCardProps {
  service: Service;
  onStatusToggle: (serviceId: string) => void;
  onEdit: (service: Service) => void;
  onDelete: (serviceId: string) => void;
  onDuplicate?: (service: Service) => void;
  onCardClick: (service: Service) => void;
}

const categoryColors: Record<string, string> = {
  '1': 'bg-blue-100 text-blue-800',
  '2': 'bg-pink-100 text-pink-800',
  '3': 'bg-green-100 text-green-800',
  '4': 'bg-gray-100 text-gray-800',
};

export default function ServiceCard({
  service,
  onStatusToggle,
  onEdit,
  onDelete,
  onDuplicate,
  onCardClick,
}: ServiceCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [editingPrice, setEditingPrice] = useState(false);
  const [tempPrice, setTempPrice] = useState(service.basePrice);

  const handleCardClick = () => {
    onCardClick(service);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handlePriceClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPrice(true);
    setTempPrice(service.basePrice);
  };

  const handlePriceSave = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      // 가격 업데이트 로직 (여기서는 시뮬레이션)
      console.log('가격 업데이트:', tempPrice);
      setEditingPrice(false);
    } else if (e.key === 'Escape') {
      setEditingPrice(false);
      setTempPrice(service.basePrice);
    }
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

  return (
    <div
      className={`relative flex min-h-[320px] cursor-pointer flex-col rounded-xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${
        !service.isActive ? 'opacity-60' : ''
      }`}
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleCardClick();
        }
      }}
    >
      {/* 더보기 메뉴 */}
      <div className="absolute right-3 top-3">
        <button
          onClick={handleMenuToggle}
          className="rounded-full p-1 transition-colors hover:bg-gray-100"
        >
          <i className="ri-more-2-line text-gray-400" />
        </button>

        {showMenu && (
          <div className="absolute right-0 top-8 z-10 min-w-[120px] rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(service);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <i className="ri-edit-line mr-2" />
              수정
            </button>
            {onDuplicate && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDuplicate(service);
                  setShowMenu(false);
                }}
                className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              >
                <i className="ri-file-copy-line mr-2" />
                복제
              </button>
            )}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onStatusToggle(service.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
            >
              <i
                className={`${service.isActive ? 'ri-pause-line' : 'ri-play-line'} mr-2`}
              />
              {service.isActive ? '비활성화' : '활성화'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(service.id);
                setShowMenu(false);
              }}
              className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
            >
              <i className="ri-delete-bin-line mr-2" />
              삭제
            </button>
          </div>
        )}
      </div>

      {/* 상단: 서비스명 + 상태 배지 */}
      <div className="mb-4 flex items-start justify-between pr-8">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <h3 className="truncate text-lg font-semibold text-gray-900">
              {service.name}
            </h3>
            {!service.isActive && (
              <span className="whitespace-nowrap rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                비활성
              </span>
            )}
          </div>
          <span
            className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
              categoryColors[service.categoryId] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {service.categoryName}
          </span>
        </div>
      </div>

      {/* 중간: 가격 (클릭 가능) */}
      <div className="mb-4">
        <div className="mb-2 flex items-baseline gap-2">
          {editingPrice ? (
            <input
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(Number(e.target.value))}
              onKeyDown={handlePriceSave}
              onBlur={() => setEditingPrice(false)}
              className="w-32 border-b-2 border-blue-500 bg-transparent text-2xl font-bold text-gray-900 outline-none"
              autoFocus
            />
          ) : (
            <button
              onClick={handlePriceClick}
              className="text-2xl font-bold text-gray-900 transition-colors hover:text-blue-600"
            >
              {formatPrice(service.basePrice)}
            </button>
          )}
          <span className="text-sm text-gray-500">원</span>
        </div>
        <div className="mb-2 flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <i className="ri-time-line" />
            <span>{formatDuration(service.duration)} 소요</span>
          </div>
          {service.priceOptions && service.priceOptions.length > 0 && (
            <div className="flex items-center gap-1">
              <i className="ri-add-circle-line" />
              <span>옵션 {service.priceOptions.length}개</span>
            </div>
          )}
        </div>
        <div className="text-sm font-medium text-blue-600">
          이번 달 {service.monthlyUsage}회 이용
        </div>
      </div>

      {/* 설명 영역 - flex-1로 남은 공간 차지 */}
      <div className="mb-4 flex-1">
        {service.description && (
          <p className="line-clamp-2 text-sm text-gray-600">
            {service.description}
          </p>
        )}
      </div>

      {/* 빠른 액션 - 카드 하단에 고정 */}
      <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(service);
          }}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 transition-colors hover:bg-blue-200"
        >
          <i className="ri-edit-line" />
          <span className="hidden sm:inline">수정</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            // 예약 현황 보기 기능
          }}
          className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-green-100 px-3 py-2 text-sm text-green-700 transition-colors hover:bg-green-200"
        >
          <i className="ri-calendar-line" />
          <span className="hidden sm:inline">예약현황</span>
        </button>
      </div>

      {/* 외부 클릭 시 메뉴 닫기 */}
      {showMenu && (
        <div className="fixed inset-0 z-0" onClick={() => setShowMenu(false)} />
      )}
    </div>
  );
}
