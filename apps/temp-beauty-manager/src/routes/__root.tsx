import { createRootRoute, Outlet } from '@tanstack/react-router';
import Sidebar from '@/shared/components/Sidebar';

export const Route = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-gray-50">
      <Sidebar />
      <div className="transition-all duration-300 md:ml-48 lg:ml-60">
        <Outlet />
      </div>
    </div>
  ),
});
