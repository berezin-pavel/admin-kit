import type { Key, ReactNode } from "react"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateLoading } from "@/registry/state-loading/state-loading"
import { StateOffline } from "@/registry/state-offline/state-offline"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

import { PageListFilters } from "./page-list-filters"
import { PageListPagination } from "./page-list-pagination"

export interface PageListFilter {
  id: string
  label: string
  kind: "search" | "select"
  value: string
  options?: readonly { value: string; label: string }[]
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageListProps<Row> {
  title: string
  description?: string
  actions?: ReactNode
  filters?: readonly PageListFilter[]
  onFilterChange?: (id: string, value: string) => void
  columns: readonly WidgetTableColumn<Row>[]
  rows: readonly Row[]
  getRowKey?: (row: Row, index: number) => Key
  page?: number
  pageSize?: number
  total?: number
  onPageChange?: (page: number) => void
  status?: PageStatus
  className?: string
}

export function PageList<Row>({
  title,
  description,
  actions,
  filters,
  onFilterChange,
  columns,
  rows,
  getRowKey,
  page = 1,
  pageSize = 10,
  total,
  onPageChange,
  status = "ready",
  className,
}: PageListProps<Row>) {
  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="font-heading text-xl font-semibold text-foreground">
            {title}
          </h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {actions ? (
          <div className="flex shrink-0 items-center gap-2">{actions}</div>
        ) : null}
      </div>

      {filters && filters.length > 0 ? (
        <PageListFilters filters={filters} onFilterChange={onFilterChange} />
      ) : null}

      {status === "ready" ? (
        <div className="flex flex-col gap-4">
          <WidgetTable
            title={title}
            columns={columns}
            rows={rows}
            getRowKey={getRowKey}
          />
          {total !== undefined ? (
            <PageListPagination
              page={page}
              pageSize={pageSize}
              total={total}
              onPageChange={onPageChange}
            />
          ) : null}
        </div>
      ) : (
        <Card>
          <CardContent>
            {status === "loading" ? <StateLoading /> : null}
            {status === "error" ? <StateError /> : null}
            {status === "forbidden" ? <StateForbidden /> : null}
            {status === "offline" ? <StateOffline /> : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
