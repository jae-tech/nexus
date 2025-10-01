import { User } from "lucide-react";

interface CustomerListItemProps {
  id: string;
  name: string;
  phone: string;
  registeredDate: string;
  onClick?: () => void;
}

export function CustomerListItem({
  name,
  phone,
  registeredDate,
  onClick,
}: CustomerListItemProps) {
  const daysAgo = Math.floor(
    (new Date().getTime() - new Date(registeredDate).getTime()) /
      (1000 * 60 * 60 * 24)
  );

  return (
    <div
      className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
        <User size={20} className="text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-gray-900 truncate">{name}</p>
        <p className="text-sm text-gray-600 truncate">{phone}</p>
      </div>
      <span className="text-xs text-gray-500">{daysAgo}일 전</span>
    </div>
  );
}
