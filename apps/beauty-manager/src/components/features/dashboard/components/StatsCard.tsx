import { Card } from "@nexus/ui";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor: string;
  iconBgColor: string;
  onClick?: () => void;
}

export function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  iconBgColor,
  onClick,
}: StatsCardProps) {
  return (
    <Card hover className={onClick ? "cursor-pointer" : ""} onClick={onClick}>
      <div className="flex items-center">
        <div className={`p-3 ${iconBgColor} rounded-lg`}>
          <Icon size={24} className={iconColor} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
      </div>
    </Card>
  );
}
