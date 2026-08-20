import type { ComponentType, Key, ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import {
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import { StateEmpty } from "@/registry/state-empty/state-empty"

import { WidgetTableColumnsMenu } from "./widget-table-columns-menu"
import { WidgetTablePageSizeSelect } from "./widget-table-page-size-select"
import { WidgetTablePaginationControls } from "./widget-table-pagination"
import { WidgetTableSelectionBar } from "./widget-table-selection-bar"
import { WidgetTableSortButton } from "./widget-table-sort-button"
import { WidgetTableSortSelect } from "./widget-table-sort-select"

export interface WidgetTableColumn<Row> {
  id: string
  title: string
  align?: "left" | "right"
  sortable?: boolean
  alwaysVisible?: boolean
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

export interface WidgetTableSelectionAction {
  id: string
  label: string
  icon?: ComponentType<{ className?: string }>
  tone?: "default" | "danger"
  onSelect: () => void
}

export interface WidgetTablePagination {
  page: number
  pageSize: number
  total: number
  onPageChange?: (page: number) => void
  pageSizeOptions?: readonly number[]
  onPageSizeChange?: (pageSize: number) => void
}

export interface WidgetTableLabels {
  emptyTitle?: string
  rowsPerPage?: string
  noSorting?: string
  sorting?: string
  previousPage?: string
  nextPage?: string
  range?: (rangeStart: number, rangeEnd: number, total: number) => string
  selectRow?: string
  selectAllOnPage?: string
  selected?: (count: number) => string
  clearSelection?: string
  selectAllMatchingLabel?: (count: number) => string
  filteredEmptyTitle?: string
  filteredEmptyDescription?: string
  clearFiltersLabel?: string
  columnsLabel?: string
  region?: string
}

export const widgetTableLabelDefaults: Required<WidgetTableLabels> = {
  emptyTitle: "No data",
  rowsPerPage: "Rows per page",
  noSorting: "No sorting",
  sorting: "Sorting",
  previousPage: "Previous page",
  nextPage: "Next page",
  range: (rangeStart, rangeEnd, total) =>
    `${rangeStart}–${rangeEnd} of ${total}`,
  selectRow: "Select row",
  selectAllOnPage: "Select all on page",
  selected: (count) => `${count} selected`,
  clearSelection: "Clear selection",
  selectAllMatchingLabel: (count) => `Select all ${count}`,
  filteredEmptyTitle: "No results",
  filteredEmptyDescription:
    "No records match the current filter. Try adjusting or clearing it.",
  clearFiltersLabel: "Clear filters",
  columnsLabel: "Columns",
  region: "Table",
}

export interface WidgetTableProps<Row> {
  blockId?: string
  title?: string
  columns: readonly WidgetTableColumn<Row>[]
  rows: readonly Row[]
  getRowKey?: (row: Row, index: number) => Key
  empty?: ReactNode
  className?: string
  toolbar?: ReactNode
  actions?: ReactNode
  pagination?: WidgetTablePagination
  footer?: ReactNode
  sort?: WidgetTableSort
  onSortChange?: (sort: WidgetTableSort | undefined) => void
  sortOptions?: readonly WidgetTableSortOption[]
  labels?: WidgetTableLabels
  selectedKeys?: ReadonlySet<Key>
  onSelectionChange?: (keys: ReadonlySet<Key>) => void
  selectionActions?: readonly WidgetTableSelectionAction[]
  totalCount?: number
  onSelectAllMatching?: () => void
  loading?: boolean
  filtered?: boolean
  onClearFilters?: () => void
  hiddenColumnIds?: readonly string[]
  onHiddenColumnIdsChange?: (ids: readonly string[]) => void
  stickyHeader?: boolean
  maxBodyHeight?: string
}

export function toggleHiddenColumnId(
  hidden: readonly string[],
  columnId: string
): readonly string[] {
  if (hidden.includes(columnId)) {
    return hidden.filter((id) => id !== columnId)
  }
  return [...hidden, columnId]
}

function csvField(value: string): string {
  const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value
  if (/["\n\r,]/.test(safeValue)) {
    return `"${safeValue.replace(/"/g, '""')}"`
  }
  return safeValue
}

export function toCsv<Row>(
  columns: readonly WidgetTableColumn<Row>[],
  rows: readonly Row[],
  getCellText?: (row: Row, column: WidgetTableColumn<Row>) => string
): string {
  const resolveCellText = (row: Row, column: WidgetTableColumn<Row>) => {
    if (getCellText) {
      return getCellText(row, column)
    }
    const value = column.cell(row)
    return typeof value === "string" || typeof value === "number"
      ? String(value)
      : ""
  }

  const lines = [
    columns.map((column) => csvField(column.title)).join(","),
    ...rows.map((row) =>
      columns.map((column) => csvField(resolveCellText(row, column))).join(",")
    ),
  ]

  return lines.join("\r\n")
}

export function getPageSelection(
  pageKeys: readonly Key[],
  selectedKeys: ReadonlySet<Key>
): "none" | "some" | "all" {
  if (pageKeys.length === 0) {
    return "none"
  }
  const selectedCount = pageKeys.filter((key) => selectedKeys.has(key)).length
  if (selectedCount === 0) {
    return "none"
  }
  if (selectedCount === pageKeys.length) {
    return "all"
  }
  return "some"
}

export function formatPaginationRange(
  pagination: WidgetTablePagination,
  range: (rangeStart: number, rangeEnd: number, total: number) => string
) {
  const rangeEnd = Math.min(
    pagination.page * pagination.pageSize,
    pagination.total
  )
  const rangeStart =
    pagination.total === 0
      ? 0
      : Math.min(
          (pagination.page - 1) * pagination.pageSize + 1,
          rangeEnd
        )
  return range(rangeStart, rangeEnd, pagination.total)
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

const skeletonRowCount = 3

export function WidgetTable<Row>({
  blockId,
  title,
  columns,
  rows,
  getRowKey,
  empty,
  className,
  toolbar,
  actions,
  pagination,
  footer,
  sort,
  onSortChange,
  sortOptions,
  labels,
  selectedKeys,
  onSelectionChange,
  selectionActions,
  totalCount,
  onSelectAllMatching,
  loading = false,
  filtered = false,
  onClearFilters,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  stickyHeader = false,
  maxBodyHeight = "24rem",
}: WidgetTableProps<Row>) {
  const resolvedLabels = { ...widgetTableLabelDefaults, ...labels }
  const visibleColumns = columns.filter(
    (column) => column.alwaysVisible || !hiddenColumnIds?.includes(column.id)
  )
  const hasSortSelect = Boolean(
    sortOptions && sortOptions.length > 0 && onSortChange
  )
  const hasColumnsMenu = Boolean(onHiddenColumnIdsChange)
  const hasServiceGroup =
    Boolean(pagination) || hasSortSelect || hasColumnsMenu
  const hasSelection = Boolean(selectedKeys && onSelectionChange)
  const pageKeys = hasSelection
    ? rows.map((row, index) => getRowKey?.(row, index) ?? index)
    : []
  const pageSelection = getPageSelection(pageKeys, selectedKeys ?? new Set())
  const hasActiveSelection = hasSelection && (selectedKeys?.size ?? 0) > 0
  const hasHeader = Boolean(
    title || toolbar || actions || hasServiceGroup || hasActiveSelection
  )

  return (
    <Block id={blockId} headings className={className}>
      {hasHeader ? (
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {hasActiveSelection &&
            !loading &&
            selectedKeys &&
            onSelectionChange ? (
              <WidgetTableSelectionBar
                count={selectedKeys.size}
                actions={selectionActions}
                selectedLabel={resolvedLabels.selected}
                clearLabel={resolvedLabels.clearSelection}
                onClear={() => onSelectionChange(new Set())}
                allPageSelected={pageSelection === "all"}
                totalCount={totalCount}
                onSelectAllMatching={onSelectAllMatching}
                selectAllMatchingLabel={resolvedLabels.selectAllMatchingLabel}
              />
            ) : (
              <>
                {title ? (
                  <CardTitle className="text-[0.84375rem] font-semibold">
                    {title}
                  </CardTitle>
                ) : null}
                {toolbar}
              </>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {pagination && !loading
              ? (footer ?? (
                  <>
                    <span className="text-sm text-muted-foreground">
                      {formatPaginationRange(pagination, resolvedLabels.range)}
                    </span>
                    {pagination.pageSizeOptions &&
                    pagination.onPageSizeChange ? (
                      <WidgetTablePageSizeSelect
                        pageSize={pagination.pageSize}
                        pageSizeOptions={pagination.pageSizeOptions}
                        onPageSizeChange={pagination.onPageSizeChange}
                        ariaLabel={resolvedLabels.rowsPerPage}
                      />
                    ) : null}
                  </>
                ))
              : null}
            {hasSortSelect && !loading && sortOptions && onSortChange ? (
              <WidgetTableSortSelect
                sortOptions={sortOptions}
                sort={sort}
                onSortChange={onSortChange}
                noSortingLabel={resolvedLabels.noSorting}
                ariaLabel={resolvedLabels.sorting}
              />
            ) : null}
            {hasColumnsMenu && !loading && onHiddenColumnIdsChange ? (
              <WidgetTableColumnsMenu
                columns={columns}
                hiddenColumnIds={hiddenColumnIds ?? []}
                onHiddenColumnIdsChange={onHiddenColumnIdsChange}
                label={resolvedLabels.columnsLabel}
              />
            ) : null}
            {actions}
          </div>
        </CardHeader>
      ) : null}
      <CardContent
        aria-busy={loading || undefined}
        className={cn(pagination && !loading && "-mb-(--card-spacing)")}
      >
        {loading ? (
          <Table>
            <TableHeader>
              <TableRow>
                {hasSelection ? (
                  <TableHead className="w-px [&:has([role=checkbox])]:pr-4">
                    <Skeleton className="size-4" />
                  </TableHead>
                ) : null}
                {visibleColumns.map((column) => (
                  <TableHead key={column.id}>
                    <Skeleton className="h-4 w-16" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                <TableRow key={rowIndex}>
                  {hasSelection ? (
                    <TableCell className="w-px [&:has([role=checkbox])]:pr-4">
                      <Skeleton className="size-4" />
                    </TableCell>
                  ) : null}
                  {visibleColumns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : rows.length === 0 ? (
          (empty ??
            (filtered ? (
              <StateEmpty
                title={resolvedLabels.filteredEmptyTitle}
                description={resolvedLabels.filteredEmptyDescription}
                actions={
                  onClearFilters ? (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={onClearFilters}
                    >
                      {resolvedLabels.clearFiltersLabel}
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <StateEmpty title={resolvedLabels.emptyTitle} />
            )))
        ) : (
          <div
            data-slot="table-container"
            tabIndex={stickyHeader ? 0 : undefined}
            role={stickyHeader ? "region" : undefined}
            aria-label={stickyHeader ? (title ?? resolvedLabels.region) : undefined}
            className={cn(
              "relative w-full outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
              stickyHeader && "overflow-auto",
              !stickyHeader && "overflow-x-auto"
            )}
            style={stickyHeader ? { maxHeight: maxBodyHeight } : undefined}
          >
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  {hasSelection ? (
                    <TableHead
                      className={cn(
                        "w-px [&:has([role=checkbox])]:pr-4",
                        stickyHeader && "sticky top-0 z-10 bg-card [[data-gradient]_&]:bg-transparent"
                      )}
                    >
                      <Checkbox
                        checked={pageSelection === "all"}
                        indeterminate={pageSelection === "some"}
                        aria-label={resolvedLabels.selectAllOnPage}
                        onCheckedChange={(checked) => {
                          if (!selectedKeys || !onSelectionChange) return
                          const next = new Set(selectedKeys)
                          for (const key of pageKeys) {
                            if (checked) {
                              next.add(key)
                            } else {
                              next.delete(key)
                            }
                          }
                          onSelectionChange(next)
                        }}
                      />
                    </TableHead>
                  ) : null}
                  {visibleColumns.map((column) => (
                    <TableHead
                      key={column.id}
                      aria-sort={
                        column.sortable && onSortChange
                          ? getAriaSort(column.id, sort)
                          : undefined
                      }
                      className={cn(
                        column.align === "right" && "text-right",
                        column.sortable && onSortChange && "p-0",
                        stickyHeader && "sticky top-0 z-10 bg-card [[data-gradient]_&]:bg-transparent"
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
                {rows.map((row, index) => {
                  const rowKey = getRowKey?.(row, index) ?? index

                  return (
                    <TableRow key={rowKey}>
                      {hasSelection ? (
                        <TableCell className="w-px [&:has([role=checkbox])]:pr-4">
                          <Checkbox
                            checked={selectedKeys?.has(rowKey) ?? false}
                            aria-label={resolvedLabels.selectRow}
                            onCheckedChange={(checked) => {
                              if (!selectedKeys || !onSelectionChange) return
                              const next = new Set(selectedKeys)
                              if (checked) {
                                next.add(rowKey)
                              } else {
                                next.delete(rowKey)
                              }
                              onSelectionChange(next)
                            }}
                          />
                        </TableCell>
                      ) : null}
                      {visibleColumns.map((column) => (
                        <TableCell
                          key={column.id}
                          className={cn(
                            column.align === "right" &&
                              "text-right tabular-nums"
                          )}
                        >
                          {column.cell(row)}
                        </TableCell>
                      ))}
                    </TableRow>
                  )
                })}
              </TableBody>
            </table>
          </div>
        )}
      </CardContent>
      {pagination && !loading ? (
        <CardFooter className="justify-center bg-card [[data-gradient]_&]:bg-transparent">
          <WidgetTablePaginationControls
            page={pagination.page}
            pageSize={pagination.pageSize}
            total={pagination.total}
            onPageChange={pagination.onPageChange}
            previousLabel={resolvedLabels.previousPage}
            nextLabel={resolvedLabels.nextPage}
          />
        </CardFooter>
      ) : null}
    </Block>
  )
}
