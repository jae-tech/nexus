import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"

export interface FormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  submitText?: string
  cancelText?: string
  onSubmit: (e: React.FormEvent) => void
  onCancel?: () => void
  loading?: boolean
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
 * FormDialog - 폼이 포함된 모달 전용
 *
 * 기본 기능:
 * - 폼 제출/취소 처리
 * - 유효성 검사 연동
 * - 로딩 상태 표시
 * - 일관된 버튼 배치
 */
export const FormDialog = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  submitText = "저장",
  cancelText = "취소",
  onSubmit,
  onCancel,
  loading = false,
  size = "md",
  className,
}: FormDialogProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(e)
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn(sizeClasses[size], className)}>
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && <DialogDescription>{description}</DialogDescription>}
          </DialogHeader>

          <div className="py-4">{children}</div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "저장 중..." : submitText}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
