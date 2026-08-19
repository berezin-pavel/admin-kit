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
  "monochrome",
  "jewel",
  "vivid",
  "fresh",
  "night",
  "earth",
  "metal",
  "pastel",
  "neutral",
] as const

export type GradientFamily = (typeof gradientFamilies)[number]

export const gradientFamilyNames: Record<GradientFamily, string> = {
  monochrome: "Monochrome",
  jewel: "Jewel",
  vivid: "Vivid",
  fresh: "Fresh",
  night: "Night",
  earth: "Earth",
  metal: "Metal",
  pastel: "Pastel",
  neutral: "Neutral",
}

export const gradientIds = [
  "red",
  "crimson",
  "orange",
  "gold",
  "yellow",
  "chartreuse",
  "green",
  "jade",
  "blue",
  "navy",
  "indigo",
  "violet",
  "purple",
  "fuchsia",
  "pink",
  "brown",
  "maroon",
  "salmon",
  "tangerine",
  "spring",
  "sea-green",
  "turquoise",
  "petrol",
  "periwinkle",
  "royal-blue",
  "iris",
  "mauve",
  "raspberry",
  "toffee",
  "ember",
  "cherry",
  "wine",
  "rose",
  "grape",
  "plum",
  "cobalt",
  "forest",
  "ivy",
  "amethyst",
  "magenta",
  "sapphire",
  "emerald",
  "ruby",
  "topaz",
  "garnet",
  "volcano",
  "sunset",
  "sunrise",
  "mango",
  "berry",
  "nebula",
  "northern",
  "aurora",
  "tropic",
  "orchid",
  "neon",
  "vapor",
  "grapefruit",
  "prism",
  "reef",
  "candy",
  "ocean",
  "lagoon",
  "ice",
  "sky",
  "meadow",
  "mint",
  "sage",
  "arctic",
  "cyan",
  "lime",
  "jungle",
  "pistachio",
  "dusk",
  "storm",
  "midnight",
  "denim",
  "steel",
  "charcoal",
  "onyx",
  "cool-grey",
  "copper",
  "moss",
  "sand",
  "brick",
  "honey",
  "mustard",
  "terracotta",
  "mocha",
  "clay",
  "olive",
  "cocoa",
  "bronze",
  "rose-gold",
  "platinum",
  "brass",
  "concrete",
  "coral",
  "flamingo",
  "lemon",
  "amber",
  "peach",
  "lavender",
  "rosewater",
  "pearl",
  "apricot",
  "lilac",
  "buttercup",
  "sherbet",
  "slate",
  "graphite",
  "ash",
  "basalt",
  "pewter",
  "mono",
] as const

export type GradientId = (typeof gradientIds)[number]

export interface GradientIntent {
  name: string
  family: GradientFamily
  angle: number
  stops: readonly string[]
  text: "light" | "dark"
}

const DEFAULT_ANGLE = 135

