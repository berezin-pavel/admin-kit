import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageList } from "./page-list"

interface OrderRow {
  number: string
  customer: string
}

const rows: readonly OrderRow[] = [{ number: "1", customer: "Anna" }]

const columns = [
  { id: "number", title: "Number", cell: (row: OrderRow) => row.number },
  { id: "customer", title: "Customer", cell: (row: OrderRow) => row.customer },
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
