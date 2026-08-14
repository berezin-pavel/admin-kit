import { render, screen } from "@testing-library/react"
import type { ReactElement } from "react"
import { describe, expect, it } from "vitest"

import { WidgetActivity } from "@/registry/widget-activity/widget-activity"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetDonut } from "@/registry/widget-donut/widget-donut"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetProgress } from "@/registry/widget-progress/widget-progress"
import { WidgetQuickActions } from "@/registry/widget-quick-actions/widget-quick-actions"
import { WidgetTable } from "@/registry/widget-table/widget-table"

const title = "Widget title"

interface WidgetCase {
  name: string
  render: (loading: boolean) => ReactElement
}

const widgets: readonly WidgetCase[] = [
  {
    name: "widget-metric",
    render: (loading) => (
      <WidgetMetric title={title} value="128" loading={loading} />
    ),
  },
  {
    name: "widget-chart",
    render: (loading) => (
      <WidgetChart title={title} labels={[]} series={[]} loading={loading} />
    ),
  },
  {
    name: "widget-table",
    render: (loading) => (
      <WidgetTable
        title={title}
        columns={[{ id: "name", title: "Name", cell: () => "cell" }]}
        rows={[]}
        loading={loading}
      />
    ),
  },
  {
    name: "widget-list",
    render: (loading) => (
      <WidgetList title={title} items={[]} loading={loading} />
    ),
  },
  {
    name: "widget-progress",
    render: (loading) => (
      <WidgetProgress title={title} value={40} max={100} loading={loading} />
    ),
  },
  {
    name: "widget-activity",
    render: (loading) => (
      <WidgetActivity title={title} entries={[]} loading={loading} />
    ),
  },
  {
    name: "widget-donut",
    render: (loading) => (
      <WidgetDonut title={title} slices={[]} loading={loading} />
    ),
  },
  {
    name: "widget-quick-actions",
    render: (loading) => (
      <WidgetQuickActions
        title={title}
        actions={[{ id: "a", label: "Do it", onSelect: () => {} }]}
        loading={loading}
      />
    ),
  },
]

describe("a loading widget keeps its title and shows skeletons instead of data", () => {
  it.each(widgets.map((widget) => [widget.name, widget] as const))(
    "%s keeps the title while loading",
    (_name, widget) => {
      render(widget.render(true))

      expect(screen.getByText(title)).toBeInTheDocument()
    }
  )

  it.each(widgets.map((widget) => [widget.name, widget] as const))(
    "%s renders skeletons while loading",
    (_name, widget) => {
      const { container } = render(widget.render(true))

      expect(
        container.querySelectorAll('[data-slot="skeleton"]').length
      ).toBeGreaterThan(0)
    }
  )

  it.each(widgets.map((widget) => [widget.name, widget] as const))(
    "%s renders nothing operable while loading",
    (_name, widget) => {
      const { container } = render(widget.render(true))

      expect(container.querySelectorAll("button, a, input")).toHaveLength(0)
    }
  )

  it.each(
    widgets
      .filter((widget) =>
        [
          "widget-table",
          "widget-list",
          "widget-activity",
          "widget-donut",
          "widget-chart",
        ].includes(widget.name)
      )
      .map((widget) => [widget.name, widget] as const)
  )("%s prefers loading over its empty state", (_name, widget) => {
    const { container } = render(widget.render(true))

    expect(
      container.querySelectorAll('[data-slot="skeleton"]').length
    ).toBeGreaterThan(0)
    expect(screen.queryByText(/no data/i)).not.toBeInTheDocument()
  })
})
