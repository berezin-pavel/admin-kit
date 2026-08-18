import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { AdminShell } from "./admin-shell/admin-shell"
import { AppearanceProvider } from "./admin-appearance/appearance-provider"
import { defaultAdminAppearance } from "./admin-appearance/appearance-palette"
import type { GradientId } from "./admin-appearance/appearance-palette"
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
  { name: "widget-metric", render: (gradient?: GradientId) => (
      <WidgetMetric title="Revenue" value="12" gradient={gradient} />
    ) },
  { name: "widget-chart", render: (gradient?: GradientId) => (
      <WidgetChart
        title="Sales"
        labels={["Jan", "Feb"]}
        series={[{ id: "a", label: "A", values: [1, 2] }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-list", render: (gradient?: GradientId) => (
      <WidgetList
        title="Products"
        items={[{ id: "a", title: "One" }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-progress", render: (gradient?: GradientId) => (
      <WidgetProgress title="Goal" value={40} gradient={gradient} />
    ) },
  { name: "widget-donut", render: (gradient?: GradientId) => (
      <WidgetDonut
        title="Split"
        slices={[{ id: "a", label: "A", value: 1 }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-activity", render: (gradient?: GradientId) => (
      <WidgetActivity
        title="Feed"
        entries={[{ id: "a", title: "Placed", timestamp: "2026-08-17T10:00" }]}
        gradient={gradient}
      />
    ) },
  { name: "widget-quick-actions", render: (gradient?: GradientId) => (
      <WidgetQuickActions
        title="Actions"
        actions={[{ id: "a", label: "New", onSelect: () => {} }]}
        gradient={gradient}
      />
    ) },
]

describe.each(cases)("$name gradient surface", ({ render: renderCase }) => {
  it("marks the card with the named gradient", () => {
    const { container } = render(renderCase("ocean"))
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-gradient", "ocean")
  })

  it("sets no data-gradient without the prop", () => {
    const { container } = render(renderCase(undefined))
    const card = container.querySelector('[data-slot="card"]')

    expect(card).not.toHaveAttribute("data-gradient")
  })

  it("carries no opaque card nested inside the gradient block", () => {
    const { container } = render(renderCase("ocean"))
    const cards = container.querySelectorAll('[data-slot="card"]')
    const opaque = Array.from(cards).filter(
      (card) => !card.hasAttribute("data-gradient")
    )

    expect(opaque).toHaveLength(0)
  })
})

describe("widget-metric lets the stored block choice win over the prop", () => {
  it("resolves the gradient from the provider's blocks entry by id", () => {
    const { container } = render(
      <AppearanceProvider
        value={{
          ...defaultAdminAppearance,
          blocks: { revenue: { gradient: "ember" } },
        }}
        onChange={() => {}}
      >
        <WidgetMetric
          title="Revenue"
          value="12"
          blockId="revenue"
          gradient="ocean"
        />
      </AppearanceProvider>
    )
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-gradient", "ember")
  })
})

describe("the shell paints its surfaces through data attributes", () => {
  it("sets data-gradient on the sidebar when sidebarGradient is given", () => {
    const { container } = render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        sidebarGradient="ocean"
      >
        <p>Work</p>
      </AdminShell>
    )

    expect(container.querySelector("aside")).toHaveAttribute(
      "data-gradient",
      "ocean"
    )
  })

  it("leaves the sidebar and the work area without data-gradient otherwise", () => {
    const { container } = render(
      <AdminShell appName="Store" nav={[]} activeHref="/">
        <p>Work</p>
      </AdminShell>
    )

    expect(container.querySelector("aside")).not.toHaveAttribute(
      "data-gradient"
    )
    expect(container.querySelector("main")).not.toHaveAttribute(
      "data-gradient"
    )
  })

  it("sets data-backdrop and data-backdrop-soft on the work area for a soft gradient", () => {
    const { container } = render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        backdrop={{ gradient: "ocean", soft: true }}
      >
        <p>Work</p>
      </AdminShell>
    )

    const main = container.firstElementChild

    expect(main).toHaveAttribute("data-backdrop", "ocean")
    expect(main).toHaveAttribute("data-backdrop-soft", "")
  })

  it("sets data-backdrop without the soft attribute when soft is false or omitted", () => {
    const { container } = render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        backdrop={{ gradient: "ocean", soft: false }}
      >
        <p>Work</p>
      </AdminShell>
    )

    const main = container.firstElementChild

    expect(main).toHaveAttribute("data-backdrop", "ocean")
    expect(main).not.toHaveAttribute("data-backdrop-soft")
  })

  it("sets neither attribute when backdrop has no gradient or is omitted", () => {
    const { container: withNullGradient } = render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        backdrop={{ gradient: null }}
      >
        <p>Work</p>
      </AdminShell>
    )

    expect(withNullGradient.firstElementChild).not.toHaveAttribute(
      "data-backdrop"
    )
    expect(withNullGradient.firstElementChild).not.toHaveAttribute(
      "data-backdrop-soft"
    )

    const { container: withoutBackdrop } = render(
      <AdminShell appName="Store" nav={[]} activeHref="/">
        <p>Work</p>
      </AdminShell>
    )

    expect(withoutBackdrop.firstElementChild).not.toHaveAttribute(
      "data-backdrop"
    )
    expect(withoutBackdrop.firstElementChild).not.toHaveAttribute(
      "data-backdrop-soft"
    )
  })

  it("carries sidebarGradient into the burger panel's sheet", async () => {
    const user = userEvent.setup()
    render(
      <AdminShell
        appName="Store"
        nav={[]}
        activeHref="/"
        header={false}
        sidebarGradient="ocean"
      >
        <p>Work</p>
      </AdminShell>
    )

    await user.click(
      screen.getByRole("button", { name: "Open navigation menu" })
    )

    const dialog = await screen.findByText("Store", {
      selector: '[data-slot="sheet-title"]',
    })
    const sheetContent = dialog.closest('[data-slot="sheet-content"]')

    expect(sheetContent).toHaveAttribute("data-gradient", "ocean")
  })
})

describe.each([
  { name: "state-empty", Component: StateEmpty },
  { name: "state-error", Component: StateError },
  { name: "state-forbidden", Component: StateForbidden },
  { name: "state-offline", Component: StateOffline },
])("$name gradient surface", ({ Component }) => {
  it("marks its frame with the named gradient", () => {
    const { container } = render(
      <Component title="Nothing here" gradient="ocean" />
    )

    expect(container.firstElementChild).toHaveAttribute(
      "data-gradient",
      "ocean"
    )
  })

  it("sets no data-gradient without the prop", () => {
    const { container } = render(<Component title="Nothing here" />)

    expect(container.firstElementChild).not.toHaveAttribute("data-gradient")
  })
})

describe("page-auth takes a gradient", () => {
  const renderAuth = (gradient?: GradientId) =>
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

  it("marks the wrapper behind the card with the named gradient", () => {
    const { container } = renderAuth("dusk")

    expect(container.firstElementChild).toHaveAttribute(
      "data-backdrop",
      "dusk"
    )
  })

  it("recolours only the text that sits on the backdrop", () => {
    const { getByText } = renderAuth("dusk")

    expect(getByText("Store")).toHaveClass("text-(--backdrop-foreground)")
    expect(getByText("Store")).not.toHaveClass("text-muted-foreground")
  })

  it("recolours the footer the same way as the app name", () => {
    const { getByText } = render(
      <PageAuth
        appName="Store"
        title="Sign in"
        onSubmit={() => {}}
        gradient="dusk"
        footer={<span>Need help?</span>}
      >
        <p>Fields</p>
      </PageAuth>
    )
    const footer = getByText("Need help?").parentElement

    expect(footer).toHaveClass("text-(--backdrop-foreground)")
    expect(footer).not.toHaveClass("text-muted-foreground")
  })

  it("leaves the footer at the theme default without the prop", () => {
    const { getByText } = render(
      <PageAuth
        appName="Store"
        title="Sign in"
        onSubmit={() => {}}
        footer={<span>Need help?</span>}
      >
        <p>Fields</p>
      </PageAuth>
    )
    const footer = getByText("Need help?").parentElement

    expect(footer).toHaveClass("text-muted-foreground")
    expect(footer).not.toHaveClass("text-(--backdrop-foreground)")
  })

  it("leaves the opaque card without data-gradient", () => {
    const { container } = renderAuth("dusk")
    const card = container.querySelector('[data-slot="card"]')

    expect(card).not.toHaveAttribute("data-gradient")
  })

  it("carries no backdrop attribute at all without the prop", () => {
    const { container } = renderAuth(undefined)

    expect(container.firstElementChild).not.toHaveAttribute("data-backdrop")
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
  const renderTrend = (gradient?: GradientId) =>
    render(
      <WidgetMetric
        title="Revenue"
        value="12"
        trend={{ direction: "down", value: "-3%", tone: "negative" }}
        gradient={gradient}
      />
    )

  it("drops the tone colour class once a gradient replaces the card background", () => {
    const { getByText } = renderTrend("ocean")

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
      <Component title="Nothing here" gradient="ocean" />
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

describe("widget-metric trend when the gradient comes from the provider", () => {
  it("drops the tone colour class for a stored gradient without a gradient prop", () => {
    const { getByText } = render(
      <AppearanceProvider
        value={{ ...defaultAdminAppearance, blocks: { revenue: { gradient: "ember" } } }}
        onChange={() => {}}
      >
        <WidgetMetric
          blockId="revenue"
          title="Revenue"
          value="12"
          trend={{ direction: "down", value: "-3%", tone: "negative" }}
        />
      </AppearanceProvider>
    )

    expect(getByText("-3%").className).not.toMatch(/text-destructive|text-primary/)
  })
})
