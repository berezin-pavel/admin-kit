"use client"

import {
  WidgetDonut,
  type WidgetDonutSlice,
} from "@/registry/widget-donut/widget-donut"

const revenueByChannelSlices: readonly WidgetDonutSlice[] = [
  { id: "online", label: "Online", value: 18400 },
  { id: "retail", label: "Retail", value: 9200 },
  { id: "wholesale", label: "Wholesale", value: 4100 },
]

export function CustomValueFormatView() {
  return (
    <WidgetDonut
      title="Revenue by channel"
      slices={revenueByChannelSlices}
      valueFormat={(value) => `$${value.toLocaleString("en-US")}`}
    />
  )
}
