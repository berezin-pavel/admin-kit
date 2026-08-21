import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import type { Key } from "react"
import { Download, Trash2 } from "lucide-react"
import { describe, expect, it, vi } from "vitest"

import {
  WidgetTable,
  formatPaginationRange,
  toCsv,
  widgetTableLabelDefaults,
  type WidgetTableColumn,
  type WidgetTablePagination,
  type WidgetTableSelectionAction,
} from "./widget-table"

interface OrderRow {
  number: string
  customer: string
}

const rows: readonly OrderRow[] = [
  { number: "1", customer: "Anna" },
  { number: "2", customer: "Bennett" },
]

const columns: readonly WidgetTableColumn<OrderRow>[] = [
  { id: "number", title: "Number", cell: (row) => row.number },
  { id: "customer", title: "Customer", cell: (row) => row.customer },
  {
    id: "actions",
    title: "",
    cell: () => "actions",
  },
]

function SelectableTable({
  totalCount,
  onSelectAllMatching,
  selectionActions,
}: {
  totalCount?: number
  onSelectAllMatching?: () => void
  selectionActions?: readonly WidgetTableSelectionAction[]
}) {
  const [selectedKeys, setSelectedKeys] = useState<ReadonlySet<Key>>(new Set())

  return (
    <WidgetTable
      title="Orders"
      columns={columns}
      rows={rows}
      getRowKey={(row) => row.number}
      selectedKeys={selectedKeys}
      onSelectionChange={setSelectedKeys}
      totalCount={totalCount}
      onSelectAllMatching={onSelectAllMatching}
      selectionActions={selectionActions}
    />
  )
}

describe("widget table selection bar", () => {
  it("offers to select every matching record once the page is fully selected", async () => {
    const user = userEvent.setup()
    render(
      <SelectableTable totalCount={50} onSelectAllMatching={() => {}} />
    )

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))

    expect(
      screen.getByRole("button", { name: "Select all 50" })
    ).toBeInTheDocument()
  })

  it("does not offer to select matching records when there is nothing beyond the page", async () => {
    const user = userEvent.setup()
    render(<SelectableTable totalCount={2} onSelectAllMatching={() => {}} />)

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))

    expect(
      screen.queryByRole("button", { name: /select all \d/i })
    ).not.toBeInTheDocument()
  })

  it("does not offer to select matching records without onSelectAllMatching", async () => {
    const user = userEvent.setup()
    render(<SelectableTable totalCount={50} />)

    await user.click(screen.getByRole("checkbox", { name: /select all/i }))

    expect(
      screen.queryByRole("button", { name: /select all \d/i })
    ).not.toBeInTheDocument()
  })

  it("renders an icon action as an icon-only button with an accessible name", async () => {
    const user = userEvent.setup()
    const actions: readonly WidgetTableSelectionAction[] = [
      { id: "delete", label: "Delete", icon: Trash2, onSelect: () => {} },
    ]
    render(<SelectableTable selectionActions={actions} />)

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0])

    const button = screen.getByRole("button", { name: "Delete" })
    expect(button).toBeInTheDocument()
    expect(button).not.toHaveTextContent("Delete")
  })

  it("keeps the text label for an action without an icon", async () => {
    const user = userEvent.setup()
    const actions: readonly WidgetTableSelectionAction[] = [
      { id: "delete", label: "Delete", onSelect: () => {} },
    ]
    render(<SelectableTable selectionActions={actions} />)

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0])

    expect(screen.getByRole("button", { name: "Delete" })).toHaveTextContent(
      "Delete"
    )
  })
})

describe("widget table columns menu", () => {
  const menuColumns: readonly WidgetTableColumn<OrderRow>[] = [
    {
      id: "number",
      title: "Number",
      alwaysVisible: true,
      cell: (row) => row.number,
    },
    { id: "customer", title: "Customer", cell: (row) => row.customer },
    { id: "actions", title: "", cell: () => "actions" },
  ]

  it("lists columns and excludes empty-title ones", async () => {
    const user = userEvent.setup()
    render(
      <WidgetTable
        title="Orders"
        columns={menuColumns}
        rows={rows}
        hiddenColumnIds={[]}
        onHiddenColumnIdsChange={() => {}}
      />
    )

    await user.click(screen.getByRole("button", { name: "Columns" }))

    expect(
      await screen.findByRole("menuitemcheckbox", { name: "Number" })
    ).toHaveAttribute("aria-disabled", "true")
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Customer" })
    ).not.toHaveAttribute("aria-disabled")
    expect(
      screen.queryByRole("menuitemcheckbox", { name: "" })
    ).not.toBeInTheDocument()
  })
})

