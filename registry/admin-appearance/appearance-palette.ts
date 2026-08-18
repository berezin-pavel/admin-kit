import { hexToOklch, oklchToHex, type Oklch } from "./appearance-color"

export interface GradientStops {
  angle: number
  from: string
  via: string
  to: string
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

export function softStops(
  surface: GradientStops,
  scheme: "light" | "dark"
): GradientStops {
  const targetLightness = scheme === "light" ? 0.965 : 0.22
  const chromaScale = scheme === "light" ? 0.35 : 0.5
  const chromaCap = scheme === "light" ? 0.035 : 0.05

  const transform = (hex: string): string => {
    const oklch = hexToOklch(hex)
    const chroma = Math.min(oklch.c * chromaScale, chromaCap)
    return oklchToHex(fitChromaToGamut({ l: targetLightness, c: chroma, h: oklch.h }))
  }

  return {
    angle: surface.angle,
    from: transform(surface.from),
    via: transform(surface.via),
    to: transform(surface.to),
  }
}

export const gradientIds = [
  "ember",
  "sunset",
  "peach",
  "amber",
  "copper",
  "rose",
  "berry",
  "grape",
  "lavender",
  "dusk",
  "midnight",
  "ocean",
  "sky",
  "lagoon",
  "mint",
  "meadow",
  "forest",
  "sand",
  "slate",
  "graphite",
] as const

export type GradientId = (typeof gradientIds)[number]

export interface GradientDefinition {
  id: GradientId
  name: string
  light: GradientStops
  dark: GradientStops
  softLight: GradientStops
  softDark: GradientStops
}

const gradientNames: Record<GradientId, string> = {
  ember: "Ember",
  sunset: "Sunset",
  peach: "Peach",
  amber: "Amber",
  copper: "Copper",
  rose: "Rose",
  berry: "Berry",
  grape: "Grape",
  lavender: "Lavender",
  dusk: "Dusk",
  midnight: "Midnight",
  ocean: "Ocean",
  sky: "Sky",
  lagoon: "Lagoon",
  mint: "Mint",
  meadow: "Meadow",
  forest: "Forest",
  sand: "Sand",
  slate: "Slate",
  graphite: "Graphite",
}

const gradientAngles: Record<GradientId, number> = {
  ember: 140,
  sunset: 130,
  peach: 125,
  amber: 135,
  copper: 145,
  rose: 130,
  berry: 140,
  grape: 135,
  lavender: 125,
  dusk: 140,
  midnight: 150,
  ocean: 135,
  sky: 120,
  lagoon: 140,
  mint: 125,
  meadow: 135,
  forest: 145,
  sand: 120,
  slate: 160,
  graphite: 135,
}

const gradientSurfaces: Record<
  GradientId,
  { light: [string, string, string]; dark: [string, string, string] }
> = {
  ember: {
    light: ["#af302a", "#ae2f23", "#9a3412"],
    dark: ["#7c0107", "#86130b", "#8f2400"],
  },
  sunset: {
    light: ["#aa3100", "#9d1934", "#9d1e4f"],
    dark: ["#731e00", "#860f29", "#8d1c46"],
  },
  peach: {
    light: ["#fed7aa", "#fdba74", "#fecdd3"],
    dark: ["#5b3700", "#683c00", "#8b223e"],
  },
  amber: {
    light: ["#fde68a", "#fef08a", "#fcd34d"],
    dark: ["#4d3f00", "#524800", "#624d00"],
  },
  copper: {
    light: ["#9a3412", "#92400e", "#854d0e"],
    dark: ["#741c00", "#772e00", "#764000"],
  },
  rose: {
    light: ["#a82957", "#a8263c", "#a52521"],
    dark: ["#790037", "#860f29", "#901f1b"],
  },
  berry: {
    light: ["#8b3693", "#6c3aa4", "#5e3eaa"],
    dark: ["#63166b", "#582b89", "#553999"],
  },
  grape: {
    light: ["#66319a", "#5735a1", "#37349d"],
    dark: ["#3e0d65", "#3b1d75", "#2f2e84"],
  },
  lavender: {
    light: ["#ddd6fe", "#e9d5ff", "#c7d2fe"],
    dark: ["#462981", "#5b2c81", "#3a449b"],
  },
  dusk: {
    light: ["#4040a9", "#6141ad", "#6f3da8"],
    dark: ["#312f8c", "#4d308f", "#603493"],
  },
  midnight: {
    light: ["#1e3a8a", "#37349d", "#312e81"],
    dark: ["#0b2272", "#29257b", "#312d84"],
  },
  ocean: {
    light: ["#1f45a8", "#005789", "#00627c"],
    dark: ["#15368d", "#004c79", "#005971"],
  },
  sky: {
    light: ["#bae6fd", "#a5f3fc", "#bfdbfe"],
    dark: ["#004660", "#00545c", "#004e9a"],
  },
  lagoon: {
    light: ["#00645d", "#00627c", "#005789"],
    dark: ["#004d47", "#005066", "#005586"],
  },
  mint: {
    light: ["#a7f3d0", "#bbf7d0", "#99f6e4"],
    dark: ["#004d34", "#00572f", "#005f52"],
  },
  meadow: {
    light: ["#006b2a", "#006345", "#00625a"],
    dark: ["#004f1d", "#00563c", "#00625a"],
  },
  forest: {
    light: ["#166534", "#065f46", "#14532d"],
    dark: ["#003916", "#00402e", "#004b21"],
  },
  sand: {
    light: ["#fef3c7", "#e7e5e4", "#ffedd5"],
    dark: ["#4d3f00", "#494746", "#6d4700"],
  },
  slate: {
    light: ["#334155", "#475569", "#3b4a63"],
    dark: ["#212e41", "#293649", "#2f3d56"],
  },
  graphite: {
    light: ["#404040", "#3f3f46", "#262626"],
    dark: ["#2e2e2e", "#35353b", "#3d3d3d"],
  },
}

function buildGradient(id: GradientId): GradientDefinition {
  const angle = gradientAngles[id]
  const [lightFrom, lightVia, lightTo] = gradientSurfaces[id].light
  const [darkFrom, darkVia, darkTo] = gradientSurfaces[id].dark

  const light: GradientStops = { angle, from: lightFrom, via: lightVia, to: lightTo }
  const dark: GradientStops = { angle, from: darkFrom, via: darkVia, to: darkTo }

  return {
    id,
    name: gradientNames[id],
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

export type BlockHeading = "muted" | "prominent" | "none"

export interface BlockAppearance {
  gradient?: GradientId | null
  heading?: BlockHeading
}

export interface PageBackdrop {
  gradient: GradientId | null
  soft: boolean
}

export interface AdminAppearance {
  accent: AccentId
  sidebar: GradientId | null
  signIn: GradientId | null
  page: PageBackdrop
  pages: Record<string, PageBackdrop>
  blocks: Record<string, BlockAppearance>
}

export const defaultAdminAppearance: AdminAppearance = {
  accent: "emerald",
  sidebar: null,
  signIn: null,
  page: { gradient: null, soft: true },
  pages: {},
  blocks: {},
}

export function resolvePageBackdrop(
  appearance: AdminAppearance,
  pageId?: string
): PageBackdrop {
  if (pageId !== undefined) {
    const override = appearance.pages[pageId]
    if (override) {
      return override
    }
  }
  return appearance.page
}
