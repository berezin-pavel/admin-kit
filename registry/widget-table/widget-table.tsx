import type { Key, ReactNode } from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

export interface WidgetTableColumn<Row> {
  key: Extract<keyof Row, string>
  title: string
  align?: "left" | "right"
}

export interface WidgetTableProps<Row> {
  title: string
  columns: readonly WidgetTableColumn<Row>[]
  rows: readonly Row[]
  empty?: ReactNode
  getRowKey?: (row: Row, index: number) => Key
  className?: string
}

export function WidgetTable<Row extends Record<string, ReactNode>>({
  title,
  columns,
  rows,
  empty,
  getRowKey,
  className,
}: WidgetTableProps<Row>) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 && empty ? (
          empty
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.key}
                    className={cn(column.align === "right" && "text-right")}
                  >
                    {column.title}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, index) => (
                <TableRow key={getRowKey?.(row, index) ?? index}>
                  {columns.map((column) => (
                    <TableCell
                      key={column.key}
                      className={cn(
                        column.align === "right" && "text-right tabular-nums"
                      )}
                    >
                      {row[column.key]}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
