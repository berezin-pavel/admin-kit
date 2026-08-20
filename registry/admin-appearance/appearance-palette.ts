import { NEAR_BLACK_HEX, NEAR_WHITE_HEX } from "./appearance-accent"
import {
  composite,
  contrastRatio,
  hexToOklch,
  oklchToHex,
  sampleGradient,
  type Oklch,
} from "./appearance-color"

export interface GradientStops {
  angle: number
  stops: readonly string[]
}

const HUE_DRIFT_TOLERANCE = 1.5
const CHROMA_SEARCH_STEP = 0.0005

function circularHueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

function isNeutralHex(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return red === green && green === blue
}

function fitChromaToGamut(color: Oklch): Oklch {
  if (color.c <= 0) {
    return color
  }

  let bestCandidate: Oklch | undefined
  let bestDrift = Infinity

  const steps = Math.ceil(color.c / CHROMA_SEARCH_STEP)

  for (let step = 0; step <= steps; step++) {
    const chroma = Math.max(color.c - step * CHROMA_SEARCH_STEP, 0)
    const candidate: Oklch = { ...color, c: chroma }
    const hex = oklchToHex(candidate)

    if (isNeutralHex(hex)) {
      break
    }

    const drift = circularHueDistance(hexToOklch(hex).h, color.h)
    if (drift < bestDrift) {
      bestDrift = drift
      bestCandidate = candidate
    }
    if (drift <= HUE_DRIFT_TOLERANCE) {
      return candidate
    }
    if (chroma <= 0) {
      break
    }
  }

  return bestCandidate ?? color
}

const SOFT_LIGHTNESS_PATTERN: Record<"light" | "dark", readonly number[]> = {
  light: [0.86, 0.91, 0.84, 0.89, 0.87],
  dark: [0.27, 0.32, 0.25, 0.3, 0.28],
}

const SOFT_HUE_SPREAD = 18

export function softStops(
  surface: GradientStops,
  scheme: "light" | "dark"
): GradientStops {
  const chromaScale = scheme === "light" ? 0.9 : 0.8
  const chromaCap = scheme === "light" ? 0.1 : 0.09
  const pattern = SOFT_LIGHTNESS_PATTERN[scheme]
  const count = surface.stops.length

  const stops = surface.stops.map((hex, index) => {
    const oklch = hexToOklch(hex)
    const lightness = pattern[index % pattern.length]
    const chroma = Math.min(oklch.c * chromaScale, chromaCap)
    const hueShift =
      count > 1
        ? -SOFT_HUE_SPREAD + (2 * SOFT_HUE_SPREAD * index) / (count - 1)
        : 0
    const hue = (oklch.h + hueShift + 360) % 360
    return oklchToHex(fitChromaToGamut({ l: lightness, c: chroma, h: hue }))
  })

  return { angle: surface.angle, stops }
}

const FIT_CONTRAST_MIN = 4.5
const FIT_SAMPLE_COUNT = 33
export const hoverOverlayAlphas: readonly number[] = [0.08, 0.16, 0.202]
const FIT_LIGHTNESS_STEP = 0.004
const FIT_MAX_ITERATIONS = 150
const FIT_LIGHT_TEXT_MIN_L = 0.05
const FIT_DARK_TEXT_MAX_L = 0.97
const FIT_DARK_TEXT_L_CEILING_FOR_CHROMA_CUT = 0.9
const FIT_DARK_TEXT_CHROMA_STEP = 0.004

function passesLegibility(
  backgroundHex: string,
  foregroundHex: string,
  oppositeForegroundHex: string
): boolean {
  const ownContrast = contrastRatio(backgroundHex, foregroundHex)
  if (ownContrast < FIT_CONTRAST_MIN) {
    return false
  }
  if (ownContrast <= contrastRatio(backgroundHex, oppositeForegroundHex)) {
    return false
  }
  return hoverOverlayAlphas.every((alpha) => {
    const composited = composite(foregroundHex, alpha, backgroundHex, "srgb")
    return contrastRatio(foregroundHex, composited) >= FIT_CONTRAST_MIN
  })
}

function segmentBoundsForSample(
  sampleIndex: number,
  sampleCount: number,
  stopCount: number
): [number, number] {
  const segments = stopCount - 1
  const position = (sampleIndex / (sampleCount - 1)) * segments
  const start = Math.min(Math.floor(position), segments - 1)
  return [start, start + 1]
}

