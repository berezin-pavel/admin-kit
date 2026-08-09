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
                <figcaption className="text-sm text-muted-foreground">
                  {view.name}
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
