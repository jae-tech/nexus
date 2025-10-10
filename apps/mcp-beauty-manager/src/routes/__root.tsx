import { createRootRoute, Outlet } from '@tanstack/react-router';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { MainLayout } from '@/components/layouts/MainLayout';

export const Route = createRootRoute({
  component: () => (
    <ThemeProvider defaultTheme="light" storageKey="beauty-manager-theme">
      <MainLayout>
        <Outlet />
      </MainLayout>
    </ThemeProvider>
  ),
});
