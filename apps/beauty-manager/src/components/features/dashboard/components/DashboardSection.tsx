import { Card } from "@nexus/ui";

interface DashboardSectionProps {
  children: React.ReactNode;
  className?: string;
}

export function DashboardSection({
  children,
  className = "",
}: DashboardSectionProps) {
  return (
    <Card className={`${className}`}>
      <div className="p-6 h-full flex flex-col">{children}</div>
    </Card>
  );
}
