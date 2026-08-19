import { describe, expect, it } from "vitest"
import { composite, contrastRatio, hexToOklch, sampleGradient } from "./appearance-color"
import { gradientForeground } from "./appearance-css"
import { NEAR_BLACK_HEX, NEAR_WHITE_HEX } from "./appearance-accent"
import {
  accentIds,
  accentPalette,
  defaultAdminAppearance,
  gradientFamilies,
  gradientIds,
  gradientIntents,
  gradientPalette,
  hoverOverlayAlphas,
  isAccentId,
  isGradientId,
  resolvePageBackdrop,
  type GradientStops,
} from "./appearance-palette"

const HEX_PATTERN = /^#[0-9a-f]{6}$/

function circularHueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

function foregroundHexOf(stops: GradientStops): string {
  return gradientForeground(stops).startsWith("oklch(0.985")
    ? NEAR_WHITE_HEX
    : NEAR_BLACK_HEX
}

function oklab(hex: string) {
  const { l, c, h } = hexToOklch(hex)
  const radians = (h * Math.PI) / 180
  return { l, a: c * Math.cos(radians), b: c * Math.sin(radians) }
}

function meanOklabDistance(a: GradientStops, b: GradientStops): number {
  const samplesA = sampleGradient(a.stops, 9).map(oklab)
  const samplesB = sampleGradient(b.stops, 9).map(oklab)
  const total = samplesA.reduce((sum, pointA, index) => {
    const pointB = samplesB[index]
    const dl = pointA.l - pointB.l
    const da = pointA.a - pointB.a
    const db = pointA.b - pointB.b
    return sum + Math.sqrt(dl * dl + da * da + db * db)
  }, 0)
  return total / samplesA.length
}

