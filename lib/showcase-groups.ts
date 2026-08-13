import type { ShowcaseEntry } from "@/showcase/types"

export interface ShowcaseGroupDefinition {
  id: string
  title: string
  items: readonly string[]
}

export interface ShowcaseResolvedGroup {
  id: string
  title: string
  entries: readonly ShowcaseEntry[]
}

export const SHOWCASE_ENTRY_GROUPS: readonly ShowcaseGroupDefinition[] = [
  { id: "shell", title: "Shell", items: ["admin-shell"] },
  {
    id: "controls",
    title: "Controls",
    items: ["theme-toggle", "sidebar-toggle", "user-menu"],
  },
  {
    id: "localization",
    title: "Localization",
    items: ["language-toggle", "locale-ru"],
  },
  {
    id: "widgets",
    title: "Widgets",
    items: [
      "widget-metric",
      "widget-table",
      "widget-progress",
      "widget-chart",
      "widget-list",
      "widget-placeholder",
    ],
  },
  {
    id: "page-parts",
    title: "Page parts",
    items: ["page-header", "status-badge", "hint", "row-actions", "breadcrumbs"],
  },
  {
    id: "fields",
    title: "Fields",
    items: [
      "text-field",
      "number-field",
      "textarea-field",
      "select-field",
      "checkbox-field",
      "date-field",
      "date-time-field",
      "date-range-field",
      "time-field",
      "color-field",
    ],
  },
  {
    id: "feedback",
    title: "Feedback",
    items: ["confirm-dialog", "admin-toaster"],
  },
  {
    id: "pages",
    title: "Pages",
    items: ["page-list", "page-entity", "page-form"],
  },
  {
    id: "states",
    title: "States",
    items: [
      "state-loading",
      "state-empty",
      "state-error",
      "state-forbidden",
      "state-offline",
    ],
  },
]

const OTHER_GROUP_ID = "other"
const OTHER_GROUP_TITLE = "Other"

export function resolveShowcaseGroups(
  entries: readonly ShowcaseEntry[]
): readonly ShowcaseResolvedGroup[] {
  const byItem = new Map(entries.map((entry) => [entry.item, entry]))
  const grouped = new Set<string>()

  const groups = SHOWCASE_ENTRY_GROUPS.map((group) => ({
    id: group.id,
    title: group.title,
    entries: group.items
      .map((item) => {
        grouped.add(item)
        return byItem.get(item)
      })
      .filter((entry): entry is ShowcaseEntry => entry !== undefined),
  })).filter((group) => group.entries.length > 0)

  const rest = entries.filter((entry) => !grouped.has(entry.item))

  if (rest.length > 0) {
    groups.push({ id: OTHER_GROUP_ID, title: OTHER_GROUP_TITLE, entries: rest })
  }

  return groups
}
