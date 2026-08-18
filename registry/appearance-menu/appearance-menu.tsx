"use client"

import { useId, type ReactElement, type ReactNode } from "react"
import { Palette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Hint } from "@/registry/hint/hint"
import { cn } from "@/lib/utils"

import {
  accentPalette,
  gradientFamilies,
  gradientFamilyNames,
  gradientPalette,
  type AccentId,
  type AdminAppearance,
  type GradientFamily,
  type GradientId,
} from "@/registry/admin-appearance/appearance-palette"

export interface AppearanceMenuLabels {
  label?: string
  accent?: string
  sidebar?: string
  signIn?: string
  page?: string
  pages?: string
  inherit?: string
  none?: string
  gradients?: Partial<Record<GradientId, string>>
  accents?: Partial<Record<AccentId, string>>
  families?: Partial<Record<GradientFamily, string>>
}

export interface AppearanceMenuPage {
  id: string
  label: string
}

export interface AppearanceMenuProps {
  value: AdminAppearance
  onChange: (next: AdminAppearance) => void
  pages?: readonly AppearanceMenuPage[]
  labels?: AppearanceMenuLabels
  className?: string
}

type GradientChoice = GradientId | "none"
type PageGradientChoice = GradientChoice | "inherit"

type ResolvedLabels = Required<
  Omit<AppearanceMenuLabels, "gradients" | "accents" | "families">
> & {
  gradients: Partial<Record<GradientId, string>>
  accents: Partial<Record<AccentId, string>>
  families: Record<GradientFamily, string>
}

const defaultLabels: Required<
  Omit<AppearanceMenuLabels, "gradients" | "accents" | "families">
> = {
  label: "Appearance",
  accent: "Accent color",
  sidebar: "Sidebar",
  signIn: "Sign-in screen",
  page: "Page background",
  pages: "Per page",
  inherit: "Same as default",
  none: "No gradient",
}

function resolveLabels(labels: AppearanceMenuLabels | undefined): ResolvedLabels {
  return {
    label: labels?.label ?? defaultLabels.label,
    accent: labels?.accent ?? defaultLabels.accent,
    sidebar: labels?.sidebar ?? defaultLabels.sidebar,
    signIn: labels?.signIn ?? defaultLabels.signIn,
    page: labels?.page ?? defaultLabels.page,
    pages: labels?.pages ?? defaultLabels.pages,
    inherit: labels?.inherit ?? defaultLabels.inherit,
    none: labels?.none ?? defaultLabels.none,
    gradients: labels?.gradients ?? {},
    accents: labels?.accents ?? {},
    families: { ...gradientFamilyNames, ...labels?.families },
  }
}

function gradientName(id: GradientId, labels: ResolvedLabels): string {
  const override = labels.gradients[id]
  if (override) {
    return override
  }
  const entry = gradientPalette.find((candidate) => candidate.id === id)
  return entry ? entry.name : id
}

function accentName(id: AccentId, labels: ResolvedLabels): string {
  const override = labels.accents[id]
  if (override) {
    return override
  }
  const entry = accentPalette.find((candidate) => candidate.id === id)
  return entry ? entry.name : id
}

function GradientOption({
  id,
  name,
}: {
  id: GradientId
  name: string
}): ReactElement {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-block h-3 w-8 rounded-sm ring-1 ring-foreground/10"
        style={{ backgroundImage: `var(--gradient-${id})` }}
      />
      <span>{name}</span>
    </span>
  )
}

function renderGradientChoice(
  choice: GradientChoice,
  labels: ResolvedLabels
): ReactNode {
  if (choice === "none") {
    return labels.none
  }
  return <GradientOption id={choice} name={gradientName(choice, labels)} />
}

function renderPageGradientChoice(
  choice: PageGradientChoice,
  labels: ResolvedLabels
): ReactNode {
  if (choice === "inherit") {
    return labels.inherit
  }
  return renderGradientChoice(choice, labels)
}

function GradientSelectItems({ labels }: { labels: ResolvedLabels }): ReactElement {
  return (
    <>
      {gradientFamilies.map((family) => (
        <SelectGroup key={family}>
          <SelectLabel>{labels.families[family]}</SelectLabel>
          {gradientPalette
            .filter((entry) => entry.family === family)
            .map((entry) => (
              <SelectItem key={entry.id} value={entry.id}>
                <GradientOption id={entry.id} name={gradientName(entry.id, labels)} />
              </SelectItem>
            ))}
        </SelectGroup>
      ))}
    </>
  )
}

