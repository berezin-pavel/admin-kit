import {
  composite,
  contrastRatio,
  formatOklch,
  hexToOklch,
  oklchToHex,
  sampleGradient,
  type Oklch,
} from "./appearance-color"
import {
  deriveAccentTokens,
  NEAR_BLACK,
  NEAR_BLACK_HEX,
  NEAR_WHITE,
  NEAR_WHITE_HEX,
} from "./appearance-accent"
import {
  accentPalette,
  CUSTOM_COLOR_ANGLE,
  customColorVariable,
  gradientIds,
  gradientPalette,
  isAccentId,
  isCustomColor,
  isGradientId,
  softStops,
  type AdminAppearance,
  type BlockHeading,
  type CustomColor,
  type GradientStops,
  type PageBackdrop,
} from "./appearance-palette"

const BLOCK_HEADINGS: readonly BlockHeading[] = ["regular", "large", "none"]

export function gradientCss(stops: GradientStops): string {
  const count = stops.stops.length
  const parts = stops.stops.map((hex, index) => {
    const position = count === 1 ? 0 : Math.round((index / (count - 1)) * 100)
    return `${hex.toLowerCase()} ${position}%`
  })
  return `linear-gradient(${stops.angle}deg, ${parts.join(", ")})`
}

export function gradientForeground(stops: GradientStops): string {
  const samples = sampleGradient(stops.stops, 33)

  const worstAgainst = (candidateHex: string) =>
    Math.min(...samples.map((sample) => contrastRatio(sample, candidateHex)))

  return worstAgainst(NEAR_WHITE_HEX) >= worstAgainst(NEAR_BLACK_HEX)
    ? NEAR_WHITE
    : NEAR_BLACK
}

const DESTRUCTIVE_CONTRAST_MIN = 4.55
const DESTRUCTIVE_HOVER_CONTRAST_MIN = 3.05
const DESTRUCTIVE_SAMPLE_COUNT = 33
const DESTRUCTIVE_LIGHTNESS_STEP = 0.01
const DESTRUCTIVE_CHROMA_STEP = 0.004
const DESTRUCTIVE_MAX_ITERATIONS = 80
const DESTRUCTIVE_ON_DARK: Oklch = { l: 0.78, c: 0.13, h: 22 }
const DESTRUCTIVE_ON_LIGHT: Oklch = { l: 0.5, c: 0.2, h: 27 }
const DESTRUCTIVE_FILL_ALPHAS: readonly number[] = [0.1, 0.2]
const DESTRUCTIVE_HOVER_TINT_ALPHAS: readonly number[] = [0.08, 0.16]

export function destructiveInkLegible(
  inkHex: string,
  stops: GradientStops,
  foregroundHex: string,
  minimum = DESTRUCTIVE_CONTRAST_MIN,
  hoverMinimum = DESTRUCTIVE_HOVER_CONTRAST_MIN
): boolean {
  return sampleGradient(stops.stops, DESTRUCTIVE_SAMPLE_COUNT).every(
    (sample) =>
      contrastRatio(inkHex, sample) >= minimum &&
      DESTRUCTIVE_FILL_ALPHAS.every(
        (alpha) =>
          contrastRatio(inkHex, composite(inkHex, alpha, sample, "srgb")) >=
          hoverMinimum
      ) &&
      DESTRUCTIVE_HOVER_TINT_ALPHAS.every(
        (alpha) =>
          contrastRatio(inkHex, composite(foregroundHex, alpha, sample, "srgb")) >=
          hoverMinimum
      )
  )
}

export function gradientDestructive(stops: GradientStops): {
  destructive: string
  destructiveForeground: string
} {
  const lightText = gradientForeground(stops) === NEAR_WHITE
  const foregroundHex = lightText ? NEAR_WHITE_HEX : NEAR_BLACK_HEX
  let ink: Oklch = lightText ? DESTRUCTIVE_ON_DARK : DESTRUCTIVE_ON_LIGHT

  for (let iteration = 0; iteration < DESTRUCTIVE_MAX_ITERATIONS; iteration++) {
    if (destructiveInkLegible(oklchToHex(ink), stops, foregroundHex)) {
      break
    }
    ink = lightText
      ? {
          l: Math.min(ink.l + DESTRUCTIVE_LIGHTNESS_STEP, 0.97),
          c: Math.max(ink.c - DESTRUCTIVE_CHROMA_STEP, 0.04),
          h: ink.h,
        }
      : { l: Math.max(ink.l - DESTRUCTIVE_LIGHTNESS_STEP, 0.15), c: ink.c, h: ink.h }
  }

  const inkHex = oklchToHex(ink)
  const destructiveForeground =
    contrastRatio(inkHex, NEAR_WHITE_HEX) >= contrastRatio(inkHex, NEAR_BLACK_HEX)
      ? NEAR_WHITE
      : NEAR_BLACK

  return { destructive: formatOklch(ink), destructiveForeground }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value)
}

