import { useState, useRef, useEffect } from 'react';
import { Bookmark, Cake, Calendar, Pencil, Phone, User } from 'lucide-react';
import Card from '@/shared/components/Card';
import Button from '@/shared/components/Button';
import type { Customer } from '@/features/customers/api/mock-detail';
import { useToast } from '@/shared/hooks/useToast';

interface CustomerInfoPanelProps {
  customer: Customer;
  onEdit: () => void;
}

export default function CustomerInfoPanel({
  customer,
  onEdit,
}: CustomerInfoPanelProps) {
  const { success: successToast } = useToast();
  const [isEditingMemo, setIsEditingMemo] = useState(false);
  const [memoText, setMemoText] = useState(customer.personalMemo);
  const memoTextareaRef = useRef<HTMLTextAreaElement>(null);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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
    setIsEditingMemo(false);
    successToast('개인 메모가 저장되었습니다.');
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

  useEffect(() => {
    if (isEditingMemo && memoTextareaRef.current) {
      memoTextareaRef.current.focus();
    }
  }, [isEditingMemo]);

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 space-y-6 p-6">
        {/* 프로필 섹션 */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <User size={18} className="text-gray-600" />
          </div>
          <h2 className="mb-2 text-2xl font-bold text-gray-800">
            {customer.name}
          </h2>
          <a
            href={`tel:${customer.phone}`}
            className="flex items-center justify-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <Phone size={18} className="text-gray-600" />
            {customer.phone}
          </a>
        </div>

        {/* 기본 정보 카드 */}
        <Card>
          <h3 className="mb-4 text-lg font-semibold text-gray-800">
            기본 정보
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <User size={18} className="text-gray-600" />
                <span className="text-gray-600">성별</span>
              </div>
              <span className="font-medium text-gray-800">
                {customer.gender === 'female'
                  ? '여성'
                  : customer.gender === 'male'
                    ? '남성'
                    : '-'}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <Cake size={18} className="text-gray-600" />
                <span className="text-gray-600">생일</span>
              </div>
              <span className="text-sm font-medium text-gray-800">
                {formatBirthDate(customer.birthDate)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <div className="flex items-center gap-3">
                <Calendar size={18} className="text-gray-600" />
                <span className="text-gray-600">등록일</span>
              </div>
              <span className="font-medium text-gray-800">
                {formatDate(customer.registeredAt)}
              </span>
            </div>

            <div className="flex items-center justify-between py-3">
              <div className="flex items-center gap-3">
                <Bookmark size={18} className="text-gray-600" />
                <span className="text-gray-600">총 방문</span>
              </div>
              <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                {customer.visitHistory.length}회
              </span>
            </div>
          </div>
        </Card>

        {/* 개인 메모 카드 */}
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">개인 메모</h3>
            {!isEditingMemo && (
              <Button
                variant="icon"
                size="sm"
                onClick={() => setIsEditingMemo(true)}
              >
                <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
              </Button>
            )}
          </div>

          {isEditingMemo ? (
            <div className="space-y-3">
              <textarea
                ref={memoTextareaRef}
                value={memoText}
                onChange={(e) => setMemoText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="고객의 특이사항, 알레르기, 선호스타일 등을 기록하세요..."
                className="h-32 w-full resize-none rounded-lg border border-gray-200 p-3 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
                maxLength={500}
              />
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-500">
                  {memoText.length}/500자 (Ctrl+Enter: 저장, ESC: 취소)
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCancelMemo}
                  >
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
                <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {customer.personalMemo}
                </p>
              ) : (
                <p className="text-sm italic text-gray-500">
                  개인 메모가 없습니다. 편집 버튼을 클릭하여 추가해보세요.
                </p>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* 하단 정보 수정 버튼 */}
      <div className="border-t border-gray-200 p-6">
        <Button variant="primary" className="w-full" onClick={onEdit}>
          <Pencil size={20} className="text-gray-600 hover:text-blue-600" />
          정보 수정
        </Button>
      </div>
    </div>
  );
}
