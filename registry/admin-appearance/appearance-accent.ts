import {
  contrastRatio,
  formatOklch,
  hexToOklch,
  oklchToHex,
  type Oklch,
} from "./appearance-color"

export const NEAR_WHITE = "oklch(0.985 0 0)"
export const NEAR_BLACK = "oklch(0.205 0 0)"
export const NEAR_WHITE_HEX = oklchToHex({ l: 0.985, c: 0, h: 0 })
export const NEAR_BLACK_HEX = oklchToHex({ l: 0.205, c: 0, h: 0 })

const FIXED_SURFACE = "#ffffff"

const NEAR_WHITE_LIGHTNESS = 0.979
const NEAR_WHITE_CHROMA = 0.021
const NEAR_BLACK_LIGHTNESS = 0.205
const CHART_HUE_OFFSETS = [59, -16, -96, 134, -141]
const CHART_LIGHT = [
  { l: 0.58, c: 0.13 },
  { l: 0.58, c: 0.14 },
  { l: 0.68, c: 0.15 },
  { l: 0.53, c: 0.16 },
  { l: 0.58, c: 0.17 },
]
const CHART_DARK = [
  { l: 0.75, c: 0.13 },
  { l: 0.75, c: 0.14 },
  { l: 0.8, c: 0.15 },
  { l: 0.72, c: 0.16 },
  { l: 0.72, c: 0.16 },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function neutral(surface: Oklch, lightness: number) {
  return formatOklch({
    l: lightness,
    c: Math.min(surface.c, 0.01),
    h: surface.h,
  })
}

function nearWhite(hue: number): Oklch {
  return { l: NEAR_WHITE_LIGHTNESS, c: NEAR_WHITE_CHROMA, h: hue }
}

function nearBlack(hue: number): Oklch {
  return { l: NEAR_BLACK_LIGHTNESS, c: 0, h: hue }
}

function readableForeground(background: Oklch, hue: number) {
  const backgroundHex = oklchToHex(background)

  return contrastRatio(backgroundHex, oklchToHex(nearWhite(hue))) >=
    contrastRatio(backgroundHex, oklchToHex(nearBlack(hue)))
    ? nearWhite(hue)
    : nearBlack(hue)
}

const LEGIBLE_CONTRAST = 4.5
const LIGHTNESS_SEARCH_STEP = 0.005
const SIDEBAR_PRIMARY_LIGHTNESS_MIN = 0.35
const SIDEBAR_PRIMARY_LIGHTNESS_MAX = 0.85
const SIDEBAR_ACTIVE_LIGHT_LIGHTNESS = 0.94
const SIDEBAR_ACTIVE_DARK_LIGHTNESS = 0.265
const SIDEBAR_ACTIVE_TINT_CHROMA_CAP = 0.03
const SIDEBAR_ACTIVE_FOREGROUND_LIGHTNESS_MIN = 0.15
const SIDEBAR_ACTIVE_FOREGROUND_LIGHTNESS_MAX = 0.85

function roundedOklch(color: Oklch): Oklch {
  return {
    l: Number(color.l.toFixed(3)),
    c: Number(color.c.toFixed(3)),
    h: Number(color.h.toFixed(3)),
  }
}

function legibilityRatio(color: Oklch) {
  const rounded = roundedOklch(color)
  const foreground = roundedOklch(readableForeground(rounded, rounded.h))
  return contrastRatio(oklchToHex(rounded), oklchToHex(foreground))
}

function contrastAgainstNearWhite(color: Oklch) {
  const rounded = roundedOklch(color)
  const foreground = roundedOklch(nearWhite(rounded.h))
  return contrastRatio(oklchToHex(rounded), oklchToHex(foreground))
}

function contrastAgainstFixedBackground(background: Oklch) {
  const backgroundHex = oklchToHex(roundedOklch(background))
  return (candidate: Oklch) =>
    contrastRatio(backgroundHex, oklchToHex(roundedOklch(candidate)))
}

export function searchLegibleLightness(
  color: Oklch,
  min: number,
  max: number,
  ratioOf: (color: Oklch) => number
): Oklch {
  const start = clamp(color.l, min, max)
  const startCandidate: Oklch = { ...color, l: start }

  let bestCandidate = startCandidate
  let bestRatio = ratioOf(startCandidate)

  const maxOffset = Math.ceil((max - min) / LIGHTNESS_SEARCH_STEP)

  for (
    let step = 1;
    bestRatio < LEGIBLE_CONTRAST && step <= maxOffset;
    step++
  ) {
    const lighterL = start + step * LIGHTNESS_SEARCH_STEP
    const darkerL = start - step * LIGHTNESS_SEARCH_STEP
    const candidates: Oklch[] = []
    if (lighterL <= max) {
      candidates.push({ ...color, l: lighterL })
    }
    if (darkerL >= min) {
      candidates.push({ ...color, l: darkerL })
    }
    if (candidates.length === 0) {
      break
    }

    for (const candidate of candidates) {
      const ratio = ratioOf(candidate)
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestCandidate = candidate
      }
    }
  }

  return bestCandidate
}

