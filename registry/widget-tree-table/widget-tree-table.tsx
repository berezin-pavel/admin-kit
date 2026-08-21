import type { ComponentType, Key, ReactElement, ReactNode } from "react"
import { ChevronDown } from "lucide-react"

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
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface TreeTableSection<Row> {
  id: string
  title: string
  icon?: ComponentType<{ className?: string }>
  color?: string
  sections?: readonly TreeTableSection<Row>[]
  rows?: readonly Row[]
}

export interface TreeTableColumn<Row> {
  id: string
  title: string
  align?: "left" | "right"
  cell: (row: Row) => ReactNode
  sectionCell?: (section: TreeTableSection<Row>) => ReactNode
}

export interface WidgetTreeTableLabels {
  emptyTitle?: string
  actions?: string
}

export const widgetTreeTableLabelDefaults: Required<WidgetTreeTableLabels> = {
  emptyTitle: "No data",
  actions: "Actions",
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
}: WidgetTreeTableProps<Row>): ReactElement {
  const resolvedLabels = { ...widgetTreeTableLabelDefaults, ...labels }
  const hasHeader = Boolean(title || toolbar || actions)
  const hasActionsColumn = Boolean(rowActions || sectionActions)
  const restColumns = columns.slice(1)

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
        <TableCell className="p-0">
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
            <div className="min-w-0 flex-1 px-2 py-2 whitespace-normal">
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
            className={cn(column.align === "right" && "text-right")}
          >
            {column.sectionCell?.(section) ?? null}
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
    return (
      <TableRow key={getRowKey(row)} data-slot="tree-table-row" data-depth={depth}>
        <TableCell className="p-0">
          <div className="flex items-stretch">
            <AncestorStripes ancestors={ancestors} />
            <div className="min-w-0 flex-1 px-2 py-2 whitespace-normal">
              {columns[0].cell(row)}
            </div>
          </div>
        </TableCell>
        {restColumns.map((column) => (
          <TableCell
            key={column.id}
            className={cn(column.align === "right" && "text-right")}
          >
            {column.cell(row)}
          </TableCell>
        ))}
        {hasActionsColumn ? (
          <TableCell className="w-px">{rowActions?.(row, section)}</TableCell>
        ) : null}
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
        }
      }
    }

    return nodes
  }

  return (
    <Block id={blockId} headings className={className}>
      {hasHeader ? (
        <CardHeader className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            {title ? (
              <CardTitle className="text-[0.84375rem] font-semibold">
                {title}
              </CardTitle>
            ) : null}
            {toolbar}
          </div>
          <div className="flex flex-wrap items-center gap-3">{actions}</div>
        </CardHeader>
      ) : null}
      <CardContent aria-busy={loading || undefined}>
        {loading ? (
          <div data-slot="table-container" className="relative w-full overflow-x-auto">
            <table className="w-full caption-bottom text-sm">
              <TableHeader>
                <TableRow>
                  {columns.map((column) => (
                    <TableHead key={column.id}>
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  ))}
                  {hasActionsColumn ? (
                    <TableHead className="w-px">
                      <Skeleton className="h-4 w-16" />
                    </TableHead>
                  ) : null}
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: skeletonRowCount }, (_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {columns.map((column) => (
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
          (empty ?? <StateEmpty title={resolvedLabels.emptyTitle} />)
        ) : (
          <div
            data-slot="table-container"
            className="relative w-full overflow-x-auto"
          >
            <table className="w-full caption-bottom text-sm">
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
                  {hasActionsColumn ? (
                    <TableHead className="w-px">
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
