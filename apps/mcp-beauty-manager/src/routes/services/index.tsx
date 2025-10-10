import { createFileRoute } from '@tanstack/react-router';
import ServicesPage from '@/features/services/pages/ServicesPage';

export const Route = createFileRoute('/services/')({
  component: ServicesPage,
});
