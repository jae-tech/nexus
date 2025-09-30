import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const spinnerVariants = cva(
  "animate-spin rounded-full border-2 border-current border-t-transparent",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-6 w-6",
        lg: "h-8 w-8",
        xl: "h-12 w-12",
      },
      variant: {
        primary: "text-primary-600",
        secondary: "text-gray-600",
        white: "text-white",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
  }
)

export interface SpinnerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof spinnerVariants> {
  label?: string
}

const Spinner = React.forwardRef<HTMLDivElement, SpinnerProps>(
  ({ className, size, variant, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("inline-flex items-center gap-2", className)}
        {...props}
      >
        <div
          className={cn(spinnerVariants({ size, variant }))}
          role="status"
          aria-label={label || "로딩 중"}
        >
          <span className="sr-only">{label || "로딩 중"}</span>
        </div>
        {label && <span className="text-sm text-gray-600">{label}</span>}
      </div>
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner, spinnerVariants }