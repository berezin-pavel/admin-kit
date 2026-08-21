import type { ComponentType, Key, ReactElement, ReactNode } from "react"
import { ChevronDown, ChevronsDownUp, ChevronsUpDown } from "lucide-react"

import { Button } from "@/components/ui/button"
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import { Hint } from "@/registry/hint/hint"
import { StateEmpty } from "@/registry/state-empty/state-empty"
import { WidgetTableColumnsMenu } from "@/registry/widget-table/widget-table-columns-menu"

export interface TreeTableSection<Row> {
  id: string
  title: string
  icon?: ComponentType<{ className?: string }>
  color?: string
  sections?: readonly TreeTableSection<Row>[]
  rows?: readonly Row[]
  rowCount?: number
}

export interface TreeTableColumn<Row> {
  id: string
  title: string
  align?: "left" | "right"
  grow?: boolean
  alwaysVisible?: boolean
  cell: (row: Row) => ReactNode
  sectionCell?: (section: TreeTableSection<Row>) => ReactNode
}

export interface WidgetTreeTableLabels {
  emptyTitle?: string
  actions?: string
  expandAll?: string
  collapseAll?: string
  columnsLabel?: string
  filteredEmptyTitle?: string
  filteredEmptyDescription?: string
  clearFiltersLabel?: string
  showMore?: (count: number) => string
}

export const widgetTreeTableLabelDefaults: Required<WidgetTreeTableLabels> = {
  emptyTitle: "No data",
  actions: "Actions",
  expandAll: "Expand all",
  collapseAll: "Collapse all",
  columnsLabel: "Columns",
  filteredEmptyTitle: "No results",
  filteredEmptyDescription:
    "No records match the current filter. Try adjusting or clearing it.",
  clearFiltersLabel: "Clear filters",
  showMore: (count) => `Show ${count} more`,
}

export interface WidgetTreeTableProps<Row> {
  blockId?: string
  title?: string
  columns: readonly TreeTableColumn<Row>[]
  sections: readonly TreeTableSection<Row>[]
  getRowKey: (row: Row) => Key
  expandedIds: readonly string[]
  onExpandedChange: (ids: readonly string[]) => void
  rowActions?: (row: Row, section: TreeTableSection<Row>) => ReactNode
  sectionActions?: (section: TreeTableSection<Row>) => ReactNode
  toolbar?: ReactNode
  actions?: ReactNode
  empty?: ReactNode
  loading?: boolean
  labels?: WidgetTreeTableLabels
  className?: string
  hiddenColumnIds?: readonly string[]
  onHiddenColumnIdsChange?: (ids: readonly string[]) => void
  filtered?: boolean
  onClearFilters?: () => void
  onRowActivate?: (row: Row, section: TreeTableSection<Row>) => void
  onLoadMoreRows?: (section: TreeTableSection<Row>) => void
  fill?: boolean
}

export function toggleExpandedId(
  ids: readonly string[],
  id: string
): readonly string[] {
  if (ids.includes(id)) {
    return ids.filter((existingId) => existingId !== id)
  }
  return [...ids, id]
}

export function collectSectionIds<Row>(
  sections: readonly TreeTableSection<Row>[]
): readonly string[] {
  const ids: string[] = []
  for (const section of sections) {
    ids.push(section.id)
    if (section.sections) {
      ids.push(...collectSectionIds(section.sections))
    }
  }
  return ids
}

function AncestorStripes({
  ancestors,
}: {
  ancestors: readonly { id: string; color?: string }[]
}) {
  return (
    <>
      {ancestors.map((ancestor) => (
        <div
          key={ancestor.id}
          className={cn("w-9 shrink-0", !ancestor.color && "bg-muted-foreground")}
          style={ancestor.color ? { backgroundColor: ancestor.color } : undefined}
        />
      ))}
    </>
  )
}

const skeletonRowCount = 3

