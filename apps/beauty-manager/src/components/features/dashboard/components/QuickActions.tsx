import { CalendarPlus, UserPlus, Clock, Scissors } from "lucide-react";
import { DashboardSection } from "./DashboardSection";
import { QuickActionCard } from "./QuickActionCard";

export function QuickActions() {
  const quickActions = [
    {
      title: "새 예약 추가",
      description: "고객 예약을 빠르게 등록",
      icon: CalendarPlus,
      color: "bg-gradient-to-r from-blue-500 to-blue-600",
      hoverColor: "hover:from-blue-600 hover:to-blue-700",
      path: "/reservations",
    },
    {
      title: "신규 고객 등록",
      description: "새로운 고객 정보 등록",
      icon: UserPlus,
      color: "bg-gradient-to-r from-green-500 to-green-600",
      hoverColor: "hover:from-green-600 hover:to-green-700",
      path: "/customers",
    },
    {
      title: "직원 스케줄 확인",
      description: "직원 근무 일정 관리",
      icon: Clock,
      color: "bg-gradient-to-r from-purple-500 to-purple-600",
      hoverColor: "hover:from-purple-600 hover:to-purple-700",
      path: "/staff",
    },
    {
      title: "서비스 관리",
      description: "서비스 메뉴 관리",
      icon: Scissors,
      color: "bg-gradient-to-r from-orange-500 to-orange-600",
      hoverColor: "hover:from-orange-600 hover:to-orange-700",
      path: "/services",
    },
  ];

  return (
    <DashboardSection>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">빠른 작업</h3>
      <div className="space-y-3">
        {quickActions.map((action, index) => (
          <QuickActionCard key={index} {...action} />
        ))}
      </div>
    </DashboardSection>
  );
}
