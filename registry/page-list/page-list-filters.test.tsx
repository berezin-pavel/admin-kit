import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { PageListFilters } from "./page-list-filters"
import type { PageListFilter } from "./page-list"

const baseFilters: readonly PageListFilter[] = [
  { id: "search", label: "Filter", kind: "search", value: "" },
  {
    id: "role",
    label: "Role",
    kind: "select",
    value: "",
    options: [
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
    ],
  },
]

describe("page-list-filters reset control", () => {
  it("stays hidden when every filter is empty", () => {
    render(
      <PageListFilters
        filters={baseFilters}
        onResetFilters={() => {}}
        resetFiltersLabel="Reset filters"
      />
    )

    expect(
      screen.queryByRole("button", { name: "Reset filters" })
    ).not.toBeInTheDocument()
  })

  it("stays hidden without onResetFilters even if a filter is set", () => {
    const filters: readonly PageListFilter[] = [
      { id: "search", label: "Filter", kind: "search", value: "acme" },
    ]

    render(<PageListFilters filters={filters} resetFiltersLabel="Reset filters" />)

    expect(
      screen.queryByRole("button", { name: "Reset filters" })
    ).not.toBeInTheDocument()
  })

  it("appears once a filter holds a value and calls onResetFilters when clicked", async () => {
    const user = userEvent.setup()
    const onResetFilters = vi.fn()
    const filters: readonly PageListFilter[] = [
      { id: "search", label: "Filter", kind: "search", value: "acme" },
      baseFilters[1],
    ]

    render(
      <PageListFilters
        filters={filters}
        onResetFilters={onResetFilters}
        resetFiltersLabel="Reset filters"
      />
    )

    const button = screen.getByRole("button", { name: "Reset filters" })
    await user.click(button)

    expect(onResetFilters).toHaveBeenCalledTimes(1)
  })

  it("stays hidden when a select's value matches its defaultValue", () => {
    const filters: readonly PageListFilter[] = [
      {
        id: "status",
        label: "Status",
        kind: "select",
        value: "all",
        defaultValue: "all",
        options: [
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
        ],
      },
    ]

    render(
      <PageListFilters
        filters={filters}
        onResetFilters={() => {}}
        resetFiltersLabel="Reset filters"
      />
    )

    expect(
      screen.queryByRole("button", { name: "Reset filters" })
    ).not.toBeInTheDocument()
  })

  it("shows once a select's value moves away from its defaultValue", () => {
    const filters: readonly PageListFilter[] = [
      {
        id: "status",
        label: "Status",
        kind: "select",
        value: "active",
        defaultValue: "all",
        options: [
          { value: "all", label: "All" },
          { value: "active", label: "Active" },
        ],
      },
    ]

    render(
      <PageListFilters
        filters={filters}
        onResetFilters={() => {}}
        resetFiltersLabel="Reset filters"
      />
    )

    expect(
      screen.getByRole("button", { name: "Reset filters" })
    ).toBeInTheDocument()
  })

  it("shows the unset select as its placeholder, not a stale label", () => {
    const filters: readonly PageListFilter[] = [baseFilters[1]]

    render(
      <PageListFilters
        filters={filters}
        onResetFilters={() => {}}
        resetFiltersLabel="Reset filters"
      />
    )

    expect(screen.getByRole("combobox")).toHaveTextContent("Role")
  })
})
