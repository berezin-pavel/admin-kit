import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageList, type PageListFilter } from "./page-list"

interface OrderRow {
  number: string
  customer: string
}

const rows: readonly OrderRow[] = [{ number: "1", customer: "Anna" }]

const columns = [
  { id: "number", title: "Number", cell: (row: OrderRow) => row.number },
  { id: "customer", title: "Customer", cell: (row: OrderRow) => row.customer },
]

const filters: readonly PageListFilter[] = [
  { id: "search", label: "Search", kind: "search", value: "" },
]

describe("page list fill layout", () => {
  it("stretches the root to the full height of its container when fill", () => {
    const { container } = render(
      <PageList title="Orders" columns={columns} rows={rows} fill />
    )

    expect(container.firstElementChild).toHaveClass("h-full", "min-h-0")
  })

  it("does not stretch the root by default", () => {
    const { container } = render(
      <PageList title="Orders" columns={columns} rows={rows} />
    )

    expect(container.firstElementChild).not.toHaveClass("h-full")
  })

  it("forwards fill to the table so it scrolls internally", () => {
    render(
      <PageList
        header={false}
        title="Orders"
        columns={columns}
        rows={rows}
        fill
      />
    )

    expect(screen.getByRole("region", { name: "Orders" })).toBeInTheDocument()
  })
})

describe("page list toolbar", () => {
  it("renders a custom toolbar node next to the filters", () => {
    render(
      <PageList
        title="Orders"
        filters={filters}
        columns={columns}
        rows={rows}
        toolbar={<button type="button">Export</button>}
      />
    )

    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument()
  })

  it("renders the toolbar alone when there are no filters", () => {
    render(
      <PageList
        title="Orders"
        columns={columns}
        rows={rows}
        toolbar={<button type="button">Export</button>}
      />
    )

    expect(screen.getByRole("button", { name: "Export" })).toBeInTheDocument()
  })
})

describe("page list keepRows", () => {
  it("keeps rendering the rows and shows the offline title when keepRows is set", () => {
    render(
      <PageList
        title="Orders"
        columns={columns}
        rows={rows}
        status="offline"
        keepRows
      />
    )

    expect(screen.getByText("Anna")).toBeInTheDocument()
    expect(screen.getByText("Connection lost")).toBeInTheDocument()
  })

  it("drops the rows on offline without keepRows", () => {
    render(
      <PageList title="Orders" columns={columns} rows={rows} status="offline" />
    )

    expect(screen.queryByText("Anna")).not.toBeInTheDocument()
    expect(screen.getByText("Connection lost")).toBeInTheDocument()
  })
})

describe("page list state actions", () => {
  it("renders a Retry action inside the error state", () => {
    render(
      <PageList
        title="Orders"
        columns={columns}
        rows={rows}
        status="error"
        stateActions={{ error: <button type="button">Retry</button> }}
      />
    )

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })
})

describe("page list reset filters label default", () => {
  it("falls back to the table's clearFiltersLabel when resetFiltersLabel is not given", () => {
    const search: readonly PageListFilter[] = [
      { id: "search", label: "Search", kind: "search", value: "acme" },
    ]

    render(
      <PageList
        title="Orders"
        filters={search}
        columns={columns}
        rows={rows}
        onResetFilters={() => {}}
        tableLabels={{ clearFiltersLabel: "Clear" }}
      />
    )

    expect(screen.getByRole("button", { name: "Clear" })).toBeInTheDocument()
  })
})
