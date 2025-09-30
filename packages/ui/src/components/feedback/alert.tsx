import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const alertVariants = cva(
  "relative w-full rounded-lg border p-4",
  {
    variants: {
      variant: {
        default: "bg-white border-gray-200 text-gray-900",
        success: "bg-success-50 border-success-200 text-success-800",
        error: "bg-danger-50 border-danger-200 text-danger-800",
        warning: "bg-warning-50 border-warning-200 text-warning-800",
        info: "bg-blue-50 border-blue-200 text-blue-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface AlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  title?: string
  icon?: React.ReactNode
  onClose?: () => void
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant, title, icon, onClose, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(alertVariants({ variant }), className)}
        role="alert"
        {...props}
      >
        <div className="flex gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <div className="flex-1">
            {title && (
              <h5 className="mb-1 font-medium leading-none tracking-tight">
                {title}
              </h5>
            )}
            <div className="text-sm">{children}</div>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="ml-auto flex-shrink-0 opacity-70 hover:opacity-100 transition-opacity"
              aria-label="닫기"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    )
  }
)
Alert.displayName = "Alert"

export { Alert, alertVariants }