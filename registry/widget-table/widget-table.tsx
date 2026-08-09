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
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetTableColumn<Row> {
  id: string
  title: string
  align?: "left" | "right"
  cell: (row: Row) => ReactNode
}

export interface WidgetTableProps<Row> {
  title: string
  columns: readonly WidgetTableColumn<Row>[]
  rows: readonly Row[]
  getRowKey?: (row: Row, index: number) => Key
  empty?: ReactNode
  className?: string
}

export function WidgetTable<Row>({
  title,
  columns,
  rows,
  getRowKey,
  empty,
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
        {rows.length === 0 ? (
          (empty ?? <StateEmpty title="No data" />)
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {columns.map((column) => (
                  <TableHead
                    key={column.id}
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
                      key={column.id}
                      className={cn(
                        column.align === "right" && "text-right tabular-nums"
                      )}
                    >
                      {column.cell(row)}
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
