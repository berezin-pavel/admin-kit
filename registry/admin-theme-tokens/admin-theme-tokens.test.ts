import { describe, expect, it } from "vitest"

import { contrastRatio, hexToOklch, oklchToHex } from "./admin-theme-color"
import {
  defaultAdminThemeSources,
  deriveAdminTheme,
  suggestDarkStops,
  type AdminThemeScheme,
} from "./admin-theme-tokens"

const CURRENT_LIGHT_CHART_HUES = [225, 150, 70, 300, 25]
const OKLCH_PATTERN = /^oklch\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)$/

function oklchStringToHex(value: string) {
  const match = value.match(OKLCH_PATTERN)
  if (!match) {
    throw new Error(`Not an oklch triple: ${value}`)
  }
  return oklchToHex({
    l: Number(match[1]),
    c: Number(match[2]),
    h: Number(match[3]),
  })
}

function hueOf(scheme: AdminThemeScheme, token: string) {
  const match = scheme[token].match(OKLCH_PATTERN)
  if (!match) {
    throw new Error(`${token} is not an oklch triple: ${scheme[token]}`)
  }
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) }
}

describe("deriveAdminTheme", () => {
  const { light, dark } = deriveAdminTheme(defaultAdminThemeSources)

  it("emits every token the shipped theme declares, in both schemes", () => {
    const required = [
      "background",
      "foreground",
      "card",
      "card-foreground",
      "popover",
      "popover-foreground",
      "primary",
      "primary-foreground",
      "secondary",
      "secondary-foreground",
      "muted",
      "muted-foreground",
      "accent",
      "accent-foreground",
      "destructive",
      "destructive-foreground",
      "success",
      "success-foreground",
      "warning",
      "warning-foreground",
      "border",
      "input",
      "ring",
      "chart-1",
      "chart-2",
      "chart-3",
      "chart-4",
      "chart-5",
      "sidebar",
      "sidebar-foreground",
      "sidebar-primary",
      "sidebar-primary-foreground",
      "sidebar-accent",
      "sidebar-accent-foreground",
      "sidebar-border",
      "sidebar-ring",
    ]

    for (const token of required) {
      expect(light[token], `light ${token}`).toBeTruthy()
      expect(dark[token], `dark ${token}`).toBeTruthy()
    }
  })

  it("carries the radius in the light scheme only", () => {
    expect(light.radius).toBe("0.45rem")
    expect(dark.radius).toBeUndefined()
  })

  it("keeps the chart fan around the brand hue", () => {
    CURRENT_LIGHT_CHART_HUES.forEach((expected, index) => {
      expect(
        Math.abs(hueOf(light, `chart-${index + 1}`).h - expected)
      ).toBeLessThan(3.5)
    })
  })

  it("lands beside today's primary in both schemes", () => {
    expect(Math.abs(hueOf(light, "primary").l - 0.508)).toBeLessThan(0.005)
    expect(Math.abs(hueOf(light, "primary").c - 0.118)).toBeLessThan(0.01)
    expect(Math.abs(hueOf(dark, "primary").l - 0.432)).toBeLessThan(0.005)
    expect(Math.abs(hueOf(dark, "primary").c - 0.095)).toBeLessThan(0.01)
  })

  it("keeps every filled surface legible across the hue circle", () => {
    for (let hue = 0; hue < 360; hue += 15) {
      const brand = oklchToHex({ l: 0.55, c: 0.12, h: hue })
      const derived = deriveAdminTheme({
        ...defaultAdminThemeSources,
        brand,
      })

      for (const scheme of [derived.light, derived.dark]) {
        for (const token of ["primary", "success", "warning", "destructive"]) {
          const ratio = contrastRatio(
            oklchStringToHex(scheme[token]),
            oklchStringToHex(scheme[`${token}-foreground`])
          )
          expect(ratio, `${token} at hue ${hue}`).toBeGreaterThanOrEqual(4.5)
        }
      }
    }
  })

  it(
    "resolves a pathological brand hue without hanging",
    () => {
      const derived = deriveAdminTheme({
        ...defaultAdminThemeSources,
        brand: "#ff3ab6",
      })

      for (const scheme of [derived.light, derived.dark]) {
        const ratio = contrastRatio(
          oklchStringToHex(scheme.primary),
          oklchStringToHex(scheme["primary-foreground"])
        )
        expect(ratio).toBeGreaterThanOrEqual(4.5)
      }
    },
    2000
  )

  it("keeps every filled surface legible across a grid of sources", () => {
    for (let hue = 0; hue < 360; hue += 30) {
      for (const lightness of [0.2, 0.5, 0.8, 0.95]) {
        for (const chroma of [0.02, 0.12, 0.3]) {
          const brand = oklchToHex({ l: lightness, c: chroma, h: hue })
          const derived = deriveAdminTheme({
            ...defaultAdminThemeSources,
            brand,
          })

          for (const scheme of [derived.light, derived.dark]) {
            for (const token of [
              "primary",
              "success",
              "warning",
              "destructive",
            ]) {
              const ratio = contrastRatio(
                oklchStringToHex(scheme[token]),
                oklchStringToHex(scheme[`${token}-foreground`])
              )
              expect(
                ratio,
                `${token} at l=${lightness} c=${chroma} h=${hue}`
              ).toBeGreaterThanOrEqual(4.5)
            }
          }
        }
      }
    }
  })

  it("tints the neutrals with the surface hue and keeps them near-neutral", () => {
    expect(hueOf(light, "muted").c).toBeLessThanOrEqual(0.01)
    expect(hueOf(light, "border").c).toBeLessThanOrEqual(0.01)
  })

  it("uses translucent white for the dark scheme's edges", () => {
    expect(dark.border).toBe("oklch(1 0 0 / 10%)")
    expect(dark.input).toBe("oklch(1 0 0 / 15%)")
  })
})

describe("suggestDarkStops", () => {
  const light = {
    angle: 135,
    from: "#0ea5e9",
    via: "#6366f1",
    viaPosition: 50,
    to: "#a855f7",
  }
  const dark = suggestDarkStops(light)

  it("keeps the angle and the stop position", () => {
    expect(dark.angle).toBe(135)
    expect(dark.viaPosition).toBe(50)
  })

  it("darkens every stop while keeping its hue", () => {
    for (const key of ["from", "via", "to"] as const) {
      const before = hexToOklch(light[key] as string)
      const after = hexToOklch(dark[key] as string)
      expect(after.l).toBeLessThan(before.l)
      expect(Math.abs(after.h - before.h)).toBeLessThan(2)
    }
  })

  it("drops the middle stop when the light variant has none", () => {
    expect(suggestDarkStops({ angle: 90, from: "#ffffff", to: "#000000" }).via)
      .toBeUndefined()
  })
})
