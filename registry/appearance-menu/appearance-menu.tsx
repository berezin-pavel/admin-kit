"use client"

import {
  useId,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from "react"
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
  isCustomColor,
  type AccentId,
  type AdminAppearance,
  type CustomColor,
  type GradientFamily,
  type GradientId,
  type SurfaceChoice,
} from "@/registry/admin-appearance/appearance-palette"
import {
  appearanceThemes,
  type AppearanceTheme,
} from "@/registry/admin-appearance/appearance-themes"
import {
  DragHandle,
  useDragOffset,
} from "@/registry/admin-appearance/drag-handle"

export interface AppearanceMenuLabels {
  label?: string
  theme?: string
  accent?: string
  sidebar?: string
  header?: string
  signIn?: string
  page?: string
  pages?: string
  inherit?: string
  none?: string
  custom?: string
  customColor?: string
  customColorHex?: string
  close?: string
  gradients?: Partial<Record<GradientId, string>>
  accents?: Partial<Record<AccentId, string>>
  families?: Partial<Record<GradientFamily, string>>
  themes?: Partial<Record<string, string>>
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

const FALLBACK_CUSTOM_COLOR: CustomColor = "#6b7280"

type SurfaceSelectValue = GradientId | "none" | "custom"
type PageSurfaceSelectValue = SurfaceSelectValue | "inherit"

type ResolvedLabels = Required<
  Omit<AppearanceMenuLabels, "gradients" | "accents" | "families" | "themes">
> & {
  gradients: Partial<Record<GradientId, string>>
  accents: Partial<Record<AccentId, string>>
  families: Record<GradientFamily, string>
  themes: Partial<Record<string, string>>
}

const defaultLabels: Required<
  Omit<AppearanceMenuLabels, "gradients" | "accents" | "families" | "themes">
> = {
  label: "Appearance",
  theme: "Theme",
  accent: "Accent color",
  sidebar: "Sidebar",
  header: "Header",
  signIn: "Sign-in screen",
  page: "Page background",
  pages: "Per page",
  inherit: "Same as default",
  none: "No gradient",
  custom: "Custom color…",
  customColor: "Custom color",
  customColorHex: "Custom color hex",
  close: "Close",
}

function resolveLabels(labels: AppearanceMenuLabels | undefined): ResolvedLabels {
  return {
    label: labels?.label ?? defaultLabels.label,
    theme: labels?.theme ?? defaultLabels.theme,
    accent: labels?.accent ?? defaultLabels.accent,
    sidebar: labels?.sidebar ?? defaultLabels.sidebar,
    header: labels?.header ?? defaultLabels.header,
    signIn: labels?.signIn ?? defaultLabels.signIn,
    page: labels?.page ?? defaultLabels.page,
    pages: labels?.pages ?? defaultLabels.pages,
    inherit: labels?.inherit ?? defaultLabels.inherit,
    none: labels?.none ?? defaultLabels.none,
    custom: labels?.custom ?? defaultLabels.custom,
    customColor: labels?.customColor ?? defaultLabels.customColor,
    customColorHex: labels?.customColorHex ?? defaultLabels.customColorHex,
    close: labels?.close ?? defaultLabels.close,
    gradients: labels?.gradients ?? {},
    accents: labels?.accents ?? {},
    families: { ...gradientFamilyNames, ...labels?.families },
    themes: labels?.themes ?? {},
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

function accentHexOf(accent: AdminAppearance["accent"]): string {
  if (isCustomColor(accent)) {
    return accent.toLowerCase()
  }
  const entry = accentPalette.find((candidate) => candidate.id === accent)
  return entry ? entry.hex : FALLBACK_CUSTOM_COLOR
}

function surfaceSwatchStyle(choice: SurfaceChoice): CSSProperties {
  return isCustomColor(choice)
    ? { backgroundColor: choice.toLowerCase() }
    : { backgroundImage: `var(--gradient-${choice})` }
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

function CustomColorOption({ color }: { color: CustomColor }): ReactElement {
  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="inline-block h-3 w-8 rounded-sm ring-1 ring-foreground/10"
        style={{ backgroundColor: color.toLowerCase() }}
      />
      <span>{color.toLowerCase()}</span>
    </span>
  )
}

function renderSurfaceChoice(
  choice: SurfaceChoice | null,
  labels: ResolvedLabels
): ReactNode {
  if (choice === null) {
    return labels.none
  }
  if (isCustomColor(choice)) {
    return <CustomColorOption color={choice} />
  }
  return <GradientOption id={choice} name={gradientName(choice, labels)} />
}

function selectValueOf(choice: SurfaceChoice | null): SurfaceSelectValue {
  if (choice === null) {
    return "none"
  }
  return isCustomColor(choice) ? "custom" : choice
}

function surfaceFromSelect(
  next: SurfaceSelectValue,
  current: SurfaceChoice | null | undefined
): SurfaceChoice | null {
  if (next === "none") {
    return null
  }
  if (next === "custom") {
    return isCustomColor(current) ? current : FALLBACK_CUSTOM_COLOR
  }
  return next
}

function SurfaceSelectItems({ labels }: { labels: ResolvedLabels }): ReactElement {
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

function CustomColorInputs({
  color,
  labels,
  onChange,
  className,
  size = "default",
}: {
  color: CustomColor
  labels: ResolvedLabels
  onChange: (next: CustomColor) => void
  className?: string
  size?: "default" | "sm"
}): ReactElement {
  const current = color.toLowerCase()
  const [draft, setDraft] = useState(current)
  const [syncedColor, setSyncedColor] = useState(current)

  if (current !== syncedColor) {
    setSyncedColor(current)
    setDraft(current)
  }

  const handleText = (event: ChangeEvent<HTMLInputElement>) => {
    const next = event.target.value
    setDraft(next)
    if (isCustomColor(next)) {
      onChange(next.toLowerCase() as CustomColor)
    }
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <input
        type="color"
        aria-label={labels.customColor}
        value={current}
        onChange={(event) =>
          onChange(event.target.value.toLowerCase() as CustomColor)
        }
        className={cn(
          "shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-1",
          size === "sm" ? "size-8" : "size-9"
        )}
      />
      <input
        type="text"
        aria-label={labels.customColorHex}
        value={draft}
        onChange={handleText}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        className={cn(
          "w-24 shrink-0 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30",
          size === "sm" ? "h-8" : "h-9"
        )}
      />
    </div>
  )
}

function SurfaceSection({
  id,
  label,
  value,
  labels,
  onChange,
}: {
  id: string
  label: string
  value: SurfaceChoice | null
  labels: ResolvedLabels
  onChange: (next: SurfaceChoice | null) => void
}): ReactElement {
  return (
    <section className="flex flex-col gap-1.5">
      <Label htmlFor={id} className="text-xs font-medium text-muted-foreground">
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Select<SurfaceSelectValue>
          value={selectValueOf(value)}
          onValueChange={(next) => {
            if (next === null) {
              return
            }
            onChange(surfaceFromSelect(next, value))
          }}
        >
          <SelectTrigger
            id={id}
            className="min-w-0 flex-1 data-[size=default]:h-9"
          >
            <SelectValue>{renderSurfaceChoice(value, labels)}</SelectValue>
          </SelectTrigger>
          <SelectContent
            align="start"
            alignItemWithTrigger={false}
            className="w-auto min-w-(--anchor-width)"
          >
            <SelectItem value="none">{labels.none}</SelectItem>
            <SelectItem value="custom">{labels.custom}</SelectItem>
            <SurfaceSelectItems labels={labels} />
          </SelectContent>
        </Select>
        {isCustomColor(value) ? (
          <CustomColorInputs color={value} labels={labels} onChange={onChange} />
        ) : null}
      </div>
    </section>
  )
}

function ThemeOption({
  theme,
  name,
}: {
  theme: AppearanceTheme
  name: string
}): ReactElement {
  const strip: readonly SurfaceChoice[] = [
    theme.appearance.sidebar,
    accentHexOf(theme.appearance.accent) as CustomColor,
    theme.appearance.page,
  ].filter((choice): choice is SurfaceChoice => choice !== null)

  return (
    <span className="flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-3 w-8 overflow-hidden rounded-sm ring-1 ring-foreground/10"
      >
        {strip.map((choice, index) => (
          <span
            key={`${choice}-${index}`}
            className="flex-1"
            style={surfaceSwatchStyle(choice)}
          />
        ))}
      </span>
      <span>{name}</span>
    </span>
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
  const [open, setOpen] = useState(false)
  const { ref, start, reset } = useDragOffset()
  const baseId = useId()
  const themeId = `${baseId}-theme`
  const sidebarId = `${baseId}-sidebar`
  const headerId = `${baseId}-header`
  const signInId = `${baseId}-sign-in`
  const pageId = `${baseId}-page`

  const surfaceOf = (choice: SurfaceChoice | null) =>
    typeof choice === "string" && isCustomColor(choice)
      ? choice.toLowerCase()
      : choice

  const matchesTheme = (theme: AppearanceTheme) =>
    surfaceOf(value.accent as SurfaceChoice) ===
      surfaceOf(theme.appearance.accent as SurfaceChoice) &&
    surfaceOf(value.sidebar) === surfaceOf(theme.appearance.sidebar) &&
    surfaceOf(value.header) === surfaceOf(theme.appearance.header) &&
    surfaceOf(value.signIn) === surfaceOf(theme.appearance.signIn) &&
    surfaceOf(value.page) === surfaceOf(theme.appearance.page)

  const activeTheme =
    appearanceThemes.find((theme) => matchesTheme(theme)) ?? null
  const activeThemeId = activeTheme?.id ?? null

  const applyTheme = (theme: AppearanceTheme) => {
    onChange({ ...theme.appearance, blocks: value.blocks, pages: value.pages })
  }

  const selectAccent = (accent: AccentId | CustomColor) => {
    onChange({ ...value, accent })
  }

  const selectPageGradient = (
    pageEntryId: string,
    next: PageSurfaceSelectValue
  ) => {
    if (next === "inherit") {
      const nextPages = { ...value.pages }
      delete nextPages[pageEntryId]
      onChange({ ...value, pages: nextPages })
      return
    }
    onChange({
      ...value,
      pages: {
        ...value.pages,
        [pageEntryId]: surfaceFromSelect(next, value.pages[pageEntryId]),
      },
    })
  }

  const setPageRowColor = (pageEntryId: string, next: CustomColor) => {
    onChange({ ...value, pages: { ...value.pages, [pageEntryId]: next } })
  }

  return (
    <Popover
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (!next) {
          reset()
        }
      }}
    >
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
        ref={ref}
        aria-label={labels.label}
        className="max-h-[70vh] w-[24rem] overflow-y-auto"
      >
        <DragHandle
          onPointerDown={start}
          onClose={() => {
            setOpen(false)
            reset()
          }}
          closeLabel={labels.close}
        />
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-1.5">
            <Label
              htmlFor={themeId}
              className="text-xs font-medium text-muted-foreground"
            >
              {labels.theme}
            </Label>
            <Select<string>
              value={activeThemeId}
              onValueChange={(next) => {
                const theme = appearanceThemes.find(
                  (candidate) => candidate.id === next
                )
                if (theme) {
                  applyTheme(theme)
                }
              }}
            >
              <SelectTrigger
                id={themeId}
                className="w-full data-[size=default]:h-9"
              >
                <SelectValue placeholder={labels.theme}>
                  {activeTheme ? (
                    <ThemeOption
                      theme={activeTheme}
                      name={labels.themes[activeTheme.id] ?? activeTheme.name}
                    />
                  ) : null}
                </SelectValue>
              </SelectTrigger>
              <SelectContent
                align="start"
                alignItemWithTrigger={false}
                className="w-auto min-w-(--anchor-width)"
              >
                {appearanceThemes.map((theme) => (
                  <SelectItem key={theme.id} value={theme.id}>
                    <ThemeOption
                      theme={theme}
                      name={labels.themes[theme.id] ?? theme.name}
                    />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </section>

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
            <CustomColorInputs
              color={accentHexOf(value.accent) as CustomColor}
              labels={labels}
              onChange={selectAccent}
            />
          </section>

          <SurfaceSection
            id={sidebarId}
            label={labels.sidebar}
            value={value.sidebar}
            labels={labels}
            onChange={(next) => onChange({ ...value, sidebar: next })}
          />

          <SurfaceSection
            id={headerId}
            label={labels.header}
            value={value.header}
            labels={labels}
            onChange={(next) => onChange({ ...value, header: next })}
          />

          <SurfaceSection
            id={signInId}
            label={labels.signIn}
            value={value.signIn}
            labels={labels}
            onChange={(next) => onChange({ ...value, signIn: next })}
          />

          <SurfaceSection
            id={pageId}
            label={labels.page}
            value={value.page}
            labels={labels}
            onChange={(next) => onChange({ ...value, page: next })}
          />

          {pages.length > 0 ? (
            <section className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {labels.pages}
              </span>
              <div className="flex flex-col gap-2">
                {pages.map((page) => {
                  const hasOverride = Object.hasOwn(value.pages, page.id)
                  const override = value.pages[page.id] ?? null
                  const selectValue: PageSurfaceSelectValue = !hasOverride
                    ? "inherit"
                    : selectValueOf(override)
                  const rowSelectId = `${baseId}-page-${page.id}`

                  return (
                    <div key={page.id} className="flex items-center gap-2">
                      <Label
                        htmlFor={rowSelectId}
                        className="min-w-0 flex-1 truncate text-sm font-normal"
                      >
                        {page.label}
                      </Label>
                      <Select<PageSurfaceSelectValue>
                          value={selectValue}
                          onValueChange={(next) => {
                            if (next === null) {
                              return
                            }
                            selectPageGradient(page.id, next)
                          }}
                        >
                          <SelectTrigger
                          id={rowSelectId}
                          size="sm"
                          className="data-[size=sm]:h-8"
                        >
                            <SelectValue>
                              {selectValue === "inherit"
                                ? labels.inherit
                                : renderSurfaceChoice(override, labels)}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent
                            align="start"
                            alignItemWithTrigger={false}
                            className="w-auto min-w-(--anchor-width)"
                          >
                            <SelectItem value="inherit">{labels.inherit}</SelectItem>
                            <SelectItem value="none">{labels.none}</SelectItem>
                            <SelectItem value="custom">{labels.custom}</SelectItem>
                          <SurfaceSelectItems labels={labels} />
                        </SelectContent>
                      </Select>
                      {isCustomColor(override) ? (
                        <CustomColorInputs
                          color={override}
                          labels={labels}
                          onChange={(next) => setPageRowColor(page.id, next)}
                          size="sm"
                        />
                      ) : null}
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
