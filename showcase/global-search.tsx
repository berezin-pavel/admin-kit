import { GlobalSearchView } from "./global-search-view"
import type { ShowcaseEntry } from "./types"

export const globalSearchEntry: ShowcaseEntry = {
  item: "global-search",
  title: "Global search",
  description:
    "A ⌘K dialog over a list you pass in: the item filters on the label and the group name, groups the matches in the order the groups first appear and keeps the ungrouped ones last. Up, down and Enter walk the list, a click picks the same way, and the choice leaves as onSelect(id) — routing and fetching stay with the consumer. The trigger is either a search-shaped field with the shortcut in a kbd, or an icon button with a tooltip for a tight header.",
  views: [
    {
      id: "field",
      name: "Field trigger (⌘K works here too)",
      render: () => <GlobalSearchView variant="field" />,
    },
    {
      id: "icon",
      name: "Icon trigger (hotkey off — the field above owns ⌘K on this page)",
      render: () => <GlobalSearchView variant="icon" hotkey={false} />,
    },
  ],
}
