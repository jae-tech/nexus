import { createFileRoute } from '@tanstack/react-router'
import { CustomerDetail } from '@/components/features/customers/detail/page'

export const Route = createFileRoute('/customers/$id')({
  component: CustomerDetail,
})