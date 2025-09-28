
import { Button as NexusButton } from '@nexus/ui'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, ReactNode } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'icon' | 'outline'
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
  // 기존 variant를 Nexus UI variant로 매핑
  const nexusVariant = variant === 'primary' ? 'default' :
                      variant === 'secondary' ? 'outline' :
                      variant === 'icon' ? 'ghost' : variant

  // 기존 size를 Nexus UI size로 매핑
  const nexusSize = size === 'md' ? 'default' : size

  return (
    <NexusButton
      variant={nexusVariant}
      size={nexusSize}
      className={cn(className)}
      {...props}
    >
      {children}
    </NexusButton>
  )
}
