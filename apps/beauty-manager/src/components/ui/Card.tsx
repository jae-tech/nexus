
import { cn } from '@/lib/utils'
import { componentTokens } from '@/lib/design-tokens'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: () => void
}

export default function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const baseStyles = `
    bg-white border border-gray-100 rounded-xl shadow-sm p-5
  `.replace(/\s+/g, ' ').trim()

  const hoverStyles = hover ? `
    hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer
  `.replace(/\s+/g, ' ').trim() : ''

  const focusStyles = onClick ? `
    focus-ring
  `.replace(/\s+/g, ' ').trim() : ''

  return (
    <div
      className={cn(
        baseStyles,
        hoverStyles,
        focusStyles,
        className
      )}
      onClick={onClick}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  )
}
