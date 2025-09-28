export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: "admin" | "user" | "moderator"
}

export interface AppConfig {
  name: string
  version: string
  description: string
}

export interface NavItem {
  title: string
  href: string
  icon?: React.ComponentType<{ className?: string }>
  disabled?: boolean
}

export type Theme = "dark" | "light" | "system"