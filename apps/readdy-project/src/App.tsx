import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@nexus/ui"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { Dashboard } from "@/components/pages/Dashboard"
import { Customers } from "@/components/pages/Customers"
import { Reservations } from "@/components/pages/Reservations"
import { Services } from "@/components/pages/Services"
import { Staff } from "@/components/pages/Staff"
import { ROUTES, APP_NAME } from "@/lib/constants"

function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to {APP_NAME}
        </h1>
        <p className="text-xl text-muted-foreground">
          Professional beauty salon management system
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">🚀 Features</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Customer management</li>
            <li>• Appointment scheduling</li>
            <li>• Service catalog</li>
            <li>• Staff management</li>
            <li>• Multi-language support</li>
            <li>• Dark/Light theme support</li>
          </ul>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">📁 Modules</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Dashboard & Analytics</li>
            <li>• Customer Database</li>
            <li>• Reservation System</li>
            <li>• Service Management</li>
            <li>• Staff Scheduling</li>
            <li>• Reporting Tools</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto flex">
        <aside className="hidden w-64 shrink-0 md:block">
          <Sidebar className="sticky top-14 h-[calc(100vh-3.5rem)]" />
        </aside>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  )
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <Router>
          <AppLayout>
            <Routes>
              <Route path={ROUTES.HOME} element={<HomePage />} />
              <Route path={ROUTES.DASHBOARD} element={<Dashboard />} />
              <Route path={ROUTES.CUSTOMERS} element={<Customers />} />
              <Route path={ROUTES.CUSTOMER_DETAIL} element={<Customers />} />
              <Route path={ROUTES.RESERVATIONS} element={<Reservations />} />
              <Route path={ROUTES.SERVICES} element={<Services />} />
              <Route path={ROUTES.STAFF} element={<Staff />} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App