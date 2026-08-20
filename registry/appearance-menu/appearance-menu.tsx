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
import { Checkbox } from "@/components/ui/checkbox"
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
  type PageBackdrop,
  type SurfaceChoice,
} from "@/registry/admin-appearance/appearance-palette"
import {
  appearanceThemes,
  type AppearanceTheme,
} from "@/registry/admin-appearance/appearance-themes"

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
  soft?: string
  custom?: string
  customColor?: string
  customColorHex?: string
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
  soft: "Soften the colour",
  custom: "Custom color…",
  customColor: "Custom color",
  customColorHex: "Custom color hex",
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
    soft: labels?.soft ?? defaultLabels.soft,
    custom: labels?.custom ?? defaultLabels.custom,
    customColor: labels?.customColor ?? defaultLabels.customColor,
    customColorHex: labels?.customColorHex ?? defaultLabels.customColorHex,
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
}: {
  color: CustomColor
  labels: ResolvedLabels
  onChange: (next: CustomColor) => void
  className?: string
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
        className="size-8 shrink-0 cursor-pointer rounded-lg border border-input bg-transparent p-0.5"
      />
      <input
        type="text"
        aria-label={labels.customColorHex}
        value={draft}
        onChange={handleText}
        maxLength={7}
        spellCheck={false}
        autoComplete="off"
        className="h-8 w-24 rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30"
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
      <Select<SurfaceSelectValue>
        value={selectValueOf(value)}
        onValueChange={(next) => {
          if (next === null) {
            return
          }
          onChange(surfaceFromSelect(next, value))
        }}
      >
        <SelectTrigger id={id} className="w-full">
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
    </section>
  )
}

function SoftCheckbox({
  label,
  checked,
  disabled,
  onCheckedChange,
}: {
  label: string
  checked: boolean
  disabled: boolean
  onCheckedChange: (next: boolean) => void
}): ReactElement {
  return (
    <Hint
      text={label}
      render={
        <Checkbox
          aria-label={label}
          checked={checked}
          disabled={disabled}
          onCheckedChange={onCheckedChange}
          className="shrink-0"
        />
      }
    />
  )
}

