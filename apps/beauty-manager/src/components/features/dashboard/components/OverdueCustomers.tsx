import { DashboardSection } from "./DashboardSection";
import { OverdueCustomerItem } from "./OverdueCustomerItem";

interface OverdueCustomer {
  name: string;
  phone: string;
  days: string;
  isOverdue: boolean;
}

interface OverdueCustomersProps {
  customers: OverdueCustomer[];
  threshold?: string;
}

export function OverdueCustomers({
  customers,
  threshold = "30일 이상",
}: OverdueCustomersProps) {
  return (
    <DashboardSection>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">
          미방문 고객 알림
        </h3>
        <span className="text-sm text-red-500">{threshold}</span>
      </div>
      <div className="space-y-3">
        {customers.map((customer, index) => (
          <OverdueCustomerItem key={index} {...customer} />
        ))}
      </div>
    </DashboardSection>
  );
}
