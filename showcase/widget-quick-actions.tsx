import { WidgetQuickActions } from "@/registry/widget-quick-actions/widget-quick-actions"

import {
  EmptyView,
  GradientView,
  LargeHeadingView,
  ThreeColumnsView,
  TwoColumnsView,
} from "./widget-quick-actions-view"
import type { ShowcaseEntry } from "./types"

export const widgetQuickActionsEntry: ShowcaseEntry = {
  item: "widget-quick-actions",
  title: "Quick actions widget",
  description:
    "A card with a grid of outline buttons for shortcuts a dashboard user reaches for often — refunding an order, exporting a report, inviting a teammate. Each action owns its onSelect handler; the widget holds no state and fires nothing on its own. Without actions it renders just the titled card, since an actions card with no actions is a consumer mistake, not a data state.",
  views: [
    {
      id: "two-columns",
      name: "Two columns (default)",
      render: () => <TwoColumnsView />,
    },
    {
      id: "three-columns",
      name: "Three columns",
      render: () => <ThreeColumnsView />,
    },
    {
      id: "large-heading",
      name: "Large heading with a summary",
      render: () => <LargeHeadingView />,
    },
    {
      id: "empty",
      name: "No actions",
      render: () => <EmptyView />,
    },
    {
      id: "loading",
      name: "Loading",
      render: () => (
        <WidgetQuickActions title="Quick actions" actions={[]} loading />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => <GradientView />,
    },
  ],
}
