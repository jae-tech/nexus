import { createFileRoute } from '@tanstack/react-router'
import { Services } from '@/components/features/services/page'

export const Route = createFileRoute('/services/')({
  component: Services,
})