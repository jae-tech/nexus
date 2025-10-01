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

export interface ConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  confirmText?: string
  cancelText?: string
  onConfirm: () => void
  onCancel?: () => void
  variant?: "default" | "destructive"
  loading?: boolean
  className?: string
}

/**
 * ConfirmDialog - 확인/취소 다이얼로그
 *
 * 기본 기능:
 * - 제목, 메시지, 확인/취소 버튼
 * - destructive 변형 (위험한 액션용)
 * - 일관된 버튼 배치 (취소 → 확인)
 * - 로딩 상태 표시
 */
export const ConfirmDialog = ({
  open,
  onOpenChange,
  title,
  description,
  confirmText = "확인",
  cancelText = "취소",
  onConfirm,
  onCancel,
  variant = "default",
  loading = false,
  className,
}: ConfirmDialogProps) => {
  const handleConfirm = () => {
    onConfirm()
    if (!loading) {
      onOpenChange(false)
    }
  }

  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={cn("max-w-md", className)}>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={loading}
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "처리 중..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
