import { Link } from "@tanstack/react-router";
import { Button } from "@nexus/ui";

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  showViewAll?: boolean;
  viewAllPath?: string;
  viewAllLabel?: string;
  rightElement?: React.ReactNode;
}

export function SectionHeader({
  title,
  subtitle,
  showViewAll = false,
  viewAllPath = "",
  viewAllLabel = "전체 보기",
  rightElement,
}: SectionHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {showViewAll && viewAllPath ? (
        <Link to={viewAllPath}>
          <Button variant="outline" size="sm">
            {viewAllLabel}
          </Button>
        </Link>
      ) : (
        rightElement
      )}
    </div>
  );
}
