declare module '@nexus/ui' {
  import * as React from 'react'

  // Theme Provider
  export interface ThemeProviderProps {
    children: React.ReactNode
    defaultTheme?: 'dark' | 'light' | 'system'
    storageKey?: string
  }
  export declare const ThemeProvider: React.FC<ThemeProviderProps>

  // Button
  export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
    size?: 'default' | 'sm' | 'lg' | 'icon'
    asChild?: boolean
  }
  export declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>

  // Card
  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
  export declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>
  export declare const CardHeader: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>
  export declare const CardTitle: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLHeadingElement> & React.RefAttributes<HTMLParagraphElement>>
  export declare const CardDescription: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLParagraphElement> & React.RefAttributes<HTMLParagraphElement>>
  export declare const CardContent: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>
  export declare const CardFooter: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>

  // Input
  export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}
  export declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>

  // Label
  export interface LabelProps extends React.ComponentPropsWithoutRef<'label'> {}
  export declare const Label: React.ForwardRefExoticComponent<LabelProps & React.RefAttributes<HTMLLabelElement>>

  // Switch
  export interface SwitchProps extends React.ComponentPropsWithoutRef<'button'> {
    checked?: boolean
    onCheckedChange?: (checked: boolean) => void
  }
  export declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>

  // Badge
  export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline'
  }
  export declare const Badge: React.ForwardRefExoticComponent<BadgeProps & React.RefAttributes<HTMLDivElement>>

  // Avatar
  export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}
  export declare const Avatar: React.ForwardRefExoticComponent<AvatarProps & React.RefAttributes<HTMLSpanElement>>
  export declare const AvatarImage: React.ForwardRefExoticComponent<React.ImgHTMLAttributes<HTMLImageElement> & React.RefAttributes<HTMLImageElement>>
  export declare const AvatarFallback: React.ForwardRefExoticComponent<React.HTMLAttributes<HTMLSpanElement> & React.RefAttributes<HTMLSpanElement>>

  // Additional components
  export declare const Checkbox: React.ForwardRefExoticComponent<any>
  export declare const Select: React.ForwardRefExoticComponent<any>
  export declare const SelectValue: React.ForwardRefExoticComponent<any>
  export declare const SelectTrigger: React.ForwardRefExoticComponent<any>
  export declare const SelectContent: React.ForwardRefExoticComponent<any>
  export declare const SelectItem: React.ForwardRefExoticComponent<any>
  export declare const Separator: React.ForwardRefExoticComponent<any>
  export declare const Tooltip: React.ForwardRefExoticComponent<any>
  export declare const TooltipTrigger: React.ForwardRefExoticComponent<any>
  export declare const TooltipContent: React.ForwardRefExoticComponent<any>
  export declare const TooltipProvider: React.ForwardRefExoticComponent<any>
  export declare const DropdownMenu: React.ForwardRefExoticComponent<any>
  export declare const DropdownMenuTrigger: React.ForwardRefExoticComponent<any>
  export declare const DropdownMenuContent: React.ForwardRefExoticComponent<any>
  export declare const DropdownMenuItem: React.ForwardRefExoticComponent<any>
  export declare const DropdownMenuSeparator: React.ForwardRefExoticComponent<any>
  export declare const Table: React.ForwardRefExoticComponent<any>
  export declare const TableHeader: React.ForwardRefExoticComponent<any>
  export declare const TableBody: React.ForwardRefExoticComponent<any>
  export declare const TableFooter: React.ForwardRefExoticComponent<any>
  export declare const TableHead: React.ForwardRefExoticComponent<any>
  export declare const TableRow: React.ForwardRefExoticComponent<any>
  export declare const TableCell: React.ForwardRefExoticComponent<any>
  export declare const TableCaption: React.ForwardRefExoticComponent<any>
}