import { ShowcaseGallery } from "@/components/showcase-gallery"
import { ThemeToggle } from "@/components/theme-toggle"
import { showcaseEntries } from "@/showcase/entries"

export default function Page() {
  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-12 px-6 py-12">
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">admin-kit</h1>
          <p className="text-muted-foreground">
            Admin panel parts you install into your project with the shadcn
            CLI and update whenever you decide.
          </p>
        </div>
        <ThemeToggle />
      </header>
      <ShowcaseGallery entries={showcaseEntries} />
    </main>
  )
}
