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
  defaultValue?: string
  options?: readonly { value: string; label: string }[]
  dateRange?: Pick<
    DateRangeFieldProps,
    "locale" | "displayFormat" | "presets"
  >
}

export type PageStatus = "ready" | "loading" | "error" | "forbidden" | "offline"

export interface PageStatusLabels {
  loading?: { label?: string }
  error?: { title?: string; description?: string }
  forbidden?: { title?: string; description?: string }
  offline?: { title?: string; description?: string }
}

export interface PageStateActions {
  error?: ReactNode
  forbidden?: ReactNode
  offline?: ReactNode
}

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
  stateLabels?: PageStatusLabels
  className?: string
  selectedKeys?: ReadonlySet<Key>
  onSelectionChange?: (keys: ReadonlySet<Key>) => void
  selectionActions?: readonly WidgetTableSelectionAction[]
  filtered?: boolean
  onClearFilters?: () => void
  hiddenColumnIds?: readonly string[]
  onHiddenColumnIdsChange?: (ids: readonly string[]) => void
  totalCount?: number
  onSelectAllMatching?: () => void
  stickyHeader?: boolean
  maxBodyHeight?: string
  fill?: boolean
  toolbar?: ReactNode
  keepRows?: boolean
  stateActions?: PageStateActions
  onRowActivate?: (row: Row, index: number) => void
}

function getStatusContent(
  status: PageStatus,
  stateLabels: PageStatusLabels | undefined,
  stateActions: PageStateActions | undefined,
  className?: string
): ReactNode {
  if (status === "loading") return <StateLoading {...stateLabels?.loading} />
  if (status === "error")
    return (
      <StateError
        {...stateLabels?.error}
        actions={stateActions?.error}
        className={className}
      />
    )
  if (status === "forbidden")
    return <StateForbidden {...stateLabels?.forbidden} actions={stateActions?.forbidden} />
  if (status === "offline")
    return (
      <StateOffline
        {...stateLabels?.offline}
        actions={stateActions?.offline}
        className={className}
      />
    )
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
  resetFiltersLabel,
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
  stateLabels,
  className,
  selectedKeys,
  onSelectionChange,
  selectionActions,
  filtered,
  onClearFilters,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  totalCount,
  onSelectAllMatching,
  stickyHeader,
  maxBodyHeight,
  fill = false,
  toolbar,
  keepRows = false,
  stateActions,
  onRowActivate,
}: PageListProps<Row>) {
  const resolvedResetFiltersLabel =
    resetFiltersLabel ?? tableLabels?.clearFiltersLabel ?? "Reset filters"
  const filtersContent =
    filters && filters.length > 0 ? (
      <PageListFilters
        filters={filters}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        resetFiltersLabel={resolvedResetFiltersLabel}
      />
    ) : undefined
  const toolbarContent =
    filtersContent && toolbar ? (
      <div className="flex flex-wrap items-center gap-2">
        {filtersContent}
        {toolbar}
      </div>
    ) : (filtersContent ?? toolbar)
  const keepsRowsForStatus =
    keepRows && (status === "error" || status === "offline")
  const showsRows = status === "ready" || keepsRowsForStatus

  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        fill && "h-full min-h-0",
        className
      )}
    >
      {header ? (
        <PageHeader
          title={title}
          description={description}
          actions={actions}
          breadcrumbs={breadcrumbs}
          blockId={blockId ? `${blockId}.header` : undefined}
          className={fill ? "shrink-0" : undefined}
        />
      ) : null}

      <WidgetTable
        blockId={blockId ? `${blockId}.table` : undefined}
        title={header ? undefined : title}
        actions={header ? undefined : actions}
        columns={columns}
        rows={showsRows ? rows : []}
        getRowKey={getRowKey}
        toolbar={toolbarContent}
        notice={
          keepsRowsForStatus
            ? getStatusContent(status, stateLabels, stateActions, "py-6")
            : undefined
        }
        empty={
          showsRows ? undefined : getStatusContent(status, stateLabels, stateActions)
        }
        pagination={
          showsRows && total !== undefined
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
        totalCount={totalCount}
        onSelectAllMatching={onSelectAllMatching}
        stickyHeader={stickyHeader}
        maxBodyHeight={maxBodyHeight}
        fill={fill}
        onRowActivate={onRowActivate}
      />
    </div>
  )
}