function ThemeButton({
  theme,
  labels,
  onSelect,
}: {
  theme: AppearanceTheme
  labels: ResolvedLabels
  onSelect: () => void
}): ReactElement {
  const strip: readonly SurfaceChoice[] = [
    theme.appearance.sidebar,
    accentHexOf(theme.appearance.accent) as CustomColor,
    theme.appearance.page?.gradient ?? null,
  ].filter((choice): choice is SurfaceChoice => choice !== null)

  return (
    <button
      type="button"
      onClick={onSelect}
      className="flex flex-col gap-1.5 rounded-lg border border-border p-1.5 text-left text-xs hover:bg-accent"
    >
      <span
        aria-hidden="true"
        className="flex h-4 overflow-hidden rounded-sm ring-1 ring-foreground/10"
      >
        {strip.map((choice) => (
          <span key={choice} className="flex-1" style={surfaceSwatchStyle(choice)} />
        ))}
      </span>
      <span className="truncate">
        {labels.themes[theme.id] ?? theme.name}
      </span>
    </button>
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
  const headerId = `${baseId}-header`
  const signInId = `${baseId}-sign-in`
  const pageId = `${baseId}-page`

  const selectAccent = (accent: AccentId | CustomColor) => {
    onChange({ ...value, accent })
  }

  const withGradient = (
    current: PageBackdrop | null | undefined,
    gradient: SurfaceChoice
  ): PageBackdrop => ({ gradient, soft: current?.soft ?? true })

  const selectPageBackground = (next: SurfaceChoice | null) => {
    onChange({
      ...value,
      page: next === null ? null : withGradient(value.page, next),
    })
  }

  const togglePageSoft = (soft: boolean) => {
    if (!value.page) {
      return
    }
    onChange({ ...value, page: { ...value.page, soft } })
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
    const current = value.pages[pageEntryId]
    const surface = surfaceFromSelect(next, current?.gradient)
    onChange({
      ...value,
      pages: {
        ...value.pages,
        [pageEntryId]: surface === null ? null : withGradient(current, surface),
      },
    })
  }

  const setPageRowColor = (pageEntryId: string, next: CustomColor) => {
    const current = value.pages[pageEntryId]
    if (!current) {
      return
    }
    onChange({
      ...value,
      pages: { ...value.pages, [pageEntryId]: { ...current, gradient: next } },
    })
  }

  const togglePageRowSoft = (pageEntryId: string, soft: boolean) => {
    const current = value.pages[pageEntryId]
    if (!current) {
      return
    }
    onChange({
      ...value,
      pages: { ...value.pages, [pageEntryId]: { ...current, soft } },
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
        className="max-h-[70vh] w-[24rem] overflow-y-auto"
      >
        <div className="flex flex-col gap-4">
          <section className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {labels.theme}
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {appearanceThemes.map((theme) => (
                <ThemeButton
                  key={theme.id}
                  theme={theme}
                  labels={labels}
                  onSelect={() => onChange(theme.appearance)}
                />
              ))}
            </div>
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

          <section className="flex flex-col gap-1.5">
            <Label
              htmlFor={pageId}
              className="text-xs font-medium text-muted-foreground"
            >
              {labels.page}
            </Label>
            <div className="flex items-center gap-2">
              <Select<SurfaceSelectValue>
                value={selectValueOf(value.page?.gradient ?? null)}
                onValueChange={(next) => {
                  if (next === null) {
                    return
                  }
                  selectPageBackground(
                    surfaceFromSelect(next, value.page?.gradient)
                  )
                }}
              >
                <SelectTrigger id={pageId} className="min-w-0 flex-1">
                  <SelectValue>
                    {renderSurfaceChoice(value.page?.gradient ?? null, labels)}
                  </SelectValue>
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
              <SoftCheckbox
                label={labels.soft}
                checked={value.page?.soft ?? true}
                disabled={value.page === null}
                onCheckedChange={togglePageSoft}
              />
            </div>
            {value.page && isCustomColor(value.page.gradient) ? (
              <CustomColorInputs
                color={value.page.gradient}
                labels={labels}
                onChange={selectPageBackground}
              />
            ) : null}
          </section>

          {pages.length > 0 ? (
            <section className="flex flex-col gap-1.5">
              <span className="text-xs font-medium text-muted-foreground">
                {labels.pages}
              </span>
              <div className="flex flex-col gap-2">
                {pages.map((page) => {
                  const hasOverride = Object.hasOwn(value.pages, page.id)
                  const override = value.pages[page.id]
                  const selectValue: PageSurfaceSelectValue = !hasOverride
                    ? "inherit"
                    : selectValueOf(override?.gradient ?? null)
                  const rowBackdrop = hasOverride ? override : value.page
                  const rowSelectId = `${baseId}-page-${page.id}`
                  const rowColor = override?.gradient

                  return (
                    <div key={page.id} className="flex flex-col gap-1.5">
                      <div className="flex items-center gap-2">
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
                          <SelectTrigger id={rowSelectId} size="sm">
                            <SelectValue>
                              {selectValue === "inherit"
                                ? labels.inherit
                                : renderSurfaceChoice(
                                    override?.gradient ?? null,
                                    labels
                                  )}
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
                        <SoftCheckbox
                          label={labels.soft}
                          checked={rowBackdrop?.soft ?? true}
                          disabled={selectValue === "none" || selectValue === "inherit"}
                          onCheckedChange={(soft) => togglePageRowSoft(page.id, soft)}
                        />
                      </div>
                      {isCustomColor(rowColor) ? (
                        <CustomColorInputs
                          color={rowColor}
                          labels={labels}
                          onChange={(next) => setPageRowColor(page.id, next)}
                          className="self-end"
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
