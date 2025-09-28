declare module '@nexus/ui' {
  import * as React from 'react'

  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
  }

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}

  export interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: string
    storageKey?: string
  }

  export const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>
  export const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>
  export const ThemeProvider: React.FC<ThemeProviderProps>
}