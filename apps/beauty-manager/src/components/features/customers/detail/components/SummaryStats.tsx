
import { CalendarCheck, DollarSign, BarChart, Clock, Heart } from 'lucide-react';
import { Card } from '@nexus/ui';
import { Customer } from '@/mocks/customerDetail';

interface SummaryStatsProps {
  customer: Customer;
}

export default function SummaryStats({ customer }: SummaryStatsProps) {
  // 통계 계산
  const totalVisits = customer.visitHistory.length;
  const totalAmount = customer.visitHistory.reduce((sum, visit) => sum + (visit.amount || 0), 0);
  const averageAmount = totalVisits > 0 ? Math.round(totalAmount / totalVisits) : 0;
  
  // 최근 방문일 계산
  const lastVisit = customer.visitHistory.length > 0 
    ? new Date(customer.visitHistory[0].date)
    : null;
  
  const daysSinceLastVisit = lastVisit 
    ? Math.floor((new Date().getTime() - lastVisit.getTime()) / (1000 * 60 * 60 * 24))
    : 0;

  // 가장 많이 받은 서비스 계산
  const serviceCount: { [key: string]: number } = {};
  customer.visitHistory.forEach(visit => {
    visit.services.forEach(service => {
      serviceCount[service] = (serviceCount[service] || 0) + 1;
    });
  });
  
  const favoriteService = Object.keys(serviceCount).length > 0
    ? Object.keys(serviceCount).reduce((a, b) => serviceCount[a] > serviceCount[b] ? a : b)
    : '없음';

  const stats = [
    {
      icon: CalendarCheck,
      label: '총 방문 횟수',
      value: `${totalVisits}회`,
      color: 'blue'
    },
    {
      icon: DollarSign,
      label: '총 결제 금액',
      value: `${totalAmount.toLocaleString()}원`,
      color: 'green'
    },
    {
      icon: BarChart,
      label: '평균 결제 금액',
      value: `${averageAmount.toLocaleString()}원`,
      color: 'purple'
    },
    {
      icon: Clock,
      label: '마지막 방문',
      value: daysSinceLastVisit === 0 ? '오늘' : `${daysSinceLastVisit}일 전`,
      color: 'orange'
    },
    {
      icon: Heart,
      label: '선호 서비스',
      value: favoriteService,
      color: 'pink'
    }
  ];

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600',
      pink: 'bg-pink-100 text-pink-600'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-100 text-gray-600';
  };

  return (
    <div className="p-8">
      <h3 className="text-lg font-semibold text-gray-800 mb-6">고객 통계</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {stats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <Card key={index} hover className="text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 ${getColorClasses(stat.color)}`}>
                <IconComponent size={20} />
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600">
                {stat.label}
              </div>
            </Card>
          );
        })}
      </div>

      {/* 추가 인사이트 */}
      {totalVisits > 0 && (
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h4 className="font-semibold text-gray-800 mb-3">방문 패턴</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">첫 방문:</span>
                <span className="font-medium">
                  {new Date(customer.registeredAt).toLocaleDateString('ko-KR')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">방문 주기:</span>
                <span className="font-medium">
                  {totalVisits > 1 ? `약 ${Math.round(daysSinceLastVisit / totalVisits)}일` : '신규 고객'}
                </span>
              </div>
            </div>
          </Card>

          <Card>
            <h4 className="font-semibold text-gray-800 mb-3">서비스 이용 현황</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">이용 서비스 수:</span>
                <span className="font-medium">{Object.keys(serviceCount).length}개</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">선호 서비스:</span>
                <span className="font-medium">{favoriteService}</span>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
