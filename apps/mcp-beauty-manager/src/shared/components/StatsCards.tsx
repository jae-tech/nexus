interface StatCard {
  icon: string;
  iconColor: string;
  title: string;
  value: string | number;
  bgColor: string;
}

interface StatsCardsProps {
  stats: StatCard[];
  className?: string;
}

export default function StatsCards({ stats, className = '' }: StatsCardsProps) {
  return (
    <div
      className={`grid grid-cols-1 gap-6 bg-gray-50 px-8 py-6 md:grid-cols-2 lg:grid-cols-4 ${className}`}
    >
      {stats.map((stat, index) => (
        <div
          key={index}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center">
            <div className={`rounded-lg p-3 ${stat.bgColor}`}>
              <i className={`${stat.icon} text-2xl ${stat.iconColor}`} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">{stat.title}</p>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
