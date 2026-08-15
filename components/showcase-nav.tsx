import {
  ShowcaseNavBody,
  type ShowcaseNavItem,
} from "@/components/showcase-nav-body"
import { resolveShowcaseGroups } from "@/lib/showcase-groups"
import type { ShowcaseEntry } from "@/showcase/types"

const REFERENCE_ITEMS: readonly ShowcaseNavItem[] = [
  { id: "tokens", title: "Theme tokens" },
]

export function ShowcaseNav({
  entries,
}: {
  entries: readonly ShowcaseEntry[]
}) {
  const items = resolveShowcaseGroups(entries).map((group) => ({
    id: group.id,
    title: group.title,
    children: group.entries.map((entry) => ({
      id: entry.item,
      title: entry.title,
    })),
  }))

  return (
    <nav
      aria-label="Showcase sections"
      className="sticky top-0 z-20 md:top-8 md:w-56 md:shrink-0"
    >
      <ShowcaseNavBody items={items} referenceItems={REFERENCE_ITEMS} />
    </nav>
  )
}
