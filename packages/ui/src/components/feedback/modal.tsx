import * as React from "react"
import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  closeOnBackdrop?: boolean
  className?: string
}

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  closeOnBackdrop = true,
  className,
}: ModalProps) => {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-full mx-4",
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={closeOnBackdrop ? onClose : undefined}
      />

      {/* Modal Content */}
      <div
        className={cn(
          "relative bg-white rounded-xl shadow-xl w-full",
          sizeClasses[size],
          className
        )}
      >
        {children}
      </div>
    </div>
  )
}

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { onClose?: () => void }
>(({ className, children, onClose, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-between p-6 border-b border-gray-200", className)}
    {...props}
  >
    <h2 className="text-xl font-semibold text-gray-900">{children}</h2>
    {onClose && (
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="닫기"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    )}
  </div>
))
ModalHeader.displayName = "ModalHeader"

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6", className)} {...props} />
))
ModalBody.displayName = "ModalBody"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 p-6 border-t border-gray-200", className)}
    {...props}
  />
))
ModalFooter.displayName = "ModalFooter"

export { Modal, ModalHeader, ModalBody, ModalFooter }