function isNullableGradientId(value: unknown): value is null {
  return value === null || isGradientId(value)
}

function isSurfaceChoice(value: unknown): boolean {
  return isGradientId(value) || isCustomColor(value)
}

function isNullableSurfaceChoice(value: unknown): boolean {
  return value === null || isSurfaceChoice(value)
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

function isPageBackdrop(value: unknown): value is PageBackdrop {
  return (
    isRecord(value) &&
    isSurfaceChoice(value.gradient) &&
    typeof value.soft === "boolean"
  )
}

function isNullablePageBackdrop(value: unknown): value is PageBackdrop | null {
  return value === null || isPageBackdrop(value)
}

function isPageRecord(value: unknown): value is Record<string, PageBackdrop | null> {
  return isRecord(value) && Object.values(value).every(isNullablePageBackdrop)
}

function isBlockAppearanceRecord(value: unknown): value is Record<string, unknown> {
  return isRecord(value) && Object.values(value).every(isBlockAppearance)
}

export function isAdminAppearance(value: unknown): value is AdminAppearance {
  return (
    isRecord(value) &&
    (isAccentId(value.accent) || isCustomColor(value.accent)) &&
    isNullableSurfaceChoice(value.sidebar) &&
    isNullableSurfaceChoice(value.header) &&
    isNullableSurfaceChoice(value.signIn) &&
    isNullablePageBackdrop(value.page) &&
    isPageRecord(value.pages) &&
    isBlockAppearanceRecord(value.blocks)
  )
}

function accentHexOf(accent: AdminAppearance["accent"]): string {
  if (isCustomColor(accent)) {
    return accent.toLowerCase()
  }
  const entry = accentPalette.find((candidate) => candidate.id === accent)
  if (!entry) {
    throw new Error(`Unknown accent id: ${accent}`)
  }
  return entry.hex
}

const PURE_WHITE = "oklch(1 0 0)"
const PURE_BLACK = "oklch(0 0 0)"
const PURE_WHITE_HEX = "#ffffff"
const PURE_BLACK_HEX = "#000000"
const SOLID_CONTRAST_MIN = 4.5

function solidStops(hex: string): GradientStops {
  return { angle: CUSTOM_COLOR_ANGLE, stops: [hex, hex, hex] }
}

export function solidForeground(color: string): string {
  const hex = color.toLowerCase()
  const near = gradientForeground(solidStops(hex))
  const nearHex = near === NEAR_WHITE ? NEAR_WHITE_HEX : NEAR_BLACK_HEX
  if (contrastRatio(hex, nearHex) >= SOLID_CONTRAST_MIN) {
    return near
  }
  return contrastRatio(hex, PURE_WHITE_HEX) >= contrastRatio(hex, PURE_BLACK_HEX)
    ? PURE_WHITE
    : PURE_BLACK
}

const CUSTOM_DARK_THRESHOLD = 0.55
const CUSTOM_DARK_ANCHOR = 0.3
const CUSTOM_DARK_SLOPE = 0.18
const CUSTOM_DARK_MIN = 0.2
const CUSTOM_DARK_MAX = 0.32
const CUSTOM_DARK_CHROMA_CAP = 0.06

export function customDarkColor(color: CustomColor): string {
  const hex = color.toLowerCase()
  const { l, c, h } = hexToOklch(hex)
  if (l <= CUSTOM_DARK_THRESHOLD) {
    return hex
  }
  const lightness = Math.min(
    CUSTOM_DARK_MAX,
    Math.max(
      CUSTOM_DARK_MIN,
      CUSTOM_DARK_ANCHOR - (l - CUSTOM_DARK_THRESHOLD) * CUSTOM_DARK_SLOPE
    )
  )
  return oklchToHex({ l: lightness, c: Math.min(c, CUSTOM_DARK_CHROMA_CAP), h })
}

function customSchemeColor(
  color: CustomColor,
  scheme: "light" | "dark"
): string {
  return scheme === "light" ? color.toLowerCase() : customDarkColor(color)
}

export function customColorsOf(appearance: AdminAppearance): CustomColor[] {
  const found = new Set<string>()
  const add = (value: unknown) => {
    if (isCustomColor(value)) {
      found.add(value.toLowerCase())
    }
  }

  add(appearance.sidebar)
  add(appearance.header)
  add(appearance.signIn)
  add(appearance.page?.gradient)
  for (const backdrop of Object.values(appearance.pages)) {
    add(backdrop?.gradient)
  }

  return [...found].sort() as CustomColor[]
}

function customColorLines(
  colors: readonly CustomColor[],
  scheme: "light" | "dark"
): string {
  return colors
    .flatMap((color) => {
      const hex = customSchemeColor(color, scheme)
      const stops = solidStops(hex)
      const variable = customColorVariable(color)
      const { destructive, destructiveForeground } = gradientDestructive(stops)
      return [
        `  ${variable}: ${gradientCss({ angle: stops.angle, stops: [hex, hex] })};`,
        `  ${variable}-foreground: ${solidForeground(hex)};`,
        `  ${variable}-destructive: ${destructive};`,
        `  ${variable}-destructive-foreground: ${destructiveForeground};`,
        `  ${variable}-soft: ${gradientCss(softStops(stops, scheme))};`,
      ]
    })
    .join("\n")
}

export function customColorSurface(color: CustomColor): string {
  const variable = customColorVariable(color)
  return [
    `  --surface-gradient: var(${variable});`,
    `  --surface-foreground: var(${variable}-foreground);`,
    `  --surface-destructive: var(${variable}-destructive);`,
    `  --surface-destructive-foreground: var(${variable}-destructive-foreground);`,
  ].join("\n")
}

function customColorBlocks(colors: readonly CustomColor[]): string {
  return colors
    .map((color) => {
      const hex = color.toLowerCase()
      const variable = customColorVariable(color)
      const surface = customColorSurface(color)
      return [
        `[data-gradient="${hex}"] {\n${surface}\n}`,
        `body:has([data-gradient="${hex}"] ${OPEN_TRIGGER}) ${POPUP_SLOTS} {\n${surface}\n}`,
        `[data-backdrop="${hex}"] {\n  --backdrop-gradient: var(${variable}-soft);\n  --backdrop-text: var(--foreground);\n}`,
        `[data-backdrop="${hex}"][data-backdrop-vivid] {\n  --backdrop-gradient: var(${variable});\n  --backdrop-text: var(${variable}-foreground);\n}`,
      ].join("\n\n")
    })
    .join("\n\n")
}

function gradientVariableBlock(scheme: "light" | "dark"): string {
  const lines: string[] = []
  for (const gradient of gradientPalette) {
    const stops = scheme === "light" ? gradient.light : gradient.dark
    const soft = scheme === "light" ? gradient.softLight : gradient.softDark
    lines.push(`  --gradient-${gradient.id}: ${gradientCss(stops)};`)
    lines.push(`  --gradient-${gradient.id}-foreground: ${gradientForeground(stops)};`)
    lines.push(`  --gradient-${gradient.id}-soft: ${gradientCss(soft)};`)
    const { destructive, destructiveForeground } = gradientDestructive(stops)
    lines.push(`  --gradient-${gradient.id}-destructive: ${destructive};`)
    lines.push(
      `  --gradient-${gradient.id}-destructive-foreground: ${destructiveForeground};`
    )
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
  --sidebar-active-foreground: var(--surface-foreground);
  --destructive: var(--surface-destructive);
  --destructive-foreground: var(--surface-destructive-foreground);`

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
        `body:has([data-gradient="${id}"] ${OPEN_TRIGGER}) ${POPUP_SLOTS} {\n  --surface-gradient: var(--gradient-${id});\n  --surface-foreground: var(--gradient-${id}-foreground);\n  --surface-destructive: var(--gradient-${id}-destructive);\n  --surface-destructive-foreground: var(--gradient-${id}-destructive-foreground);\n}`
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
        `[data-gradient="${id}"] {\n  --surface-gradient: var(--gradient-${id});\n  --surface-foreground: var(--gradient-${id}-foreground);\n  --surface-destructive: var(--gradient-${id}-destructive);\n  --surface-destructive-foreground: var(--gradient-${id}-destructive-foreground);\n}`
    )
    .join("\n\n")
}

function backdropSelectorBlocks(): string {
  const blocks = gradientIds.map(
    (id) =>
      `[data-backdrop="${id}"] {\n  --backdrop-gradient: var(--gradient-${id}-soft);\n  --backdrop-text: var(--foreground);\n}\n\n[data-backdrop="${id}"][data-backdrop-vivid] {\n  --backdrop-gradient: var(--gradient-${id});\n  --backdrop-text: var(--gradient-${id}-foreground);\n}`
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

  const customColors = customColorsOf(appearance)

  const lightBlock = `:root:root {\n${[
    ...lightTokenLines,
    lightGradientLines,
    ...(customColors.length > 0 ? [customColorLines(customColors, "light")] : []),
  ].join("\n")}\n}`
  const darkBlock = `:root:root.dark {\n${[
    ...darkTokenLines,
    darkGradientLines,
    ...(customColors.length > 0 ? [customColorLines(customColors, "dark")] : []),
  ].join("\n")}\n}`

  return [
    lightBlock,
    darkBlock,
    SURFACE_RULE,
    surfaceSelectorBlocks(),
    POPUP_RULE,
    popupSelectorBlocks(),
    `[data-backdrop] {\n  background-image: var(--backdrop-gradient);\n  --backdrop-foreground: var(--backdrop-text);\n}`,
    backdropSelectorBlocks(),
    ...(customColors.length > 0 ? [customColorBlocks(customColors)] : []),
    HEADING_RULE,
  ].join("\n\n")
}
