"use client"

import { useState } from "react"
import { Search } from "lucide-react"

import { Input } from "@/components/ui/input"
import {
  WidgetTable,
  type WidgetTableSort,
} from "@/registry/widget-table/widget-table"

import { demoOrderColumns, demoOrderRows, type OrderRow } from "@/app/demo/data"

const PAGE_SIZE_OPTIONS = [3, 6, 9] as const
const DEFAULT_PAGE_SIZE = 3

function parseTotal(total: string) {
  return Number(total.replace(/\D/g, ""))
}

function sortOrderRows(
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
    return (Number(a.number) - Number(b.number)) * direction
  })
}

export function DemoStandaloneTable() {
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState<WidgetTableSort | undefined>(undefined)

  const query = search.trim().toLowerCase()
  const filtered = demoOrderRows.filter(
    (row) =>
      query === "" ||
      row.number.includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query)
  )
  const matched = sortOrderRows(filtered, sort)

  const lastPage = Math.max(1, Math.ceil(matched.length / pageSize))
  const currentPage = Math.min(page, lastPage)

  return (
    <WidgetTable
      title="Recent orders"
      columns={demoOrderColumns}
      rows={matched.slice((currentPage - 1) * pageSize, currentPage * pageSize)}
      getRowKey={(row) => row.number}
      toolbar={
        <div className="relative">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value)
              setPage(1)
            }}
            placeholder="Search orders"
            aria-label="Search orders"
            className="w-56 pl-8"
          />
        </div>
      }
      sort={sort}
      onSortChange={(nextSort) => {
        setSort(nextSort)
        setPage(1)
      }}
      pagination={{
        page: currentPage,
        pageSize,
        total: matched.length,
        onPageChange: setPage,
        pageSizeOptions: PAGE_SIZE_OPTIONS,
        onPageSizeChange: (nextPageSize) => {
          setPageSize(nextPageSize)
          setPage(1)
        },
      }}
    />
  )
}
