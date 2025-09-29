import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'manager' | 'staff'
}

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  setUser: (user: User) => void
  clearError: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null })

        try {
          // 실제 로그인 API 호출 로직
          // 임시로 모의 사용자 생성
          const mockUser: User = {
            id: '1',
            name: '관리자',
            email,
            role: 'admin'
          }

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
            error: null
          })
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : '로그인에 실패했습니다',
            isLoading: false
          })
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
          error: null
        })
      },

      setUser: (user: User) => {
        set({ user, isAuthenticated: true })
      },

      clearError: () => {
        set({ error: null })
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)