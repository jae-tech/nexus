import { create } from 'zustand'

interface ToastMessage {
  id: string
  message: string
  type: 'success' | 'error' | 'warning' | 'info'
  duration?: number
}

interface ToastState {
  toasts: ToastMessage[]
  addToast: (message: string, type?: ToastMessage['type'], duration?: number) => string
  removeToast: (id: string) => void
  clearAllToasts: () => void
  success: (message: string, duration?: number) => string
  error: (message: string, duration?: number) => string
  warning: (message: string, duration?: number) => string
  info: (message: string, duration?: number) => string
}

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  addToast: (message, type = 'info', duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast: ToastMessage = {
      id,
      message,
      type,
      duration
    }

    set((state) => ({
      toasts: [...state.toasts, newToast]
    }))

    // 자동 제거
    if (duration > 0) {
      setTimeout(() => {
        get().removeToast(id)
      }, duration)
    }

    return id
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id)
    }))
  },

  clearAllToasts: () => {
    set({ toasts: [] })
  },

  success: (message, duration = 5000) => {
    return get().addToast(message, 'success', duration)
  },

  error: (message, duration = 8000) => {
    return get().addToast(message, 'error', duration)
  },

  warning: (message, duration = 6000) => {
    return get().addToast(message, 'warning', duration)
  },

  info: (message, duration = 5000) => {
    return get().addToast(message, 'info', duration)
  }
}))

// 편의 훅
export const useToast = () => {
  const { success, error, warning, info, removeToast, toasts } = useToastStore()
  return { success, error, warning, info, removeToast, toasts }
}