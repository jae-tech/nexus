import { createFileRoute } from '@tanstack/react-router';
import StaffPageDB from '@/features/staff/pages/StaffPage-DB';

export const Route = createFileRoute('/staff/')({
  component: StaffPageDB,
});
