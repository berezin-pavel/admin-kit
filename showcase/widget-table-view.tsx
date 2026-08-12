"use client"

import { useState } from "react"
import type { Key } from "react"
import { Download, Eye, Pencil, Trash2 } from "lucide-react"

import { Input } from "@/components/ui/input"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { RowActions } from "@/registry/row-actions/row-actions"
import {
  WidgetTable,
  type WidgetTableColumn,
  type WidgetTableSelectionAction,
  type WidgetTableSort,
  type WidgetTableSortOption,
} from "@/registry/widget-table/widget-table"

interface OrderRow {
  number: string
  customer: string
  total: string
  urgency: number
}

const allRows: readonly OrderRow[] = [
  { number: "1043", customer: "Bennett A.", total: "$4,200", urgency: 3 },
  { number: "1042", customer: "Peters S.", total: "$1,750", urgency: 1 },
  { number: "1041", customer: "Sanders M.", total: "$12,400", urgency: 5 },
  { number: "1040", customer: "Cooper O.", total: "$980", urgency: 2 },
  { number: "1039", customer: "Smith D.", total: "$3,150", urgency: 4 },
]

const SORT_OPTIONS: readonly WidgetTableSortOption[] = [
  {
    label: "Number: newest first",
    sort: { columnId: "number", direction: "desc" },
  },
  {
    label: "Amount: descending",
    sort: { columnId: "total", direction: "desc" },
  },
  {
    label: "Urgent first",
    sort: { columnId: "urgency", direction: "desc" },
  },
]

const PAGE_SIZE_OPTIONS = [2, 3, 5] as const
const DEFAULT_PAGE_SIZE = 2

function parseTotal(total: string) {
  return Number(total.replace(/\D/g, ""))
}

function sortRows(
  rows: readonly OrderRow[],
  sort: WidgetTableSort | undefined
): readonly OrderRow[] {
  if (!sort) {
    return rows
  }

  const direction = sort.direction === "asc" ? 1 : -1

  return [...rows].sort((a, b) => {
    if (sort.columnId === "total") {
      return (parseTotal(a.total) - parseTotal(b.total)) * direction
    }
    if (sort.columnId === "urgency") {
      return (a.urgency - b.urgency) * direction
    }
    return a.number.localeCompare(b.number) * direction
  })
}

export interface WidgetTableShowcaseViewProps {
  title?: string
  withToolbar?: boolean
  withPagination?: boolean
  withSort?: boolean
  withPageSizeOptions?: boolean
  withSortSelect?: boolean
  withRowActions?: boolean
  withSelection?: boolean
}

export function WidgetTableShowcaseView({
  title,
  withToolbar = false,
  withPagination = false,
  withSort = false,
  withPageSizeOptions = false,
  withSortSelect = false,
  withRowActions = false,
  withSelection = false,
}: WidgetTableShowcaseViewProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState<WidgetTableSort | undefined>(undefined)
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(
    new Set()
  )

  const baseColumns: readonly WidgetTableColumn<OrderRow>[] = [
    {
      id: "number",
      title: "Number",
      sortable: withSort,
      cell: (row) => row.number,
    },
    { id: "customer", title: "Customer", cell: (row) => row.customer },
    {
      id: "total",
      title: "Amount",
      align: "right",
      sortable: withSort,
      cell: (row) => row.total,
    },
  ]

  const actionsColumn: WidgetTableColumn<OrderRow> = {
    id: "actions",
    title: "",
    align: "right",
    cell: (row) => (
      <RowActions
        actions={[
          {
            id: "view",
            label: "View order",
            icon: Eye,
            onSelect: () => notify.info(`Order #${row.number}`),
          },
          {
            id: "edit",
            label: "Edit order",
            icon: Pencil,
            onSelect: () => notify.info("Coming soon"),
          },
          {
            id: "delete",
            label: "Delete order",
            icon: Trash2,
            tone: "danger",
            onSelect: () =>
              notify.danger(`Order #${row.number} deleted`, {
                description:
                  "This action in the showcase doesn't actually change anything",
              }),
          },
        ]}
      />
    ),
  }

  const columns = withRowActions ? [...baseColumns, actionsColumn] : baseColumns

  const query = search.trim().toLowerCase()
  const filtered = allRows.filter(
    (row) =>
      query === "" ||
      row.number.includes(query) ||
      row.customer.toLowerCase().includes(query)
  )
  const matched = sortRows(filtered, sort)

  const lastPage = Math.max(1, Math.ceil(matched.length / pageSize))
  const currentPage = Math.min(page, lastPage)
  const rows = withPagination
    ? matched.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    : matched

  const sortIsManaged = withSort || withSortSelect

  const selectionActions: readonly WidgetTableSelectionAction[] = [
    {
      id: "export",
      label: "Export",
      icon: Download,
      onSelect: () => undefined,
    },
    {
      id: "delete",
      label: "Delete",
      icon: Trash2,
      tone: "danger",
      onSelect: () => setSelectedKeys(new Set()),
    },
  ]

  return (
    <WidgetTable
      title={title}
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.number}
      toolbar={
        withToolbar ? (
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search orders"
            aria-label="Search orders"
            className="w-48"
          />
        ) : undefined
      }
      sort={sortIsManaged ? sort : undefined}
      onSortChange={sortIsManaged ? setSort : undefined}
      sortOptions={withSortSelect ? SORT_OPTIONS : undefined}
      selectedKeys={withSelection ? selectedKeys : undefined}
      onSelectionChange={withSelection ? setSelectedKeys : undefined}
      selectionActions={withSelection ? selectionActions : undefined}
      pagination={
        withPagination
          ? {
              page: currentPage,
              pageSize,
              total: matched.length,
              onPageChange: setPage,
              pageSizeOptions: withPageSizeOptions
                ? PAGE_SIZE_OPTIONS
                : undefined,
              onPageSizeChange: withPageSizeOptions
                ? (nextPageSize: number) => {
                    setPageSize(nextPageSize)
                    setPage(1)
                  }
                : undefined,
            }
          : undefined
      }
    />
  )
}
