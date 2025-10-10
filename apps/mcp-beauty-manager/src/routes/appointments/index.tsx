import { createFileRoute } from '@tanstack/react-router';
import AppointmentsPage from '@/features/appointments/pages/AppointmentsPage';

export const Route = createFileRoute('/appointments/')({
  component: AppointmentsPage,
});
