import { createFileRoute } from '@tanstack/react-router';
import ServicesPageDB from '@/features/services/pages/ServicesPage-DB';

export const Route = createFileRoute('/services/')({
  component: ServicesPageDB,
});
