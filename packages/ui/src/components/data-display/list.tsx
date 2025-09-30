import * as React from "react"
import { cn } from "@/lib/utils"

export interface ListProps extends React.HTMLAttributes<HTMLUListElement> {
  divided?: boolean
}

const List = React.forwardRef<HTMLUListElement, ListProps>(
  ({ className, divided = false, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "w-full",
          divided && "divide-y divide-gray-200",
          className
        )}
        {...props}
      />
    )
  }
)
List.displayName = "List"

export interface ListItemProps extends React.HTMLAttributes<HTMLLIElement> {
  active?: boolean
  disabled?: boolean
}

const ListItem = React.forwardRef<HTMLLIElement, ListItemProps>(
  ({ className, active = false, disabled = false, onClick, ...props }, ref) => {
    return (
      <li
        ref={ref}
        onClick={disabled ? undefined : onClick}
        className={cn(
          "px-4 py-3 transition-colors",
          onClick && !disabled && "cursor-pointer hover:bg-gray-50",
          active && "bg-primary-50 text-primary-700",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        {...props}
      />
    )
  }
)
ListItem.displayName = "ListItem"

export { List, ListItem }