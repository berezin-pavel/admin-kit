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

  it("gives the grow column w-full, defaulting to the first column", () => {
    render(<ControlledTreeTable />)

    const headerRow = screen.getAllByRole("row")[0]
    expect(within(headerRow).getByText("Name").closest("th")).toHaveClass(
      "w-full"
    )
    expect(within(headerRow).getByText("SKU").closest("th")).not.toHaveClass(
      "w-full"
    )
  })

  it("honors an explicit grow column", () => {
    const growColumns: readonly TreeTableColumn<ProductRow>[] = [
      { id: "name", title: "Name", cell: (row) => row.name },
      { id: "sku", title: "SKU", grow: true, cell: (row) => row.sku },
    ]

    render(<ControlledTreeTable columns={growColumns} />)

    const headerRow = screen.getAllByRole("row")[0]
    expect(within(headerRow).getByText("SKU").closest("th")).toHaveClass(
      "w-full"
    )
    expect(within(headerRow).getByText("Name").closest("th")).not.toHaveClass(
      "w-full"
    )
  })
})

describe("widget tree table columns menu", () => {
  const menuColumns: readonly TreeTableColumn<ProductRow>[] = [
    { id: "name", title: "Name", cell: (row) => row.name },
    {
      id: "sku",
      title: "SKU",
      cell: (row) => row.sku,
      sectionCell: (section) => `${section.id}-count`,
    },
    { id: "price", title: "Price", alwaysVisible: true, cell: () => "$10" },
  ]

  it("lists the first column disabled and checked, alongside the rest", async () => {
    const user = userEvent.setup()
    render(
      <ControlledTreeTable
        columns={menuColumns}
        hiddenColumnIds={[]}
        onHiddenColumnIdsChange={() => {}}
      />
    )

    await user.click(screen.getByRole("button", { name: "Columns" }))

    expect(
      await screen.findByRole("menuitemcheckbox", { name: "Name" })
    ).toHaveAttribute("aria-disabled", "true")
    expect(
      screen.getByRole("menuitemcheckbox", { name: "SKU" })
    ).not.toHaveAttribute("aria-disabled")
    expect(
      screen.getByRole("menuitemcheckbox", { name: "Price" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("hides a column from the header, section rows and record rows", async () => {
    const user = userEvent.setup()

    function Wrapper() {
      const [hiddenColumnIds, setHiddenColumnIds] = useState<
        readonly string[]
      >([])
      return (
        <ControlledTreeTable
          columns={menuColumns}
          initialExpandedIds={["footwear"]}
          hiddenColumnIds={hiddenColumnIds}
          onHiddenColumnIdsChange={setHiddenColumnIds}
        />
      )
    }

    render(<Wrapper />)

    expect(screen.getByText("SKU")).toBeInTheDocument()
    expect(screen.getByText("footwear-count")).toBeInTheDocument()
    expect(screen.getByText("SN-1")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Columns" }))
    await user.click(
      await screen.findByRole("menuitemcheckbox", { name: "SKU" })
    )
    await user.keyboard("{Escape}")

    expect(screen.queryByText("SKU")).not.toBeInTheDocument()
    expect(screen.queryByText("footwear-count")).not.toBeInTheDocument()
    expect(screen.queryByText("SN-1")).not.toBeInTheDocument()
  })
})

describe("widget tree table expand and collapse all", () => {
  it("calls onExpandedChange with every section id on expand-all", async () => {
    const user = userEvent.setup()
    let lastChange: readonly string[] | undefined

    render(
      <ControlledTreeTable
        onExpandedChange={(ids) => {
          lastChange = ids
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Expand all" }))

    expect(lastChange).toEqual(["footwear", "electronics"])
  })

  it("calls onExpandedChange with an empty list on collapse-all", async () => {
    const user = userEvent.setup()
    let lastChange: readonly string[] | undefined

    render(
      <ControlledTreeTable
        initialExpandedIds={["footwear", "electronics"]}
        onExpandedChange={(ids) => {
          lastChange = ids
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Collapse all" }))

    expect(lastChange).toEqual([])
  })

  it("doesn't show expand/collapse icons without sections", () => {
    render(<ControlledTreeTable sections={[]} />)

    expect(
      screen.queryByRole("button", { name: "Expand all" })
    ).not.toBeInTheDocument()
  })
})

describe("widget tree table row activation", () => {
  it("wraps the first column's content in a button firing with (row, section)", async () => {
    const user = userEvent.setup()
    let activated: [ProductRow, TreeTableSection<ProductRow>] | undefined

    render(
      <ControlledTreeTable
        initialExpandedIds={["footwear"]}
        onRowActivate={(row, section) => {
          activated = [row, section]
        }}
      />
    )

    const button = screen.getByRole("button", { name: "Runner" })
    await user.click(button)

    expect(activated?.[0]).toEqual({ sku: "SN-1", name: "Runner" })
    expect(activated?.[1].id).toBe("footwear")
  })

  it("renders plain text without onRowActivate", () => {
    render(<ControlledTreeTable initialExpandedIds={["footwear"]} />)

    expect(
      screen.queryByRole("button", { name: "Runner" })
    ).not.toBeInTheDocument()
    expect(screen.getByText("Runner")).toBeInTheDocument()
  })
})

describe("widget tree table show more rows", () => {
  const loadMoreSections: readonly TreeTableSection<ProductRow>[] = [
    {
      id: "footwear",
      title: "Footwear",
      rowCount: 120,
      rows: Array.from({ length: 25 }, (_, index) => ({
        sku: `SN-${index}`,
        name: `Shoe ${index}`,
      })),
    },
  ]

  it("shows a show-more row when rowCount exceeds the loaded rows", () => {
    render(
      <ControlledTreeTable
        sections={loadMoreSections}
        initialExpandedIds={["footwear"]}
        onLoadMoreRows={() => {}}
      />
    )

    expect(
      screen.getByRole("button", { name: "Show 95 more" })
    ).toBeInTheDocument()
  })

  it("calls onLoadMoreRows with the section on click", async () => {
    const user = userEvent.setup()
    let loadedSection: TreeTableSection<ProductRow> | undefined

    render(
      <ControlledTreeTable
        sections={loadMoreSections}
        initialExpandedIds={["footwear"]}
        onLoadMoreRows={(section) => {
          loadedSection = section
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Show 95 more" }))

    expect(loadedSection?.id).toBe("footwear")
  })

  it("hides the show-more row once every row has loaded", () => {
    const fullyLoadedSections: readonly TreeTableSection<ProductRow>[] = [
      {
        id: "footwear",
        title: "Footwear",
        rowCount: 2,
        rows: [
          { sku: "SN-1", name: "Runner" },
          { sku: "SN-2", name: "Trail" },
        ],
      },
    ]

    render(
      <ControlledTreeTable
        sections={fullyLoadedSections}
        initialExpandedIds={["footwear"]}
        onLoadMoreRows={() => {}}
      />
    )

    expect(
      screen.queryByRole("button", { name: /show \d+ more/i })
    ).not.toBeInTheDocument()
  })

  it("doesn't render the show-more row without onLoadMoreRows", () => {
    render(
      <ControlledTreeTable
        sections={loadMoreSections}
        initialExpandedIds={["footwear"]}
      />
    )

    expect(
      screen.queryByRole("button", { name: /show \d+ more/i })
    ).not.toBeInTheDocument()
  })
})

describe("widget tree table filtered state", () => {
  it("shows the filtered empty state with a clear-filters button", async () => {
    const user = userEvent.setup()
    let cleared = false

    render(
      <ControlledTreeTable
        sections={[]}
        filtered
        onClearFilters={() => {
          cleared = true
        }}
      />
    )

    expect(screen.getByText("No results")).toBeInTheDocument()
    expect(screen.queryByText("No data")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Clear filters" }))

    expect(cleared).toBe(true)
  })

  it("falls back to the default empty state when not filtered", () => {
    render(<ControlledTreeTable sections={[]} />)

    expect(screen.getByText("No data")).toBeInTheDocument()
    expect(screen.queryByText("No results")).not.toBeInTheDocument()
  })
})

describe("widget tree table fill", () => {
  it("gives the scroll container overflow-auto and an accessible region", () => {
    const { container } = render(
      <ControlledTreeTable initialExpandedIds={["footwear"]} fill />
    )

    const tableContainer = container.querySelector(
      '[data-slot="table-container"]'
    )
    expect(tableContainer).toHaveClass("overflow-auto")
    expect(screen.getByRole("region", { name: "Products" })).toBeInTheDocument()
  })

  it("doesn't mark the container as a region without fill", () => {
    render(<ControlledTreeTable initialExpandedIds={["footwear"]} />)

    expect(screen.queryByRole("region")).not.toBeInTheDocument()
  })
})
