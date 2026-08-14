import {
  PageTabsDefaultView,
  PageTabsOverflowView,
  PageTabsWithActionsView,
} from "./page-tabs-view"
import type { ShowcaseEntry } from "./types"

export const pageTabsEntry: ShowcaseEntry = {
  item: "page-tabs",
  title: "Page tabs",
  description:
    "Section navigation inside a single page — the tabs on an order or customer screen that split Overview, History, and Settings without leaving the URL. Built on the shadcn/Base UI tabs primitive. Controlled like every item in the kit: value and onValueChange come from props, so a consumer can route the active tab through the URL query string instead of local state. Only the active panel's content mounts — the primitive unmounts the others by default, so a heavy table on a hidden tab doesn't render while the user looks elsewhere. icon renders before the label, badge after it (a count or a status dot), and disabled disables the trigger without removing it. actions renders on the same row as the tab strip, pushed to the far end for a page-level button that belongs next to the tabs rather than inside a panel; on a narrow screen the row wraps instead of pushing the actions off screen. The tab strip scrolls horizontally when the labels don't fit, instead of wrapping into two rows or clipping. Keyboard and ARIA (role=tablist, arrow-key movement, aria-selected) come from the primitive.",
  views: [
    {
      id: "default",
      name: "Default (icons and a badge)",
      render: () => <PageTabsDefaultView />,
    },
    {
      id: "with-actions",
      name: "With an action button and a disabled tab",
      render: () => <PageTabsWithActionsView />,
    },
    {
      id: "overflow",
      name: "Overflow (eight tabs, scrolling strip)",
      render: () => <PageTabsOverflowView />,
    },
  ],
}
