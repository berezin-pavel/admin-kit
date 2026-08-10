"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"
import { StatusBadge } from "@/registry/status-badge/status-badge"
import type {
  WidgetTableColumn,
  WidgetTableSort,
} from "@/registry/widget-table/widget-table"

import {
  demoOrderRows,
  orderStatusLabel,
  orderStatusTone,
  type OrderRow,
} from "@/app/demo/data"

const statusOptions = [
  { value: "all", label: "All statuses" },
  { value: "delivered", label: orderStatusLabel.delivered },
  { value: "in-transit", label: orderStatusLabel["in-transit"] },
  { value: "paid", label: orderStatusLabel.paid },
  { value: "cancelled", label: orderStatusLabel.cancelled },
]

const PAGE_SIZE_OPTIONS = [4, 8, 12] as const
const DEFAULT_PAGE_SIZE = 4

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

export function DemoOrders() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState<WidgetTableSort | undefined>(undefined)
  const [rows, setRows] = useState<readonly OrderRow[]>(demoOrderRows)
  const [pendingOrder, setPendingOrder] = useState<OrderRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  const query = search.trim().toLowerCase()

  const filtered = rows.filter((row) => {
    const byStatus = status === "all" || row.status === status
    const byQuery =
      query === "" ||
      row.number.includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query)

    return byStatus && byQuery
  })

  const matched = sortOrderRows(filtered, sort)

  const lastPage = Math.max(1, Math.ceil(matched.length / pageSize))
  const currentPage = Math.min(page, lastPage)

  const columns: readonly WidgetTableColumn<OrderRow>[] = [
    {
      id: "number",
      title: "Number",
      sortable: true,
      cell: (row) => (
        <Link href="/demo/order" className="font-medium hover:underline">
          #{row.number}
        </Link>
      ),
    },
    { id: "customer", title: "Customer", cell: (row) => row.customer },
    { id: "product", title: "Product", cell: (row) => row.product },
    {
      id: "status",
      title: "Status",
      cell: (row) => (
        <StatusBadge tone={orderStatusTone[row.status]}>
          {orderStatusLabel[row.status]}
        </StatusBadge>
      ),
    },
    {
      id: "total",
      title: "Total",
      align: "right",
      sortable: true,
      cell: (row) => row.total,
    },
    {
      id: "actions",
      title: "",
      align: "right",
      cell: (row) => (
        <Button variant="ghost" size="sm" onClick={() => setPendingOrder(row)}>
          Delete
        </Button>
      ),
    },
  ]

  const filters: readonly PageListFilter[] = [
    { id: "search", label: "Search", kind: "search", value: search },
    {
      id: "status",
      label: "Status",
      kind: "select",
      value: status,
      options: statusOptions,
    },
  ]

  const removePendingOrder = () => {
    if (!pendingOrder) {
      return
    }

    setDeleting(true)

    window.setTimeout(() => {
      setRows((previous) =>
        previous.filter((row) => row.number !== pendingOrder.number)
      )
      setDeleting(false)
      setPendingOrder(null)
      notify.success("Order deleted", {
        description: `Order #${pendingOrder.number} removed from the list`,
      })
    }, 700)
  }

  return (
    <>
      <PageList
        title="Orders"
        description="All store orders from the last 30 days"
        actions={
          <Button
            size="sm"
            onClick={() =>
              notify.info("Export started", {
                description: "The file will arrive by email in a couple of minutes",
              })
            }
          >
            Export to CSV
          </Button>
        }
        filters={filters}
        onFilterChange={(id, value) => {
          if (id === "search") {
            setSearch(value)
          } else {
            setStatus(value)
          }

          setPage(1)
        }}
        columns={columns}
        rows={matched.slice(
          (currentPage - 1) * pageSize,
          currentPage * pageSize
        )}
        getRowKey={(row) => row.number}
        page={currentPage}
        pageSize={pageSize}
        total={matched.length}
        onPageChange={setPage}
        pageSizeOptions={PAGE_SIZE_OPTIONS}
        onPageSizeChange={(nextPageSize) => {
          setPageSize(nextPageSize)
          setPage(1)
        }}
        sort={sort}
        onSortChange={(nextSort) => {
          setSort(nextSort)
          setPage(1)
        }}
      />
      <ConfirmDialog
        open={pendingOrder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingOrder(null)
          }
        }}
        title="Delete order?"
        description={
          pendingOrder
            ? `Order #${pendingOrder.number} from ${pendingOrder.customer} will be deleted with no way to restore it.`
            : undefined
        }
        confirmLabel="Delete"
        tone="danger"
        loading={deleting}
        onConfirm={removePendingOrder}
      />
    </>
  )
}