export function fitStopsForText(
  stops: readonly string[],
  text: "light" | "dark"
): string[] {
  const foregroundHex = text === "light" ? NEAR_WHITE_HEX : NEAR_BLACK_HEX
  const oppositeForegroundHex = text === "light" ? NEAR_BLACK_HEX : NEAR_WHITE_HEX
  let current = stops.map((hex) => hexToOklch(hex))

  for (let iteration = 0; iteration < FIT_MAX_ITERATIONS; iteration++) {
    const hexStops = current.map((oklch) => oklchToHex(oklch))
    const samples = sampleGradient(hexStops, FIT_SAMPLE_COUNT)

    const failingStops = new Set<number>()
    samples.forEach((sample, index) => {
      if (!passesLegibility(sample, foregroundHex, oppositeForegroundHex)) {
        const [start, end] = segmentBoundsForSample(
          index,
          FIT_SAMPLE_COUNT,
          hexStops.length
        )
        const culprit =
          text === "light"
            ? current[start].l >= current[end].l
              ? start
              : end
            : current[start].l <= current[end].l
              ? start
              : end
        failingStops.add(culprit)
      }
    })

    if (failingStops.size === 0) {
      return hexStops
    }

    current = current.map((oklch, index) => {
      if (!failingStops.has(index)) {
        return oklch
      }
      if (text === "light") {
        const l = Math.max(oklch.l - FIT_LIGHTNESS_STEP, FIT_LIGHT_TEXT_MIN_L)
        return fitChromaToGamut({ ...oklch, l })
      }
      if (oklch.l < FIT_DARK_TEXT_L_CEILING_FOR_CHROMA_CUT) {
        const l = Math.min(oklch.l + FIT_LIGHTNESS_STEP, FIT_DARK_TEXT_MAX_L)
        return fitChromaToGamut({ ...oklch, l })
      }
      const c = Math.max(oklch.c - FIT_DARK_TEXT_CHROMA_STEP, 0)
      return fitChromaToGamut({ ...oklch, c })
    })
  }

  return current.map((oklch) => oklchToHex(oklch))
}

export const gradientFamilies = [
  "neutral",
  "warm",
  "green",
  "blue",
  "violet",
] as const

export type GradientFamily = (typeof gradientFamilies)[number]

export const gradientFamilyNames: Record<GradientFamily, string> = {
  neutral: "Neutral",
  warm: "Warm",
  green: "Green",
  blue: "Blue",
  violet: "Violet",
}

export const gradientIds = [
  "basalt",
  "graphite",
  "toffee",
  "slate",
  "brown",
  "pewter",
  "concrete",
  "sand",
  "platinum",
  "wine",
  "ember",
  "raspberry",
  "orange",
  "olive",
  "maroon",
  "crimson",
  "red",
  "gold",
  "tangerine",
  "salmon",
  "amber",
  "honey",
  "yellow",
  "flamingo",
  "forest",
  "jungle",
  "ivy",
  "green",
  "jade",
  "lime",
  "spring",
  "sea-green",
  "chartreuse",
  "meadow",
  "sage",
  "mint",
  "midnight",
  "dusk",
  "cobalt",
  "petrol",
  "royal-blue",
  "lagoon",
  "navy",
  "ocean",
  "indigo",
  "blue",
  "turquoise",
  "periwinkle",
  "sky",
  "cyan",
  "ice",
  "grape",
  "magenta",
  "amethyst",
  "pink",
  "purple",
  "violet",
  "fuchsia",
  "iris",
  "mauve",
  "orchid",
  "lavender",
  "lilac",
] as const

export type GradientId = (typeof gradientIds)[number]

export interface GradientIntent {
  name: string
  family: GradientFamily
  angle: number
  stops: readonly [string, string, string]
  text: "light" | "dark"
}

const DEFAULT_ANGLE = 135

