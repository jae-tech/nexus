import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "../ui/card.js"

export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  value: string | number
  icon?: React.ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  description?: string
}

const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, title, value, icon, trend, description, ...props }, ref) => {
    return (
      <Card
        ref={ref}
        className={cn("p-6", className)}
        {...props}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>

            {(trend || description) && (
              <div className="mt-2 flex items-center gap-2">
                {trend && (
                  <span
                    className={cn(
                      "text-sm font-medium",
                      trend.isPositive ? "text-success-600" : "text-danger-600"
                    )}
                  >
                    {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
                  </span>
                )}
                {description && (
                  <span className="text-sm text-gray-500">{description}</span>
                )}
              </div>
            )}
          </div>

          {icon && (
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100 text-primary-600">
              {icon}
            </div>
          )}
        </div>
      </Card>
    )
  }
)
StatsCard.displayName = "StatsCard"

export { StatsCard }