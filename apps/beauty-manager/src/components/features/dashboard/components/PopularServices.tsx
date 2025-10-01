import { DashboardSection } from "./DashboardSection";
import { ServiceRankItem } from "./ServiceRankItem";

interface Service {
  rank: number;
  name: string;
  price: string;
  count: string;
}

interface PopularServicesProps {
  services: Service[];
  period?: string;
}

export function PopularServices({
  services,
  period = "이번 주",
}: PopularServicesProps) {
  return (
    <DashboardSection>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          인기 서비스 TOP 5
        </h3>
        <span className="text-sm text-gray-500">{period}</span>
      </div>
      <div className="space-y-3">
        {services.map((service) => (
          <ServiceRankItem key={service.rank} {...service} />
        ))}
      </div>
    </DashboardSection>
  );
}
