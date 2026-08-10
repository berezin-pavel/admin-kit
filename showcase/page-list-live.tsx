"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"

import { roleFilterOptions, userColumns, userRows } from "./page-list-data"

const PAGE_SIZE = 3

export function PageListLive() {
  const [search, setSearch] = useState("")
  const [role, setRole] = useState("all")
  const [page, setPage] = useState(1)

  const query = search.trim().toLowerCase()
  const roleLabel = roleFilterOptions.find(
    (option) => option.value === role
  )?.label

  const matched = userRows.filter((row) => {
    const byRole = role === "all" || row.role === roleLabel
    const byQuery =
      query === "" ||
      row.name.toLowerCase().includes(query) ||
      row.email.toLowerCase().includes(query)

    return byRole && byQuery
  })

  const lastPage = Math.max(1, Math.ceil(matched.length / PAGE_SIZE))
  const currentPage = Math.min(page, lastPage)

  const filters: readonly PageListFilter[] = [
    { id: "search", label: "Search", kind: "search", value: search },
    {
      id: "role",
      label: "Role",
      kind: "select",
      value: role,
      options: roleFilterOptions,
    },
  ]

  return (
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
    />
  )
}
