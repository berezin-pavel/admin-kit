import Link from "next/link"

import type { ShowcaseEntry } from "@/showcase/types"

export function ShowcaseGallery({
  entries,
}: {
  entries: readonly ShowcaseEntry[]
}) {
  return (
    <div className="flex flex-col gap-16">
      {entries.map((entry) => (
        <section key={entry.item} className="flex flex-col gap-6">
          <header className="flex flex-col gap-2">
            <h2 className="text-2xl font-semibold">{entry.title}</h2>
            <p className="max-w-2xl text-muted-foreground">
              {entry.description}
            </p>
            <code className="w-fit rounded-md bg-muted px-2 py-1 text-sm">
              pnpm dlx shadcn@latest add berezin-pavel/admin-kit/{entry.item}
            </code>
          </header>
          <div className="flex flex-col gap-8">
            {entry.views.map((view) => (
              <figure key={view.id} className="flex flex-col gap-3">
                <figcaption className="flex items-baseline justify-between gap-3 text-sm text-muted-foreground">
                  <span>{view.name}</span>
                  <Link
                    href={`/preview/${entry.item}/${view.id}`}
                    className="text-xs text-muted-foreground/70 underline-offset-4 hover:text-foreground hover:underline"
                  >
                    Open full page
                  </Link>
                </figcaption>
                <div className="max-h-[36rem] overflow-auto rounded-lg border border-border p-6">
                  <view.render />
                </div>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
