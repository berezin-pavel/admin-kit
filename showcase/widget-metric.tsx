import { WidgetMetric } from "@/registry/widget-metric/widget-metric"

import type { ShowcaseEntry } from "./types"

export const widgetMetricEntry: ShowcaseEntry = {
  item: "widget-metric",
  title: "Metric widget",
  description:
    "A card with a single number: a title, a value, an optional trend, and a caption. Data comes in via props, the widget doesn't fetch anything on its own.",
  views: [
    {
      id: "no-trend",
      name: "Without a trend",
      render: () => <WidgetMetric title="Users" value="1,248" />,
    },
    {
      id: "trend-up",
      name: "With growth",
      render: () => (
        <WidgetMetric
          title="Orders"
          value="312"
          trend={{ direction: "up", value: "+12%" }}
        />
      ),
    },
    {
      id: "trend-down-positive",
      name: "With a drop",
      render: () => (
        <WidgetMetric
          title="Bounces"
          value="27"
          trend={{ direction: "down", value: "−4%", tone: "positive" }}
        />
      ),
    },
    {
      id: "trend-down-negative",
      name: "With a decline",
      render: () => (
        <WidgetMetric
          title="Active users"
          value="842"
          trend={{ direction: "down", value: "−15%" }}
        />
      ),
    },
    {
      id: "with-hint",
      name: "With a caption",
      render: () => (
        <WidgetMetric
          title="Revenue"
          value="$1.4M"
          hint="over the last 30 days"
        />
      ),
    },
  ],
}
