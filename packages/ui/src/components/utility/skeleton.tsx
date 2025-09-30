import * as React from "react"
import { cn } from "@/lib/utils"

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "text" | "circular" | "rectangular"
  width?: string | number
  height?: string | number
  lines?: number
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      className,
      variant = "rectangular",
      width,
      height,
      lines = 1,
      ...props
    },
    ref
  ) => {
    if (variant === "text" && lines > 1) {
      return (
        <div className="space-y-2">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={cn(
                "h-4 bg-gray-200 rounded animate-pulse",
                index === lines - 1 && "w-3/4",
                className
              )}
              style={{ width: index === lines - 1 ? undefined : width }}
            />
          ))}
        </div>
      )
    }

    const variantClasses = {
      text: "h-4 rounded",
      circular: "rounded-full",
      rectangular: "rounded-lg",
    }

    return (
      <div
        ref={ref}
        className={cn(
          "bg-gray-200 animate-pulse",
          variantClasses[variant],
          className
        )}
        style={{ width, height }}
        {...props}
      />
    )
  }
)
Skeleton.displayName = "Skeleton"

export { Skeleton }