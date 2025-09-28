"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ServiceCard;
var react_1 = require("react");
var categoryColors = {
    '1': 'bg-blue-100 text-blue-800',
    '2': 'bg-pink-100 text-pink-800',
    '3': 'bg-green-100 text-green-800',
    '4': 'bg-gray-100 text-gray-800'
};
function ServiceCard(_a) {
    var service = _a.service, onStatusToggle = _a.onStatusToggle, onEdit = _a.onEdit, onDelete = _a.onDelete, onDuplicate = _a.onDuplicate, onCardClick = _a.onCardClick;
    var _b = (0, react_1.useState)(false), showMenu = _b[0], setShowMenu = _b[1];
    var _c = (0, react_1.useState)(false), editingPrice = _c[0], setEditingPrice = _c[1];
    var _d = (0, react_1.useState)(service.basePrice), tempPrice = _d[0], setTempPrice = _d[1];
    var handleCardClick = function () {
        onCardClick(service);
    };
    var handleMenuToggle = function (e) {
        e.stopPropagation();
        setShowMenu(!showMenu);
    };
    var handlePriceClick = function (e) {
        e.stopPropagation();
        setEditingPrice(true);
        setTempPrice(service.basePrice);
    };
    var handlePriceSave = function (e) {
        if (e.key === 'Enter') {
            // 가격 업데이트 로직 (여기서는 시뮬레이션)
            console.log('가격 업데이트:', tempPrice);
            setEditingPrice(false);
        }
        else if (e.key === 'Escape') {
            setEditingPrice(false);
            setTempPrice(service.basePrice);
        }
    };
    var formatPrice = function (price) {
        return new Intl.NumberFormat('ko-KR').format(price);
    };
    var formatDuration = function (minutes) {
        var hours = Math.floor(minutes / 60);
        var mins = minutes % 60;
        if (hours > 0 && mins > 0) {
            return "".concat(hours, "\uC2DC\uAC04 ").concat(mins, "\uBD84");
        }
        else if (hours > 0) {
            return "".concat(hours, "\uC2DC\uAC04");
        }
        else {
            return "".concat(mins, "\uBD84");
        }
    };
    return (<div className={"bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer min-h-[320px] flex flex-col relative ".concat(!service.isActive ? 'opacity-60' : '')} onClick={handleCardClick} tabIndex={0} onKeyDown={function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardClick();
            }
        }}>
      {/* 더보기 메뉴 */}
      <div className="absolute top-3 right-3">
        <button onClick={handleMenuToggle} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
          <i className="ri-more-2-line text-gray-400"></i>
        </button>
        
        {showMenu && (<div className="absolute right-0 top-8 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10 min-w-[120px]">
            <button onClick={function (e) {
                e.stopPropagation();
                onEdit(service);
                setShowMenu(false);
            }} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              <i className="ri-edit-line mr-2"></i>
              수정
            </button>
            {onDuplicate && (<button onClick={function (e) {
                    e.stopPropagation();
                    onDuplicate(service);
                    setShowMenu(false);
                }} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
                <i className="ri-file-copy-line mr-2"></i>
                복제
              </button>)}
            <button onClick={function (e) {
                e.stopPropagation();
                onStatusToggle(service.id);
                setShowMenu(false);
            }} className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50">
              <i className={"".concat(service.isActive ? 'ri-pause-line' : 'ri-play-line', " mr-2")}></i>
              {service.isActive ? '비활성화' : '활성화'}
            </button>
            <button onClick={function (e) {
                e.stopPropagation();
                onDelete(service.id);
                setShowMenu(false);
            }} className="w-full px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50">
              <i className="ri-delete-bin-line mr-2"></i>
              삭제
            </button>
          </div>)}
      </div>

      {/* 상단: 서비스명 + 상태 배지 */}
      <div className="flex items-start justify-between mb-4 pr-8">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="font-semibold text-gray-900 text-lg truncate">{service.name}</h3>
            {!service.isActive && (<span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full font-medium whitespace-nowrap">
                비활성
              </span>)}
          </div>
          <span className={"inline-block px-2 py-1 rounded-full text-xs font-medium ".concat(categoryColors[service.categoryId] || 'bg-gray-100 text-gray-800')}>
            {service.categoryName}
          </span>
        </div>
      </div>

      {/* 중간: 가격 (클릭 가능) */}
      <div className="mb-4">
        <div className="flex items-baseline gap-2 mb-2">
          {editingPrice ? (<input type="number" value={tempPrice} onChange={function (e) { return setTempPrice(Number(e.target.value)); }} onKeyDown={handlePriceSave} onBlur={function () { return setEditingPrice(false); }} className="text-2xl font-bold text-gray-900 border-b-2 border-blue-500 bg-transparent outline-none w-32" autoFocus/>) : (<button onClick={handlePriceClick} className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {formatPrice(service.basePrice)}
            </button>)}
          <span className="text-sm text-gray-500">원</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
          <div className="flex items-center gap-1">
            <i className="ri-time-line"></i>
            <span>{formatDuration(service.duration)} 소요</span>
          </div>
          {service.priceOptions && service.priceOptions.length > 0 && (<div className="flex items-center gap-1">
              <i className="ri-add-circle-line"></i>
              <span>옵션 {service.priceOptions.length}개</span>
            </div>)}
        </div>
        <div className="text-sm text-blue-600 font-medium">
          이번 달 {service.monthlyUsage}회 이용
        </div>
      </div>

      {/* 설명 영역 - flex-1로 남은 공간 차지 */}
      <div className="flex-1 mb-4">
        {service.description && (<p className="text-sm text-gray-600 line-clamp-2">{service.description}</p>)}
      </div>

      {/* 빠른 액션 - 카드 하단에 고정 */}
      <div className="flex items-center gap-2 pt-3 border-t border-gray-100 mt-auto">
        <button onClick={function (e) {
            e.stopPropagation();
            onEdit(service);
        }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
          <i className="ri-edit-line"></i>
          <span className="hidden sm:inline">수정</span>
        </button>
        <button onClick={function (e) {
            e.stopPropagation();
            // 예약 현황 보기 기능
        }} className="flex-1 flex items-center justify-center gap-1 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors">
          <i className="ri-calendar-line"></i>
          <span className="hidden sm:inline">예약현황</span>
        </button>
      </div>

      {/* 외부 클릭 시 메뉴 닫기 */}
      {showMenu && (<div className="fixed inset-0 z-0" onClick={function () { return setShowMenu(false); }}/>)}
    </div>);
}
