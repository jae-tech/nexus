import { createFileRoute } from '@tanstack/react-router';
import ReservationsPage from '@/features/reservations/pages/ReservationsPage';

export const Route = createFileRoute('/reservations/')({
  component: ReservationsPage,
});
