import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const progressVariants = cva(
  "h-2 w-full overflow-hidden rounded-full bg-gray-200",
  {
    variants: {
      size: {
        sm: "h-1",
        md: "h-2",
        lg: "h-3",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
)

const progressBarVariants = cva(
  "h-full rounded-full transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-primary-600",
        success: "bg-success-600",
        warning: "bg-warning-600",
        error: "bg-danger-600",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface ProgressBarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof progressVariants>,
    VariantProps<typeof progressBarVariants> {
  value: number
  max?: number
  showLabel?: boolean
}

const ProgressBar = React.forwardRef<HTMLDivElement, ProgressBarProps>(
  (
    {
      className,
      value,
      max = 100,
      size,
      variant,
      showLabel = false,
      ...props
    },
    ref
  ) => {
    const percentage = Math.min(Math.max((value / max) * 100, 0), 100)

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(progressVariants({ size }), className)}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
          {...props}
        >
          <div
            className={cn(progressBarVariants({ variant }))}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showLabel && (
          <p className="mt-1 text-sm text-gray-600 text-right">
            {Math.round(percentage)}%
          </p>
        )}
      </div>
    )
  }
)
ProgressBar.displayName = "ProgressBar"

export { ProgressBar }