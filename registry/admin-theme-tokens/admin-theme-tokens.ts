import {
  contrastRatio,
  formatOklch,
  hexToOklch,
  oklchToHex,
  type Oklch,
} from "./admin-theme-color"

export interface AdminThemeSources {
  brand: string
  surface: string
  success: string
  warning: string
  danger: string
  radius: number
}

export interface GradientStops {
  angle: number
  from: string
  via?: string
  viaPosition?: number
  to: string
}

export interface AdminThemeGradient {
  id: string
  name: string
  light: GradientStops
  dark: GradientStops
}

export interface AdminTheme {
  sources: AdminThemeSources
  gradients: readonly AdminThemeGradient[]
}

export type AdminThemeScheme = Record<string, string>

export const defaultAdminThemeSources: AdminThemeSources = {
  brand: "#007953",
  surface: "#ffffff",
  success: "#287c42",
  warning: "#ad5600",
  danger: "#c9302d",
  radius: 0.45,
}

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

const RADIUS_FALLBACK_REM = 0.45
const RADIUS_MIN_REM = 0
const RADIUS_MAX_REM = 4

function sanitizedRadiusRem(radius: number): string {
  const finiteRadius = Number.isFinite(radius) ? radius : RADIUS_FALLBACK_REM
  return `${clamp(finiteRadius, RADIUS_MIN_REM, RADIUS_MAX_REM)}rem`
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
const FILLED_SURFACE_LIGHTNESS_MIN = 0.15
const FILLED_SURFACE_LIGHTNESS_MAX = 0.85
const SIDEBAR_PRIMARY_LIGHTNESS_MIN = 0.35
const SIDEBAR_PRIMARY_LIGHTNESS_MAX = 0.85
const SIDEBAR_ACTIVE_LIGHT_LIGHTNESS = 0.94
const SIDEBAR_ACTIVE_DARK_LIGHTNESS = 0.27
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

function searchLegibleLightness(
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

function filledPair(
  hex: string,
  transform: (color: Oklch) => Oklch,
  min: number,
  max: number
) {
  const surface = searchLegibleLightness(
    transform(hexToOklch(hex)),
    min,
    max,
    legibilityRatio
  )
  return {
    surface: formatOklch(surface),
    foreground: formatOklch(readableForeground(surface, surface.h)),
  }
}

function sidebarActivePair(
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

export function deriveAdminTheme(sources: AdminThemeSources): {
  light: AdminThemeScheme
  dark: AdminThemeScheme
} {
  const brand = hexToOklch(sources.brand)
  const surface = hexToOklch(sources.surface)

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

  const identity = (color: Oklch) => color
  const success = filledPair(
    sources.success,
    identity,
    FILLED_SURFACE_LIGHTNESS_MIN,
    FILLED_SURFACE_LIGHTNESS_MAX
  )
  const warning = filledPair(
    sources.warning,
    identity,
    FILLED_SURFACE_LIGHTNESS_MIN,
    FILLED_SURFACE_LIGHTNESS_MAX
  )
  const dangerLight = filledPair(
    sources.danger,
    identity,
    FILLED_SURFACE_LIGHTNESS_MIN,
    FILLED_SURFACE_LIGHTNESS_MAX
  )
  const dangerDark = filledPair(
    sources.danger,
    (color) => ({
      ...color,
      l: clamp(color.l + 0.1, 0, 0.9),
    }),
    FILLED_SURFACE_LIGHTNESS_MIN,
    FILLED_SURFACE_LIGHTNESS_MAX
  )

  const chart = (index: number, ramp: typeof CHART_LIGHT) =>
    formatOklch({
      l: ramp[index].l,
      c: ramp[index].c,
      h: (brand.h + CHART_HUE_OFFSETS[index] + 360) % 360,
    })

  const light: AdminThemeScheme = {
    background: neutral(surface, 1),
    foreground: neutral(surface, 0.145),
    card: neutral(surface, 1),
    "card-foreground": neutral(surface, 0.145),
    popover: neutral(surface, 1),
    "popover-foreground": neutral(surface, 0.145),
    primary: formatOklch(lightPrimary),
    "primary-foreground": formatOklch(
      readableForeground(lightPrimary, brand.h)
    ),
    secondary: neutral(surface, 0.97),
    "secondary-foreground": neutral(surface, 0.205),
    muted: neutral(surface, 0.97),
    "muted-foreground": neutral(surface, 0.556),
    accent: neutral(surface, 0.97),
    "accent-foreground": neutral(surface, 0.205),
    destructive: dangerLight.surface,
    "destructive-foreground": dangerLight.foreground,
    success: success.surface,
    "success-foreground": success.foreground,
    warning: warning.surface,
    "warning-foreground": warning.foreground,
    border: neutral(surface, 0.922),
    input: neutral(surface, 0.922),
    ring: neutral(surface, 0.708),
    sidebar: neutral(surface, 0.985),
    "sidebar-foreground": neutral(surface, 0.145),
    "sidebar-primary": formatOklch(lightSidebarPrimary),
    "sidebar-primary-foreground": formatOklch(nearWhite(brand.h)),
    "sidebar-accent": neutral(surface, 0.97),
    "sidebar-accent-foreground": neutral(surface, 0.205),
    "sidebar-active": lightSidebarActive.active,
    "sidebar-active-foreground": lightSidebarActive.foreground,
    "sidebar-border": neutral(surface, 0.922),
    "sidebar-ring": neutral(surface, 0.708),
    radius: sanitizedRadiusRem(sources.radius),
  }

  const dark: AdminThemeScheme = {
    background: neutral(surface, 0.145),
    foreground: neutral(surface, 0.985),
    card: neutral(surface, 0.205),
    "card-foreground": neutral(surface, 0.985),
    popover: neutral(surface, 0.205),
    "popover-foreground": neutral(surface, 0.985),
    primary: formatOklch(darkPrimary),
    "primary-foreground": formatOklch(readableForeground(darkPrimary, brand.h)),
    secondary: neutral(surface, 0.269),
    "secondary-foreground": neutral(surface, 0.985),
    muted: neutral(surface, 0.269),
    "muted-foreground": neutral(surface, 0.708),
    accent: neutral(surface, 0.269),
    "accent-foreground": neutral(surface, 0.985),
    destructive: dangerDark.surface,
    "destructive-foreground": dangerDark.foreground,
    success: success.surface,
    "success-foreground": success.foreground,
    warning: warning.surface,
    "warning-foreground": warning.foreground,
    border: "oklch(1 0 0 / 10%)",
    input: "oklch(1 0 0 / 15%)",
    ring: neutral(surface, 0.556),
    sidebar: neutral(surface, 0.205),
    "sidebar-foreground": neutral(surface, 0.985),
    "sidebar-primary": formatOklch(darkSidebarPrimary),
    "sidebar-primary-foreground": formatOklch(nearWhite(brand.h)),
    "sidebar-accent": neutral(surface, 0.269),
    "sidebar-accent-foreground": neutral(surface, 0.985),
    "sidebar-active": darkSidebarActive.active,
    "sidebar-active-foreground": darkSidebarActive.foreground,
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": neutral(surface, 0.556),
  }

  CHART_LIGHT.forEach((_, index) => {
    light[`chart-${index + 1}`] = chart(index, CHART_LIGHT)
    dark[`chart-${index + 1}`] = chart(index, CHART_DARK)
  })

  return { light, dark }
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

export function suggestDarkStops(light: GradientStops): GradientStops {
  const darken = (hex: string) => {
    const color = hexToOklch(hex)
    const targetLightness = Math.min(color.l, clamp(color.l * 0.55, 0.12, 0.6))
    return oklchToHex(fitChromaToGamut({ ...color, l: targetLightness }))
  }

  return {
    angle: light.angle,
    from: darken(light.from),
    via: light.via ? darken(light.via) : undefined,
    viaPosition: light.viaPosition,
    to: darken(light.to),
  }
}
