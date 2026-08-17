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

function neutral(surface: Oklch, lightness: number) {
  return formatOklch({
    l: lightness,
    c: Math.min(surface.c, 0.01),
    h: surface.h,
  })
}

function readableForeground(background: Oklch, hue: number) {
  const nearWhite: Oklch = {
    l: NEAR_WHITE_LIGHTNESS,
    c: NEAR_WHITE_CHROMA,
    h: hue,
  }
  const nearBlack: Oklch = { l: NEAR_BLACK_LIGHTNESS, c: 0, h: hue }
  const backgroundHex = oklchToHex(background)

  return contrastRatio(backgroundHex, oklchToHex(nearWhite)) >=
    contrastRatio(backgroundHex, oklchToHex(nearBlack))
    ? nearWhite
    : nearBlack
}

function filledPair(hex: string, transform: (color: Oklch) => Oklch) {
  const surface = transform(hexToOklch(hex))
  return {
    surface: formatOklch(surface),
    foreground: formatOklch(readableForeground(surface, surface.h)),
  }
}

const LEGIBLE_CONTRAST = 4.5
const LIGHTNESS_SEARCH_STEP = 0.005

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

function clampToLegibleLightness(
  color: Oklch,
  min: number,
  max: number
): Oklch {
  const start = clamp(color.l, min, max)
  const startCandidate: Oklch = { ...color, l: start }

  let bestCandidate = startCandidate
  let bestRatio = legibilityRatio(startCandidate)

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
      const ratio = legibilityRatio(candidate)
      if (ratio > bestRatio) {
        bestRatio = ratio
        bestCandidate = candidate
      }
    }
  }

  return bestCandidate
}

export function deriveAdminTheme(sources: AdminThemeSources): {
  light: AdminThemeScheme
  dark: AdminThemeScheme
} {
  const brand = hexToOklch(sources.brand)
  const surface = hexToOklch(sources.surface)

  const lightPrimary: Oklch = clampToLegibleLightness(brand, 0.35, 0.72)
  const darkPrimaryBase: Oklch = {
    h: brand.h,
    c: lightPrimary.c * 0.8,
    l: clamp(lightPrimary.l - 0.076, 0.28, 0.62),
  }
  const darkPrimary: Oklch = clampToLegibleLightness(
    darkPrimaryBase,
    0.28,
    0.62
  )
  const lightSidebarPrimary: Oklch = {
    h: brand.h,
    c: lightPrimary.c + 0.027,
    l: clamp(lightPrimary.l + 0.088, 0.35, 0.85),
  }
  const darkSidebarPrimary: Oklch = { h: brand.h, c: 0.17, l: 0.696 }

  const identity = (color: Oklch) => color
  const success = filledPair(sources.success, identity)
  const warning = filledPair(sources.warning, identity)
  const dangerLight = filledPair(sources.danger, identity)
  const dangerDark = filledPair(sources.danger, (color) => ({
    ...color,
    l: clamp(color.l + 0.1, 0, 0.9),
  }))

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
    "sidebar-primary-foreground": formatOklch(
      readableForeground(lightSidebarPrimary, brand.h)
    ),
    "sidebar-accent": neutral(surface, 0.97),
    "sidebar-accent-foreground": neutral(surface, 0.205),
    "sidebar-border": neutral(surface, 0.922),
    "sidebar-ring": neutral(surface, 0.708),
    radius: `${sources.radius}rem`,
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
    "sidebar-primary-foreground": formatOklch(
      readableForeground(darkSidebarPrimary, brand.h)
    ),
    "sidebar-accent": neutral(surface, 0.269),
    "sidebar-accent-foreground": neutral(surface, 0.985),
    "sidebar-border": "oklch(1 0 0 / 10%)",
    "sidebar-ring": neutral(surface, 0.556),
  }

  CHART_LIGHT.forEach((_, index) => {
    light[`chart-${index + 1}`] = chart(index, CHART_LIGHT)
    dark[`chart-${index + 1}`] = chart(index, CHART_DARK)
  })

  return { light, dark }
}

const CHROMA_DRIFT_TOLERANCE = 0.002
const CHROMA_SEARCH_ITERATIONS = 30

function fitChromaToGamut(color: Oklch): Oklch {
  if (color.c <= 0) {
    return color
  }

  const chromaDrift = (chroma: number) => {
    const roundTripped = hexToOklch(oklchToHex({ ...color, c: chroma }))
    return Math.abs(roundTripped.c - chroma)
  }

  if (chromaDrift(color.c) <= CHROMA_DRIFT_TOLERANCE) {
    return color
  }

  let low = 0
  let high = color.c
  for (let i = 0; i < CHROMA_SEARCH_ITERATIONS; i++) {
    const mid = (low + high) / 2
    if (chromaDrift(mid) <= CHROMA_DRIFT_TOLERANCE) {
      low = mid
    } else {
      high = mid
    }
  }

  return { ...color, c: low }
}

export function suggestDarkStops(light: GradientStops): GradientStops {
  const darken = (hex: string) => {
    const color = hexToOklch(hex)
    return oklchToHex(
      fitChromaToGamut({
        ...color,
        l: clamp(color.l * 0.55, 0.12, 0.6),
      })
    )
  }

  return {
    angle: light.angle,
    from: darken(light.from),
    via: light.via ? darken(light.via) : undefined,
    viaPosition: light.viaPosition,
    to: darken(light.to),
  }
}