describe("widget table sticky header", () => {
  it("gets a focusable, labelled scroll region even without an explicit maxBodyHeight", () => {
    render(
      <WidgetTable title="Orders" columns={columns} rows={rows} stickyHeader />
    )

    expect(screen.getByRole("region", { name: "Orders" })).toBeInTheDocument()
  })

  it("falls back to the region label default when there is no title", () => {
    render(<WidgetTable columns={columns} rows={rows} stickyHeader />)

    expect(
      screen.getByRole("region", { name: widgetTableLabelDefaults.region })
    ).toBeInTheDocument()
  })

  it("honors a custom region label", () => {
    render(
      <WidgetTable
        columns={columns}
        rows={rows}
        stickyHeader
        labels={{ region: "Custom region" }}
      />
    )

    expect(
      screen.getByRole("region", { name: "Custom region" })
    ).toBeInTheDocument()
  })
})

describe("widget table grow column", () => {
  const growColumns: readonly WidgetTableColumn<OrderRow>[] = [
    { id: "number", title: "Number", cell: (row) => row.number },
    { id: "customer", title: "Customer", grow: true, cell: (row) => row.customer },
  ]

  it("gives the grow column's header the full-width class", () => {
    render(<WidgetTable columns={growColumns} rows={rows} />)

    expect(screen.getByRole("columnheader", { name: "Customer" })).toHaveClass(
      "w-full"
    )
    expect(
      screen.getByRole("columnheader", { name: "Number" })
    ).not.toHaveClass("w-full")
  })

  it("gives the grow column's cells the full-width, wrapping classes", () => {
    render(<WidgetTable columns={growColumns} rows={rows} />)

    expect(screen.getByRole("cell", { name: "Anna" })).toHaveClass(
      "w-full",
      "whitespace-normal"
    )
    expect(screen.getByRole("cell", { name: "1" })).not.toHaveClass("w-full")
    expect(screen.getByRole("cell", { name: "1" })).not.toHaveClass(
      "whitespace-normal"
    )
  })

  it("gives the grow column's skeleton header the full-width class while loading", () => {
    const { container } = render(
      <WidgetTable columns={growColumns} rows={rows} loading />
    )

    const headers = container.querySelectorAll('[data-slot="table-head"]')
    expect(headers[1]).toHaveClass("w-full")
    expect(headers[0]).not.toHaveClass("w-full")
  })
})

describe("widget table fill layout", () => {
  it("scrolls internally without an inline maxHeight when fill", () => {
    const { container } = render(
      <WidgetTable title="Orders" columns={columns} rows={rows} fill />
    )

    const region = screen.getByRole("region", { name: "Orders" })
    expect(region).toHaveClass("min-h-0", "flex-1", "overflow-auto")
    expect(region.style.maxHeight).toBe("")
    expect(container.querySelector('[data-slot="card"]')).toHaveClass(
      "flex",
      "min-h-0",
      "flex-1",
      "flex-col"
    )
  })
})

describe("toCsv formula injection", () => {
  const injectionColumns: readonly WidgetTableColumn<{ value: string }>[] = [
    { id: "value", title: "Value", cell: (row) => row.value },
  ]

  it.each(["=SUM(A1)", "+1+1", "-1+1", "@SUM(A1)"])(
    "prefixes a %s cell with a single quote",
    (value) => {
      const csv = toCsv(injectionColumns, [{ value }])
      const dataLine = csv.split("\r\n")[1]

      expect(dataLine).toBe(`'${value}`)
    }
  )

  it("prefixes a plain negative number too, as the price of the guard", () => {
    const csv = toCsv(injectionColumns, [{ value: "-5" }])
    const dataLine = csv.split("\r\n")[1]

    expect(dataLine).toBe("'-5")
  })

  it("leaves an ordinary value untouched", () => {
    const csv = toCsv(injectionColumns, [{ value: "Bennett" }])
    const dataLine = csv.split("\r\n")[1]

    expect(dataLine).toBe("Bennett")
  })
})

