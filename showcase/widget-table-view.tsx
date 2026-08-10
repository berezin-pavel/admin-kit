"use client"

import { useState } from "react"

import { Input } from "@/components/ui/input"
import {
  WidgetTable,
  type WidgetTableColumn,
  type WidgetTableSort,
} from "@/registry/widget-table/widget-table"

interface OrderRow {
  number: string
  customer: string
  total: string
}

const allRows: readonly OrderRow[] = [
  { number: "1043", customer: "Bennett A.", total: "$4,200" },
  { number: "1042", customer: "Peters S.", total: "$1,750" },
  { number: "1041", customer: "Sanders M.", total: "$12,400" },
  { number: "1040", customer: "Cooper O.", total: "$980" },
  { number: "1039", customer: "Smith D.", total: "$3,150" },
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
    return a.number.localeCompare(b.number) * direction
  })
}

export interface WidgetTableShowcaseViewProps {
  title?: string
  withToolbar?: boolean
  withPagination?: boolean
  withSort?: boolean
  withPageSizeOptions?: boolean
}

export function WidgetTableShowcaseView({
  title,
  withToolbar = false,
  withPagination = false,
  withSort = false,
  withPageSizeOptions = false,
}: WidgetTableShowcaseViewProps) {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState<WidgetTableSort | undefined>(undefined)

  const columns: readonly WidgetTableColumn<OrderRow>[] = [
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
      sort={withSort ? sort : undefined}
      onSortChange={withSort ? setSort : undefined}
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