describe("gradientIds and gradientPalette", () => {
  it("has exactly one hundred six unique ids in the declared order", () => {
    expect(gradientIds).toHaveLength(106)
    expect(new Set(gradientIds).size).toBe(106)
    expect(gradientPalette.map((gradient) => gradient.id)).toEqual([
      ...gradientIds,
    ])
  })

  it("has three to five valid hex stops and a valid angle for every gradient in both schemes", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        expect(scheme.stops.length).toBeGreaterThanOrEqual(3)
        expect(scheme.stops.length).toBeLessThanOrEqual(5)
        for (const hex of scheme.stops) {
          expect(hex).toMatch(HEX_PATTERN)
        }
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

  it("assigns every gradient a declared family", () => {
    for (const gradient of gradientPalette) {
      expect(gradientFamilies).toContain(gradient.family)
    }
  })

  it("picks a foreground that stays legible across the whole gradient", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const foregroundHex = foregroundHexOf(scheme)
        const samples = sampleGradient(scheme.stops, 33)
        for (const sample of samples) {
          expect(contrastRatio(sample, foregroundHex)).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  it("stays legible under a gamma-encoded sRGB hover overlay", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const foregroundHex = foregroundHexOf(scheme)
        const samples = sampleGradient(scheme.stops, 33)
        for (const sample of samples) {
          for (const alpha of hoverOverlayAlphas) {
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
    const lightForegroundHex = NEAR_BLACK_HEX

    for (const gradient of gradientPalette) {
      const samples = sampleGradient(gradient.softLight.stops, 33)
      for (const hex of gradient.softLight.stops) {
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
    const darkForegroundHex = NEAR_WHITE_HEX

    for (const gradient of gradientPalette) {
      const samples = sampleGradient(gradient.softDark.stops, 33)
      for (const hex of gradient.softDark.stops) {
        const l = hexToOklch(hex).l
        expect(l).toBeGreaterThanOrEqual(0.22)
        expect(l).toBeLessThanOrEqual(0.36)
      }
      for (const sample of samples) {
        expect(contrastRatio(sample, darkForegroundHex)).toBeGreaterThanOrEqual(7)
      }
    }
  })

  it("shows visible motion between the first and last stop in both schemes", () => {
    for (const gradient of gradientPalette) {
      for (const scheme of [gradient.light, gradient.dark]) {
        const from = hexToOklch(scheme.stops[0])
        const to = hexToOklch(scheme.stops[scheme.stops.length - 1])
        const deltaL = Math.abs(from.l - to.l)
        const deltaH = circularHueDistance(from.h, to.h)
        expect(
          deltaL >= 0.03 || deltaH >= 8,
          `${scheme.stops[0]} -> ${scheme.stops[scheme.stops.length - 1]}: deltaL=${deltaL.toFixed(3)} deltaH=${deltaH.toFixed(1)}`
        ).toBe(true)
      }
    }
  })

  it("has no two gradients sharing the same light-scheme first and last stop", () => {
    const pairs = gradientPalette.map(
      (gradient) =>
        `${gradient.light.stops[0]}:${gradient.light.stops[gradient.light.stops.length - 1]}`
    )
    expect(new Set(pairs).size).toBe(pairs.length)
  })

  it("keeps the fitted light-scheme stops faithful to the intent's hue, and never moves lightness further than legibility demands", () => {
    for (const gradient of gradientPalette) {
      const intent = gradientIntents[gradient.id]
      for (let index = 0; index < intent.stops.length; index++) {
        const intentOklch = hexToOklch(intent.stops[index])
        const fittedOklch = hexToOklch(gradient.light.stops[index])

        const lightnessDelta = Math.abs(intentOklch.l - fittedOklch.l)
        expect(
          lightnessDelta,
          `${gradient.id} stop ${index}: intent l=${intentOklch.l.toFixed(3)} fitted l=${fittedOklch.l.toFixed(3)}`
        ).toBeLessThanOrEqual(0.55)

        if (intentOklch.c < 0.02) {
          continue
        }
        const hueDelta = circularHueDistance(intentOklch.h, fittedOklch.h)
        expect(
          hueDelta,
          `${gradient.id} stop ${index}: intent h=${intentOklch.h.toFixed(1)} fitted h=${fittedOklch.h.toFixed(1)}`
        ).toBeLessThanOrEqual(12)
      }
    }
  })

  it("picks the intended text colour for the light scheme", () => {
    for (const gradient of gradientPalette) {
      const intent = gradientIntents[gradient.id]
      const foreground = gradientForeground(gradient.light)
      const expected = intent.text === "light" ? "oklch(0.985" : "oklch(0.205"
      expect(foreground.startsWith(expected), gradient.id).toBe(true)
    }
  })

  it("keeps every pair of gradients at least 0.045 mean OKLab distance apart across nine samples of the light variant", () => {
    for (let i = 0; i < gradientPalette.length; i++) {
      for (let j = i + 1; j < gradientPalette.length; j++) {
        const distance = meanOklabDistance(
          gradientPalette[i].light,
          gradientPalette[j].light
        )
        expect(
          distance,
          `${gradientPalette[i].id} vs ${gradientPalette[j].id}: distance=${distance.toFixed(4)}`
        ).toBeGreaterThanOrEqual(0.045)
      }
    }
  })

  it("keeps every monochrome gradient to three same-hue stops", () => {
    for (const gradient of gradientPalette) {
      if (gradient.family !== "monochrome") {
        continue
      }
      const intent = gradientIntents[gradient.id]
      expect(intent.stops).toHaveLength(3)

      const oklchStops = intent.stops
        .map((hex) => hexToOklch(hex))
        .filter((oklch) => oklch.c >= 0.03)
      let hueSpread = 0
      for (let i = 0; i < oklchStops.length; i++) {
        for (let j = i + 1; j < oklchStops.length; j++) {
          hueSpread = Math.max(
            hueSpread,
            circularHueDistance(oklchStops[i].h, oklchStops[j].h)
          )
        }
      }
      expect(hueSpread, `${gradient.id}: hue spread ${hueSpread.toFixed(1)}`).toBeLessThanOrEqual(8)
    }
  })

  it("isGradientId accepts only known ids", () => {
    expect(isGradientId("ocean")).toBe(true)
    expect(isGradientId("neon-lights")).toBe(false)
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
      header: null,
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
      pages: { orders: { gradient: "ocean" as const, soft: true } },
    }
    expect(resolvePageBackdrop(appearance, "orders")).toEqual({
      gradient: "ocean",
      soft: true,
    })
    expect(resolvePageBackdrop(appearance, "products")).toEqual(appearance.page)
  })

  it("carries the override's own soft flag", () => {
    const appearance = {
      ...defaultAdminAppearance,
      page: { gradient: "ocean" as const, soft: true },
      pages: { orders: { gradient: "ember" as const, soft: false } },
    }
    expect(resolvePageBackdrop(appearance, "orders")).toEqual({
      gradient: "ember",
      soft: false,
    })
  })

  it("treats a stored null override as no backdrop on that page", () => {
    const appearance = {
      ...defaultAdminAppearance,
      page: { gradient: "ocean" as const, soft: true },
      pages: { orders: null },
    }
    expect(resolvePageBackdrop(appearance, "orders")).toBeNull()
    expect(resolvePageBackdrop(appearance, "products")).toEqual({
      gradient: "ocean",
      soft: true,
    })
  })

  it("falls back to the page backdrop when no pageId is given", () => {
    expect(resolvePageBackdrop(defaultAdminAppearance)).toEqual(
      defaultAdminAppearance.page
    )
  })
})
