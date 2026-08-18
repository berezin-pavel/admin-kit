import { describe, expect, it } from "vitest"
import { composite, contrastRatio, hexToOklch, oklchToHex, sampleGradient } from "./appearance-color"
import { gradientForeground } from "./appearance-css"
import { NEAR_BLACK_HEX, NEAR_WHITE_HEX } from "./appearance-accent"
import {
  accentIds,
  accentPalette,
  defaultAdminAppearance,
  gradientIds,
  gradientPalette,
  isAccentId,
  isGradientId,
  resolvePageBackdrop,
  type GradientId,
  type GradientStops,
} from "./appearance-palette"

const HEX_PATTERN = /^#[0-9a-f]{6}$/

const LIGHT_SCHEME_MEAN_LIGHTNESS_MINIMUM: Record<GradientId, number> = {
  ember: 0.42,
  sunset: 0.42,
  peach: 0.8,
  amber: 0.8,
  copper: 0.42,
  rose: 0.42,
  berry: 0.42,
  grape: 0.33,
  lavender: 0.8,
  dusk: 0.42,
  midnight: 0.33,
  ocean: 0.42,
  sky: 0.8,
  lagoon: 0.42,
  mint: 0.8,
  meadow: 0.42,
  forest: 0.33,
  sand: 0.8,
  slate: 0.33,
  graphite: 0.33,
}

const DARK_SCHEME_MEAN_LIGHTNESS_MINIMUM = 0.3

function circularHueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

function hueSpread(stops: GradientStops): number {
  const points = [stops.from, stops.via, stops.to].map(hexToOklch)
  const chromatic = points.filter((point) => point.c >= 0.02)
  if (chromatic.length < 2) {
    return 0
  }
  let max = 0
  for (let i = 0; i < chromatic.length; i++) {
    for (let j = i + 1; j < chromatic.length; j++) {
      max = Math.max(max, circularHueDistance(chromatic[i].h, chromatic[j].h))
    }
  }
  return max
}

function lightnessSpread(stops: GradientStops): number {
  const lightnesses = [stops.from, stops.via, stops.to].map(
    (hex) => hexToOklch(hex).l
  )
  return Math.max(...lightnesses) - Math.min(...lightnesses)
}

function maxChroma(stops: GradientStops): number {
  return Math.max(
    ...[stops.from, stops.via, stops.to].map((hex) => hexToOklch(hex).c)
  )
}

function foregroundHexOf(stops: GradientStops): string {
  return gradientForeground(stops).startsWith("oklch(0.985")
    ? NEAR_WHITE_HEX
    : NEAR_BLACK_HEX
}

