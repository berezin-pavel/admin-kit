import { Button } from "@/components/ui/button"
import { PageList, type PageListFilter } from "@/registry/page-list/page-list"
import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"

import type { ShowcaseEntry } from "./types"

interface UserRow {
  id: string
  name: string
  email: string
  role: string
}

const userColumns: readonly WidgetTableColumn<UserRow>[] = [
  { id: "name", title: "Name", cell: (row) => row.name },
  { id: "email", title: "Email", cell: (row) => row.email },
  { id: "role", title: "Role", cell: (row) => row.role },
]

const userRows: readonly UserRow[] = [
  { id: "1", name: "Anna Bennett", email: "anna@example.com", role: "Admin" },
  {
    id: "2",
    name: "Sergey Peters",
    email: "sergey@example.com",
    role: "Editor",
  },
  {
    id: "3",
    name: "Maria Sanders",
    email: "maria@example.com",
    role: "Viewer",
  },
  {
    id: "4",
    name: "Oleg Cooper",
    email: "oleg@example.com",
    role: "Editor",
  },
  {
    id: "5",
    name: "Daria Smith",
    email: "darya@example.com",
    role: "Viewer",
  },
]

const roleFilterOptions = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
] as const

const userFilters: readonly PageListFilter[] = [
  { id: "search", label: "Search", kind: "search", value: "" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "all",
    options: roleFilterOptions,
  },
]

const emptySearchFilters: readonly PageListFilter[] = [
  { id: "search", label: "Search", kind: "search", value: "zzz" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "all",
    options: roleFilterOptions,
  },
]

export const pageListEntry: ShowcaseEntry = {
  item: "page-list",
  title: "List page",
  description:
    "A list page: a section title, a filter row, a table, and pagination below it. Every value is controlled by props — the page keeps no state of its own for the current page number or filter values; changes go out through the onFilterChange and onPageChange callbacks. The status prop selects the content: the title and filters stay in place, only the list body changes. Pagination is drawn only when total is passed — there's no honest way to build it without the total record count.",
  views: [
    {
      id: "with-filters-and-pagination",
      name: "List with filters and pagination",
      render: () => (
        <PageList
          title="Users"
          description="Project members and their roles"
          actions={<Button size="sm">Invite</Button>}
          filters={userFilters}
          columns={userColumns}
          rows={userRows}
          getRowKey={(row) => row.id}
          page={3}
          pageSize={10}
          total={42}
        />
      ),
    },
    {
      id: "empty-search",
      name: "Empty search result",
      render: () => (
        <PageList
          title="Users"
          filters={emptySearchFilters}
          columns={userColumns}
          rows={[]}
        />
      ),
    },
    {
      id: "loading",
      name: "Loading state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="loading"
        />
      ),
    },
    {
      id: "error",
      name: "Error state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="error"
        />
      ),
    },
    {
      id: "forbidden",
      name: "Forbidden state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="forbidden"
        />
      ),
    },
    {
      id: "offline",
      name: "Offline state",
      render: () => (
        <PageList
          title="Users"
          filters={userFilters}
          columns={userColumns}
          rows={[]}
          status="offline"
        />
      ),
    },
  ],
}
