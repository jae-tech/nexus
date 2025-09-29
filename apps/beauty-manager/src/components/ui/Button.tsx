
import { cn } from '@/lib/utils'
import { componentTokens, designTokens } from '@/lib/design-tokens'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'success' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  children: ReactNode
}

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  className = '',
  ...props
}: ButtonProps) {
  const baseStyles = `
    inline-flex items-center justify-center font-medium
    transition-all duration-200 focus-ring
    disabled:opacity-50 disabled:cursor-not-allowed
  `.replace(/\s+/g, ' ').trim()

  // Design token 기반 variant 스타일
  const variants = {
    primary: `
      bg-primary-600 hover:bg-primary-700 text-white
      border-0 shadow-sm
    `.replace(/\s+/g, ' ').trim(),

    secondary: `
      bg-white hover:bg-gray-50 text-gray-700
      border border-gray-300
    `.replace(/\s+/g, ' ').trim(),

    outline: `
      bg-white hover:bg-gray-50 text-gray-700
      border border-gray-200
    `.replace(/\s+/g, ' ').trim(),

    ghost: `
      bg-transparent hover:bg-gray-100 text-gray-700
      border-0
    `.replace(/\s+/g, ' ').trim(),

    success: `
      bg-success-600 hover:bg-success-700 text-white
      border-0 shadow-sm
    `.replace(/\s+/g, ' ').trim(),

    danger: `
      bg-danger-600 hover:bg-danger-700 text-white
      border-0 shadow-sm
    `.replace(/\s+/g, ' ').trim()
  }

  // Design token 기반 size 스타일
  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-lg',
    md: 'px-4 py-2 text-sm rounded-lg',
    lg: 'px-6 py-3 text-base rounded-lg'
  }

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