describe("gradientIds and gradientPalette", () => {
  it("has exactly twenty unique ids in the declared order", () => {
    expect(gradientIds).toHaveLength(20)
    expect(new Set(gradientIds).size).toBe(20)
    expect(gradientPalette.map((gradient) => gradient.id)).toEqual([
      ...gradientIds,
    ])
  })

  it("has valid hex stops and angles for every gradient in both schemes", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        expect(scheme.from).toMatch(HEX_PATTERN)
        expect(scheme.via).toMatch(HEX_PATTERN)
        expect(scheme.to).toMatch(HEX_PATTERN)
        expect(scheme.angle).toBeGreaterThanOrEqual(0)
        expect(scheme.angle).toBeLessThanOrEqual(360)
      }
    }
  })

  it("has unique, non-empty names", () => {
    const names = gradientPalette.map((gradient) => gradient.name)
    expect(names.every((name) => name.length > 0)).toBe(true)
    expect(new Set(names).size).toBe(names.length)
  })

  it("keeps chroma pleasant (<= 0.17) for every stop in both schemes", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        expect(maxChroma(scheme)).toBeLessThanOrEqual(0.17)
      }
    }
  })

  it("keeps lightness spread within a gradient at or under 0.18", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        expect(lightnessSpread(scheme)).toBeLessThanOrEqual(0.18)
      }
    }
  })

  it("keeps hue spread within a gradient at or under 70 degrees", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        expect(hueSpread(scheme)).toBeLessThanOrEqual(70)
      }
    }
  })

  it("picks a foreground that stays legible across the whole gradient", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const foregroundHex = foregroundHexOf(scheme)
        const samples = sampleGradient(scheme, 33)
        for (const sample of samples) {
          expect(contrastRatio(sample, foregroundHex)).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  it("stays legible under a gamma-encoded sRGB hover overlay", () => {
    const alphas = [0.08, 0.16]
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const foregroundHex = foregroundHexOf(scheme)
        const samples = sampleGradient(scheme, 33)
        for (const sample of samples) {
          for (const alpha of alphas) {
            const composited = composite(foregroundHex, alpha, sample, "srgb")
            expect(
              contrastRatio(foregroundHex, composited)
            ).toBeGreaterThanOrEqual(4.5)
          }
        }
      }
    }
  })

  it("keeps soft light stops legible against the light scheme's own foreground", () => {
    const lightForegroundHex = oklchToHex({ l: 0.145, c: 0, h: 0 })

    for (const gradient of gradientPalette) {
      const samples = sampleGradient(gradient.softLight, 33)
      for (const hex of [
        gradient.softLight.from,
        gradient.softLight.via,
        gradient.softLight.to,
      ]) {
        const l = hexToOklch(hex).l
        expect(l).toBeGreaterThanOrEqual(0.8)
        expect(l).toBeLessThanOrEqual(0.94)
      }
      for (const sample of samples) {
        expect(contrastRatio(sample, lightForegroundHex)).toBeGreaterThanOrEqual(7)
      }
    }
  })

  it("keeps soft dark stops legible against the dark scheme's own foreground", () => {
    const darkForegroundHex = oklchToHex({ l: 0.985, c: 0, h: 0 })

    for (const gradient of gradientPalette) {
      const samples = sampleGradient(gradient.softDark, 33)
      for (const hex of [
        gradient.softDark.from,
        gradient.softDark.via,
        gradient.softDark.to,
      ]) {
        const l = hexToOklch(hex).l
        expect(l).toBeGreaterThanOrEqual(0.22)
        expect(l).toBeLessThanOrEqual(0.36)
      }
      for (const sample of samples) {
        expect(contrastRatio(sample, darkForegroundHex)).toBeGreaterThanOrEqual(7)
      }
    }
  })

  it("keeps the light-scheme surface out of near-black territory, per family", () => {
    for (const gradient of gradientPalette) {
      const meanLightness =
        [gradient.light.from, gradient.light.via, gradient.light.to]
          .map((hex) => hexToOklch(hex).l)
          .reduce((sum, l) => sum + l, 0) / 3
      expect(meanLightness).toBeGreaterThanOrEqual(
        LIGHT_SCHEME_MEAN_LIGHTNESS_MINIMUM[gradient.id]
      )
    }
  })

  it("keeps the dark-scheme surface visibly above black, per family", () => {
    for (const gradient of gradientPalette) {
      const meanLightness =
        [gradient.dark.from, gradient.dark.via, gradient.dark.to]
          .map((hex) => hexToOklch(hex).l)
          .reduce((sum, l) => sum + l, 0) / 3
      expect(meanLightness).toBeGreaterThanOrEqual(DARK_SCHEME_MEAN_LIGHTNESS_MINIMUM)
    }
  })

  it("shows visible motion between from and to in both schemes", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const from = hexToOklch(scheme.from)
        const to = hexToOklch(scheme.to)
        const deltaL = Math.abs(from.l - to.l)
        const deltaH = circularHueDistance(from.h, to.h)
        expect(
          deltaL >= 0.03 || deltaH >= 8,
          `${scheme.from} -> ${scheme.to}: deltaL=${deltaL.toFixed(3)} deltaH=${deltaH.toFixed(1)}`
        ).toBe(true)
      }
    }
  })

  it("has no two gradients sharing the same light.from and light.to", () => {
    const pairs = gradientPalette.map(
      (gradient) => `${gradient.light.from}:${gradient.light.to}`
    )
    expect(new Set(pairs).size).toBe(pairs.length)
  })

  it("isGradientId accepts only known ids", () => {
    expect(isGradientId("ocean")).toBe(true)
    expect(isGradientId("neon")).toBe(false)
    expect(isGradientId(42)).toBe(false)
  })
})

describe("accentIds and accentPalette", () => {
  it("has exactly twenty unique ids in the declared order", () => {
    expect(accentIds).toHaveLength(20)
    expect(new Set(accentIds).size).toBe(20)
    expect(accentPalette.map((accent) => accent.id)).toEqual([...accentIds])
  })

  it("defaults emerald to today's brand color", () => {
    const emerald = accentPalette.find((accent) => accent.id === "emerald")
    expect(emerald?.hex).toBe("#007953")
  })

  it("has valid hex values and unique, non-empty names", () => {
    for (const accent of accentPalette) {
      expect(accent.hex).toMatch(HEX_PATTERN)
    }
    const names = accentPalette.map((accent) => accent.name)
    expect(new Set(names).size).toBe(names.length)
    expect(names.every((name) => name.length > 0)).toBe(true)
  })

  it("isAccentId accepts only known ids", () => {
    expect(isAccentId("emerald")).toBe(true)
    expect(isAccentId("turquoise")).toBe(false)
    expect(isAccentId(null)).toBe(false)
  })
})

describe("defaultAdminAppearance", () => {
  it("matches the documented defaults", () => {
    expect(defaultAdminAppearance).toEqual({
      accent: "emerald",
      sidebar: null,
      signIn: null,
      page: null,
      pages: {},
      blocks: {},
    })
  })
})

describe("resolvePageBackdrop", () => {
  it("falls back to the global page backdrop when there is no override", () => {
    expect(resolvePageBackdrop(defaultAdminAppearance, "orders")).toEqual(
      defaultAdminAppearance.page
    )
  })

  it("uses the page-specific override when present", () => {
    const appearance = {
      ...defaultAdminAppearance,
      pages: { orders: "ocean" as const },
    }
    expect(resolvePageBackdrop(appearance, "orders")).toBe("ocean")
    expect(resolvePageBackdrop(appearance, "products")).toEqual(appearance.page)
  })

  it("treats a stored null override as no backdrop on that page", () => {
    const appearance = {
      ...defaultAdminAppearance,
      page: "ocean" as const,
      pages: { orders: null },
    }
    expect(resolvePageBackdrop(appearance, "orders")).toBeNull()
    expect(resolvePageBackdrop(appearance, "products")).toBe("ocean")
  })

  it("falls back to the page backdrop when no pageId is given", () => {
    expect(resolvePageBackdrop(defaultAdminAppearance)).toEqual(
      defaultAdminAppearance.page
    )
  })
})
