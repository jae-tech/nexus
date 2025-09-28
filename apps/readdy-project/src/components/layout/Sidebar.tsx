import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"

interface SidebarProps {
  className?: string
}

const navigation = [
  { name: "Dashboard", href: ROUTES.DASHBOARD, icon: "📊" },
  { name: "Customers", href: ROUTES.CUSTOMERS, icon: "👥" },
  { name: "Reservations", href: ROUTES.RESERVATIONS, icon: "📅" },
  { name: "Services", href: ROUTES.SERVICES, icon: "✂️" },
  { name: "Staff", href: ROUTES.STAFF, icon: "👨‍💼" },
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  return (
    <div className={cn("bg-background border-r", className)}>
      <nav className="space-y-2 p-4">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              )}
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}