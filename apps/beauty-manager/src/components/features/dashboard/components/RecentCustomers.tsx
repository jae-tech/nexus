import { DashboardSection } from "./DashboardSection";
import { SectionHeader } from "./SectionHeader";
import { CustomerListItem } from "./CustomerListItem";

interface Customer {
  id: string;
  name: string;
  phone: string;
  registeredDate: string;
}

interface RecentCustomersProps {
  customers: Customer[];
}

export function RecentCustomers({ customers }: RecentCustomersProps) {
  return (
    <DashboardSection>
      <SectionHeader
        title="최근 등록 고객"
        showViewAll
        viewAllPath="/customers"
      />
      <div className="space-y-3">
        {customers.map((customer) => (
          <CustomerListItem key={customer.id} {...customer} />
        ))}
      </div>
    </DashboardSection>
  );
}
