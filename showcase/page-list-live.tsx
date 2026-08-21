"use client"

import { Download } from "lucide-react"
import { useState } from "react"
import type { Key } from "react"

import { Button } from "@/components/ui/button"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"
import {
  toCsv,
  type WidgetTableSelectionAction,
} from "@/registry/widget-table/widget-table"

import { roleFilterOptions, userColumns, userRows } from "./page-list-data"

const PAGE_SIZE = 3

export function PageListLive() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("")
  const [page, setPage] = useState(1)
  const [hiddenColumnIds, setHiddenColumnIds] = useState<readonly string[]>(
    []
  )
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(
    new Set()
  )
  const [csv, setCsv] = useState("")

  const query = search.trim().toLowerCase()
  const roleLabel = roleFilterOptions.find(
    (option) => option.value === role
  )?.label

  const matched = userRows.filter((row) => {
    const byRole = role === "" || row.role === roleLabel
    const byQuery =
      query === "" ||
      row.name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query)

    return byRole && byQuery
  })

  const lastPage = Math.max(1, Math.ceil(matched.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)
  const isFiltered = search.trim() !== "" || role !== ""

  function resetFilters() {
    setSearch("")
    setRole("")
    setPage(1)
  }

  const filters: readonly PageListFilter[] = [
    { id: "search", label: "Filter", kind: "search", value: search },
    {
      id: "role",
      label: "Role",
      kind: "select",
      value: role,
      options: roleFilterOptions,
    },
  ]

  const selectionActions: readonly WidgetTableSelectionAction[] = [
    {
      id: "export",
      label: "Export",
      icon: Download,
      onSelect: () => {
        const selectedRows = matched.filter((row) => selectedKeys.has(row.id))
        setCsv(toCsv(userColumns, selectedRows))
      },
    },
  ]

  return (
    <div className="flex flex-col gap-3">
      <PageList
        title="Users"
        description="Project members and their roles"
        actions={<Button size="sm">Invite</Button>}
        filters={filters}
        onFilterChange={(id, value) => {
          if (id === "search") {
            setSearch(value)
          } else {
            setRole(value)
          }

          setPage(1)
        }}
        columns={userColumns}
        rows={matched.slice(
          (currentPage - 1) * PAGE_SIZE,
          currentPage * PAGE_SIZE
        )}
        getRowKey={(row) => row.id}
        page={currentPage}
        pageSize={PAGE_SIZE}
        total={matched.length}
        onPageChange={setPage}
        filtered={isFiltered}
        onClearFilters={resetFilters}
        onResetFilters={resetFilters}
        hiddenColumnIds={hiddenColumnIds}
        onHiddenColumnIdsChange={setHiddenColumnIds}
        selectedKeys={selectedKeys}
        onSelectionChange={setSelectedKeys}
        selectionActions={selectionActions}
      />
      {csv ? (
        <pre className="overflow-x-auto rounded-lg border border-border bg-muted p-3 text-xs">
          {csv}
        </pre>
      ) : null}
    </div>
  )
}
