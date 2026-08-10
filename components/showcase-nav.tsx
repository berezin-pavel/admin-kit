import { ChevronDown } from "lucide-react"
import Link from "next/link"

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

const REFERENCE_SECTIONS = [
  { href: "#tokens", title: "Theme tokens" },
  { href: "#primitives", title: "Primitives" },
]

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

export function ShowcaseNav({
  entries,
}: {
  entries: readonly ShowcaseEntry[]
}) {
  const groups = resolveGroups(entries)

  return (
    <nav
      aria-label="Showcase sections"
      className="sticky top-0 z-20 md:top-8 md:w-56 md:shrink-0"
    >
      <details className="-mx-6 border-b border-border bg-background/95 px-6 py-2 backdrop-blur md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium">
          Sections
          <ChevronDown className="size-4 text-muted-foreground" />
        </summary>
        <div className="max-h-[70svh] overflow-y-auto py-3">
          <NavGroups groups={groups} />
        </div>
      </details>
      <div className="hidden md:block md:max-h-[calc(100svh-4rem)] md:overflow-y-auto">
        <NavGroups groups={groups} />
      </div>
    </nav>
  )
}

function NavGroups({ groups }: { groups: readonly ResolvedNavGroup[] }) {
  return (
    <div className="flex flex-col gap-5 text-sm">
      {groups.map((group) => (
        <div key={group.title} className="flex flex-col gap-1.5">
          <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
            {group.title}
          </span>
          <ul className="flex flex-col gap-1">
            {group.entries.map((entry) => (
              <li key={entry.item}>
                <Link
                  href={`#${entry.item}`}
                  className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                >
                  {entry.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="flex flex-col gap-1.5 border-t border-border pt-4">
        <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          Reference
        </span>
        <ul className="flex flex-col gap-1">
          {REFERENCE_SECTIONS.map((section) => (
            <li key={section.href}>
              <Link
                href={section.href}
                className="block rounded-md px-2 py-1 text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {section.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