export function sidebarActivePair(
  brand: Oklch,
  tintLightness: number,
  pushDirection: "down" | "up"
) {
  const active: Oklch = {
    h: brand.h,
    c: Math.min(brand.c, SIDEBAR_ACTIVE_TINT_CHROMA_CAP),
    l: tintLightness,
  }
  const foregroundMin =
    pushDirection === "down"
      ? SIDEBAR_ACTIVE_FOREGROUND_LIGHTNESS_MIN
      : brand.l
  const foregroundMax =
    pushDirection === "down"
      ? brand.l
      : SIDEBAR_ACTIVE_FOREGROUND_LIGHTNESS_MAX
  const foreground = searchLegibleLightness(
    brand,
    foregroundMin,
    foregroundMax,
    contrastAgainstFixedBackground(active)
  )

  return {
    active: formatOklch(active),
    foreground: formatOklch(foreground),
  }
}

export function deriveAccentTokens(accentHex: string): {
  light: Record<string, string>
  dark: Record<string, string>
} {
  const brand = hexToOklch(accentHex)
  const surface = hexToOklch(FIXED_SURFACE)

  const lightPrimary: Oklch = searchLegibleLightness(
    brand,
    0.35,
    0.72,
    legibilityRatio
  )
  const darkPrimaryBase: Oklch = {
    h: brand.h,
    c: lightPrimary.c * 0.8,
    l: clamp(lightPrimary.l - 0.076, 0.28, 0.62),
  }
  const darkPrimary: Oklch = searchLegibleLightness(
    darkPrimaryBase,
    0.28,
    0.62,
    legibilityRatio
  )

  const lightSidebarPrimaryBase: Oklch = {
    h: brand.h,
    c: lightPrimary.c + 0.027,
    l: clamp(
      lightPrimary.l + 0.088,
      SIDEBAR_PRIMARY_LIGHTNESS_MIN,
      SIDEBAR_PRIMARY_LIGHTNESS_MAX
    ),
  }
  const lightSidebarPrimary: Oklch = searchLegibleLightness(
    lightSidebarPrimaryBase,
    SIDEBAR_PRIMARY_LIGHTNESS_MIN,
    SIDEBAR_PRIMARY_LIGHTNESS_MAX,
    contrastAgainstNearWhite
  )

  const darkSidebarPrimaryBase: Oklch = {
    h: brand.h,
    c: darkPrimary.c + 0.027,
    l: clamp(
      darkPrimary.l + 0.088,
      SIDEBAR_PRIMARY_LIGHTNESS_MIN,
      SIDEBAR_PRIMARY_LIGHTNESS_MAX
    ),
  }
  const darkSidebarPrimary: Oklch = searchLegibleLightness(
    darkSidebarPrimaryBase,
    SIDEBAR_PRIMARY_LIGHTNESS_MIN,
    SIDEBAR_PRIMARY_LIGHTNESS_MAX,
    contrastAgainstNearWhite
  )

  const lightSidebarActive = sidebarActivePair(
    brand,
    SIDEBAR_ACTIVE_LIGHT_LIGHTNESS,
    "down"
  )
  const darkSidebarActive = sidebarActivePair(
    brand,
    SIDEBAR_ACTIVE_DARK_LIGHTNESS,
    "up"
  )

  const chart = (index: number, ramp: typeof CHART_LIGHT) =>
    formatOklch({
      l: ramp[index].l,
      c: ramp[index].c,
      h: (brand.h + CHART_HUE_OFFSETS[index] + 360) % 360,
    })

  const light: Record<string, string> = {
    primary: formatOklch(lightPrimary),
    "primary-foreground": formatOklch(readableForeground(lightPrimary, brand.h)),
    ring: neutral(surface, 0.708),
    "sidebar-primary": formatOklch(lightSidebarPrimary),
    "sidebar-primary-foreground": formatOklch(nearWhite(brand.h)),
    "sidebar-active": lightSidebarActive.active,
    "sidebar-active-foreground": lightSidebarActive.foreground,
    "sidebar-ring": neutral(surface, 0.708),
  }

  const dark: Record<string, string> = {
    primary: formatOklch(darkPrimary),
    "primary-foreground": formatOklch(readableForeground(darkPrimary, brand.h)),
    ring: neutral(surface, 0.556),
    "sidebar-primary": formatOklch(darkSidebarPrimary),
    "sidebar-primary-foreground": formatOklch(nearWhite(brand.h)),
    "sidebar-active": darkSidebarActive.active,
    "sidebar-active-foreground": darkSidebarActive.foreground,
    "sidebar-ring": neutral(surface, 0.556),
  }

  CHART_LIGHT.forEach((_, index) => {
    light[`chart-${index + 1}`] = chart(index, CHART_LIGHT)
    dark[`chart-${index + 1}`] = chart(index, CHART_DARK)
  })

  return { light, dark }
}
