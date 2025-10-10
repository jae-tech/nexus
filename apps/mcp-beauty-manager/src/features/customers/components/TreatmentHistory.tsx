import { useState } from 'react';
import { Pencil, Plus, Scissors, Search, Trash2, User } from 'lucide-react';
import Card from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { VisitRecord } from '@/features/customers/api/types';
import { useToast } from '@/hooks/useToast';

interface TreatmentHistoryProps {
  visitHistory: VisitRecord[];
  onAddTreatment: () => void;
}

export default function TreatmentHistory({
  visitHistory,
  onAddTreatment,
}: TreatmentHistoryProps) {
  const { success: successToast, info: infoToast } = useToast();
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];

    return {
      date: date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }),
      weekday: weekday,
      dayMonth: `${date.getMonth() + 1}월 ${date.getDate()}일`,
    };
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return amount.toLocaleString('ko-KR') + '원';
  };

  const handleEditTreatment = (visitId: string) => {
    console.log('시술 수정:', visitId);
    infoToast('시술 수정 기능을 준비 중입니다.');
  };

  const handleDeleteTreatment = (visitId: string) => {
    if (confirm('정말 이 시술 기록을 삭제하시겠습니까?')) {
      console.log('시술 삭제:', visitId);
      successToast('시술 기록이 삭제되었습니다.');
    }
  };

  const filteredHistory = visitHistory.filter((visit) => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return (
        visit.services.some((service) =>
          service.toLowerCase().includes(searchLower)
        ) || visit.employee.name.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-8 py-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-800">시술 이력</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 transform" />
              <input
                type="text"
                placeholder="서비스명 또는 담당직원으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 rounded-lg border border-gray-200 py-2 pl-10 pr-4 text-sm focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <Button variant="primary" onClick={onAddTreatment}>
              <Plus size={20} className="text-white" />새 시술/예약 추가
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">기간:</span>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="rounded-lg border border-gray-200 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="6months">최근 6개월</option>
                <option value="1year">최근 1년</option>
              </select>
            </div>
          </div>

          <div className="text-sm text-gray-600">
            총{' '}
            <span className="font-semibold text-blue-600">
              {filteredHistory.length}
            </span>
            건
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute bottom-0 left-10 top-0 w-0.5 bg-gray-200" />

          {filteredHistory.length > 0 ? (
            <div className="space-y-8">
              {filteredHistory.map((visit, index) => {
                const { date, weekday, dayMonth } = formatDate(visit.date);

                return (
                  <div key={visit.id} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex w-20 flex-shrink-0 flex-col items-center">
                      <div className="h-4 w-4 rounded-full border-4 border-white bg-blue-500 shadow-sm" />
                      <div className="mt-3 text-center">
                        <div className="text-sm font-semibold text-gray-800">
                          {dayMonth}
                        </div>
                        <div className="text-xs text-gray-500">
                          ({weekday}요일)
                        </div>
                      </div>
                    </div>

                    {/* Treatment Card */}
                    <div className="flex-1">
                      <Card hover className="relative">
                        {/* Amount and Actions */}
                        <div className="absolute right-4 top-4 flex items-center gap-3">
                          {visit.amount && (
                            <span className="text-lg font-semibold text-green-600">
                              {formatAmount(visit.amount)}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleEditTreatment(visit.id)}
                            >
                              <Pencil
                                size={20}
                                className="text-gray-600 hover:text-blue-600"
                              />
                            </Button>
                            <Button
                              variant="icon"
                              size="sm"
                              onClick={() => handleDeleteTreatment(visit.id)}
                            >
                              <Trash2
                                size={20}
                                className="text-gray-600 hover:text-red-600"
                              />
                            </Button>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="mb-4 pr-40">
                          <h3 className="mb-3 text-lg font-semibold text-gray-800">
                            {visit.services.join(' + ')}
                          </h3>

                          {/* Employee */}
                          <div className="mb-3 flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden rounded-full bg-gray-100">
                              {visit.employee.avatar ? (
                                <img
                                  src={visit.employee.avatar}
                                  alt={visit.employee.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="flex h-full w-full items-center justify-center">
                                  <User size={18} className="text-gray-600" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              담당:{' '}
                              <span className="font-medium text-gray-800">
                                {visit.employee.name}
                              </span>
                            </span>
                          </div>

                          {/* Memo */}
                          {visit.memo && (
                            <div className="rounded-lg bg-gray-50 p-3">
                              <p className="text-sm leading-relaxed text-gray-700">
                                {visit.memo}
                              </p>
                            </div>
                          )}
                        </div>
                      </Card>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Empty State */
            <div className="py-16 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
                <Scissors size={18} className="text-gray-600" />
              </div>
              <h3 className="mb-2 text-lg font-medium text-gray-600">
                {searchQuery
                  ? '검색 결과가 없습니다'
                  : '첫 번째 시술을 기록해보세요'}
              </h3>
              <p className="mb-6 text-gray-500">
                {searchQuery
                  ? '다른 검색어로 시도해보세요'
                  : '고객님의 시술 이력을 관리하여 더 나은 서비스를 제공하세요'}
              </p>
              <Button variant="primary" onClick={onAddTreatment}>
                <Plus size={20} className="text-white" />첫 시술 기록하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
