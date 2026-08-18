import { contrastRatio, sampleGradient } from "./appearance-color"
import {
  deriveAccentTokens,
  NEAR_BLACK,
  NEAR_BLACK_HEX,
  NEAR_WHITE,
  NEAR_WHITE_HEX,
} from "./appearance-accent"
import {
  accentPalette,
  gradientIds,
  gradientPalette,
  isAccentId,
  isGradientId,
  type AdminAppearance,
  type BlockHeading,
  type GradientStops,
  type PageBackdrop,
} from "./appearance-palette"

const BLOCK_HEADINGS: readonly BlockHeading[] = ["regular", "large", "none"]

export function gradientCss(stops: GradientStops): string {
  const from = stops.from.toLowerCase()
  const via = stops.via.toLowerCase()
  const to = stops.to.toLowerCase()
  return `linear-gradient(${stops.angle}deg, ${from} 0%, ${via} 50%, ${to} 100%)`
}

export function gradientForeground(stops: GradientStops): string {
  const samples = sampleGradient(stops, 33)

  const worstAgainst = (candidateHex: string) =>
    Math.min(...samples.map((sample) => contrastRatio(sample, candidateHex)))

  return worstAgainst(NEAR_WHITE_HEX) >= worstAgainst(NEAR_BLACK_HEX)
    ? NEAR_WHITE
    : NEAR_BLACK
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNullableGradientId(value: unknown): value is null {
  return value === null || isGradientId(value)
}

function isPageBackdrop(value: unknown): value is PageBackdrop {
  return (
    isRecord(value) &&
    isNullableGradientId(value.gradient) &&
    typeof value.soft === "boolean"
  )
}

function isBlockAppearance(value: unknown) {
  if (!isRecord(value)) {
    return false
  }
  if (value.gradient !== undefined && !isNullableGradientId(value.gradient)) {
    return false
  }
  if (
    value.heading !== undefined &&
    !BLOCK_HEADINGS.some((heading) => heading === value.heading)
  ) {
    return false
  }
  return true
}

function isPageBackdropRecord(value: unknown): value is Record<string, PageBackdrop> {
  return isRecord(value) && Object.values(value).every(isPageBackdrop)
}

function isBlockAppearanceRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && Object.values(value).every(isBlockAppearance)
}

export function isAdminAppearance(value: unknown): value is AdminAppearance {
  return (
    isRecord(value) &&
    isAccentId(value.accent) &&
    isNullableGradientId(value.sidebar) &&
    isNullableGradientId(value.signIn) &&
    isPageBackdrop(value.page) &&
    isPageBackdropRecord(value.pages) &&
    isBlockAppearanceRecord(value.blocks)
  )
}

function accentHexOf(accentId: string): string {
  const accent = accentPalette.find((candidate) => candidate.id === accentId)
  if (!accent) {
    throw new Error(`Unknown accent id: ${accentId}`)
  }
  return accent.hex
}

function gradientVariableBlock(scheme: "light" | "dark"): string {
  const lines: string[] = []
  for (const gradient of gradientPalette) {
    const stops = scheme === "light" ? gradient.light : gradient.dark
    const soft = scheme === "light" ? gradient.softLight : gradient.softDark
    lines.push(`  --gradient-${gradient.id}: ${gradientCss(stops)};`)
    lines.push(`  --gradient-${gradient.id}-foreground: ${gradientForeground(stops)};`)
    lines.push(`  --gradient-${gradient.id}-soft: ${gradientCss(soft)};`)
  }
  return lines.join("\n")
}

const SURFACE_DECLARATIONS = `
  background-image: var(--surface-gradient);
  color: var(--surface-foreground);
  --foreground: var(--surface-foreground);
  --card: color-mix(in oklch, var(--surface-foreground) 20%, transparent);
  --card-foreground: var(--surface-foreground);
  --muted-foreground: var(--surface-foreground);
  --background: color-mix(in oklch, var(--surface-foreground) 8%, transparent);
  --muted: color-mix(in oklch, var(--surface-foreground) 16%, transparent);
  --accent: color-mix(in oklch, var(--surface-foreground) 16%, transparent);
  --accent-foreground: var(--surface-foreground);
  --secondary: color-mix(in oklch, var(--surface-foreground) 16%, transparent);
  --secondary-foreground: var(--surface-foreground);
  --border: color-mix(in oklch, var(--surface-foreground) 30%, transparent);
  --input: var(--border);
  --ring: color-mix(in oklch, var(--surface-foreground) 60%, transparent);
  --sidebar-foreground: var(--surface-foreground);
  --sidebar-border: var(--border);
  --sidebar-accent: var(--muted);
  --sidebar-active: color-mix(in oklch, var(--surface-foreground) 14%, transparent);
  --sidebar-active-foreground: var(--surface-foreground);`

