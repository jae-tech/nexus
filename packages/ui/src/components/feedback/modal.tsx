/**
 * Modal - Dialog 기반 통합 모달 컴포넌트
 *
 * 기존 커스텀 Modal을 Radix UI Dialog 기반으로 완전 재구성
 * - 일관된 배경 처리 (bg-black/80)
 * - 표준 애니메이션 및 접근성
 * - BaseDialog와 동일한 기반 사용
 */
import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog"
import { cn } from "@/lib/utils"

export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
  className?: string
}

const sizeClasses = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
  full: "max-w-full mx-4",
}

const Modal = ({
  isOpen,
  onClose,
  children,
  size = "md",
  className,
}: ModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        {children}
      </DialogContent>
    </Dialog>
  )
}

const ModalHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <DialogHeader ref={ref} className={cn("border-b pb-4", className)} {...props}>
    <DialogTitle className="text-xl font-semibold">{children}</DialogTitle>
  </DialogHeader>
))
ModalHeader.displayName = "ModalHeader"

const ModalBody = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("py-4", className)} {...props} />
))
ModalBody.displayName = "ModalBody"

const ModalFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center justify-end gap-2 pt-4 border-t", className)}
    {...props}
  />
))
ModalFooter.displayName = "ModalFooter"

export { Modal, ModalHeader, ModalBody, ModalFooter }