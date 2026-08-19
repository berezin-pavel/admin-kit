import Link from "next/link"

import { ShowcaseHeader } from "@/components/showcase-header"
import { resolveShowcaseGroups, showcaseGroupHref } from "@/lib/showcase-groups"
import { showcaseEntries } from "@/showcase/entries"

export default function Page() {
  const groups = resolveShowcaseGroups(showcaseEntries)

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8 md:py-12">
      <ShowcaseHeader />
      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Sections</h2>
        <ul className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <li
              key={group.id}
              className="flex flex-col gap-3 rounded-xl border border-border p-5"
            >
              <div className="flex items-baseline justify-between gap-3">
                <Link
                  href={showcaseGroupHref(group.id)}
                  className="text-lg font-semibold underline-offset-4 hover:underline"
                >
                  {group.title}
                </Link>
                <span className="text-xs text-muted-foreground">
                  {group.entries.length}{" "}
                  {group.entries.length === 1 ? "item" : "items"}
                </span>
              </div>
              <ul className="flex flex-wrap gap-x-3 gap-y-1 text-sm">
                {group.entries.map((entry) => (
                  <li key={entry.item}>
                    <Link
                      href={`${showcaseGroupHref(group.id)}#${entry.item}`}
                      className="text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                    >
                      {entry.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
