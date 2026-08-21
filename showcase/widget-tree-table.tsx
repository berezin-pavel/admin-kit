import type { ShowcaseEntry } from "./types"
import {
  WidgetTreeTableColumnsMenuView,
  WidgetTreeTableFilteredView,
  WidgetTreeTableLoadMoreView,
  WidgetTreeTableStoreView,
} from "./widget-tree-table-view"

export const widgetTreeTableEntry: ShowcaseEntry = {
  item: "widget-tree-table",
  title: "Tree table widget",
  description:
    "A hierarchical table for dashboards where records fall into nested groups: sections can hold further sections or a list of rows, and only expanded sections mount their contents. The first column carries a colour stripe per ancestor section plus the section's own icon, and its expand button toggles expandedIds, which the consumer owns. sectionCell computes a value for a section row on any other column — most often an aggregate over the rows inside it — while rowActions and sectionActions render row-scoped controls in a shared trailing column. hiddenColumnIds and onHiddenColumnIdsChange add a columns menu to the header next to expand-all/collapse-all icon buttons, which always appear once there are sections; the first column can never be hidden. A column marked grow takes the table's slack width and wraps its text, defaulting to the first column when none is marked. rowCount on a section, once it exceeds its loaded rows, adds a show-more row calling onLoadMoreRows; onRowActivate turns the first column's content into a button; filtered plus onClearFilters swaps the empty state for a filtered-results one; fill stretches the card to its container and keeps the header pinned while the body scrolls.",
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
      id: "with-columns-menu",
      name: "With the columns menu and expand controls",
      render: () => <WidgetTreeTableColumnsMenuView />,
    },
    {
      id: "load-more",
      name: "With a show-more row",
      render: () => <WidgetTreeTableLoadMoreView />,
    },
    {
      id: "filtered",
      name: "No results for the current filter",
      render: () => <WidgetTreeTableFilteredView />,
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
