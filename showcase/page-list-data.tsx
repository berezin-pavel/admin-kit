import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"

export interface UserRow {
  id: string
  name: string
  email: string
  role: string
}

export const userColumns: readonly WidgetTableColumn<UserRow>[] = [
  { id: "name", title: "Name", alwaysVisible: true, cell: (row) => row.name },
  { id: "email", title: "Email", cell: (row) => row.email },
  { id: "role", title: "Role", cell: (row) => row.role },
]

export const userRows: readonly UserRow[] = [
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

export const roleFilterOptions = [
  { value: "all", label: "All roles" },
  { value: "admin", label: "Admin" },
  { value: "editor", label: "Editor" },
  { value: "viewer", label: "Viewer" },
] as const
