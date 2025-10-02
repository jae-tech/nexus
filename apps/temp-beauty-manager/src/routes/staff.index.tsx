import { createFileRoute } from '@tanstack/react-router';
import StaffPage from '@/features/staff/pages/StaffPage';

export const Route = createFileRoute('/staff/')({
  component: StaffPage,
});
