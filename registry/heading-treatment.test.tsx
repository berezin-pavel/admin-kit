import { render } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { WidgetActivity } from "./widget-activity/widget-activity"
import { WidgetChart } from "./widget-chart/widget-chart"
import { WidgetDonut } from "./widget-donut/widget-donut"
import { WidgetList } from "./widget-list/widget-list"
import { WidgetMetric } from "./widget-metric/widget-metric"
import { WidgetProgress } from "./widget-progress/widget-progress"
import { WidgetQuickActions } from "./widget-quick-actions/widget-quick-actions"

interface HeadingProps {
  heading?: "muted" | "prominent"
  summary?: ReactElement | string
  gradient?: string
}

const cases: readonly {
  name: string
  title: string
  render: (props: HeadingProps) => ReactElement
}[] = [
  {
    name: "widget-metric",
    title: "Revenue",
    render: (props) => <WidgetMetric title="Revenue" value="12" {...props} />,
  },
  {
    name: "widget-chart",
    title: "Sales",
    render: (props) => (
      <WidgetChart
        title="Sales"
        labels={["Jan", "Feb"]}
        series={[{ id: "a", label: "A", values: [1, 2] }]}
        {...props}
      />
    ),
  },
  {
    name: "widget-list",
    title: "Products",
    render: (props) => (
      <WidgetList
        title="Products"
        items={[{ id: "a", title: "One" }]}
        {...props}
      />
    ),
  },
  {
    name: "widget-progress",
    title: "Goal",
    render: (props) => <WidgetProgress title="Goal" value={40} {...props} />,
  },
  {
    name: "widget-donut",
    title: "Split",
    render: (props) => (
      <WidgetDonut
        title="Split"
        slices={[{ id: "a", label: "A", value: 1 }]}
        {...props}
      />
    ),
  },
  {
    name: "widget-activity",
    title: "Feed",
    render: (props) => (
      <WidgetActivity
        title="Feed"
        entries={[{ id: "a", title: "Placed", timestamp: "2026-08-17T10:00" }]}
        {...props}
      />
    ),
  },
  {
    name: "widget-quick-actions",
    title: "Actions",
    render: (props) => (
      <WidgetQuickActions
        title="Actions"
        actions={[{ id: "a", label: "New", onSelect: () => {} }]}
        {...props}
      />
    ),
  },
]

describe.each(cases)("$name heading and summary", ({ render: renderCase, title }) => {
  it("renders the muted title treatment by default", () => {
    const { getByText } = render(renderCase({}))

    expect(getByText(title)).toHaveClass(
      "text-sm",
      "font-medium",
      "text-muted-foreground"
    )
  })

  it("renders a prominent title in full-strength foreground", () => {
    const { getByText } = render(renderCase({ heading: "prominent" }))
    const titleNode = getByText(title)

    expect(titleNode).toHaveClass("text-xl", "font-semibold", "text-foreground")
    expect(titleNode).not.toHaveClass("text-muted-foreground")
  })

  it("shows no summary by default", () => {
    const { queryByText } = render(renderCase({}))

    expect(queryByText("486 200 over 30 days")).not.toBeInTheDocument()
  })

  it("renders the summary at the header's opposite end in muted type", () => {
    const { getByText } = render(
      renderCase({ summary: "486 200 over 30 days" })
    )
    const summaryNode = getByText("486 200 over 30 days")

    expect(summaryNode).toHaveClass("text-muted-foreground")
    expect(summaryNode.tagName).toBe("SPAN")
    expect(summaryNode.closest("button, a")).toBeNull()
  })

  it("carries the gradient foreground down to the summary text", () => {
    const { getByText } = render(
      renderCase({ summary: "486 200 over 30 days", gradient: "revenue" })
    )
    const summaryNode = getByText("486 200 over 30 days")

    expect(
      getComputedStyle(summaryNode).getPropertyValue("--muted-foreground")
    ).toBe("var(--gradient-revenue-foreground)")
  })
})

describe("widget-chart summary coexists with its toolbar", () => {
  it("renders the summary and the toolbar side by side in the header", () => {
    const { getByText, getByRole } = render(
      <WidgetChart
        title="Sales"
        labels={["Jan", "Feb"]}
        series={[{ id: "a", label: "A", values: [1, 2] }]}
        summary="486 200 over 30 days"
        toolbar={<button type="button">This month</button>}
      />
    )

    expect(getByText("486 200 over 30 days")).toBeInTheDocument()
    expect(getByRole("button", { name: "This month" })).toBeInTheDocument()
  })
})
