import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { defaultAdminAppearance } from "@/registry/admin-appearance/appearance-palette"
import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import { PageEntity } from "@/registry/page-entity/page-entity"
import { PageAuth } from "@/registry/page-auth/page-auth"
import { PageForm } from "@/registry/page-form/page-form"
import { PageHeader } from "@/registry/page-header/page-header"
import { PageList } from "@/registry/page-list/page-list"
import {
  PageTabs,
  PageTabsPanels,
  PageTabsStrip,
} from "@/registry/page-tabs/page-tabs"

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

  it("moves the title and the actions into the table block when header is false", () => {
    const { container } = render(
      <PageList
        blockId="orders"
        header={false}
        title="Orders"
        actions={<button type="button">Reload</button>}
        columns={[{ id: "number", title: "Number", cell: () => "cell" }]}
        rows={[]}
      />
    )

    expect(blockById(container, "orders.header")).not.toBeInTheDocument()
    const table = blockById(container, "orders.table") as HTMLElement
    expect(within(table).getByText("Orders")).toBeInTheDocument()
    expect(within(table).getByRole("button", { name: "Reload" })).toBeInTheDocument()
    expect(container.querySelector("h1")).not.toBeInTheDocument()
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

describe("page-entity header and combined modes", () => {
  it("drops the header block and merges the sections into one block", () => {
    const { container } = render(
      <PageEntity
        blockId="order"
        header={false}
        combined
        title="Order"
        sections={[
          { id: "a", title: "Order", fields: [{ id: "s", label: "Status", value: "Paid" }] },
          { id: "b", title: "Customer", fields: [{ id: "n", label: "Name", value: "Emily" }] },
        ]}
      />
    )

    expect(blockById(container, "order.header")).not.toBeInTheDocument()
    expect(blockById(container, "order.a")).not.toBeInTheDocument()
    const details = blockById(container, "order.details") as HTMLElement
    expect(details).toBeInTheDocument()
    expect(within(details).getByText("Customer")).toBeInTheDocument()
    expect(within(details).getByText("Emily")).toBeInTheDocument()
  })
})

describe("page-form headerless mode", () => {
  it("renders no header block when header is false", () => {
    const { container } = render(
      <PageForm
        blockId="edit"
        header={false}
        title="Edit order"
        sections={[{ title: "Details", children: <p>Fields</p> }]}
      />
    )

    expect(blockById(container, "edit.header")).not.toBeInTheDocument()
    expect(container.querySelector("h1")).not.toBeInTheDocument()
  })
})

describe("page-tabs outside a block", () => {
  it("renders the strip without a card when block is false", () => {
    const { container } = render(
      <PageTabs
        blockId="order"
        block={false}
        items={[
          { id: "a", label: "Overview", content: <p>Body</p> },
          { id: "b", label: "History", content: <p>Log</p> },
        ]}
        value="a"
        onValueChange={() => {}}
      />
    )

    expect(blockById(container, "order.tabs")).not.toBeInTheDocument()
    expect(container.querySelector("[data-block]")).not.toBeInTheDocument()
    expect(screen.getByRole("tab", { name: "Overview" })).toBeInTheDocument()
  })

  it("keeps a detached strip and panels in step through a shared value", () => {
    const { rerender } = render(
      <>
        <PageTabsStrip
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="a"
          onValueChange={() => {}}
        />
        <PageTabsPanels
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="a"
        />
      </>
    )

    expect(screen.getByText("Body")).toBeInTheDocument()
    rerender(
      <>
        <PageTabsStrip
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="b"
          onValueChange={() => {}}
        />
        <PageTabsPanels
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="b"
        />
      </>
    )
    expect(screen.getByText("Log")).toBeInTheDocument()
  })

  it("links each tab to its panel through aria-controls and aria-labelledby", () => {
    const { container } = render(
      <>
        <PageTabsStrip
          idPrefix="order"
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="a"
          onValueChange={() => {}}
        />
        <PageTabsPanels
          idPrefix="order"
          items={[
            { id: "a", label: "Overview", content: <p>Body</p> },
            { id: "b", label: "History", content: <p>Log</p> },
          ]}
          value="a"
        />
      </>
    )

    for (const id of ["a", "b"]) {
      const tab = screen.getByRole("tab", {
        name: id === "a" ? "Overview" : "History",
      })
      expect(tab.id).toBe(`order-tab-${id}`)
      expect(tab.getAttribute("aria-controls")).toBe(`order-panel-${id}`)
    }

    const activePanel = container.querySelector(`#order-panel-a`)
    expect(activePanel).toBeInTheDocument()
    expect(activePanel).toHaveAttribute("aria-labelledby", "order-tab-a")
  })
})

describe("heading choice on section blocks", () => {
  it("offers the heading choice for a form section and a sign-in card", async () => {
    const { container } = render(
      <AppearanceProvider value={defaultAdminAppearance} onChange={() => {}} editable>
        <PageForm
          blockId="edit"
          title="Edit order"
          sections={[{ title: "Details", children: <p>Fields</p> }]}
        />
        <PageAuth appName="Store" title="Sign in" blockId="sign-in.card" onSubmit={() => {}}>
          <p>Form</p>
        </PageAuth>
      </AppearanceProvider>
    )

    for (const id of ["edit.0", "sign-in.card"]) {
      const block = blockById(container, id) as HTMLElement
      const trigger = within(block).getByRole("button", { name: "Block appearance" })
      await userEvent.click(trigger)
      expect(screen.getByRole("radiogroup", { name: "Heading" })).toBeInTheDocument()
      await userEvent.keyboard("{Escape}")
    }
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
