import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "@nexus/ui"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { Header } from "@/components/layout/Header"
import { Sidebar } from "@/components/layout/Sidebar"
import { Footer } from "@/components/layout/Footer"
import { Dashboard } from "@/components/pages/Dashboard"
import { Settings } from "@/components/pages/Settings"
import { ROUTES } from "@/lib/constants"

function HomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Nexus React App
        </h1>
        <p className="text-xl text-muted-foreground">
          A modern React application built with the Nexus Design System
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">🚀 Features</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• React 19 with TypeScript</li>
            <li>• Vite for fast development</li>
            <li>• TailwindCSS v4 styling</li>
            <li>• Nexus UI components</li>
            <li>• React Router v6</li>
            <li>• Dark/Light theme support</li>
          </ul>
        </div>
        <div className="rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-2">📁 Structure</h2>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Components organized by type</li>
            <li>• Custom hooks for reusability</li>
            <li>• TypeScript for type safety</li>
            <li>• Absolute imports with @/ prefix</li>
            <li>• Error boundaries for stability</li>
            <li>• Responsive design patterns</li>
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
              <Route path={ROUTES.SETTINGS} element={<Settings />} />
            </Routes>
          </AppLayout>
        </Router>
      </ThemeProvider>
    </ErrorBoundary>
  )
}

export default App