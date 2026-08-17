import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AdminShell } from "./admin-shell/admin-shell"
import { PageAuth } from "./page-auth/page-auth"
import { StateEmpty } from "./state-empty/state-empty"
import { StateError } from "./state-error/state-error"
import { StateForbidden } from "./state-forbidden/state-forbidden"
import { StateOffline } from "./state-offline/state-offline"
import { WidgetActivity } from "./widget-activity/widget-activity"
import { WidgetChart } from "./widget-chart/widget-chart"
import { WidgetDonut } from "./widget-donut/widget-donut"
import { WidgetList } from "./widget-list/widget-list"
import { WidgetMetric } from "./widget-metric/widget-metric"
import { WidgetProgress } from "./widget-progress/widget-progress"
import { WidgetQuickActions } from "./widget-quick-actions/widget-quick-actions"

const cases = [
  { name: "widget-metric", render: (gradient?: string) => (
      <WidgetMetric title="Revenue" value="12" gradient={gradient} />
    ) },
  { name: "widget-chart", render: (gradient?: string) => (
      <WidgetChart
        title="Sales"
        labels={["Jan", "Feb"]}
        series={[{ id: "a", label: "A", values: [1, 2] }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-list", render: (gradient?: string) => (
      <WidgetList
        title="Products"
        items={[{ id: "a", title: "One" }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-progress", render: (gradient?: string) => (
      <WidgetProgress title="Goal" value={40} gradient={gradient} />
    ) },
  { name: "widget-donut", render: (gradient?: string) => (
      <WidgetDonut
        title="Split"
        slices={[{ id: "a", label: "A", value: 1 }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-activity", render: (gradient?: string) => (
      <WidgetActivity
        title="Feed"
        entries={[{ id: "a", title: "Placed", timestamp: "2026-08-17T10:00" }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-quick-actions", render: (gradient?: string) => (
      <WidgetQuickActions
        title="Actions"
        actions={[{ id: "a", label: "New", onSelect: () => {} }]}
        gradient={gradient}
      />
    ) },
]

describe.each(cases)("$name gradient surface", ({ render: renderCase }) => {
  it("paints the card from the named gradient", () => {
    const { container } = render(renderCase("revenue"))
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveStyle({
      backgroundImage: "var(--gradient-revenue)",
      color: "var(--gradient-revenue-foreground)",
      "--card-foreground": "var(--gradient-revenue-foreground)",
      "--muted-foreground": "var(--gradient-revenue-foreground)",
    })
  })

  it("sets no inline colour without the prop", () => {
    const { container } = render(renderCase(undefined))
    const card = container.querySelector('[data-slot="card"]')

    expect(card?.getAttribute("style")).toBeNull()
  })
})

describe("the shell's sidebar takes a gradient", () => {
  it("paints the sidebar and leaves the work area alone", () => {
    const { container } = render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        sidebarGradient="brand"
      >
        <p>Work</p>
      </AdminShell>
    )

    expect(container.querySelector("aside")).toHaveStyle({
      backgroundImage: "var(--gradient-brand)",
      "--card-foreground": "var(--gradient-brand-foreground)",
      "--muted-foreground": "var(--gradient-brand-foreground)",
      "--sidebar-foreground": "var(--gradient-brand-foreground)",
    })
    expect(container.querySelector("main")?.getAttribute("style")).toBeNull()
  })

  const shellWithNav = (sidebarGradient?: string) => (
    <AdminShell
      appName="Store"
      nav={[
        { href: "/orders", title: "Orders" },
        { href: "/settings", title: "Settings" },
      ]}
      activeHref="/orders"
      sidebarGradient={sidebarGradient}
    >
      <p>Work</p>
    </AdminShell>
  )

  const findInactiveNavLink = (container: HTMLElement) =>
    [...container.querySelectorAll("aside nav a")].find((link) =>
      link.textContent?.includes("Settings")
    )

  it("carries the gradient foreground down to an inactive nav row", () => {
    const { container } = render(shellWithNav("brand"))
    const inactiveLink = findInactiveNavLink(container)

    expect(inactiveLink).toBeTruthy()
    expect(
      getComputedStyle(inactiveLink as Element).getPropertyValue(
        "--sidebar-foreground"
      )
    ).toBe("var(--gradient-brand-foreground)")
  })

  it("leaves an inactive nav row at the sidebar default without a gradient", () => {
    const { container } = render(shellWithNav(undefined))
    const inactiveLink = findInactiveNavLink(container)

    expect(inactiveLink).toBeTruthy()
    expect(
      getComputedStyle(inactiveLink as Element).getPropertyValue(
        "--sidebar-foreground"
      )
    ).toBe("")
  })
})

describe.each([
  { name: "state-empty", Component: StateEmpty },
  { name: "state-error", Component: StateError },
  { name: "state-forbidden", Component: StateForbidden },
  { name: "state-offline", Component: StateOffline },
])("$name gradient surface", ({ Component }) => {
  it("paints its frame from the named gradient", () => {
    const { container } = render(
      <Component title="Nothing here" gradient="calm" />
    )

    expect(container.firstElementChild).toHaveStyle({
      backgroundImage: "var(--gradient-calm)",
      "--muted-foreground": "var(--gradient-calm-foreground)",
    })
  })
})

describe("page-auth takes a gradient", () => {
  const renderAuth = (gradient?: string) =>
    render(
      <PageAuth
        appName="Store"
        title="Sign in"
        onSubmit={() => {}}
        gradient={gradient}
      >
        <p>Fields</p>
      </PageAuth>
    )

  it("paints the screen behind the card", () => {
    const { container } = renderAuth("brand")

    expect(container.firstElementChild).toHaveStyle({
      backgroundImage: "var(--gradient-brand)",
    })
  })

  it("recolours only the text that sits on the backdrop", () => {
    const { getByText } = renderAuth("brand")

    expect(getByText("Store")).toHaveStyle({
      color: "var(--gradient-brand-foreground)",
    })
    expect(getByText("Store")).not.toHaveClass("text-muted-foreground")
  })

  it("leaves the opaque card reading the theme's own foreground", () => {
    const { container } = renderAuth("brand")
    const card = container.querySelector('[data-slot="card"]')

    expect(card?.getAttribute("style")).toBeNull()
    expect(container.firstElementChild).not.toHaveStyle({
      "--card-foreground": "var(--gradient-brand-foreground)",
    })
  })

  it("carries no inline style at all without the prop", () => {
    const { container } = renderAuth(undefined)

    expect(container.firstElementChild?.getAttribute("style")).toBeNull()
    expect(getByTextIn(container, "Store")).toHaveClass("text-muted-foreground")
  })
})

function getByTextIn(container: HTMLElement, text: string) {
  const found = Array.from(container.querySelectorAll("*")).find(
    (node) => node.textContent === text && node.children.length === 0
  )
  if (!found) {
    throw new Error(`No element with text ${text}`)
  }
  return found
}

describe("widget-metric trend on a gradient surface", () => {
  const renderTrend = (gradient?: string) =>
    render(
      <WidgetMetric
        title="Revenue"
        value="12"
        trend={{ direction: "down", value: "-3%", tone: "negative" }}
        gradient={gradient}
      />
    )

  it("drops the tone colour class once a gradient replaces the card background", () => {
    const { getByText } = renderTrend("revenue")

    expect(getByText("-3%").className).not.toMatch(/text-destructive|text-primary/)
  })

  it("keeps the tone colour class without a gradient", () => {
    const { getByText } = renderTrend(undefined)

    expect(getByText("-3%").className).toMatch(/text-destructive/)
  })
})

describe.each([
  { name: "state-error", Component: StateError },
  { name: "state-offline", Component: StateOffline },
])("$name icon on a gradient surface", ({ Component }) => {
  it("drops the fixed destructive colour once a gradient replaces the frame background", () => {
    const { container } = render(
      <Component title="Nothing here" gradient="calm" />
    )
    const icon = container.querySelector("svg")

    expect(icon).toBeTruthy()
    expect(icon?.getAttribute("class")).not.toMatch(/text-destructive/)
  })

  it("keeps the fixed destructive colour without a gradient", () => {
    const { container } = render(<Component title="Nothing here" />)
    const icon = container.querySelector("svg")

    expect(icon).toBeTruthy()
    expect(icon?.getAttribute("class")).toMatch(/text-destructive/)
  })
})
