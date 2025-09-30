declare module "@nexus/ui" {
  import * as React from "react";

  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
      | "default"
      | "primary"
      | "secondary"
      | "outline"
      | "ghost"
      | "success"
      | "danger"
      | "destructive"
      | "link";
    size?: "default" | "sm" | "md" | "lg" | "icon";
    asChild?: boolean;
  }

  export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hover?: boolean;
    padding?: "default" | "none" | "sm" | "lg";
  }

  export interface ThemeProviderProps {
    children: React.ReactNode;
    defaultTheme?: string;
    storageKey?: string;
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
  export const Card: React.ForwardRefExoticComponent<
    CardProps & React.RefAttributes<HTMLDivElement>
  >;
  export const ThemeProvider: React.FC<ThemeProviderProps>;
}
