import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import type { Key } from "react"
import { Download, Trash2 } from "lucide-react"
import { describe, expect, it } from "vitest"

import {
  WidgetTable,
  type WidgetTableColumn,
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
})

describe("widget table export button removal", () => {
  it("no longer renders a header export button", () => {
    render(
      <WidgetTable
        title="Orders"
        columns={columns}
        rows={rows}
        onExport={() => {}}
      />
    )

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
