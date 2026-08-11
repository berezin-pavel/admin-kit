import { RowActionsDisabledView, RowActionsListView } from "./row-actions-view"
import type { ShowcaseEntry } from "./types"

export const rowActionsEntry: ShowcaseEntry = {
  item: "row-actions",
  title: "Row actions",
  description:
    'A row of compact icon buttons for a table\'s last column. The label isn\'t rendered as text but stays the button\'s accessible name and pops up as a tooltip on hover — the existing hint element draws the tooltip, row-actions has no tooltip of its own. tone="danger" colors the icon with text-destructive; disabled blocks the whole button, including the tooltip on click. The element holds no state of its own: the consumer passes the actions list and the onSelect handlers.',
  views: [
    {
      id: "list",
      name: "In a row list — deletion actually works",
      render: () => <RowActionsListView />,
    },
    {
      id: "disabled",
      name: "With disabled actions",
      render: () => <RowActionsDisabledView />,
    },
  ],
}
