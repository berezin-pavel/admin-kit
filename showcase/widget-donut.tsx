import {
  WidgetDonut,
  type WidgetDonutSlice,
} from "@/registry/widget-donut/widget-donut"

import { CustomValueFormatView } from "./widget-donut-view"
import type { ShowcaseEntry } from "./types"

const orderStatusSlices: readonly WidgetDonutSlice[] = [
  { id: "delivered", label: "Delivered", value: 48 },
  { id: "shipped", label: "Shipped", value: 21 },
  { id: "paid", label: "Paid", value: 34 },
  { id: "cancelled", label: "Cancelled", value: 9 },
]

const trafficSourceSlices: readonly WidgetDonutSlice[] = [
  { id: "organic", label: "Organic search", value: 42 },
  { id: "direct", label: "Direct", value: 27 },
  { id: "social", label: "Social", value: 18 },
  { id: "email", label: "Email", value: 9 },
  { id: "referral", label: "Referral", value: 6 },
]

export const widgetDonutEntry: ShowcaseEntry = {
  item: "widget-donut",
  title: "Donut widget",
  description:
    "A card with a donut chart for a dashboard: a title, an optional hint, and a legend listing each slice's share of the total. valueFormat controls what's printed next to each label — a percentage by default, or a raw count, a currency amount, anything derived from the value and its share. Zero slices or an all-zero total show a default state.",
  views: [
    {
      id: "four-slices",
      name: "Four slices",
      render: () => (
        <WidgetDonut title="Orders by status" slices={orderStatusSlices} />
      ),
    },
    {
      id: "five-slices",
      name: "Five slices with a hint",
      render: () => (
        <WidgetDonut
          title="Traffic sources"
          hint="Sessions over the last 30 days"
          slices={trafficSourceSlices}
        />
      ),
    },
    {
      id: "custom-value-format",
      name: "Custom value format",
      render: () => <CustomValueFormatView />,
    },
    {
      id: "prominent-heading",
      name: "Prominent heading with a summary",
      render: () => (
        <WidgetDonut
          title="Orders by status"
          slices={orderStatusSlices}
          heading="prominent"
          summary="112 orders"
        />
      ),
    },
    {
      id: "empty",
      name: "No data",
      render: () => <WidgetDonut title="Orders by status" slices={[]} />,
    },
    {
      id: "loading",
      name: "Loading",
      render: () => (
        <WidgetDonut
          title="Orders by status"
          slices={orderStatusSlices}
          loading
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <WidgetDonut
          title="Traffic sources"
          hint="Sessions over the last 30 days"
          slices={trafficSourceSlices}
          gradient="sunset"
        />
      ),
    },
  ],
}
