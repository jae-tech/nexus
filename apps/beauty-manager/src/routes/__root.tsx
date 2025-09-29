import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import { ThemeProvider } from '@nexus/ui'
import { ErrorBoundary } from '@/components/common/ErrorBoundary'
import { Sidebar } from '@/components/layout/Sidebar'
import { useUIStore } from '@/stores/ui-store'

function RootLayout() {
  const { isSidebarOpen } = useUIStore()

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" storageKey="beauty-manager-theme">
        <div className="min-h-screen bg-gray-50 flex">
          <Sidebar />
          <main className={`flex-1 transition-all duration-300 ${
            isSidebarOpen ? 'ml-60' : 'ml-16'
          }`}>
            <Outlet />
          </main>
        </div>
        <TanStackRouterDevtools />
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})