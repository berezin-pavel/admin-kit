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
  const targetLightness = scheme === "light" ? 0.983 : 0.22
  const chromaScale = scheme === "light" ? 0.015 : 0.5
  const chromaCap = scheme === "light" ? 0.003 : 0.05

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
  slate: 140,
  graphite: 135,
}

const gradientSurfaces: Record<
  GradientId,
  { light: [string, string, string]; dark: [string, string, string] }
> = {
  ember: {
    light: ["#7a000a", "#731500", "#622900"],
    dark: ["#6e000b", "#681200", "#582400"],
  },
  sunset: {
    light: ["#6b1f00", "#7a0018", "#740143"],
    dark: ["#621b00", "#6e0015", "#69003c"],
  },
  peach: {
    light: ["#cda58b", "#d4a287", "#d0a390"],
    dark: ["#582400", "#5b2300", "#5c2100"],
  },
  amber: {
    light: ["#c3a36e", "#d19d6b", "#d99a76"],
    dark: ["#492e00", "#512a00", "#5b2300"],
  },
  copper: {
    light: ["#652602", "#6a2102", "#6a200d"],
    dark: ["#592304", "#5f1e04", "#601d0d"],
  },
  rose: {
    light: ["#730049", "#770032", "#7a0018"],
    dark: ["#680342", "#6c002e", "#6f0016"],
  },
  berry: {
    light: ["#671163", "#5f166e", "#521e7c"],
    dark: ["#5b1457", "#541861", "#471e6c"],
  },
  grape: {
    light: ["#4e2573", "#4b237a", "#402880"],
    dark: ["#442463", "#42226a", "#39266f"],
  },
  lavender: {
    light: ["#aea3c5", "#aba2cc", "#a7a5c7"],
    dark: ["#3f2761", "#3c2768", "#36296a"],
  },
  dusk: {
    light: ["#2c307e", "#402880", "#502177"],
    dark: ["#272c72", "#392474", "#471e6c"],
  },
  midnight: {
    light: ["#003a6b", "#0f3678", "#243379"],
    dark: ["#003561", "#0e326c", "#212e6d"],
  },
  ocean: {
    light: ["#003a6b", "#003e55", "#004147"],
    dark: ["#003561", "#00384d", "#00393f"],
  },
  sky: {
    light: ["#89acc2", "#7dafc3", "#82aeba"],
    dark: ["#003750", "#003849", "#003a45"],
  },
  lagoon: {
    light: ["#004049", "#004243", "#004339"],
    dark: ["#003a42", "#003a3a", "#003c33"],
  },
  mint: {
    light: ["#89b19e", "#86b197", "#91af96"],
    dark: ["#003c28", "#003d22", "#003c15"],
  },
  meadow: {
    light: ["#004418", "#004400", "#1e4200"],
    dark: ["#003c15", "#003d00", "#1a3b00"],
  },
  forest: {
    light: ["#004422", "#004313", "#074300"],
    dark: ["#003c1e", "#003d10", "#063e00"],
  },
  sand: {
    light: ["#b2a794", "#b7a58d", "#b5a595"],
    dark: ["#463000", "#492e00", "#4d2d00"],
  },
  slate: {
    light: ["#253c4f", "#263b4a", "#203d4d"],
    dark: ["#1f3548", "#203646", "#1a3747"],
  },
  graphite: {
    light: ["#363a3e", "#363a3e", "#363a3e"],
    dark: ["#313437", "#313437", "#313437"],
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
