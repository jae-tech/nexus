
import { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Customer } from '@/mocks/customerDetail';
import { useToast } from '@/hooks/useToast';

interface CustomerInfoPanelProps {
  customer: Customer;
  onEdit: () => void;
}

export default function CustomerInfoPanel({ customer, onEdit }: CustomerInfoPanelProps) {
  const { showToast } = useToast();
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(customer.personalMemo);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatBirthDate = (dateString?: string) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    return `${formatDate(dateString)} (${age}세)`;
  };

  const handleSaveMemo = () => {
    // 실제로는 API 호출로 메모 저장
    console.log('메모 저장:', memoText);
    setIsEditingMemo(false);
    showToast('개인 메모가 저장되었습니다.', 'success');
  };

  const handleCancelMemo = () => {
    setMemoText(customer.personalMemo);
    setIsEditingMemo(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCancelMemo();
    } else if (e.key === 'Enter' && e.ctrlKey) {
      handleSaveMemo();
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 p-6 space-y-6">
        {/* 프로필 섹션 */}
        <div className="text-center">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="ri-user-line text-blue-600 text-3xl"></i>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">{customer.name}</h2>
          <a 
            href={`tel:${customer.phone}`}
            className="text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 transition-colors"
          >
            <i className="ri-phone-line"></i>
            {customer.phone}
          </a>
        </div>

        {/* 기본 정보 카드 */}
        <Card>
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
        </Card>

        {/* 개인 메모 카드 */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">개인 메모</h3>
            {!isEditingMemo && (
              <Button variant="icon" size="sm" onClick={() => setIsEditingMemo(true)}>
                <i className="ri-edit-line"></i>
              </Button>
            )}
          </div>

          {isEditingMemo ? (
            <div className="space-y-3">
              <textarea
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="고객의 특이사항, 알레르기, 선호스타일 등을 기록하세요..."
                className="w-full h-32 p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                maxLength={500}
                autoFocus
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {memoText.length}/500자 (Ctrl+Enter: 저장, ESC: 취소)
                </span>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm" onClick={handleCancelMemo}>
                    취소
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSaveMemo}>
                    저장
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {customer.personalMemo ? (
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
                  {customer.personalMemo}
                </p>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  개인 메모가 없습니다. 편집 버튼을 클릭하여 추가해보세요.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* 하단 정보 수정 버튼 */}
      <div className="p-6 border-t border-gray-200">
        <Button variant="primary" className="w-full" onClick={onEdit}>
          <i className="ri-edit-line"></i>
          정보 수정
        </Button>
      </div>
    </div>
  );
}
