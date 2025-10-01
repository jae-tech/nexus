import { Badge } from "@nexus/ui";
import { User, ChevronRight } from "lucide-react";

interface ReservationItemProps {
  id: string;
  customerName: string;
  startTime: string;
  employeeName: string;
  service: string;
  status: "scheduled" | "completed" | "cancelled";
  onClick?: () => void;
}

export function ReservationItem({
  customerName,
  startTime,
  employeeName,
  service,
  status,
  onClick,
}: ReservationItemProps) {
  const getStatusVariant = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default" as const;
      case "completed":
        return "success" as const;
      case "cancelled":
        return "destructive" as const;
      default:
        return "secondary" as const;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "예약됨";
      case "completed":
        return "완료";
      case "cancelled":
        return "취소";
      default:
        return status;
    }
  };

  return (
    <div
      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-center flex-1">
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
          <User size={20} className="text-blue-600" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-medium text-gray-900 truncate">{customerName}</p>
            <span className="text-sm font-medium text-blue-600">
              {startTime}
            </span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <span>{employeeName}</span>
            <span>•</span>
            <span className="truncate">{service}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <Badge variant={getStatusVariant(status)}>
          {getStatusText(status)}
        </Badge>
        <ChevronRight size={20} className="text-gray-400" />
      </div>
    </div>
  );
}
