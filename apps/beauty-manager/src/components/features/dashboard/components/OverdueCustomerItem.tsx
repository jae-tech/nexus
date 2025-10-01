import { User } from "lucide-react";

interface OverdueCustomerItemProps {
  name: string;
  phone: string;
  days: string;
  isOverdue: boolean;
  onClick?: () => void;
}

export function OverdueCustomerItem({
  name,
  phone,
  days,
  isOverdue,
  onClick,
}: OverdueCustomerItemProps) {
  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg hover:${
        isOverdue ? "bg-red-100" : "bg-gray-100"
      } transition-colors cursor-pointer ${
        isOverdue ? "bg-red-50" : "bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mr-3">
          <User size={20} className="text-red-600" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-600">{phone}</p>
        </div>
      </div>
      <span
        className={`text-sm font-medium ${
          isOverdue ? "text-red-600" : "text-green-600"
        }`}
      >
        {days}
      </span>
    </div>
  );
}