const SURFACE_RULE = `[data-gradient] {${SURFACE_DECLARATIONS}
}`

const POPUP_SLOTS =
  ':is([data-slot="popover-content"], [data-slot="select-content"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-sub-content"], [data-slot="combobox-content"])'
const OPEN_TRIGGER = ':is([aria-haspopup], [role="combobox"])[aria-expanded="true"]'

const POPUP_RULE = `body:has([data-gradient] ${OPEN_TRIGGER}) ${POPUP_SLOTS} {${SURFACE_DECLARATIONS}
  --popover: transparent;
  --popover-foreground: var(--surface-foreground);
}`

function popupSelectorBlocks(): string {
  return gradientIds
    .map(
      (id) =>
        `body:has([data-gradient="${id}"] ${OPEN_TRIGGER}) ${POPUP_SLOTS} {\n  --surface-gradient: var(--gradient-${id});\n  --surface-foreground: var(--gradient-${id}-foreground);\n}`
    )
    .join("\n\n")
}

const HEADING_RULE = `[data-block][data-heading="regular"] [data-slot="card-title"] {
  font-size: 0.84375rem;
  line-height: 1.25rem;
  font-weight: 600;
  color: var(--foreground);
}

[data-block][data-heading="large"] [data-slot="card-title"] {
  font-size: 1.15rem;
  line-height: 1.6rem;
  font-weight: 600;
  color: var(--foreground);
}

[data-block][data-heading="none"] [data-slot="card-title"] {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}`

function surfaceSelectorBlocks(): string {
  return gradientIds
    .map(
      (id) =>
        `[data-gradient="${id}"] {\n  --surface-gradient: var(--gradient-${id});\n  --surface-foreground: var(--gradient-${id}-foreground);\n}`
    )
    .join("\n\n")
}

function backdropSelectorBlocks(): string {
  const blocks = gradientIds.map(
    (id) =>
      `[data-backdrop="${id}"] {\n  --backdrop-gradient: var(--gradient-${id});\n  --backdrop-text: var(--gradient-${id}-foreground);\n}\n\n[data-backdrop="${id}"][data-backdrop-soft] {\n  --backdrop-gradient: var(--gradient-${id}-soft);\n  --backdrop-text: var(--foreground);\n}\n\nhtml:has([data-backdrop="${id}"]:not([data-backdrop-soft])) {\n  background-image: var(--gradient-${id});\n}\n\nhtml:has([data-backdrop="${id}"][data-backdrop-soft]) {\n  background-image: var(--gradient-${id}-soft);\n}`
  )
  return blocks.join("\n\n")
}

export function appearanceCss(appearance: AdminAppearance): string {
  const accentHex = accentHexOf(appearance.accent)
  const { light, dark } = deriveAccentTokens(accentHex)

  const lightGradientLines = gradientVariableBlock("light")
  const darkGradientLines = gradientVariableBlock("dark")

  const lightTokenLines = Object.entries(light).map(
    ([token, value]) => `  --${token}: ${value};`
  )
  const darkTokenLines = Object.entries(dark).map(
    ([token, value]) => `  --${token}: ${value};`
  )

  const lightBlock = `:root:root {\n${[...lightTokenLines, lightGradientLines].join("\n")}\n}`
  const darkBlock = `:root:root.dark {\n${[...darkTokenLines, darkGradientLines].join("\n")}\n}`

  return [
    lightBlock,
    darkBlock,
    SURFACE_RULE,
    surfaceSelectorBlocks(),
    POPUP_RULE,
    popupSelectorBlocks(),
    `[data-backdrop] {\n  background-image: var(--backdrop-gradient);\n  --backdrop-foreground: var(--backdrop-text);\n}`,
    backdropSelectorBlocks(),
    HEADING_RULE,
  ].join("\n\n")
}
