import type { Key, ReactNode } from "react"

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
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

import { WidgetTablePageSizeSelect } from "./widget-table-page-size-select"
import { WidgetTablePaginationControls } from "./widget-table-pagination"
import { WidgetTableSortButton } from "./widget-table-sort-button"
import { WidgetTableSortSelect } from "./widget-table-sort-select"

export interface WidgetTableColumn<Row> {
  id: string
  title: string
  align?: "left" | "right"
  sortable?: boolean
  cell: (row: Row) => ReactNode
}

export interface WidgetTableSort {
  columnId: string
  direction: "asc" | "desc"
}

export interface WidgetTableSortOption {
  label: string
  sort: WidgetTableSort
}

export interface WidgetTablePagination {
  page: number
  pageSize: number
  total: number
  onPageChange?: (page: number) => void
  pageSizeOptions?: readonly number[]
  onPageSizeChange?: (pageSize: number) => void
}

export interface WidgetTableProps<Row> {
  title?: string
  columns: readonly WidgetTableColumn<Row>[]
  rows: readonly Row[]
  getRowKey?: (row: Row, index: number) => Key
  empty?: ReactNode
  className?: string
  toolbar?: ReactNode
  pagination?: WidgetTablePagination
  footer?: ReactNode
  sort?: WidgetTableSort
  onSortChange?: (sort: WidgetTableSort | undefined) => void
  sortOptions?: readonly WidgetTableSortOption[]
}

function formatPaginationRange(pagination: WidgetTablePagination) {
  const rangeStart =
    pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.pageSize + 1
  const rangeEnd = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  )
  return `${rangeStart}–${rangeEnd} of ${pagination.total}`
}

function getAriaSort(
  columnId: string,
  sort: WidgetTableSort | undefined
): "ascending" | "descending" | "none" {
  if (!sort || sort.columnId !== columnId) {
    return "none"
  }
  return sort.direction === "asc" ? "ascending" : "descending"
}

export function WidgetTable<Row>({
  title,
  columns,
  rows,
  getRowKey,
  empty,
  className,
  toolbar,
  pagination,
  footer,
  sort,
  onSortChange,
  sortOptions,
}: WidgetTableProps<Row>) {
  const hasSortSelect = Boolean(
    sortOptions && sortOptions.length > 0 && onSortChange
  )
  const hasServiceGroup = Boolean(pagination) || hasSortSelect
  const hasHeader = Boolean(title || toolbar || hasServiceGroup)

  return (
    <Card className={className}>
      {hasHeader ? (
        <CardHeader className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {title ? (
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {title}
              </CardTitle>
            ) : null}
            {toolbar}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {pagination
              ? (footer ?? (
                  <>
                    {pagination.pageSizeOptions &&
                    pagination.onPageSizeChange ? (
                      <WidgetTablePageSizeSelect
                        pageSize={pagination.pageSize}
                        pageSizeOptions={pagination.pageSizeOptions}
                        onPageSizeChange={pagination.onPageSizeChange}
                      />
                    ) : null}
                    <span className="text-sm text-muted-foreground">
                      {formatPaginationRange(pagination)}
                    </span>
                  </>
                ))
              : null}
            {hasSortSelect && sortOptions && onSortChange ? (
              <WidgetTableSortSelect
                sortOptions={sortOptions}
                sort={sort}
                onSortChange={onSortChange}
              />
            ) : null}
          </div>
        </CardHeader>
      ) : null}
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
                    aria-sort={
                      column.sortable && onSortChange
                        ? getAriaSort(column.id, sort)
                        : undefined
                    }
                    className={cn(
                      column.align === "right" && "text-right",
                      column.sortable && onSortChange && "p-0"
                    )}
                  >
                    {column.sortable && onSortChange ? (
                      <WidgetTableSortButton
                        columnId={column.id}
                        align={column.align}
                        sort={sort}
                        onSortChange={onSortChange}
                      >
                        {column.title}
                      </WidgetTableSortButton>
                    ) : (
                      column.title
                    )}
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
      {pagination ? (
        <CardFooter className="justify-center bg-card">
          <WidgetTablePaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
          />
        </CardFooter>
      ) : null}
    </Card>
  )
}
