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
    })
    expect(container.querySelector("main")?.getAttribute("style")).toBeNull()
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
    })
  })
})

describe("page-auth takes a gradient", () => {
  it("paints the screen behind the card", () => {
    const { container } = render(
      <PageAuth
        appName="Store"
        title="Sign in"
        onSubmit={() => {}}
        gradient="brand"
      >
        <p>Fields</p>
      </PageAuth>
    )

    expect(container.firstElementChild).toHaveStyle({
      backgroundImage: "var(--gradient-brand)",
    })
  })
})
