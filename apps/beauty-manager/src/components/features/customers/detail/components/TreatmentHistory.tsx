
import { useState } from 'react';
import { Search, Plus, Edit, Trash2, Scissors, User } from 'lucide-react';
import { toast } from 'sonner';
import { Card, Button } from '@nexus/ui';
import { VisitRecord } from '@/mocks/customerDetail';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@nexus/ui";

interface TreatmentHistoryProps {
  visitHistory: VisitRecord[];
  onAddTreatment: () => void;
}

export default function TreatmentHistory({ visitHistory, onAddTreatment }: TreatmentHistoryProps) {
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
        day: '2-digit'
      }),
      weekday: weekday,
      dayMonth: `${date.getMonth() + 1}월 ${date.getDate()}일`
    };
  };

  const formatAmount = (amount?: number) => {
    if (!amount) return '';
    return amount.toLocaleString('ko-KR') + '원';
  };

  const handleEditTreatment = (visitId: string) => {
    console.log('시술 수정:', visitId);
    toast.info('시술 수정 기능을 준비 중입니다.');
  };

  const handleDeleteTreatment = (visitId: string) => {
    if (confirm('정말 이 시술 기록을 삭제하시겠습니까?')) {
      console.log('시술 삭제:', visitId);
      toast.success('시술 기록이 삭제되었습니다.');
    }
  };

  const filteredHistory = visitHistory.filter(visit => {
    if (searchQuery) {
      const searchLower = searchQuery.toLowerCase();
      return visit.services.some(service => 
        service.toLowerCase().includes(searchLower)
      ) || visit.employee.name.toLowerCase().includes(searchLower);
    }
    return true;
  });

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800">시술 이력</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="서비스명 또는 담당직원으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-80 pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus-ring focus:border-transparent"
              />
            </div>
            <Button variant="primary" onClick={onAddTreatment}>
              <Plus size={20} />
              새 시술/예약 추가
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">기간:</span>
              <Select
                value={filter}
                onValueChange={(value) => setFilter(value)}
              >
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="기간 선택" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">전체</SelectItem>
                  <SelectItem value="6months">최근 6개월</SelectItem>
                  <SelectItem value="1year">최근 1년</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="text-sm text-gray-600">
            총 <span className="font-semibold text-blue-600">{filteredHistory.length}</span>건
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="flex-1 p-8 overflow-y-auto">
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-10 top-0 bottom-0 w-0.5 bg-gray-200"></div>

          {filteredHistory.length > 0 ? (
            <div className="space-y-8">
              {filteredHistory.map((visit, index) => {
                const { date, weekday, dayMonth } = formatDate(visit.date);
                
                return (
                  <div key={visit.id} className="relative flex gap-6">
                    {/* Timeline Dot */}
                    <div className="relative z-10 flex flex-col items-center w-20 flex-shrink-0">
                      <div className="w-4 h-4 bg-blue-500 rounded-full border-4 border-white shadow-sm"></div>
                      <div className="text-center mt-3">
                        <div className="text-sm font-semibold text-gray-800">
                          {dayMonth}
                        </div>
                        <div className="text-xs text-gray-500">({weekday}요일)</div>
                      </div>
                    </div>

                    {/* Treatment Card */}
                    <div className="flex-1">
                      <Card hover className="relative">
                        {/* Amount and Actions */}
                        <div className="absolute top-4 right-4 flex items-center gap-3">
                          {visit.amount && (
                            <span className="text-lg font-semibold text-green-600">
                              {formatAmount(visit.amount)}
                            </span>
                          )}
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEditTreatment(visit.id)} className="h-8 w-8 p-0 text-gray-600 hover:text-blue-600">
                              <Edit size={16} />
                            </Button>
                            <Button variant="ghost" size="sm" onClick={() => handleDeleteTreatment(visit.id)} className="h-8 w-8 p-0 text-gray-600 hover:text-red-600">
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>

                        {/* Services */}
                        <div className="mb-4 pr-40">
                          <h3 className="text-lg font-semibold text-gray-800 mb-3">
                            {visit.services.join(' + ')}
                          </h3>
                          
                          {/* Employee */}
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                              {visit.employee.avatar ? (
                                <img 
                                  src={visit.employee.avatar} 
                                  alt={visit.employee.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <User size={16} className="text-gray-500" />
                                </div>
                              )}
                            </div>
                            <span className="text-sm text-gray-600">
                              담당: <span className="font-medium text-gray-800">{visit.employee.name}</span>
                            </span>
                          </div>

                          {/* Memo */}
                          {visit.memo && (
                            <div className="bg-gray-50 rounded-lg p-3">
                              <p className="text-sm text-gray-700 leading-relaxed">
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
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Scissors size={24} className="text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-600 mb-2">
                {searchQuery ? '검색 결과가 없습니다' : '첫 번째 시술을 기록해보세요'}
              </h3>
              <p className="text-gray-500 mb-6">
                {searchQuery ? '다른 검색어로 시도해보세요' : '고객님의 시술 이력을 관리하여 더 나은 서비스를 제공하세요'}
              </p>
              <Button variant="primary" onClick={onAddTreatment}>
                <Plus size={20} />
                첫 시술 기록하기
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
