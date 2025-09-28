"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = CustomerInfoPanel;
var react_1 = require("react");
var Card_1 = require("../../../../components/base/Card");
var Button_1 = require("../../../../components/base/Button");
var useToast_1 = require("../../../../hooks/useToast");
function CustomerInfoPanel(_a) {
    var customer = _a.customer, onEdit = _a.onEdit;
    var showToast = (0, useToast_1.useToast)().showToast;
    var _b = (0, react_1.useState)(false), isEditingMemo = _b[0], setIsEditingMemo = _b[1];
    var _c = (0, react_1.useState)(customer.personalMemo), memoText = _c[0], setMemoText = _c[1];
    var formatDate = function (dateString) {
        var date = new Date(dateString);
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };
    var formatBirthDate = function (dateString) {
        if (!dateString)
            return '-';
        var date = new Date(dateString);
        var today = new Date();
        var age = today.getFullYear() - date.getFullYear();
        return "".concat(formatDate(dateString), " (").concat(age, "\uC138)");
    };
    var handleSaveMemo = function () {
        // 실제로는 API 호출로 메모 저장
        console.log('메모 저장:', memoText);
        setIsEditingMemo(false);
        showToast('개인 메모가 저장되었습니다.', 'success');
    };
    var handleCancelMemo = function () {
        setMemoText(customer.personalMemo);
        setIsEditingMemo(false);
    };
    var handleKeyDown = function (e) {
        if (e.key === 'Escape') {
            handleCancelMemo();
        }
        else if (e.key === 'Enter' && e.ctrlKey) {
            handleSaveMemo();
        }
    };
    return (<div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        {/* 프로필 섹션 */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-line text-blue-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{customer.name}</h2>
          <a href={"tel:".concat(customer.phone)} className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors">
            <i className="ri-phone-line"></i>
            {customer.phone}
          </a>
        </div>

        {/* 기본 정보 카드 */}
        <Card_1.default>
          <h3 className="text-lg font-semibold text-gray-800 mb-4">기본 정보</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <i className="ri-user-line text-gray-500"></i>
                <span className="text-gray-600">성별</span>
              </div>
              <span className="font-medium text-gray-800">
                {customer.gender === 'female' ? '여성' : customer.gender === 'male' ? '남성' : '-'}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <i className="ri-cake-2-line text-gray-500"></i>
                <span className="text-gray-600">생일</span>
              </div>
              <span className="font-medium text-gray-800 text-sm">
                {formatBirthDate(customer.birthDate)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <i className="ri-calendar-line text-gray-500"></i>
                <span className="text-gray-600">등록일</span>
              </div>
              <span className="font-medium text-gray-800">
                {formatDate(customer.registeredAt)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <i className="ri-bookmark-line text-gray-500"></i>
                <span className="text-gray-600">총 방문</span>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                {customer.visitHistory.length}회
              </span>
            </div>
          </div>
        </Card_1.default>

        {/* 개인 메모 카드 */}
        <Card_1.default>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">개인 메모</h3>
            {!isEditingMemo && (<Button_1.default variant="icon" size="sm" onClick={function () { return setIsEditingMemo(true); }}>
                <i className="ri-edit-line"></i>
              </Button_1.default>)}
          </div>

          {isEditingMemo ? (<div className="space-y-3">
              <textarea value={memoText} onChange={function (e) { return setMemoText(e.target.value); }} onKeyDown={handleKeyDown} placeholder="고객의 특이사항, 알레르기, 선호스타일 등을 기록하세요..." className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm" maxLength={500} autoFocus/>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {memoText.length}/500자 (Ctrl+Enter: 저장, ESC: 취소)
                </span>
                <div className="flex items-center gap-2">
                  <Button_1.default variant="secondary" size="sm" onClick={handleCancelMemo}>
                    취소
                  </Button_1.default>
                  <Button_1.default variant="primary" size="sm" onClick={handleSaveMemo}>
                    저장
                  </Button_1.default>
                </div>
              </div>
            </div>) : (<div>
              {customer.personalMemo ? (<p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {customer.personalMemo}
                </p>) : (<p className="text-gray-500 text-sm italic">
                  개인 메모가 없습니다. 편집 버튼을 클릭하여 추가해보세요.
                </p>)}
            </div>)}
        </Card_1.default>
      </div>

      {/* 하단 정보 수정 버튼 */}
      <div className="p-6 border-t border-gray-200">
        <Button_1.default variant="primary" className="w-full" onClick={onEdit}>
          <i className="ri-edit-line"></i>
          정보 수정
        </Button_1.default>
      </div>
    </div>);
}
