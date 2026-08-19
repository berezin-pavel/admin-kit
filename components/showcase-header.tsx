import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function ShowcaseHeader({
  title = "admin-kit",
  description = "Admin panel parts you install into your project with the shadcn CLI and update whenever you decide.",
  backLink = false,
}: {
  title?: string
  description?: string
  backLink?: boolean
}) {
  return (
    <header className="flex items-start justify-between gap-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {backLink ? (
            <Link
              href="/"
              className={cn(
                buttonVariants({ variant: "outline", size: "sm" }),
                "w-fit"
              )}
            >
              Back to showcase
            </Link>
          ) : null}
          <Link
            href="/demo"
            className={cn(buttonVariants({ size: "sm" }), "w-fit")}
          >
            View demo
          </Link>
          <Link
            href="/demo-flush"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit"
            )}
          >
            Flush demo
          </Link>
          <Link
            href="/palette"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit"
            )}
          >
            Palette
          </Link>
          <Link
            href="/tokens"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit"
            )}
          >
            Theme tokens
          </Link>
        </div>
      </div>
      <ThemeToggle />
    </header>
  )
}