describe("formatPaginationRange", () => {
  it("clamps the start of the range to the end when the last page is short", () => {
    const pagination: WidgetTablePagination = {
      page: 3,
      pageSize: 10,
      total: 15,
    }

    expect(
      formatPaginationRange(pagination, widgetTableLabelDefaults.range)
    ).toBe("15–15 of 15")
  })

  it("keeps a normal middle-page range untouched", () => {
    const pagination: WidgetTablePagination = {
      page: 2,
      pageSize: 10,
      total: 35,
    }

    expect(
      formatPaginationRange(pagination, widgetTableLabelDefaults.range)
    ).toBe("11–20 of 35")
  })
})

describe("widget table row activation", () => {
  it("calls onRowActivate with the row and index when a cell is clicked", async () => {
    const user = userEvent.setup()
    const onRowActivate = vi.fn()
    render(
      <WidgetTable
        title="Orders"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.number}
        onRowActivate={onRowActivate}
      />
    )

    await user.click(screen.getByRole("cell", { name: "Bennett" }))

    expect(onRowActivate).toHaveBeenCalledTimes(1)
    expect(onRowActivate).toHaveBeenCalledWith(rows[1], 1)
  })

  it("does not activate the row when the click lands on an interactive element inside a cell", async () => {
    const user = userEvent.setup()
    const onRowActivate = vi.fn()
    const actionColumns: readonly WidgetTableColumn<OrderRow>[] = [
      { id: "number", title: "Number", cell: (row) => row.number },
      {
        id: "actions",
        title: "",
        cell: () => <button type="button">Delete</button>,
      },
    ]
    render(
      <WidgetTable
        title="Orders"
        columns={actionColumns}
        rows={rows}
        getRowKey={(row) => row.number}
        onRowActivate={onRowActivate}
      />
    )

    await user.click(screen.getAllByRole("button", { name: "Delete" })[0])

    expect(onRowActivate).not.toHaveBeenCalled()
  })

  it("activates the focused row on Enter", async () => {
    const user = userEvent.setup()
    const onRowActivate = vi.fn()
    render(
      <WidgetTable
        title="Orders"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.number}
        onRowActivate={onRowActivate}
      />
    )

    const row = screen.getByRole("cell", { name: "Anna" }).closest("tr")
    row?.focus()
    await user.keyboard("{Enter}")

    expect(onRowActivate).toHaveBeenCalledTimes(1)
    expect(onRowActivate).toHaveBeenCalledWith(rows[0], 0)
  })

  it("leaves rows without a tabindex when onRowActivate is not given", () => {
    render(
      <WidgetTable
        title="Orders"
        columns={columns}
        rows={rows}
        getRowKey={(row) => row.number}
      />
    )

    const row = screen.getByRole("cell", { name: "Anna" }).closest("tr")
    expect(row).not.toHaveAttribute("tabindex")
  })
})

describe("widget table export button removal", () => {
  it("no longer renders a header export button", () => {
    render(<WidgetTable title="Orders" columns={columns} rows={rows} />)

    expect(
      screen.queryByRole("button", { name: /export/i })
    ).not.toBeInTheDocument()
  })

  it("still exposes a working export action through selectionActions", async () => {
    const user = userEvent.setup()
    let exported: readonly OrderRow[] | undefined
    const actions: readonly WidgetTableSelectionAction[] = [
      {
        id: "export",
        label: "Export",
        icon: Download,
        onSelect: () => {
          exported = rows
        },
      },
    ]
    render(<SelectableTable selectionActions={actions} />)

    await user.click(screen.getAllByRole("checkbox", { name: "Select row" })[0])
    await user.click(screen.getByRole("button", { name: "Export" }))

    expect(exported).toEqual(rows)
  })
})
