import { StatsCard } from "./StatsCard";
import { User, Calendar, Users, Scissors } from "lucide-react";

interface StatData {
  title: string;
  value: string | number;
  subtitle?: string;
  type: "customers" | "reservations" | "staff" | "services";
}

interface StatsGridProps {
  stats: {
    totalCustomers: number;
    todayReservations: number;
    activeStaff: number;
    activeServices: number;
  };
}

export function StatsGrid({ stats }: StatsGridProps) {
  const statsData: StatData[] = [
    {
      title: "총 고객",
      value: `${stats.totalCustomers}명`,
      subtitle: "클릭하여 관리",
      type: "customers",
    },
    {
      title: "오늘 예약",
      value: `${stats.todayReservations}건`,
      subtitle: "예약 3 • 완료 0 • 취소 0",
      type: "reservations",
    },
    {
      title: "활성 직원",
      value: `${stats.activeStaff}명`,
      subtitle: "재직 중인 직원",
      type: "staff",
    },
    {
      title: "활성 서비스",
      value: `${stats.activeServices}개`,
      subtitle: "운영 중인 서비스",
      type: "services",
    },
  ];

  const getIconConfig = (type: StatData["type"]) => {
    switch (type) {
      case "customers":
        return {
          icon: User,
          iconColor: "text-blue-600",
          iconBgColor: "bg-blue-100",
        };
      case "reservations":
        return {
          icon: Calendar,
          iconColor: "text-green-600",
          iconBgColor: "bg-green-100",
        };
      case "staff":
        return {
          icon: Users,
          iconColor: "text-purple-600",
          iconBgColor: "bg-purple-100",
        };
      case "services":
        return {
          icon: Scissors,
          iconColor: "text-orange-600",
          iconBgColor: "bg-orange-100",
        };
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
      {statsData.map((stat) => {
        const config = getIconConfig(stat.type);
        return (
          <StatsCard
            key={stat.type}
            title={stat.title}
            value={stat.value}
            subtitle={stat.subtitle}
            icon={config.icon}
            iconColor={config.iconColor}
            iconBgColor={config.iconBgColor}
          />
        );
      })}
    </div>
  );
}
