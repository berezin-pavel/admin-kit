import type { ShowcaseEntry } from "./types"
import { WidgetTreeTableStoreView } from "./widget-tree-table-view"

export const widgetTreeTableEntry: ShowcaseEntry = {
  item: "widget-tree-table",
  title: "Tree table widget",
  description:
    "A hierarchical table for dashboards where records fall into nested groups: sections can hold further sections or a list of rows, and only expanded sections mount their contents. The first column carries a colour stripe per ancestor section plus the section's own icon, and its expand button toggles expandedIds, which the consumer owns. sectionCell computes a value for a section row on any other column — most often an aggregate over the rows inside it — while rowActions and sectionActions render row-scoped controls in a shared trailing column.",
  views: [
    {
      id: "default",
      name: "Default",
      render: () => <WidgetTreeTableStoreView withActions />,
    },
    {
      id: "collapsed",
      name: "Collapsed",
      render: () => <WidgetTreeTableStoreView initialExpandedIds={[]} />,
    },
    {
      id: "empty",
      name: "No sections",
      render: () => <WidgetTreeTableStoreView empty />,
    },
    {
      id: "loading",
      name: "Loading",
      render: () => <WidgetTreeTableStoreView loading />,
    },
  ],
}