export function WidgetTreeTable<Row>({
  blockId,
  title,
  columns,
  sections,
  getRowKey,
  expandedIds,
  onExpandedChange,
  rowActions,
  sectionActions,
  toolbar,
  actions,
  empty,
  loading = false,
  labels,
  className,
  hiddenColumnIds,
  onHiddenColumnIdsChange,
  filtered = false,
  onClearFilters,
  onRowActivate,
  onLoadMoreRows,
  fill = false,
}: WidgetTreeTableProps<Row>): ReactElement {
  const resolvedLabels = { ...widgetTreeTableLabelDefaults, ...labels }
  const hasActionsColumn = Boolean(rowActions || sectionActions)
  const visibleColumns = columns.filter(
    (column, index) =>
      index === 0 || column.alwaysVisible || !hiddenColumnIds?.includes(column.id)
  )
  const restColumns = visibleColumns.slice(1)
  const growColumn = columns.find((column) => column.grow) ?? columns[0]
  const hasColumnsMenu = Boolean(onHiddenColumnIdsChange) && !loading
  const hasExpandCollapseIcons = sections.length > 0 && !loading
  const hasHeader = Boolean(
    title || toolbar || actions || onHiddenColumnIdsChange || sections.length > 0
  )
  const columnsMenuColumns = columns.map((column, index) =>
    index === 0 ? { ...column, alwaysVisible: true } : column
  )
  const tableContainerClassName = cn(
    "relative w-full",
    fill ? "min-h-0 flex-1 overflow-auto" : "overflow-x-auto"
  )
  const stickyHeadClassName = fill
    ? "sticky top-0 z-10 bg-card [[data-gradient]_&]:bg-transparent"
    : undefined

  function renderSectionRow(
    section: TreeTableSection<Row>,
    ancestors: readonly TreeTableSection<Row>[],
    depth: number
  ): ReactNode {
    const expanded = expandedIds.includes(section.id)

    return (
      <TableRow
        key={section.id}
        data-slot="tree-table-section-row"
        data-depth={depth}
      >
        <TableCell
          className={cn("p-0", columns[0] === growColumn && "w-full")}
        >
          <div className="flex items-stretch">
            <AncestorStripes ancestors={ancestors} />
            <div
              className={cn(
                "flex w-9 shrink-0 items-center justify-center",
                !section.color && "bg-muted-foreground"
              )}
              style={
                section.color ? { backgroundColor: section.color } : undefined
              }
            >
              {section.icon ? (
                <section.icon className="size-5 text-white" aria-hidden />
              ) : null}
            </div>
            <div
              className={cn(
                "min-w-0 flex-1 px-2 py-2",
                columns[0] === growColumn && "whitespace-normal"
              )}
            >
              <button
                type="button"
                aria-expanded={expanded}
                onClick={() =>
                  onExpandedChange(toggleExpandedId(expandedIds, section.id))
                }
                className="flex w-full items-center justify-between gap-2 text-left font-semibold"
              >
                <span>{section.title}</span>
                <ChevronDown
                  className={cn(
                    "size-4 shrink-0 transition-transform",
                    expanded && "rotate-180"
                  )}
                  aria-hidden
                />
              </button>
            </div>
          </div>
        </TableCell>
        {restColumns.map((column) => (
          <TableCell
            key={column.id}
            className={cn(
              column.align === "right" && "text-right",
              column === growColumn && "w-full"
            )}
          >
            {column === growColumn ? (
              <div className="whitespace-normal">
                {column.sectionCell?.(section) ?? null}
              </div>
            ) : (
              (column.sectionCell?.(section) ?? null)
            )}
          </TableCell>
        ))}
        {hasActionsColumn ? (
          <TableCell className="w-px">{sectionActions?.(section)}</TableCell>
        ) : null}
      </TableRow>
    )
  }

  function renderRecordRow(
    row: Row,
    section: TreeTableSection<Row>,
    ancestors: readonly TreeTableSection<Row>[],
    depth: number
  ): ReactNode {
    const nameContent = columns[0].cell(row)

    return (
      <TableRow key={getRowKey(row)} data-slot="tree-table-row" data-depth={depth}>
        <TableCell
          className={cn("p-0", columns[0] === growColumn && "w-full")}
        >
          <div className="flex items-stretch">
            <AncestorStripes ancestors={ancestors} />
            <div
              className={cn(
                "min-w-0 flex-1 px-2 py-2",
                columns[0] === growColumn && "whitespace-normal"
              )}
            >
              {onRowActivate ? (
                <button
                  type="button"
                  onClick={() => onRowActivate(row, section)}
                  className="text-left hover:underline underline-offset-4 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 rounded-sm"
                >
                  {nameContent}
                </button>
              ) : (
                nameContent
              )}
            </div>
          </div>
        </TableCell>
        {restColumns.map((column) => (
          <TableCell
            key={column.id}
            className={cn(
              column.align === "right" && "text-right",
              column === growColumn && "w-full"
            )}
          >
            {column === growColumn ? (
              <div className="whitespace-normal">{column.cell(row)}</div>
            ) : (
              column.cell(row)
            )}
          </TableCell>
        ))}
        {hasActionsColumn ? (
          <TableCell className="w-px">{rowActions?.(row, section)}</TableCell>
        ) : null}
      </TableRow>
    )
  }

  function renderMoreRow(
    section: TreeTableSection<Row>,
    ancestors: readonly TreeTableSection<Row>[],
    depth: number
  ): ReactNode {
    const rowCount = section.rowCount ?? 0
    const shown = section.rows?.length ?? 0
    const remainingColSpan = restColumns.length + (hasActionsColumn ? 1 : 0)

    return (
      <TableRow
        key={`${section.id}-more`}
        data-slot="tree-table-more-row"
        data-depth={depth}
      >
        <TableCell className="p-0">
          <div className="flex items-stretch">
            <AncestorStripes ancestors={ancestors} />
            <div className="flex flex-1 items-center px-2 py-2">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onLoadMoreRows?.(section)}
              >
                {resolvedLabels.showMore(rowCount - shown)}
              </Button>
            </div>
          </div>
        </TableCell>
        {remainingColSpan > 0 ? <TableCell colSpan={remainingColSpan} /> : null}
      </TableRow>
    )
  }

  function renderTree(
    treeSections: readonly TreeTableSection<Row>[],
    ancestors: readonly TreeTableSection<Row>[],
    depth: number
  ): ReactNode[] {
    const nodes: ReactNode[] = []

    for (const section of treeSections) {
      nodes.push(renderSectionRow(section, ancestors, depth))

      if (expandedIds.includes(section.id)) {
        const childAncestors = [...ancestors, section]
        if (section.sections) {
          nodes.push(...renderTree(section.sections, childAncestors, depth + 1))
        }
        if (section.rows) {
          for (const row of section.rows) {
            nodes.push(renderRecordRow(row, section, childAncestors, depth + 1))
          }
          if (
            onLoadMoreRows &&
            section.rowCount !== undefined &&
            section.rows.length < section.rowCount
          ) {
            nodes.push(renderMoreRow(section, childAncestors, depth + 1))
          }
        }
      }
    }

    return nodes
  }

  return (
    <Block
      id={blockId}
      headings
      className={cn(fill && "flex min-h-0 flex-1 flex-col", className)}
    >
      {hasHeader ? (
        <CardHeader
          className={cn(
            "flex flex-wrap items-center justify-between gap-4",
            fill && "shrink-0"
          )}
        >
          <div className="flex flex-wrap items-center gap-3">
            {title ? (
              <CardTitle className="text-[0.84375rem] font-semibold">
                {title}
              </CardTitle>
            ) : null}
            {toolbar}
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {hasColumnsMenu && onHiddenColumnIdsChange ? (
              <WidgetTableColumnsMenu
                columns={columnsMenuColumns}
                hiddenColumnIds={hiddenColumnIds ?? []}
                onHiddenColumnIdsChange={onHiddenColumnIdsChange}
                label={resolvedLabels.columnsLabel}
              />
            ) : null}
            {hasExpandCollapseIcons ? (
              <>
                <Hint
                  text={resolvedLabels.expandAll}
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={resolvedLabels.expandAll}
                      onClick={() =>
                        onExpandedChange(collectSectionIds(sections))
                      }
                    >
                      <ChevronsUpDown />
                    </Button>
                  }
                />
                <Hint
                  text={resolvedLabels.collapseAll}
                  render={
                    <Button
                      type="button"
                      variant="outline"
                      size="icon-sm"
                      aria-label={resolvedLabels.collapseAll}
                      onClick={() => onExpandedChange([])}
                    >
                      <ChevronsDownUp />
                    </Button>
                  }
                />
              </>
            ) : null}
            {actions}
          </div>
        </CardHeader>
      ) : null}
      <CardContent
        aria-busy={loading || undefined}
        className={cn(fill && "flex min-h-0 flex-1 flex-col")}
      >
        {loading ? (
          <div data-slot="table-container" className={tableContainerClassName}>
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={column.id} className={stickyHeadClassName}>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  ))}
                  {hasActionsColumn ? (
                    <TableHead className={cn("w-px", stickyHeadClassName)}>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id}>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ))}
                    {hasActionsColumn ? (
                      <TableCell>
                        <Skeleton className="h-4 w-full" />
                      </TableCell>
                    ) : null}
                  </TableRow>
                ))}
              </TableBody>
            </table>
          </div>
        ) : sections.length === 0 ? (
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
            role={fill ? "region" : undefined}
            tabIndex={fill ? 0 : undefined}
            aria-label={fill ? title : undefined}
            className={tableContainerClassName}
          >
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead
                      key={column.id}
                      className={cn(
                        column.align === "right" && "text-right",
                        column === growColumn && "w-full",
                        stickyHeadClassName
                      )}
                    >
                      {column.title}
                    </TableHead>
                  ))}
                  {hasActionsColumn ? (
                    <TableHead className={cn("w-px", stickyHeadClassName)}>
                      <span className="sr-only">{resolvedLabels.actions}</span>
                    </TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>{renderTree(sections, [], 0)}</TableBody>
            </table>
          </div>
        )}
      </CardContent>
    </Block>
  )
}
