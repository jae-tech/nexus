import { Link } from "@tanstack/react-router";
import { LucideIcon, ChevronRight } from "lucide-react";

interface QuickActionCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
  hoverColor: string;
  path: string;
}

export function QuickActionCard({
  title,
  description,
  icon: Icon,
  color,
  hoverColor,
  path,
}: QuickActionCardProps) {
  return (
    <Link to={path}>
      <button
        className={`w-full flex items-center p-4 rounded-xl ${color} ${hoverColor} text-white transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl`}
      >
        <div className="p-2 bg-white bg-opacity-20 rounded-lg mr-4">
          <Icon size={24} className="text-white" />
        </div>
        <div className="text-left">
          <p className="font-medium text-white">{title}</p>
          <p className="text-sm text-white text-opacity-90">{description}</p>
        </div>
        <ChevronRight size={20} className="ml-auto text-white text-opacity-70" />
      </button>
    </Link>
  );
}
