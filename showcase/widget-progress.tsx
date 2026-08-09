import { WidgetProgress } from "@/registry/widget-progress/widget-progress"

import type { ShowcaseEntry } from "./types"

export const widgetProgressEntry: ShowcaseEntry = {
  item: "widget-progress",
  title: "Progress widget",
  description:
    "A card with a progress bar: warehouse fill level, plan completion, quota usage. The percentage is computed against max, and an out-of-range value doesn't break the layout.",
  views: [
    {
      id: "normal",
      name: "Regular value",
      render: () => (
        <WidgetProgress
          title="Plan completion"
          value={62}
          hint="62 of 100 orders"
        />
      ),
    },
    {
      id: "zero",
      name: "Zero",
      render: () => (
        <WidgetProgress title="Quota usage" value={0} hint="Not started yet" />
      ),
    },
    {
      id: "overflow",
      name: "Overflow",
      render: () => (
        <WidgetProgress
          title="Quota usage"
          value={140}
          hint="140 of 100 — quota exceeded"
        />
      ),
    },
    {
      id: "custom-max",
      name: "Custom max",
      render: () => (
        <WidgetProgress
          title="Warehouse fill level"
          value={340}
          max={500}
          hint="340 of 500 slots"
        />
      ),
    },
  ],
}
