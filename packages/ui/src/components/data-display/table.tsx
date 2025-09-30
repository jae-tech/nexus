import * as React from "react"
import { cn } from "@/lib/utils"

export interface Column<T = any> {
  key: string
  title: string
  render?: (value: any, record: T, index: number) => React.ReactNode
  width?: string | number
  align?: "left" | "center" | "right"
  sortable?: boolean
}

export interface TableProps<T = any> extends React.HTMLAttributes<HTMLTableElement> {
  columns: Column<T>[]
  data: T[]
  loading?: boolean
  onRowClick?: (record: T, index: number) => void
  rowKey?: keyof T | ((record: T) => string | number)
}

function Table<T extends Record<string, any>>({
  className,
  columns,
  data,
  loading = false,
  onRowClick,
  rowKey = "id",
  ...props
}: TableProps<T>) {
  const getRowKey = (record: T, index: number): string | number => {
    if (typeof rowKey === "function") {
      return rowKey(record)
    }
    return record[rowKey] ?? index
  }

  return (
    <div className="relative w-full overflow-auto">
      <table
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      >
        <thead className="border-b border-gray-200 bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                style={{ width: column.width }}
                className={cn(
                  "h-12 px-4 font-medium text-gray-700",
                  column.align === "center" && "text-center",
                  column.align === "right" && "text-right",
                  column.align === "left" && "text-left"
                )}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                로딩 중...
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="h-24 text-center text-gray-500"
              >
                데이터가 없습니다
              </td>
            </tr>
          ) : (
            data.map((record, index) => (
              <tr
                key={getRowKey(record, index)}
                onClick={() => onRowClick?.(record, index)}
                className={cn(
                  "border-b border-gray-100 transition-colors",
                  onRowClick && "cursor-pointer hover:bg-gray-50"
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={cn(
                      "px-4 py-3 text-gray-900",
                      column.align === "center" && "text-center",
                      column.align === "right" && "text-right",
                      column.align === "left" && "text-left"
                    )}
                  >
                    {column.render
                      ? column.render(record[column.key], record, index)
                      : record[column.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

Table.displayName = "Table"

export { Table }