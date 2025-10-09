import React from 'react';

interface ServiceStatsProps {
  totalServices?: number;
  activeServices?: number;
  totalRevenue?: number;
  averageRating?: number;
}

/**
 * ServiceStats component displays a set of statistical cards.
 *
 * @param totalServices   Number of all services (default: 0)
 * @param activeServices  Number of currently active services (default: 0)
 * @param totalRevenue    Total revenue amount (default: 0)
 * @param averageRating   Average rating value (default: 0)
 */
export default function ServiceStats({
  totalServices = 0,
  activeServices = 0,
  totalRevenue = 0,
  averageRating = 0,
}: ServiceStatsProps) {
  /**
   * Formats a numeric price into a more readable Korean string.
   * Handles large numbers (K, M) and ensures graceful fallback for invalid inputs.
   */
  const formatPrice = (price: number): string => {
    if (!Number.isFinite(price) || price < 0) {
      return '0';
    }

    if (price >= 1_000_000) {
      return `${(price / 1_000_000).toFixed(1)}M`;
    }
    if (price >= 1_000) {
      return `${(price / 1_000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('ko-KR').format(price);
  };

  const stats = [
    {
      title: '전체 서비스',
      value: totalServices.toString(),
      icon: 'ri-service-line',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      title: '활성 서비스',
      value: activeServices.toString(),
      icon: 'ri-check-line',
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      title: '총 매출',
      value: `${formatPrice(totalRevenue)}원`,
      icon: 'ri-money-dollar-circle-line',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
    {
      title: '평균 만족도',
      value: Number.isFinite(averageRating) ? averageRating.toFixed(1) : '0.0',
      icon: 'ri-star-line',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-1 text-sm text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div
                className={`h-12 w-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}
              >
                <i className={`${stat.icon} text-xl ${stat.color}`} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