export const gradientIntents: Record<GradientId, GradientIntent> = {
  red: { name: "Red", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#5e000d", "#a21929", "#e2484f"], text: "light" },
  crimson: { name: "Crimson", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#521526", "#8d364b", "#c86077"], text: "light" },
  orange: { name: "Orange", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#3e1000", "#802a00", "#c94700"], text: "light" },
  gold: { name: "Gold", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#d78c00", "#eb9f2c", "#ffb245"], text: "dark" },
  yellow: { name: "Yellow", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#e0bb00", "#f7d22a", "#ffe648"], text: "dark" },
  chartreuse: { name: "Chartreuse", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#85c100", "#9edb2e", "#b7f652"], text: "dark" },
  green: { name: "Green", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#004300", "#06750d", "#38a937"], text: "light" },
  jade: { name: "Jade", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#004225", "#007545", "#00ab68"], text: "light" },
  blue: { name: "Blue", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#002e5c", "#0059a7", "#2d88e2"], text: "light" },
  navy: { name: "Navy", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#13244b", "#364d82", "#607cba"], text: "light" },
  indigo: { name: "Indigo", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#2a1870", "#4f44ac", "#7b74e8"], text: "light" },
  violet: { name: "Violet", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#3d0076", "#692fb4", "#9860f0"], text: "light" },
  purple: { name: "Purple", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#44085f", "#753597", "#a862cf"], text: "light" },
  fuchsia: { name: "Fuchsia", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#520057", "#88228d", "#c24dc7"], text: "light" },
  pink: { name: "Pink", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#4b1639", "#7f3d66", "#b76798"], text: "light" },
  brown: { name: "Brown", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#492e21", "#7d5642", "#b3826a"], text: "light" },
  maroon: { name: "Maroon", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#3f191d", "#743e42", "#aa686d"], text: "light" },
  salmon: { name: "Salmon", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#eb7e92", "#ff98ab", "#ffc3cc"], text: "dark" },
  tangerine: { name: "Tangerine", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#ff6d0f", "#ff9e72", "#ffc8b0"], text: "dark" },
  spring: { name: "Spring", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#5abc81", "#74d699", "#8ef1b2"], text: "dark" },
  "sea-green": { name: "Sea Green", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#00c57b", "#00e28e", "#2afda7"], text: "dark" },
  turquoise: { name: "Turquoise", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#00b5c7", "#00d3e5", "#41edff"], text: "dark" },
  petrol: { name: "Petrol", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#00242e", "#003f4f", "#00637b"], text: "light" },
  periwinkle: { name: "Periwinkle", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#63a4ff", "#92bfff", "#bfd9ff"], text: "dark" },
  "royal-blue": { name: "Royal Blue", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#100d7a", "#2538a1", "#4561cc"], text: "light" },
  iris: { name: "Iris", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#b088ff", "#c5acff", "#dbceff"], text: "dark" },
  mauve: { name: "Mauve", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#d57fda", "#f099f5", "#ffbdff"], text: "dark" },
  raspberry: { name: "Raspberry", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#450024", "#750041", "#b00064"], text: "light" },
  toffee: { name: "Toffee", family: "monochrome", angle: DEFAULT_ANGLE, stops: ["#2f1e00", "#543a03", "#7a5e2e"], text: "light" },

  ember: { name: "Ember", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#7f1d1d", "#b91c1c", "#dc2626", "#ea580c", "#f59e0b"], text: "light" },
  cherry: { name: "Cherry", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#881337", "#be123c", "#e11d48", "#f472b6"], text: "light" },
  wine: { name: "Wine", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#4a044e", "#831843", "#9f1239", "#7c2d12"], text: "light" },
  rose: { name: "Rose", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#9d174d", "#db2777", "#a21caf", "#6d28d9"], text: "light" },
  grape: { name: "Grape", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#312e81", "#5b21b6", "#9333ea", "#c026d3"], text: "light" },
  plum: { name: "Plum", family: "jewel", angle: 160, stops: ["#3b0764", "#6b21a8", "#be185d", "#0f172a"], text: "light" },
  cobalt: { name: "Cobalt", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#1e1b4b", "#3730a3", "#2563eb", "#38bdf8"], text: "light" },
  forest: { name: "Forest", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#132b16", "#345c2d", "#475e09", "#605800", "#327555"], text: "light" },
  ivy: { name: "Ivy", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#052e16", "#15803d", "#0f766e", "#155e75"], text: "light" },
  amethyst: { name: "Amethyst", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#2e1065", "#6d28d9", "#a855f7", "#f0abfc"], text: "light" },
  magenta: { name: "Magenta", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#701a75", "#c026d3", "#db2777", "#fb7185"], text: "light" },
  sapphire: { name: "Sapphire", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#172554", "#1e40af", "#4f46e5", "#a5b4fc"], text: "light" },
  emerald: { name: "Emerald", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#002b2e", "#007777", "#00b9b2", "#95f3ef"], text: "light" },
  ruby: { name: "Ruby", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#450932", "#931b6b", "#d3278f", "#f2a5d2"], text: "light" },
  topaz: { name: "Topaz", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#431210", "#c43c32", "#fe972e", "#ffea87"], text: "light" },
  garnet: { name: "Garnet", family: "jewel", angle: DEFAULT_ANGLE, stops: ["#450a0a", "#7f1d1d", "#be123c", "#7e22ce"], text: "light" },

  volcano: { name: "Volcano", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#3a0919", "#7c1b3c", "#c33949", "#ff685b", "#ffbc2e"], text: "light" },
  sunset: { name: "Sunset", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#c2410c", "#e11d48", "#be185d", "#7e22ce"], text: "light" },
  sunrise: { name: "Sunrise", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#f59e0b", "#f97316", "#ef4444", "#db2777"], text: "light" },
  mango: { name: "Mango", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#ae5a00", "#e46100", "#e7a700", "#54d351"], text: "light" },
  berry: { name: "Berry", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#701a75", "#a21caf", "#e11d48", "#f97316"], text: "light" },
  nebula: { name: "Nebula", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#1e1b4b", "#7e22ce", "#db2777", "#f97316"], text: "light" },
  northern: { name: "Northern", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#154c58", "#3d6c9d", "#741db3", "#a4009f"], text: "light" },
  aurora: { name: "Aurora", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#064e3b", "#0d9488", "#4f46e5", "#a21caf"], text: "light" },
  tropic: { name: "Tropic", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#facc15", "#84cc16", "#10b981", "#06b6d4"], text: "dark" },
  orchid: { name: "Orchid", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#c026d3", "#e879f9", "#818cf8", "#38bdf8"], text: "light" },
  neon: { name: "Neon", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#22d3ee", "#a855f7", "#ec4899", "#f97316"], text: "light" },
  vapor: { name: "Vapor", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#f472b6", "#c084fc", "#60a5fa", "#2dd4bf"], text: "light" },
  grapefruit: { name: "Grapefruit", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#da2053", "#fe6b4b", "#ffb437", "#cbdb00"], text: "light" },
  prism: { name: "Prism", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#2563eb", "#7c3aed", "#db2777", "#f59e0b", "#84cc16"], text: "light" },
  reef: { name: "Reef", family: "vivid", angle: DEFAULT_ANGLE, stops: ["#0e7490", "#10b981", "#facc15", "#f97316"], text: "light" },

  candy: { name: "Candy", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#f9a8d4", "#c4b5fd", "#67e8f9", "#a7f3d0"], text: "dark" },
  ocean: { name: "Ocean", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#1e3a8a", "#1d4ed8", "#0284c7", "#06b6d4", "#14b8a6"], text: "light" },
  lagoon: { name: "Lagoon", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#134e4a", "#0f766e", "#0891b2", "#22d3ee", "#a3e635"], text: "light" },
  ice: { name: "Ice", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#bae6fd", "#c7d2fe", "#e9d5ff", "#f0fdfa"], text: "dark" },
  sky: { name: "Sky", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#7dd3fc", "#38bdf8", "#818cf8", "#c4b5fd"], text: "dark" },
  meadow: { name: "Meadow", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#14532d", "#15803d", "#65a30d", "#eab308"], text: "light" },
  mint: { name: "Mint", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#a7f3d0", "#6ee7b7", "#67e8f9", "#bae6fd"], text: "dark" },
  sage: { name: "Sage", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#d9f99d", "#bbf7d0", "#99f6e4", "#e0e7ff"], text: "dark" },
  arctic: { name: "Arctic", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#0c4a6e", "#0369a1", "#38bdf8", "#e0f2fe"], text: "light" },
  cyan: { name: "Cyan", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#112840", "#265075", "#3fa4de", "#a5e4f2"], text: "light" },
  lime: { name: "Lime", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#2c2900", "#605800", "#c9b800", "#ffec89"], text: "light" },
  jungle: { name: "Jungle", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#002f1e", "#006743", "#009395", "#e5d629"], text: "light" },
  pistachio: { name: "Pistachio", family: "fresh", angle: DEFAULT_ANGLE, stops: ["#bef264", "#86efac", "#5eead4", "#fef9c3"], text: "dark" },

  dusk: { name: "Dusk", family: "night", angle: DEFAULT_ANGLE, stops: ["#0f172a", "#312e81", "#7e22ce", "#f472b6"], text: "light" },
  storm: { name: "Storm", family: "night", angle: DEFAULT_ANGLE, stops: ["#1f2937", "#4c1d95", "#6d28d9", "#64748b"], text: "light" },
  midnight: { name: "Midnight", family: "night", angle: DEFAULT_ANGLE, stops: ["#020617", "#1e3a8a", "#1d4ed8", "#0f766e"], text: "light" },
  denim: { name: "Denim", family: "night", angle: 160, stops: ["#0f172a", "#1e40af", "#334155", "#0ea5e9"], text: "light" },
  steel: { name: "Steel", family: "night", angle: DEFAULT_ANGLE, stops: ["#272637", "#525168", "#4a5da7", "#9f9fb7"], text: "light" },
  charcoal: { name: "Charcoal", family: "night", angle: DEFAULT_ANGLE, stops: ["#18181b", "#3f3f46", "#52525b", "#7c2d12"], text: "light" },
  onyx: { name: "Onyx", family: "night", angle: DEFAULT_ANGLE, stops: ["#000000", "#1e1b4b", "#111827", "#312e81"], text: "light" },
  "cool-grey": { name: "Cool Grey", family: "night", angle: DEFAULT_ANGLE, stops: ["#111827", "#1f2937", "#1e3a8a", "#374151"], text: "light" },

  copper: { name: "Copper", family: "earth", angle: DEFAULT_ANGLE, stops: ["#431214", "#7d2929", "#b84d32", "#e16f38", "#a85c25"], text: "light" },
  moss: { name: "Moss", family: "earth", angle: DEFAULT_ANGLE, stops: ["#365314", "#4d7c0f", "#a16207", "#78350f"], text: "light" },
  sand: { name: "Sand", family: "earth", angle: DEFAULT_ANGLE, stops: ["#fef3c7", "#e7e5e4", "#d6d3d1", "#fde68a"], text: "dark" },
  brick: { name: "Brick", family: "earth", angle: DEFAULT_ANGLE, stops: ["#330003", "#6b0216", "#8b1824", "#9d4334"], text: "light" },
  honey: { name: "Honey", family: "earth", angle: DEFAULT_ANGLE, stops: ["#936b00", "#c98300", "#dfcd2e", "#e3f998"], text: "light" },
  mustard: { name: "Mustard", family: "earth", angle: DEFAULT_ANGLE, stops: ["#763a27", "#ab592e", "#da7e34", "#ffa431"], text: "light" },
  terracotta: { name: "Terracotta", family: "earth", angle: DEFAULT_ANGLE, stops: ["#7c2d12", "#9a3412", "#c2410c", "#d6d3d1"], text: "light" },
  mocha: { name: "Mocha", family: "earth", angle: DEFAULT_ANGLE, stops: ["#292524", "#57534e", "#78350f", "#a8a29e"], text: "light" },
  clay: { name: "Clay", family: "earth", angle: DEFAULT_ANGLE, stops: ["#78350f", "#b45309", "#a8a29e", "#fde68a"], text: "light" },
  olive: { name: "Olive", family: "earth", angle: DEFAULT_ANGLE, stops: ["#0e300f", "#296527", "#3ba83f", "#a3a3a3"], text: "light" },
  cocoa: { name: "Cocoa", family: "earth", angle: DEFAULT_ANGLE, stops: ["#1c1917", "#44403c", "#7c2d12", "#a16207"], text: "light" },

  bronze: { name: "Bronze", family: "metal", angle: DEFAULT_ANGLE, stops: ["#401f00", "#894a00", "#c78500", "#e2f095"], text: "light" },
  "rose-gold": { name: "Rose Gold", family: "metal", angle: DEFAULT_ANGLE, stops: ["#9f1239", "#e11d48", "#fda4af", "#fef3c7"], text: "light" },
  platinum: { name: "Platinum", family: "metal", angle: DEFAULT_ANGLE, stops: ["#a1a1aa", "#e4e4e7", "#f4f4f5", "#d4d4d8"], text: "dark" },
  brass: { name: "Brass", family: "metal", angle: DEFAULT_ANGLE, stops: ["#634900", "#a89c07", "#c4f372", "#f5f5f4"], text: "light" },
  concrete: { name: "Concrete", family: "metal", angle: DEFAULT_ANGLE, stops: ["#78716c", "#a8a29e", "#d6d3d1", "#e7e5e4"], text: "dark" },

  coral: { name: "Coral", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#f43f5e", "#fb7185", "#f97316", "#facc15"], text: "dark" },
  flamingo: { name: "Flamingo", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#db2777", "#f472b6", "#fb923c", "#fde68a"], text: "dark" },
  lemon: { name: "Lemon", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fef08a", "#fde047", "#bef264", "#86efac"], text: "dark" },
  amber: { name: "Amber", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fde68a", "#fbbf24", "#fb923c", "#fda4af"], text: "dark" },
  peach: { name: "Peach", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fed7aa", "#fdba74", "#fda4af", "#f9a8d4"], text: "dark" },
  lavender: { name: "Lavender", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#ddd6fe", "#c4b5fd", "#f5d0fe", "#bfdbfe"], text: "dark" },
  rosewater: { name: "Rosewater", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fecdd3", "#fbcfe8", "#e9d5ff", "#fef3c7"], text: "dark" },
  pearl: { name: "Pearl", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#f5f5f4", "#e7e5e4", "#e0f2fe", "#fce7f3"], text: "dark" },
  apricot: { name: "Apricot", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fdba74", "#fb923c", "#fde68a", "#fecaca"], text: "dark" },
  lilac: { name: "Lilac", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#e9d5ff", "#f0abfc", "#f9a8d4", "#fecdd3"], text: "dark" },
  buttercup: { name: "Buttercup", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fef9c3", "#fde68a", "#fcd34d", "#fdba74"], text: "dark" },
  sherbet: { name: "Sherbet", family: "pastel", angle: DEFAULT_ANGLE, stops: ["#fdba74", "#f9a8d4", "#c4b5fd", "#a5f3fc"], text: "dark" },

  slate: { name: "Slate", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#0f172a", "#334155", "#475569", "#0369a1"], text: "light" },
  graphite: { name: "Graphite", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#111827", "#374151", "#1f2937", "#4b5563", "#0f766e"], text: "light" },
  ash: { name: "Ash", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#1c1917", "#292524", "#44403c", "#57534e"], text: "light" },
  basalt: { name: "Basalt", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#0a0a0a", "#171717", "#262626", "#404040"], text: "light" },
  pewter: { name: "Pewter", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#374151", "#4b5563", "#6b7280", "#9ca3af"], text: "light" },
  mono: { name: "Mono", family: "neutral", angle: DEFAULT_ANGLE, stops: ["#000000", "#262626", "#525252", "#737373"], text: "light" },
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

export type BlockHeading = "regular" | "large" | "none"

export interface BlockAppearance {
  gradient?: GradientId | null
  heading?: BlockHeading
}

export interface PageBackdrop {
  gradient: GradientId
  soft: boolean
}

export interface AdminAppearance {
  accent: AccentId
  sidebar: GradientId | null
  header: GradientId | null
  signIn: GradientId | null
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
