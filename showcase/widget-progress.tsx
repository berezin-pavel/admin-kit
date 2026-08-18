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
    {
      id: "with-target",
      name: "With a target",
      render: () => (
        <WidgetProgress
          title="Monthly revenue"
          value={340}
          max={500}
          target={420}
          hint="$34,000 of $50,000"
        />
      ),
    },
    {
      id: "tones",
      name: "Threshold tones",
      render: () => (
        <div className="flex flex-col gap-4">
          <WidgetProgress
            title="Ahead of plan"
            value={480}
            max={500}
            target={420}
            tone="success"
            hint="on track for the month"
          />
          <WidgetProgress
            title="Slightly behind"
            value={300}
            max={500}
            target={420}
            tone="warning"
            hint="catching up is still realistic"
          />
          <WidgetProgress
            title="Falling behind"
            value={120}
            max={500}
            target={420}
            tone="danger"
            hint="needs attention"
          />
        </div>
      ),
    },
    {
      id: "target-custom-label",
      name: "Custom target label",
      render: () => (
        <WidgetProgress
          title="Support tickets closed"
          value={62}
          max={100}
          target={80}
          targetLabel="Team goal"
        />
      ),
    },
    {
      id: "prominent-heading",
      name: "Prominent heading with a summary",
      render: () => (
        <WidgetProgress
          title="Monthly revenue"
          value={340}
          max={500}
          target={420}
          heading="prominent"
          summary="$34,000 of $50,000"
        />
      ),
    },
    {
      id: "loading",
      name: "Loading",
      render: () => (
        <WidgetProgress title="Plan completion" value={62} loading />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <WidgetProgress
          title="Monthly revenue"
          value={340}
          max={500}
          target={420}
          hint="$34,000 of $50,000"
          gradient="forest"
        />
      ),
    },
  ],
}
