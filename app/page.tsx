import Link from "next/link"

import { ShowcaseGallery } from "@/components/showcase-gallery"
import { ShowcaseNav } from "@/components/showcase-nav"
import { SHOWCASE_NAV_SENTINEL_ID } from "@/components/showcase-nav-body"
import { ShowcasePrimitives } from "@/components/showcase-primitives"
import { ShowcaseTokens } from "@/components/showcase-tokens"
import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { showcaseEntries } from "@/showcase/entries"

export default function Page() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-6 py-8 md:py-12">
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">admin-kit</h1>
            <p className="text-muted-foreground">
              Admin panel parts you install into your project with the shadcn
              CLI and update whenever you decide.
            </p>
          </div>
          <Link
            href="/demo"
            className={cn(buttonVariants({ size: "sm" }), "w-fit")}
          >
            View demo
          </Link>
        </div>
        <ThemeToggle />
      </header>
      <div className="flex flex-col gap-8 md:flex-row md:items-start md:gap-10">
        <ShowcaseNav entries={showcaseEntries} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-16">
            <ShowcaseGallery entries={showcaseEntries} />
            <ShowcaseTokens />
            <ShowcasePrimitives />
          </div>
          <div
            id={SHOWCASE_NAV_SENTINEL_ID}
            aria-hidden="true"
            className="h-px"
          />
        </div>
      </div>
    </main>
  )
}
