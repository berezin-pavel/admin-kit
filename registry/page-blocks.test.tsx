import { render, screen, within } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { defaultAdminAppearance } from "@/registry/admin-appearance/appearance-palette"
import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import { PageEntity } from "@/registry/page-entity/page-entity"
import { PageForm } from "@/registry/page-form/page-form"
import { PageHeader } from "@/registry/page-header/page-header"
import { PageList } from "@/registry/page-list/page-list"
import { PageTabs } from "@/registry/page-tabs/page-tabs"

function blockById(container: HTMLElement, id: string) {
  return container.querySelector(`[data-block-id="${id}"]`)
}

describe("page-header block", () => {
  it("renders a card block with the given id and the breadcrumbs slot", () => {
    const { container } = render(
      <PageHeader
        title="Orders"
        blockId="orders.header"
        breadcrumbs={<span>Home</span>}
      />
    )

    const block = blockById(container, "orders.header")
    expect(block).toHaveAttribute("data-slot", "card")
    expect(block).toHaveAttribute("data-block")
    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  it("renders as a block without a block id when none is given", () => {
    const { container } = render(<PageHeader title="Orders" />)

    expect(container.querySelector("[data-block-id]")).not.toBeInTheDocument()
    expect(container.querySelector("[data-block]")).toBeInTheDocument()
  })
})

describe("page-list blocks", () => {
  it("wraps the header and the table in blocks named from blockId", () => {
    const { container } = render(
      <PageList
        blockId="orders"
        title="Orders"
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(blockById(container, "orders.header")).toBeInTheDocument()
    expect(blockById(container, "orders.table")).toBeInTheDocument()
  })

  it("renders no block ids without blockId, but still renders blocks", () => {
    const { container } = render(
      <PageList
        title="Orders"
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(container.querySelectorAll("[data-block-id]")).toHaveLength(0)
    expect(
      container.querySelectorAll("[data-block]").length
    ).toBeGreaterThan(0)
  })

  it("forwards breadcrumbs into the header block", () => {
    render(
      <PageList
        title="Orders"
        breadcrumbs={<span>Home</span>}
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
  })

  it("paints the table block with the gradient stored for its id", () => {
    const appearance = {
      ...defaultAdminAppearance,
      blocks: { "orders.table": { gradient: "ember" as const } },
    }

    const { container } = render(
      <AppearanceProvider value={appearance} onChange={() => {}}>
        <PageList
          blockId="orders"
          title="Orders"
          columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
          rows={[]}
        />
      </AppearanceProvider>
    )

    expect(blockById(container, "orders.table")).toHaveAttribute(
      "data-gradient",
      "ember"
    )
  })
})

describe("page-entity blocks", () => {
  it("wraps the header and each section in blocks named from blockId", () => {
    const { container } = render(
      <PageEntity
        blockId="order"
        title="Order 1024"
        sections={[
          {
            id: "summary",
            fields: [{ id: "total", label: "Total", value: "$10" }],
          },
        ]}
      />
    )

    expect(blockById(container, "order.header")).toBeInTheDocument()
    expect(blockById(container, "order.summary")).toBeInTheDocument()
  })

  it("renders no block ids without blockId, but still renders blocks", () => {
    const { container } = render(
      <PageEntity
        title="Order 1024"
        sections={[
          {
            id: "summary",
            fields: [{ id: "total", label: "Total", value: "$10" }],
          },
        ]}
      />
    )

    expect(container.querySelectorAll("[data-block-id]")).toHaveLength(0)
    expect(
      container.querySelectorAll("[data-block]").length
    ).toBeGreaterThan(0)
  })

  it("forwards breadcrumbs into the header block", () => {
    render(
      <PageEntity
        title="Order 1024"
        breadcrumbs={<span>Home</span>}
        sections={[
          {
            id: "summary",
            fields: [{ id: "total", label: "Total", value: "$10" }],
          },
        ]}
      />
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})

describe("page-form blocks", () => {
  it("wraps the header, each section and the actions row in blocks named from blockId", () => {
    const { container } = render(
      <PageForm
        blockId="edit"
        title="Edit order"
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(blockById(container, "edit.header")).toBeInTheDocument()
    expect(blockById(container, "edit.0")).toBeInTheDocument()

    const actionsBlock = blockById(container, "edit.actions")
    expect(actionsBlock).toBeInTheDocument()
    expect(
      within(actionsBlock as HTMLElement).getByRole("button", {
        name: "Cancel",
      })
    ).toBeInTheDocument()
    expect(
      within(actionsBlock as HTMLElement).getByRole("button", {
        name: "Save",
      })
    ).toBeInTheDocument()
  })

  it("renders no block ids without blockId, but still renders blocks", () => {
    const { container } = render(
      <PageForm
        title="Edit order"
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(container.querySelectorAll("[data-block-id]")).toHaveLength(0)
    expect(
      container.querySelectorAll("[data-block]").length
    ).toBeGreaterThan(0)
  })

  it("forwards breadcrumbs into the header block", () => {
    render(
      <PageForm
        title="Edit order"
        breadcrumbs={<span>Home</span>}
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(screen.getByText("Home")).toBeInTheDocument()
  })
})

describe("page-tabs blocks", () => {
  it("wraps the tab strip in a block named from blockId", () => {
    const { container } = render(
      <PageTabs
        blockId="order"
        value="one"
        onValueChange={() => {}}
        items={[{ id: "one", label: "One", content: <p>One content</p> }]}
      />
    )

    const block = blockById(container, "order.tabs")
    expect(block).toBeInTheDocument()
    expect(
      within(block as HTMLElement).getByRole("tablist")
    ).toBeInTheDocument()
  })

  it("renders no block ids without blockId, but still renders a block", () => {
    const { container } = render(
      <PageTabs
        value="one"
        onValueChange={() => {}}
        items={[{ id: "one", label: "One", content: <p>One content</p> }]}
      />
    )

    expect(container.querySelectorAll("[data-block-id]")).toHaveLength(0)
    expect(
      container.querySelectorAll("[data-block]").length
    ).toBeGreaterThan(0)
  })

  it("renders breadcrumbs inside the tabs block, above the strip", () => {
    const { container } = render(
      <PageTabs
        blockId="order"
        breadcrumbs={<span>Home</span>}
        value="one"
        onValueChange={() => {}}
        items={[{ id: "one", label: "One", content: <p>One content</p> }]}
      />
    )

    const block = blockById(container, "order.tabs")
    expect(
      within(block as HTMLElement).getByText("Home")
    ).toBeInTheDocument()
  })
})
