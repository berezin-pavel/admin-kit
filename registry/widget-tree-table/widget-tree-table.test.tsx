import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it } from "vitest"

import {
  WidgetTreeTable,
  type TreeTableColumn,
  type TreeTableSection,
  type WidgetTreeTableProps,
} from "./widget-tree-table"

interface ProductRow {
  sku: string
  name: string
}

const columns: readonly TreeTableColumn<ProductRow>[] = [
  { id: "name", title: "Name", cell: (row) => row.name },
  {
    id: "sku",
    title: "SKU",
    cell: (row) => row.sku,
    sectionCell: (section) => `${section.id}-count`,
  },
]

const sections: readonly TreeTableSection<ProductRow>[] = [
  {
    id: "footwear",
    title: "Footwear",
    rows: [
      { sku: "SN-1", name: "Runner" },
      { sku: "SN-2", name: "Trail" },
    ],
  },
  {
    id: "electronics",
    title: "Electronics",
    rows: [{ sku: "AU-1", name: "Headphones" }],
  },
]

function ControlledTreeTable(
  props: Partial<WidgetTreeTableProps<ProductRow>> & {
    initialExpandedIds?: readonly string[]
  }
) {
  const { initialExpandedIds = [], ...rest } = props
  const [expandedIds, setExpandedIds] = useState<readonly string[]>(
    initialExpandedIds
  )

  return (
    <WidgetTreeTable
      title="Products"
      columns={columns}
      sections={sections}
      getRowKey={(row) => row.sku}
      expandedIds={expandedIds}
      onExpandedChange={setExpandedIds}
      {...rest}
    />
  )
}

describe("widget tree table expansion", () => {
  it("renders no record rows for a collapsed section", () => {
    render(<ControlledTreeTable />)

    expect(screen.queryByText("Runner")).not.toBeInTheDocument()
    expect(screen.queryByText("Headphones")).not.toBeInTheDocument()
  })

  it("renders record rows for an expanded section", () => {
    render(<ControlledTreeTable initialExpandedIds={["footwear"]} />)

    expect(screen.getByText("Runner")).toBeInTheDocument()
    expect(screen.getByText("Trail")).toBeInTheDocument()
    expect(screen.queryByText("Headphones")).not.toBeInTheDocument()
  })

  it("toggles the section on button click and reflects aria-expanded", async () => {
    const user = userEvent.setup()
    render(<ControlledTreeTable />)

    const button = screen.getByRole("button", { name: /footwear/i })
    expect(button).toHaveAttribute("aria-expanded", "false")

    await user.click(button)

    expect(button).toHaveAttribute("aria-expanded", "true")
    expect(screen.getByText("Runner")).toBeInTheDocument()

    await user.click(button)

    expect(button).toHaveAttribute("aria-expanded", "false")
    expect(screen.queryByText("Runner")).not.toBeInTheDocument()
  })

  it("calls onExpandedChange with the toggled list", async () => {
    const user = userEvent.setup()
    let lastChange: readonly string[] | undefined

    function Wrapper() {
      const [expandedIds, setExpandedIds] = useState<readonly string[]>([
        "footwear",
      ])
      return (
        <WidgetTreeTable
          columns={columns}
          sections={sections}
          getRowKey={(row) => row.sku}
          expandedIds={expandedIds}
          onExpandedChange={(ids) => {
            lastChange = ids
            setExpandedIds(ids)
          }}
        />
      )
    }

    render(<Wrapper />)

    await user.click(screen.getByRole("button", { name: /electronics/i }))

    expect(lastChange).toEqual(["footwear", "electronics"])

    await user.click(screen.getByRole("button", { name: /footwear/i }))

    expect(lastChange).toEqual(["electronics"])
  })
})

describe("widget tree table cell content", () => {
  it("shows sectionCell content on the section row and cell content on record rows", () => {
    render(<ControlledTreeTable initialExpandedIds={["footwear"]} />)

    expect(screen.getByText("footwear-count")).toBeInTheDocument()
    expect(screen.getByText("SN-1")).toBeInTheDocument()
    expect(screen.getByText("SN-2")).toBeInTheDocument()
  })
})

describe("widget tree table actions column", () => {
  it("has no actions header without rowActions or sectionActions", () => {
    render(<ControlledTreeTable />)

    expect(
      screen.queryByRole("columnheader", { name: "Actions" })
    ).not.toBeInTheDocument()
  })

  it("adds a sr-only Actions header when rowActions is given", () => {
    render(<ControlledTreeTable rowActions={() => <button>Edit</button>} />)

    expect(
      screen.getByRole("columnheader", { name: "Actions" })
    ).toBeInTheDocument()
  })

  it("adds a sr-only Actions header when sectionActions is given", () => {
    render(
      <ControlledTreeTable sectionActions={() => <button>Edit</button>} />
    )

    expect(
      screen.getByRole("columnheader", { name: "Actions" })
    ).toBeInTheDocument()
  })

  it("renders rowActions for a row and sectionActions for a section", () => {
    render(
      <ControlledTreeTable
        initialExpandedIds={["footwear"]}
        rowActions={(row) => <button>Edit {row.name}</button>}
        sectionActions={(section) => <button>Manage {section.title}</button>}
      />
    )

    expect(
      screen.getByRole("button", { name: "Manage Footwear" })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Edit Runner" })
    ).toBeInTheDocument()
  })
})

describe("widget tree table loading", () => {
  it("keeps the title, renders skeletons and no interactive button", () => {
    const { container } = render(<ControlledTreeTable loading />)

    expect(screen.getByText("Products")).toBeInTheDocument()
    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0)
    expect(screen.queryByRole("button")).not.toBeInTheDocument()
  })
})

describe("widget tree table empty state", () => {
  it("shows the default empty title when there are no sections", () => {
    render(
      <ControlledTreeTable sections={[]} />
    )

    expect(screen.getByText("No data")).toBeInTheDocument()
  })

  it("honors a custom emptyTitle label", () => {
    render(
      <ControlledTreeTable sections={[]} labels={{ emptyTitle: "Nothing yet" }} />
    )

    expect(screen.getByText("Nothing yet")).toBeInTheDocument()
    expect(screen.queryByText("No data")).not.toBeInTheDocument()
  })
})

describe("widget tree table header cells", () => {
  it("renders one column header per column plus the actions header", () => {
    render(<ControlledTreeTable rowActions={() => <button>Edit</button>} />)

    const headerRow = screen.getAllByRole("row")[0]
    expect(within(headerRow).getByText("Name")).toBeInTheDocument()
    expect(within(headerRow).getByText("SKU")).toBeInTheDocument()
  })
})
