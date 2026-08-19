import Link from "next/link"

import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"
import { Button, buttonVariants } from "@/components/ui/button"
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { deriveAccentTokens } from "@/registry/admin-appearance/appearance-accent"
import {
  accentPalette,
  gradientFamilies,
  gradientFamilyNames,
  gradientPalette,
  type AccentId,
} from "@/registry/admin-appearance/appearance-palette"
import { Block } from "@/registry/admin-appearance/block"
import { adminRowClassName } from "@/registry/admin-shell/admin-row"

const ACCENT_TOKEN_KEYS = [
  "primary",
  "primary-foreground",
  "ring",
  "sidebar-active",
  "sidebar-active-foreground",
  "sidebar-primary",
  "sidebar-primary-foreground",
] as const

function accentPreviewCss(): string {
  return accentPalette
    .map((accent) => {
      const { light, dark } = deriveAccentTokens(accent.hex)
      const lightLines = ACCENT_TOKEN_KEYS.map(
        (key) => `  --${key}: ${light[key]};`
      ).join("\n")
      const darkLines = ACCENT_TOKEN_KEYS.map(
        (key) => `  --${key}: ${dark[key]};`
      ).join("\n")
      return [
        `[data-accent-preview="${accent.id}-light"] {\n${lightLines}\n}`,
        `[data-accent-preview="${accent.id}-dark"] {\n${darkLines}\n}`,
      ].join("\n\n")
    })
    .join("\n\n")
}

function AccentSchemeSample({
  id,
  scheme,
}: {
  id: AccentId
  scheme: "light" | "dark"
}) {
  return (
    <div
      data-accent-preview={`${id}-${scheme}`}
      className={cn(
        "flex flex-col gap-2 rounded-md p-3",
        scheme === "light"
          ? "bg-background text-foreground"
          : "bg-[oklch(0.145_0_0)] text-[oklch(0.985_0_0)]"
      )}
    >
      <Button size="sm">Primary</Button>
      <div
        className={cn(
          "text-[0.9375rem]",
          adminRowClassName(false),
          "bg-sidebar-active font-semibold text-sidebar-active-foreground"
        )}
      >
        Active item
      </div>
      <div className="flex items-center gap-3">
        <Checkbox aria-label={`${id} ${scheme} sample checkbox`} defaultChecked />
        <Progress value={60} aria-label="Progress sample" className="flex-1" />
      </div>
    </div>
  )
}

export default function PalettePage() {
  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-8 md:py-12">
      <style dangerouslySetInnerHTML={{ __html: accentPreviewCss() }} />
      <header className="flex items-start justify-between gap-6">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold">Palette</h1>
            <p className="text-muted-foreground">
              The fixed set of one hundred three gradients and twenty accents admin-kit
              ships with — the only source of colour choices, each measured
              for text contrast along the whole gradient and, for accents,
              every filled pair the derivation produces.
            </p>
          </div>
          <Link
            href="/"
            className={cn(
              buttonVariants({ variant: "outline", size: "sm" }),
              "w-fit"
            )}
          >
            Back to showcase
          </Link>
        </div>
        <ThemeToggle />
      </header>

      <section className="flex flex-col gap-8">
        <h2 className="text-2xl font-semibold">Gradients</h2>
        {gradientFamilies.map((family) => (
          <div key={family} className="flex flex-col gap-4">
            <h3 className="text-lg font-semibold">{gradientFamilyNames[family]}</h3>
            <div className="grid grid-cols-1 gap-8">
              {gradientPalette
                .filter((gradient) => gradient.family === family)
                .map((gradient) => (
                  <div key={gradient.id} className="flex flex-col gap-2">
                    <Block gradient={gradient.id} className="min-h-64">
                      <CardHeader>
                        <CardTitle>{gradient.name}</CardTitle>
                        <CardDescription>Revenue 12,480 · +8.2%</CardDescription>
                      </CardHeader>
                      <CardContent className="mt-auto flex flex-wrap items-center gap-2">
                        <Button variant="outline" size="sm">
                          Outline
                        </Button>
                        <Button variant="ghost" size="sm">
                          Ghost
                        </Button>
                        <Button variant="secondary" size="sm">
                          Secondary
                        </Button>
                        <Input
                          placeholder="Search"
                          aria-label={`Search ${gradient.name}`}
                          className="w-32"
                        />
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`${gradient.id}-checkbox`}
                            aria-label={`${gradient.name} sample checkbox`}
                          />
                          <Label htmlFor={`${gradient.id}-checkbox`}>Checkbox</Label>
                        </div>
                        <Badge variant="outline">Badge</Badge>
                        <Skeleton className="h-3 w-24" />
                      </CardContent>
                    </Block>
                    <div className="flex flex-col gap-1">
                      <div
                        className="h-12 rounded-md"
                        style={{
                          backgroundImage: `var(--gradient-${gradient.id}-soft)`,
                        }}
                      />
                      <span className="text-xs text-muted-foreground">
                        soft backdrop
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </section>

      <section className="flex flex-col gap-6">
        <h2 className="text-2xl font-semibold">Accents</h2>
        <div className="flex flex-col gap-4">
          {accentPalette.map((accent) => (
            <div
              key={accent.id}
              className="flex flex-col gap-3 rounded-lg border border-border p-4 sm:flex-row sm:items-center sm:gap-4"
            >
              <div className="flex min-w-32 items-center gap-2">
                <span
                  aria-hidden="true"
                  className="size-6 shrink-0 rounded-full ring-1 ring-foreground/10"
                  style={{ backgroundColor: accent.hex }}
                />
                <span className="text-sm font-medium">{accent.name}</span>
              </div>
              <div className="grid flex-1 gap-3 sm:grid-cols-2">
                <AccentSchemeSample id={accent.id} scheme="light" />
                <AccentSchemeSample id={accent.id} scheme="dark" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
