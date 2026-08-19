import {
  ShowcaseNavBody,
  type ShowcaseNavItem,
} from "@/components/showcase-nav-body"
import { resolveShowcaseGroups, showcaseGroupHref } from "@/lib/showcase-groups"
import type { ShowcaseEntry } from "@/showcase/types"

const REFERENCE_ITEMS: readonly ShowcaseNavItem[] = [
  { id: "tokens", title: "Theme tokens", href: "/tokens" },
]

export function ShowcaseNav({
  entries,
  activeId,
}: {
  entries: readonly ShowcaseEntry[]
  activeId?: string
}) {
  const items = resolveShowcaseGroups(entries).map((group) => ({
    id: group.id,
    title: group.title,
    href: showcaseGroupHref(group.id),
    children: group.entries.map((entry) => ({
      id: entry.item,
      title: entry.title,
      href: `${showcaseGroupHref(group.id)}#${entry.item}`,
    })),
  }))

  return (
    <nav
      aria-label="Showcase sections"
      className="sticky top-0 z-20 md:top-8 md:w-56 md:shrink-0"
    >
      <ShowcaseNavBody
        items={items}
        referenceItems={REFERENCE_ITEMS}
        activeId={activeId}
      />
    </nav>
  )
}
