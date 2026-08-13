import type { Key, ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { DateRangeFieldProps } from "@/registry/date-range-field/date-range-field"
import { StateError } from "@/registry/state-error/state-error"
import { StateForbidden } from "@/registry/state-forbidden/state-forbidden"
import { StateLoading } from "@/registry/state-loading/state-loading"
import { StateOffline } from "@/registry/state-offline/state-offline"
import {
  WidgetTable,
  type WidgetTableColumn,
  type WidgetTableLabels,
  type WidgetTableSelectionAction,
  type WidgetTableSort,
  type WidgetTableSortOption,
} from "@/registry/widget-table/widget-table"

import { PageListFilters } from "./page-list-filters"

export interface PageListFilter {
  id: string
  label: string
  kind: "search" | "select" | "date-range"
  value: string
  options?: readonly { value: string; label: string }[]
  dateRange?: Pick<
    DateRangeFieldProps,
    "locale" | "displayFormat" | "presets"
  >
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
  pageSizeOptions?: readonly number[]
  onPageSizeChange?: (pageSize: number) => void
  sort?: WidgetTableSort
  onSortChange?: (sort: WidgetTableSort | undefined) => void
  sortOptions?: readonly WidgetTableSortOption[]
  tableLabels?: WidgetTableLabels
  status?: PageStatus
  className?: string
  selectedKeys?: ReadonlySet<Key>
  onSelectionChange?: (keys: ReadonlySet<Key>) => void
  selectionActions?: readonly WidgetTableSelectionAction[]
}

function getStatusContent(status: PageStatus): ReactNode {
  if (status === "loading") return <StateLoading />
  if (status === "error") return <StateError />
  if (status === "forbidden") return <StateForbidden />
  if (status === "offline") return <StateOffline />
  return null
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
  pageSizeOptions,
  onPageSizeChange,
  sort,
  onSortChange,
  sortOptions,
  tableLabels,
  status = "ready",
  className,
  selectedKeys,
  onSelectionChange,
  selectionActions,
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

      <WidgetTable
        columns={columns}
        rows={status === "ready" ? rows : []}
        getRowKey={getRowKey}
        toolbar={
          filters && filters.length > 0 ? (
            <PageListFilters
              filters={filters}
              onFilterChange={onFilterChange}
            />
          ) : undefined
        }
        empty={status === "ready" ? undefined : getStatusContent(status)}
        pagination={
          status === "ready" && total !== undefined
            ? {
                page,
                pageSize,
                total,
                onPageChange,
                pageSizeOptions,
                onPageSizeChange,
              }
            : undefined
        }
        sort={sort}
        onSortChange={onSortChange}
        sortOptions={sortOptions}
        labels={tableLabels}
        selectedKeys={selectedKeys}
        onSelectionChange={onSelectionChange}
        selectionActions={selectionActions}
      />
    </div>
  )
}
