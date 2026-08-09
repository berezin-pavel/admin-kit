import { StateEmpty } from "@/registry/state-empty/state-empty"
import {
  WidgetChart,
  type WidgetChartPoint,
} from "@/registry/widget-chart/widget-chart"

import type { ShowcaseEntry } from "./types"

const revenueByMonth: readonly WidgetChartPoint[] = [
  { label: "Jan", value: 820 },
  { label: "Feb", value: 932 },
  { label: "Mar", value: 901 },
  { label: "Apr", value: 1204 },
  { label: "May", value: 1390 },
  { label: "Jun", value: 1280 },
]

export const widgetChartEntry: ShowcaseEntry = {
  item: "widget-chart",
  title: "Chart widget",
  description:
    "A card with a chart for a dashboard: a single data series comes in via props as label/value pairs, and kind switches between a line and bars. Without points and without the empty prop it shows a default state.",
  views: [
    {
      id: "line",
      name: "Line",
      render: () => (
        <WidgetChart title="Revenue by month" data={revenueByMonth} />
      ),
    },
    {
      id: "bar",
      name: "Bars",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          data={revenueByMonth}
          kind="bar"
        />
      ),
    },
    {
      id: "with-hint",
      name: "With a hint",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          data={revenueByMonth}
          hint="in thousands of dollars"
        />
      ),
    },
    {
      id: "empty-custom",
      name: "No data",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          data={[]}
          empty={<StateEmpty title="Too early to draw conclusions" />}
        />
      ),
    },
    {
      id: "empty-default",
      name: "No data, default state",
      render: () => <WidgetChart title="Revenue by month" data={[]} />,
    },
  ],
}