export const gradientIntents: Record<GradientId, GradientIntent> = {
  basalt: { name: "Basalt", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#151618", "#232426", "#36383a"], text: "light" },
  graphite: { name: "Graphite", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#212428", "#373b3f", "#4f5357"], text: "light" },
  toffee: { name: "Toffee", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#2f1e00", "#543a03", "#7a5e2e"], text: "light" },
  slate: { name: "Slate", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#34383d", "#47515c", "#606a75"], text: "light" },
  brown: { name: "Brown", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#492e21", "#7d5642", "#b3826a"], text: "light" },
  pewter: { name: "Pewter", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#83878b", "#9b9fa3", "#b4b8bc"], text: "dark" },
  concrete: { name: "Concrete", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#ada29a", "#c5b8ae", "#dbcec4"], text: "dark" },
  sand: { name: "Sand", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#cbb490", "#e2caa6", "#f9e1bc"], text: "dark" },
  platinum: { name: "Platinum", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#c2c4c7", "#d5d8da", "#e9ebee"], text: "dark" },
  wine: { name: "Wine", family: "warm", angle: DEFAULT_ANGLE, stops: ["#21000a", "#3f0319", "#561a2d"], text: "light" },
  ember: { name: "Ember", family: "warm", angle: DEFAULT_ANGLE, stops: ["#310200", "#5b0500", "#7f2213"], text: "light" },
  raspberry: { name: "Raspberry", family: "warm", angle: DEFAULT_ANGLE, stops: ["#450024", "#750041", "#b00064"], text: "light" },
  orange: { name: "Orange", family: "warm", angle: DEFAULT_ANGLE, stops: ["#3e1000", "#802a00", "#c94700"], text: "light" },
  olive: { name: "Olive", family: "warm", angle: DEFAULT_ANGLE, stops: ["#3e3200", "#594c1a", "#756937"], text: "light" },
  maroon: { name: "Maroon", family: "warm", angle: DEFAULT_ANGLE, stops: ["#3f191d", "#743e42", "#aa686d"], text: "light" },
  crimson: { name: "Crimson", family: "warm", angle: DEFAULT_ANGLE, stops: ["#521526", "#8d364b", "#c86077"], text: "light" },
  red: { name: "Red", family: "warm", angle: DEFAULT_ANGLE, stops: ["#5e000d", "#a21929", "#e2484f"], text: "light" },
  gold: { name: "Gold", family: "warm", angle: DEFAULT_ANGLE, stops: ["#d78c00", "#eb9f2c", "#ffb245"], text: "dark" },
  tangerine: { name: "Tangerine", family: "warm", angle: DEFAULT_ANGLE, stops: ["#ff6d0f", "#ff9e72", "#ffc8b0"], text: "dark" },
  salmon: { name: "Salmon", family: "warm", angle: DEFAULT_ANGLE, stops: ["#eb7e92", "#ff98ab", "#ffc3cc"], text: "dark" },
  amber: { name: "Amber", family: "warm", angle: DEFAULT_ANGLE, stops: ["#e5974c", "#fdad63", "#ffcb9c"], text: "dark" },
  honey: { name: "Honey", family: "warm", angle: DEFAULT_ANGLE, stops: ["#d4ab4f", "#ebc166", "#ffd87f"], text: "dark" },
  yellow: { name: "Yellow", family: "warm", angle: DEFAULT_ANGLE, stops: ["#e0bb00", "#f7d22a", "#ffe648"], text: "dark" },
  flamingo: { name: "Flamingo", family: "warm", angle: DEFAULT_ANGLE, stops: ["#f3aad3", "#ffc2e4", "#ffe1f1"], text: "dark" },
  forest: { name: "Forest", family: "green", angle: DEFAULT_ANGLE, stops: ["#001801", "#043009", "#1e4821"], text: "light" },
  jungle: { name: "Jungle", family: "green", angle: DEFAULT_ANGLE, stops: ["#00201b", "#003931", "#075449"], text: "light" },
  ivy: { name: "Ivy", family: "green", angle: DEFAULT_ANGLE, stops: ["#002d1d", "#004a32", "#13684b"], text: "light" },
  green: { name: "Green", family: "green", angle: DEFAULT_ANGLE, stops: ["#004300", "#06750d", "#38a937"], text: "light" },
  jade: { name: "Jade", family: "green", angle: DEFAULT_ANGLE, stops: ["#004225", "#007545", "#00ab68"], text: "light" },
  lime: { name: "Lime", family: "green", angle: DEFAULT_ANGLE, stops: ["#83a01f", "#9bb940", "#b4d35c"], text: "dark" },
  spring: { name: "Spring", family: "green", angle: DEFAULT_ANGLE, stops: ["#5abc81", "#74d699", "#8ef1b2"], text: "dark" },
  "sea-green": { name: "Sea Green", family: "green", angle: DEFAULT_ANGLE, stops: ["#00c57b", "#00e28e", "#2afda7"], text: "dark" },
  chartreuse: { name: "Chartreuse", family: "green", angle: DEFAULT_ANGLE, stops: ["#85c100", "#9edb2e", "#b7f652"], text: "dark" },
  meadow: { name: "Meadow", family: "green", angle: DEFAULT_ANGLE, stops: ["#85ce6c", "#9be582", "#b2fc98"], text: "dark" },
  sage: { name: "Sage", family: "green", angle: DEFAULT_ANGLE, stops: ["#a6bfaa", "#bcd6c0", "#d3edd7"], text: "dark" },
  mint: { name: "Mint", family: "green", angle: DEFAULT_ANGLE, stops: ["#a0dabf", "#b3edd3", "#c3fee3"], text: "dark" },
  midnight: { name: "Midnight", family: "blue", angle: DEFAULT_ANGLE, stops: ["#011435", "#11284b", "#253d61"], text: "light" },
  dusk: { name: "Dusk", family: "blue", angle: DEFAULT_ANGLE, stops: ["#0f0042", "#211a61", "#383780"], text: "light" },
  cobalt: { name: "Cobalt", family: "blue", angle: DEFAULT_ANGLE, stops: ["#020062", "#092482", "#2043a3"], text: "light" },
  petrol: { name: "Petrol", family: "blue", angle: DEFAULT_ANGLE, stops: ["#00242e", "#003f4f", "#00637b"], text: "light" },
  "royal-blue": { name: "Royal Blue", family: "blue", angle: DEFAULT_ANGLE, stops: ["#100d7a", "#2538a1", "#4561cc"], text: "light" },
  lagoon: { name: "Lagoon", family: "blue", angle: DEFAULT_ANGLE, stops: ["#003c3c", "#005a5a", "#007979"], text: "light" },
  navy: { name: "Navy", family: "blue", angle: DEFAULT_ANGLE, stops: ["#13244b", "#364d82", "#607cba"], text: "light" },
  ocean: { name: "Ocean", family: "blue", angle: DEFAULT_ANGLE, stops: ["#003852", "#005a80", "#007eb0"], text: "light" },
  indigo: { name: "Indigo", family: "blue", angle: DEFAULT_ANGLE, stops: ["#2a1870", "#4f44ac", "#7b74e8"], text: "light" },
  blue: { name: "Blue", family: "blue", angle: DEFAULT_ANGLE, stops: ["#002e5c", "#0059a7", "#2d88e2"], text: "light" },
  turquoise: { name: "Turquoise", family: "blue", angle: DEFAULT_ANGLE, stops: ["#00b5c7", "#00d3e5", "#41edff"], text: "dark" },
  periwinkle: { name: "Periwinkle", family: "blue", angle: DEFAULT_ANGLE, stops: ["#63a4ff", "#92bfff", "#bfd9ff"], text: "dark" },
  sky: { name: "Sky", family: "blue", angle: DEFAULT_ANGLE, stops: ["#61b7de", "#7bd0f9", "#b6e6ff"], text: "dark" },
  cyan: { name: "Cyan", family: "blue", angle: DEFAULT_ANGLE, stops: ["#17d0d8", "#44e7ef", "#86faff"], text: "dark" },
  ice: { name: "Ice", family: "blue", angle: DEFAULT_ANGLE, stops: ["#99d6e5", "#adeaf9", "#d1f6ff"], text: "dark" },
  grape: { name: "Grape", family: "violet", angle: DEFAULT_ANGLE, stops: ["#1d0034", "#380a5a", "#532a78"], text: "light" },
  magenta: { name: "Magenta", family: "violet", angle: DEFAULT_ANGLE, stops: ["#2d0027", "#510247", "#6f2563"], text: "light" },
  amethyst: { name: "Amethyst", family: "violet", angle: DEFAULT_ANGLE, stops: ["#3a2b66", "#544785", "#7063a4"], text: "light" },
  pink: { name: "Pink", family: "violet", angle: DEFAULT_ANGLE, stops: ["#4b1639", "#7f3d66", "#b76798"], text: "light" },
  purple: { name: "Purple", family: "violet", angle: DEFAULT_ANGLE, stops: ["#44085f", "#753597", "#a862cf"], text: "light" },
  violet: { name: "Violet", family: "violet", angle: DEFAULT_ANGLE, stops: ["#3d0076", "#692fb4", "#9860f0"], text: "light" },
  fuchsia: { name: "Fuchsia", family: "violet", angle: DEFAULT_ANGLE, stops: ["#520057", "#88228d", "#c24dc7"], text: "light" },
  iris: { name: "Iris", family: "violet", angle: DEFAULT_ANGLE, stops: ["#b088ff", "#c5acff", "#dbceff"], text: "dark" },
  mauve: { name: "Mauve", family: "violet", angle: DEFAULT_ANGLE, stops: ["#d57fda", "#f099f5", "#ffbdff"], text: "dark" },
  orchid: { name: "Orchid", family: "violet", angle: DEFAULT_ANGLE, stops: ["#c796d2", "#e1afed", "#f7cdff"], text: "dark" },
  lavender: { name: "Lavender", family: "violet", angle: DEFAULT_ANGLE, stops: ["#b3b3dd", "#c6c6f1", "#d9daff"], text: "dark" },
  lilac: { name: "Lilac", family: "violet", angle: DEFAULT_ANGLE, stops: ["#d1c1f2", "#e1d1ff", "#eee6ff"], text: "dark" },
}

const DARK_TEXT_LOWER_STEP = 0.1
const DARK_TEXT_LOWER_MIN_L = 0.18
const PASTEL_DEEP_L_LOW = 0.3
const PASTEL_DEEP_L_HIGH = 0.38
const PASTEL_DEEP_CHROMA_SCALE = 0.8

export function darkVariant(intent: GradientIntent): GradientStops {
  if (intent.text === "light") {
    const stops = intent.stops.map((hex) => {
      const oklch = hexToOklch(hex)
      const l = Math.max(oklch.l - DARK_TEXT_LOWER_STEP, DARK_TEXT_LOWER_MIN_L)
      return oklchToHex(fitChromaToGamut({ ...oklch, l }))
    })
    return { angle: intent.angle, stops: fitStopsForText(stops, "light") }
  }

  const stops = intent.stops.map((hex, index) => {
    const oklch = hexToOklch(hex)
    const l =
      index === intent.stops.length - 1 || index % 2 === 1
        ? PASTEL_DEEP_L_HIGH
        : PASTEL_DEEP_L_LOW
    const c = oklch.c * PASTEL_DEEP_CHROMA_SCALE
    return oklchToHex(fitChromaToGamut({ l, c, h: oklch.h }))
  })
  return { angle: intent.angle, stops: fitStopsForText(stops, "light") }
}

export interface GradientDefinition {
  id: GradientId
  name: string
  family: GradientFamily
  light: GradientStops
  dark: GradientStops
  softLight: GradientStops
  softDark: GradientStops
}

function buildGradient(id: GradientId): GradientDefinition {
  const intent = gradientIntents[id]
  const light: GradientStops = {
    angle: intent.angle,
    stops: fitStopsForText(intent.stops, intent.text),
  }
  const dark = darkVariant(intent)

  return {
    id,
    name: intent.name,
    family: intent.family,
    light,
    dark,
    softLight: softStops(light, "light"),
    softDark: softStops(dark, "dark"),
  }
}

export const gradientPalette: readonly GradientDefinition[] =
  gradientIds.map(buildGradient)

export function isGradientId(value: unknown): value is GradientId {
  return (
    typeof value === "string" && (gradientIds as readonly string[]).includes(value)
  )
}

export const accentIds = [
  "emerald",
  "green",
  "lime",
  "teal",
  "cyan",
  "sky",
  "blue",
  "cobalt",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "rose",
  "red",
  "orange",
  "amber",
  "brown",
  "slate",
  "graphite",
] as const

export type AccentId = (typeof accentIds)[number]

export interface AccentDefinition {
  id: AccentId
  name: string
  hex: string
}

const accentNames: Record<AccentId, string> = {
  emerald: "Emerald",
  green: "Green",
  lime: "Lime",
  teal: "Teal",
  cyan: "Cyan",
  sky: "Sky",
  blue: "Blue",
  cobalt: "Cobalt",
  indigo: "Indigo",
  violet: "Violet",
  purple: "Purple",
  fuchsia: "Fuchsia",
  pink: "Pink",
  rose: "Rose",
  red: "Red",
  orange: "Orange",
  amber: "Amber",
  brown: "Brown",
  slate: "Slate",
  graphite: "Graphite",
}

const accentTargets: Record<AccentId, Oklch> = {
  emerald: { l: 0.51, c: 0.11, h: 162.8 },
  green: { l: 0.52, c: 0.14, h: 140 },
  lime: { l: 0.6, c: 0.13, h: 115 },
  teal: { l: 0.55, c: 0.09, h: 185 },
  cyan: { l: 0.58, c: 0.09, h: 205 },
  sky: { l: 0.6, c: 0.11, h: 228 },
  blue: { l: 0.5, c: 0.145, h: 252 },
  cobalt: { l: 0.46, c: 0.17, h: 268 },
  indigo: { l: 0.46, c: 0.17, h: 283 },
  violet: { l: 0.48, c: 0.18, h: 298 },
  purple: { l: 0.46, c: 0.17, h: 312 },
  fuchsia: { l: 0.47, c: 0.17, h: 326 },
  pink: { l: 0.58, c: 0.16, h: 344 },
  rose: { l: 0.55, c: 0.155, h: 5 },
  red: { l: 0.52, c: 0.17, h: 22 },
  orange: { l: 0.58, c: 0.15, h: 42 },
  amber: { l: 0.61, c: 0.132, h: 63 },
  brown: { l: 0.4, c: 0.06, h: 50 },
  slate: { l: 0.5, c: 0.02, h: 240 },
  graphite: { l: 0.32, c: 0.006, h: 250 },
}

const ACCENT_HEX_OVERRIDES: Partial<Record<AccentId, string>> = {
  emerald: "#007953",
}

function buildAccent(id: AccentId): AccentDefinition {
  return {
    id,
    name: accentNames[id],
    hex: ACCENT_HEX_OVERRIDES[id] ?? oklchToHex(accentTargets[id]),
  }
}

export const accentPalette: readonly AccentDefinition[] =
  accentIds.map(buildAccent)

export function isAccentId(value: unknown): value is AccentId {
  return (
    typeof value === "string" && (accentIds as readonly string[]).includes(value)
  )
}

export type CustomColor = `#${string}`

const CUSTOM_COLOR_PATTERN = /^#[0-9a-f]{6}$/i

export function isCustomColor(value: unknown): value is CustomColor {
  return typeof value === "string" && CUSTOM_COLOR_PATTERN.test(value)
}

export type SurfaceChoice = GradientId | CustomColor

export const CUSTOM_COLOR_ANGLE = 135

export function customColorStops(color: CustomColor): GradientStops {
  const hex = color.toLowerCase()
  return { angle: CUSTOM_COLOR_ANGLE, stops: [hex, hex, hex] }
}

export function customColorVariable(color: CustomColor): string {
  return `--custom-${color.slice(1).toLowerCase()}`
}

export type BlockHeading = "regular" | "large" | "none"

export interface BlockAppearance {
  gradient?: GradientId | null
  heading?: BlockHeading
}

export interface PageBackdrop {
  gradient: SurfaceChoice
  soft: boolean
}

export interface AdminAppearance {
  accent: AccentId | CustomColor
  sidebar: SurfaceChoice | null
  header: SurfaceChoice | null
  signIn: SurfaceChoice | null
  page: PageBackdrop | null
  pages: Record<string, PageBackdrop | null>
  blocks: Record<string, BlockAppearance>
}

export const defaultAdminAppearance: AdminAppearance = {
  accent: "emerald",
  sidebar: null,
  header: null,
  signIn: null,
  page: null,
  pages: {},
  blocks: {},
}

export function resolvePageBackdrop(
  appearance: AdminAppearance,
  pageId?: string
): PageBackdrop | null {
  if (pageId !== undefined && Object.hasOwn(appearance.pages, pageId)) {
    return appearance.pages[pageId]
  }
  return appearance.page
}
