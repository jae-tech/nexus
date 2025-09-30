
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
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 px-8 py-6 bg-gray-50 ${className}`}>
      {stats.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <i className={`${stat.icon} text-2xl ${stat.iconColor}`}></i>
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
