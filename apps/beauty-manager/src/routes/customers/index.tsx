import { createFileRoute } from '@tanstack/react-router'
import { Customers } from '@/components/features/customers/page'

export const Route = createFileRoute('/customers/')({
  component: Customers,
})