import { createFileRoute } from '@tanstack/react-router';
import ReservationsPageDB from '@/features/reservations/pages/ReservationsPage-DB';

export const Route = createFileRoute('/reservations/')({
  component: ReservationsPageDB,
});
