import * as React from "react"
import { cn } from "@/lib/utils"

export interface SidebarItem {
  id: string
  label: string
  icon?: React.ReactNode
  href?: string
  onClick?: () => void
  active?: boolean
  children?: SidebarItem[]
}

export interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  items: SidebarItem[]
  collapsed?: boolean
  onItemClick?: (item: SidebarItem) => void
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, items, collapsed = false, onItemClick, ...props }, ref) => {
    return (
      <aside
        ref={ref}
        className={cn(
          "flex flex-col h-full bg-white border-r border-gray-200 transition-all duration-300",
          collapsed ? "w-16" : "w-64",
          className
        )}
        {...props}
      >
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {items.map((item) => (
            <SidebarItem
              key={item.id}
              item={item}
              collapsed={collapsed}
              onClick={() => onItemClick?.(item)}
            />
          ))}
        </nav>
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

interface SidebarItemComponentProps {
  item: SidebarItem
  collapsed: boolean
  onClick?: () => void
}

function SidebarItem({ item, collapsed, onClick }: SidebarItemComponentProps) {
  const handleClick = () => {
    if (item.onClick) {
      item.onClick()
    }
    onClick?.()
  }

  return (
    <button
      onClick={handleClick}
      className={cn(
        "flex items-center w-full px-3 py-2 text-sm font-medium rounded-lg transition-colors",
        "hover:bg-gray-100",
        item.active
          ? "bg-primary-50 text-primary-700"
          : "text-gray-700",
        collapsed && "justify-center"
      )}
    >
      {item.icon && (
        <span className={cn("flex-shrink-0", !collapsed && "mr-3")}>
          {item.icon}
        </span>
      )}
      {!collapsed && <span className="flex-1 text-left">{item.label}</span>}
    </button>
  )
}

export { Sidebar }