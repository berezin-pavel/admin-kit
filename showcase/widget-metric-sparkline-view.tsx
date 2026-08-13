"use client"

import { WidgetMetric } from "@/registry/widget-metric/widget-metric"

const REVENUE_TREND = [
  18200, 17400, 19800, 21500, 20100, 23800, 22600, 24900, 26400, 25100, 27800,
  29300,
]

export function WidgetMetricSparklineTooltipView() {
  return (
    <WidgetMetric
      title="Revenue"
      value="$29,300"
      trend={{ direction: "up", value: "+5%" }}
      trendValues={REVENUE_TREND}
      trendTooltipFormat={(value) => `$${value.toLocaleString("en-US")}`}
      hint="hover the sparkline for exact values"
    />
  )
}
