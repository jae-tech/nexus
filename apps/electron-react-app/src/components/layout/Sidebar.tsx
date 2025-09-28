import { Button } from "@nexus/ui"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"
import { ROUTES } from "@/lib/constants"
import type { NavItem } from "@/types"

interface SidebarProps {
  className?: string
}

const navigation: NavItem[] = [
  {
    title: "Dashboard",
    href: ROUTES.DASHBOARD,
  },
  {
    title: "Settings",
    href: ROUTES.SETTINGS,
  },
]

export function Sidebar({ className }: SidebarProps) {
  const location = useLocation()

  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Navigation
          </h2>
          <div className="space-y-1">
            {navigation.map((item) => (
              <Button
                key={item.href}
                variant={location.pathname === item.href ? "secondary" : "ghost"}
                className="w-full justify-start"
                asChild
              >
                <Link to={item.href}>
                  {item.title}
                </Link>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}