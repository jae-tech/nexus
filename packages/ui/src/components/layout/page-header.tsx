import * as React from "react"
import { cn } from "@/lib/utils"

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  actions?: React.ReactNode
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, actions, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between pb-6 border-b border-gray-200",
          className
        )}
        {...props}
      >
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {title}
          </h1>
          {description && (
            <p className="text-sm text-gray-500">{description}</p>
          )}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
    )
  }
)
PageHeader.displayName = "PageHeader"

export { PageHeader }