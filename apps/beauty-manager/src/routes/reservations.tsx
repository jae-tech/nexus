import { createFileRoute } from '@tanstack/react-router'
import { Reservations } from '@/components/features/reservations/page'

export const Route = createFileRoute('/reservations')({
  component: Reservations,
})