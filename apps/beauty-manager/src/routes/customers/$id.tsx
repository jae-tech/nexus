import { createFileRoute } from '@tanstack/react-router';
import CustomerDetailPage from '@/features/customers/pages/CustomerDetailPage';

export const Route = createFileRoute('/customers/$id')({
  component: CustomerDetailPage,
});
