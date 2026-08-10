"use client"

import { useState } from "react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"
import { StatusBadge } from "@/registry/status-badge/status-badge"
import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"

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

const PAGE_SIZE = 4

export function DemoOrders() {
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [rows, setRows] = useState<readonly OrderRow[]>(demoOrderRows)
  const [pendingOrder, setPendingOrder] = useState<OrderRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  const query = search.trim().toLowerCase()

  const matched = rows.filter((row) => {
    const byStatus = status === "all" || row.status === status
    const byQuery =
      query === "" ||
      row.number.includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query)

    return byStatus && byQuery
  })

  const lastPage = Math.max(1, Math.ceil(matched.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)

  const columns: readonly WidgetTableColumn<OrderRow>[] = [
    {
      id: "number",
      title: "Number",
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
    { id: "total", title: "Total", align: "right", cell: (row) => row.total },
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
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        )}
        getRowKey={(row) => row.number}
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={matched.length}
        onPageChange={setPage}
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