export function AppearanceMenu({
  value,
  onChange,
  pages = [],
  labels: labelsProp,
  className,
}: AppearanceMenuProps): ReactElement {
  const labels = resolveLabels(labelsProp)
  const baseId = useId()
  const sidebarId = `${baseId}-sidebar`
  const signInId = `${baseId}-sign-in`
  const pageId = `${baseId}-page`

  const selectAccent = (id: AccentId) => {
    onChange({ ...value, accent: id })
  }

  const selectSidebar = (next: GradientChoice) => {
    onChange({ ...value, sidebar: next === "none" ? null : next })
  }

  const selectSignIn = (next: GradientChoice) => {
    onChange({ ...value, signIn: next === "none" ? null : next })
  }

  const selectPageBackground = (next: GradientChoice) => {
    onChange({ ...value, page: next === "none" ? null : next })
  }

  const selectPageGradient = (pageEntryId: string, next: PageGradientChoice) => {
    if (next === "inherit") {
      const nextPages = { ...value.pages }
      delete nextPages[pageEntryId]
      onChange({ ...value, pages: nextPages })
      return
    }
    onChange({
      ...value,
      pages: { ...value.pages, [pageEntryId]: next === "none" ? null : next },
    })
  }

  return (
    <Popover>
      <Hint
        text={labels.label}
        render={
          <PopoverTrigger
            aria-label={labels.label}
            render={<Button variant="outline" size="icon" className={className} />}
          >
            <Palette className="size-4" aria-hidden="true" />
          </PopoverTrigger>
        }
      />
      <PopoverContent
        aria-label={labels.label}
        className="max-h-[70vh] w-[22rem] overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {labels.accent}
            </span>
            <div
              role="radiogroup"
              aria-label={labels.accent}
              className="grid grid-cols-10 gap-1.5"
            >
              {accentPalette.map((entry) => {
                const selected = value.accent === entry.id
                return (
                  <button
                    key={entry.id}
                    type="button"
                    role="radio"
                    aria-checked={selected}
                    aria-label={accentName(entry.id, labels)}
                    onClick={() => selectAccent(entry.id)}
                    className={cn(
                      "size-6 rounded-full ring-1 ring-foreground/10",
                      selected && "ring-2 ring-ring ring-offset-2 ring-offset-popover"
                    )}
                    style={{ backgroundColor: entry.hex }}
                  />
                )
              })}
            </div>
          </section>

          <section className="flex flex-col gap-1.5">
            <Label
              htmlFor={sidebarId}
              className="text-xs font-medium text-muted-foreground"
            >
              {labels.sidebar}
            </Label>
            <Select<GradientChoice>
              value={value.sidebar ?? "none"}
              onValueChange={(next) => {
                if (next === null) {
                  return
                }
                selectSidebar(next)
              }}
            >
              <SelectTrigger id={sidebarId} className="w-full">
                <SelectValue>
                  {renderGradientChoice(value.sidebar ?? "none", labels)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-auto min-w-(--anchor-width)"
              >
                <SelectItem value="none">{labels.none}</SelectItem>
                <GradientSelectItems labels={labels} />
              </SelectContent>
            </Select>
          </section>

          <section className="flex flex-col gap-1.5">
            <Label
              htmlFor={signInId}
              className="text-xs font-medium text-muted-foreground"
            >
              {labels.signIn}
            </Label>
            <Select<GradientChoice>
              value={value.signIn ?? "none"}
              onValueChange={(next) => {
                if (next === null) {
                  return
                }
                selectSignIn(next)
              }}
            >
              <SelectTrigger id={signInId} className="w-full">
                <SelectValue>
                  {renderGradientChoice(value.signIn ?? "none", labels)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-auto min-w-(--anchor-width)"
              >
                <SelectItem value="none">{labels.none}</SelectItem>
                <GradientSelectItems labels={labels} />
              </SelectContent>
            </Select>
          </section>

          <section className="flex flex-col gap-1.5">
            <Label
              htmlFor={pageId}
              className="text-xs font-medium text-muted-foreground"
            >
              {labels.page}
            </Label>
            <Select<GradientChoice>
              value={value.page ?? "none"}
              onValueChange={(next) => {
                if (next === null) {
                  return
                }
                selectPageBackground(next)
              }}
            >
              <SelectTrigger id={pageId} className="w-full">
                <SelectValue>
                  {renderGradientChoice(value.page ?? "none", labels)}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-auto min-w-(--anchor-width)"
              >
                <SelectItem value="none">{labels.none}</SelectItem>
                <GradientSelectItems labels={labels} />
              </SelectContent>
            </Select>
          </section>

          {pages.length > 0 ? (
            <section className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {labels.pages}
              </span>
              <div className="flex flex-col gap-2">
                {pages.map((page) => {
                  const hasOverride = Object.hasOwn(value.pages, page.id)
                  const selectValue: PageGradientChoice = !hasOverride
                    ? "inherit"
                    : (value.pages[page.id] ?? "none")
                  const rowSelectId = `${baseId}-page-${page.id}`

                  return (
                    <div key={page.id} className="flex items-center gap-2">
                      <Label
                        htmlFor={rowSelectId}
                        className="min-w-0 flex-1 truncate text-sm font-normal"
                      >
                        {page.label}
                      </Label>
                      <Select<PageGradientChoice>
                        value={selectValue}
                        onValueChange={(next) => {
                          if (next === null) {
                            return
                          }
                          selectPageGradient(page.id, next)
                        }}
                      >
                        <SelectTrigger id={rowSelectId} size="sm">
                          <SelectValue>
                            {renderPageGradientChoice(selectValue, labels)}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent
                          align="start"
                          alignItemWithTrigger={false}
                          className="w-auto min-w-(--anchor-width)"
                        >
                          <SelectItem value="inherit">{labels.inherit}</SelectItem>
                          <SelectItem value="none">{labels.none}</SelectItem>
                          <GradientSelectItems labels={labels} />
                        </SelectContent>
                      </Select>
                    </div>
                  )
                })}
              </div>
            </section>
          ) : null}
        </div>
      </PopoverContent>
    </Popover>
  )
}
