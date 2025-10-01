import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog"
import { cn } from "@/lib/utils"

export interface BaseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title?: string
  description?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
}

/**
 * BaseDialog - 표준화된 Dialog 래퍼 컴포넌트
 *
 * 기본 기능:
 * - 일관된 크기 옵션 (sm, md, lg, xl)
 * - 표준 애니메이션 및 배경
 * - ESC 키 및 배경 클릭으로 닫기
 * - 접근성 속성 자동 적용
 */
export const BaseDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  size = "md",
  className,
}: BaseDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        {(title || description) && (
          <DialogHeader>
            {title && <DialogTitle>{title}</DialogTitle>}
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>
        )}
        {children}
      </DialogContent>
    </Dialog>
  )
}
