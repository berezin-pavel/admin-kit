import type { Key, ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { DateRangeFieldProps } from "@/registry/date-range-field/date-range-field"
import { PageHeader } from "@/registry/page-header/page-header"
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
  blockId?: string
  header?: boolean
  title: string
  description?: string
  actions?: ReactNode
  breadcrumbs?: ReactNode
  filters?: readonly PageListFilter[]
  onFilterChange?: (id: string, value: string) => void
  onResetFilters?: () => void
  resetFiltersLabel?: string
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
  filtered?: boolean
  onClearFilters?: () => void
  hiddenColumnIds?: readonly string[]
  onHiddenColumnIdsChange?: (ids: readonly string[]) => void
  onExport?: (rows: readonly Row[]) => void
  totalCount?: number
  onSelectAllMatching?: () => void
  stickyHeader?: boolean
  maxBodyHeight?: string
}

function getStatusContent(status: PageStatus): ReactNode {
  if (status === "loading") return <StateLoading />
  if (status === "error") return <StateError />
  if (status === "forbidden") return <StateForbidden />
  if (status === "offline") return <StateOffline />
  return null
}

export function PageList<Row>({
  blockId,
  header = true,
  title,
  description,
  actions,
  breadcrumbs,
  filters,
  onFilterChange,
  onResetFilters,
  resetFiltersLabel = "Reset filters",
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
  filtered,
  onClearFilters,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  onExport,
  totalCount,
  onSelectAllMatching,
  stickyHeader,
  maxBodyHeight,
}: PageListProps<Row>) {
  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {header ? (
        <PageHeader
          title={title}
          description={description}
          actions={actions}
          breadcrumbs={breadcrumbs}
          blockId={blockId ? `${blockId}.header` : undefined}
        />
      ) : null}

      <WidgetTable
        blockId={blockId ? `${blockId}.table` : undefined}
        title={header ? undefined : title}
        actions={header ? undefined : actions}
        columns={columns}
        rows={status === "ready" ? rows : []}
        getRowKey={getRowKey}
        toolbar={
          filters && filters.length > 0 ? (
            <PageListFilters
              filters={filters}
              onFilterChange={onFilterChange}
              onResetFilters={onResetFilters}
              resetFiltersLabel={resetFiltersLabel}
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
        filtered={filtered}
        onClearFilters={onClearFilters}
        hiddenColumnIds={hiddenColumnIds}
        onHiddenColumnIdsChange={onHiddenColumnIdsChange}
        onExport={onExport}
        totalCount={totalCount}
        onSelectAllMatching={onSelectAllMatching}
        stickyHeader={stickyHeader}
        maxBodyHeight={maxBodyHeight}
      />
    </div>
  )
}
