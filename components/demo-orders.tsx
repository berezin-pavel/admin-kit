"use client"

import { useMemo, useState } from "react"
import type { Key } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Download, Eye, Pencil, RotateCw, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { parseDateRangeValue } from "@/registry/date-range-field/date-range-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import {
  PageList,
  type PageListFilter,
  type PageStatus,
} from "@/registry/page-list/page-list"
import { RowActions } from "@/registry/row-actions/row-actions"
import { StatusBadge } from "@/registry/status-badge/status-badge"
import type {
  WidgetTableColumn,
  WidgetTableSelectionAction,
  WidgetTableSort,
  WidgetTableSortOption,
} from "@/registry/widget-table/widget-table"

import {
  getDemoOrderRows,
  orderStatusLabelByLocale,
  orderStatusTone,
  type OrderRow,
} from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const PAGE_SIZE_OPTIONS = [4, 8, 12] as const
const DEFAULT_PAGE_SIZE = 4
const RELOAD_DELAY_MS = 1200

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
    if (sort.columnId === "createdAt") {
      return (a.createdAt.getTime() - b.createdAt.getTime()) * direction
    }
    return (Number(a.number) - Number(b.number)) * direction
  })
}

export function DemoOrders() {
  const router = useRouter()
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].orders
  const statusLabel = orderStatusLabelByLocale[locale]

  const [search, setSearch] = useState("")
  const [status, setStatus] = useState("all")
  const [dateRange, setDateRange] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE)
  const [sort, setSort] = useState<WidgetTableSort | undefined>(undefined)
  const [deletedNumbers, setDeletedNumbers] = useState<ReadonlySet<string>>(
    new Set()
  )
  const [pendingOrder, setPendingOrder] = useState<OrderRow | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(
    new Set()
  )
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false)
  const [bulkDeleting, setBulkDeleting] = useState(false)
  const [pageStatus, setPageStatus] = useState<PageStatus>("ready")

  const rows = useMemo(
    () =>
      getDemoOrderRows(locale).filter((row) => !deletedNumbers.has(row.number)),
    [locale, deletedNumbers]
  )

  const statusOptions = [
    { value: "all", label: strings.statusAll },
    { value: "delivered", label: statusLabel.delivered },
    { value: "in-transit", label: statusLabel["in-transit"] },
    { value: "paid", label: statusLabel.paid },
    { value: "cancelled", label: statusLabel.cancelled },
  ]

  const sortOptions: readonly WidgetTableSortOption[] = [
    { label: strings.sortNumberDesc, sort: { columnId: "number", direction: "desc" } },
    { label: strings.sortNumberAsc, sort: { columnId: "number", direction: "asc" } },
    { label: strings.sortTotalDesc, sort: { columnId: "total", direction: "desc" } },
    { label: strings.sortTotalAsc, sort: { columnId: "total", direction: "asc" } },
    {
      label: strings.sortNewestFirst,
      sort: { columnId: "createdAt", direction: "desc" },
    },
    {
      label: strings.sortOldestFirst,
      sort: { columnId: "createdAt", direction: "asc" },
    },
  ]

  const query = search.trim().toLowerCase()
  const createdAtRange = parseDateRangeValue(dateRange)

  const filtered = rows.filter((row) => {
    const byStatus = status === "all" || row.status === status
    const byQuery =
      query === "" ||
      row.number.includes(query) ||
      row.customer.toLowerCase().includes(query) ||
      row.product.toLowerCase().includes(query)
    const byDateRange =
      !createdAtRange ||
      (row.createdAt.getTime() >= createdAtRange.from.getTime() &&
        row.createdAt.getTime() <= createdAtRange.to.getTime())

    return byStatus && byQuery && byDateRange
  })

  const matched = sortOrderRows(filtered, sort)

  const lastPage = Math.max(1, Math.ceil(matched.length / pageSize))
  const currentPage = Math.min(page, lastPage)

  const columns: readonly WidgetTableColumn<OrderRow>[] = [
    {
      id: "number",
      title: strings.columnNumber,
      sortable: true,
      cell: (row) => (
        <Link href="/demo/order" className="font-medium hover:underline">
          #{row.number}
        </Link>
      ),
    },
    { id: "customer", title: strings.columnCustomer, cell: (row) => row.customer },
    { id: "product", title: strings.columnProduct, cell: (row) => row.product },
    {
      id: "status",
      title: strings.columnStatus,
      cell: (row) => (
        <StatusBadge tone={orderStatusTone[row.status]}>
          {statusLabel[row.status]}
        </StatusBadge>
      ),
    },
    {
      id: "total",
      title: strings.columnTotal,
      align: "right",
      sortable: true,
      cell: (row) => row.total,
    },
    {
      id: "actions",
      title: "",
      align: "right",
      cell: (row) => (
        <RowActions
          actions={[
            {
              id: "view",
              label: strings.viewOrderAction,
              icon: Eye,
              onSelect: () => router.push("/demo/order"),
            },
            {
              id: "edit",
              label: strings.editOrderAction,
              icon: Pencil,
              onSelect: () => router.push("/demo/order/edit"),
            },
            {
              id: "delete",
              label: strings.deleteOrderAction,
              icon: Trash2,
              tone: "danger",
              onSelect: () => setPendingOrder(row),
            },
          ]}
        />
      ),
    },
  ]

  const filters: readonly PageListFilter[] = [
    { id: "search", label: strings.searchFilterLabel, kind: "search", value: search },
    {
      id: "status",
      label: strings.statusFilterLabel,
      kind: "select",
      value: status,
      options: statusOptions,
    },
    {
      id: "createdAt",
      label: strings.dateRangeFilterLabel,
      kind: "date-range",
      value: dateRange,
      dateRange:
        locale === "ru"
          ? {
              locale: localeRu.dateRangeField.locale,
              displayFormat: localeRu.dateRangeField.displayFormat,
              presets: localeRu.dateRangeField.presets,
            }
          : undefined,
    },
  ]

  const removePendingOrder = () => {
    if (!pendingOrder) {
      return
    }

    setDeleting(true)

    window.setTimeout(() => {
      setDeletedNumbers(
        (previous) => new Set([...previous, pendingOrder.number])
      )
      setDeleting(false)
      setPendingOrder(null)
      notify.success(strings.deleteToastTitle, {
        description: strings.deleteToastDescription(pendingOrder.number),
      })
    }, 700)
  }

  const removeSelectedOrders = () => {
    setBulkDeleting(true)

    window.setTimeout(() => {
      const count = selectedKeys.size

      setDeletedNumbers(
        (previous) => new Set([...previous, ...selectedKeys].map(String))
      )
      setSelectedKeys(new Set())
      setBulkDeleting(false)
      setBulkDeleteOpen(false)
      notify.success(strings.selectionDeleteToastTitle, {
        description: strings.selectionDeleteToastDescription(count),
      })
    }, 700)
  }

  const reload = () => {
    setPageStatus("loading")
    window.setTimeout(() => setPageStatus("ready"), RELOAD_DELAY_MS)
  }

  const selectionActions: readonly WidgetTableSelectionAction[] = [
    {
      id: "export",
      label: strings.selectionExportAction,
      icon: Download,
      onSelect: () =>
        notify.info(strings.selectionExportToastTitle(selectedKeys.size)),
    },
    {
      id: "delete",
      label: strings.selectionDeleteAction,
      icon: Trash2,
      tone: "danger",
      onSelect: () => setBulkDeleteOpen(true),
    },
  ]

  return (
    <>
      <PageList
        title={strings.title}
        description={strings.description}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={reload}
              disabled={pageStatus === "loading"}
            >
              <RotateCw
                className={cn(
                  "size-4",
                  pageStatus === "loading" && "animate-spin"
                )}
              />
              {strings.reloadButton}
            </Button>
            <Button
              size="sm"
              onClick={() =>
                notify.info(strings.exportToastTitle, {
                  description: strings.exportToastDescription,
                })
              }
            >
              {strings.exportButton}
            </Button>
          </>
        }
        filters={filters}
        onFilterChange={(id, value) => {
          if (id === "search") {
            setSearch(value)
          } else if (id === "status") {
            setStatus(value)
          } else {
            setDateRange(value)
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
        tableLabels={locale === "ru" ? localeRu.widgetTable : undefined}
        sortOptions={sortOptions}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectionActions={selectionActions}
        status={pageStatus}
      />
      <ConfirmDialog
        open={bulkDeleteOpen}
        onOpenChange={(open) => {
          if (!open) {
            setBulkDeleteOpen(false)
          }
        }}
        title={strings.selectionDeleteConfirmTitle}
        description={strings.selectionDeleteConfirmDescription(
          selectedKeys.size
        )}
        confirmLabel={strings.selectionDeleteConfirmLabel}
        cancelLabel={locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined}
        tone="danger"
        loading={bulkDeleting}
        onConfirm={removeSelectedOrders}
      />
      <ConfirmDialog
        open={pendingOrder !== null}
        onOpenChange={(open) => {
          if (!open) {
            setPendingOrder(null)
          }
        }}
        title={strings.deleteConfirmTitle}
        description={
          pendingOrder
            ? strings.deleteConfirmDescription(pendingOrder.number, pendingOrder.customer)
            : undefined
        }
        confirmLabel={strings.deleteConfirmLabel}
        cancelLabel={locale === "ru" ? localeRu.confirmDialog.cancelLabel : undefined}
        tone="danger"
        loading={deleting}
        onConfirm={removePendingOrder}
      />
    </>
  )
}
