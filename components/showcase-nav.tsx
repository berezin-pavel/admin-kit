import {
  ShowcaseNavBody,
  type ShowcaseNavGroupData,
} from "@/components/showcase-nav-body"
import type { ShowcaseEntry } from "@/showcase/types"

interface ShowcaseNavGroup {
  title: string
  items: readonly string[]
}

interface ResolvedNavGroup {
  title: string
  entries: readonly ShowcaseEntry[]
}

const ENTRY_GROUPS: readonly ShowcaseNavGroup[] = [
  { title: "Shell", items: ["admin-shell"] },
  {
    title: "Controls",
    items: ["theme-toggle", "sidebar-toggle"],
  },
  {
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
    title: "Page parts",
    items: ["page-header", "status-badge", "hint"],
  },
  {
    title: "Fields",
    items: ["date-field", "date-time-field", "time-field", "color-field"],
  },
  {
    title: "Feedback",
    items: ["confirm-dialog", "admin-toaster"],
  },
  { title: "Pages", items: ["page-list", "page-entity"] },
  {
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

const REFERENCE_SECTION: ShowcaseNavGroupData = {
  title: "Reference",
  items: [
    { id: "tokens", title: "Theme tokens" },
    { id: "primitives", title: "Primitives" },
  ],
}

function resolveGroups(
  entries: readonly ShowcaseEntry[]
): readonly ResolvedNavGroup[] {
  const byItem = new Map(entries.map((entry) => [entry.item, entry]))
  const grouped = new Set<string>()

  const groups = ENTRY_GROUPS.map((group) => ({
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
    groups.push({ title: "Other", entries: rest })
  }

  return groups
}

function toNavGroupData(group: ResolvedNavGroup): ShowcaseNavGroupData {
  return {
    title: group.title,
    items: group.entries.map((entry) => ({
      id: entry.item,
      title: entry.title,
    })),
  }
}

export function ShowcaseNav({
  entries,
}: {
  entries: readonly ShowcaseEntry[]
}) {
  const groups = resolveGroups(entries).map(toNavGroupData)

  return (
    <nav
      aria-label="Showcase sections"
      className="sticky top-0 z-20 md:top-8 md:w-56 md:shrink-0"
    >
      <ShowcaseNavBody groups={groups} referenceSection={REFERENCE_SECTION} />
    </nav>
  )
}
