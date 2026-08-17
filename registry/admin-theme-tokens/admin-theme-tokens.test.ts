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

function circularHueDelta(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

function isNeutralHex(hex: string) {
  const value = Number.parseInt(hex.slice(1), 16)
  const red = (value >> 16) & 255
  const green = (value >> 8) & 255
  const blue = value & 255
  return red === green && green === blue
}

function darkenedLightness(lightness: number) {
  return Math.min(lightness, clamp(lightness * 0.55, 0.12, 0.6))
}

function bestAchievableHueDrift(hex: string) {
  const source = hexToOklch(hex)
  const targetLightness = darkenedLightness(source.l)
  const FINE_CHROMA_STEP = 0.0002

  let best = Infinity
  for (let chroma = source.c; chroma >= 0; chroma -= FINE_CHROMA_STEP) {
    const candidateHex = oklchToHex({ l: targetLightness, c: chroma, h: source.h })
    if (isNeutralHex(candidateHex)) {
      break
    }
    const drift = circularHueDelta(hexToOklch(candidateHex).h, source.h)
    if (drift < best) {
      best = drift
    }
  }
  return best
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
          const sourceHex = oklchToHex({ l: lightness, c: chroma, h: hue })
          const derived = deriveAdminTheme({
            ...defaultAdminThemeSources,
            brand: sourceHex,
            success: sourceHex,
            warning: sourceHex,
            danger: sourceHex,
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

  it("keeps the reported worst-case success/warning/destructive source legible", () => {
    const derived = deriveAdminTheme({
      ...defaultAdminThemeSources,
      success: "#d7397b",
      warning: "#d7397b",
      danger: "#d7397b",
    })

    for (const scheme of [derived.light, derived.dark]) {
      for (const token of ["success", "warning", "destructive"]) {
        const ratio = contrastRatio(
          oklchStringToHex(scheme[token]),
          oklchStringToHex(scheme[`${token}-foreground`])
        )
        expect(ratio, `${token} in ${scheme === derived.light ? "light" : "dark"}`).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it("keeps sidebar-primary's foreground near-white and legible in both schemes", () => {
    for (const [scheme, label] of [
      [light, "light"],
      [dark, "dark"],
    ] as const) {
      expect(
        hueOf(scheme, "sidebar-primary-foreground").l,
        `${label} sidebar-primary-foreground lightness`
      ).toBe(0.979)

      const ratio = contrastRatio(
        oklchStringToHex(scheme["sidebar-primary"]),
        oklchStringToHex(scheme["sidebar-primary-foreground"])
      )
      expect(ratio, `${label} sidebar-primary ratio`).toBeGreaterThanOrEqual(
        4.5
      )
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
      const afterValue = dark[key]
      if (afterValue === undefined) {
        throw new Error(`${key} is missing from the darkened stops`)
      }

      const before = hexToOklch(light[key])
      const after = hexToOklch(afterValue)
      expect(after.l).toBeLessThan(before.l)
      expect(Math.abs(after.h - before.h)).toBeLessThan(2)
    }
  })

  it("drops the middle stop when the light variant has none", () => {
    expect(suggestDarkStops({ angle: 90, from: "#ffffff", to: "#000000" }).via)
      .toBeUndefined()
  })

  it("never lightens a stop that is already darker than the clamp floor", () => {
    expect(
      suggestDarkStops({ angle: 90, from: "#ffffff", to: "#000000" }).to
    ).toBe("#000000")
  })

  it("preserves hue and avoids collapsing to grey for low-lightness saturated stops", () => {
    for (let hue = 0; hue < 360; hue += 60) {
      const stopHex = oklchToHex({ l: 0.12, c: 0.3, h: hue })
      const before = hexToOklch(stopHex)
      const darkened = suggestDarkStops({ angle: 0, from: stopHex, to: stopHex })
      const after = hexToOklch(darkened.from)

      expect(
        circularHueDelta(after.h, before.h),
        `hue at input h=${hue}`
      ).toBeLessThan(2)
      expect(after.c, `chroma at input h=${hue}`).toBeGreaterThan(0)
    }
  })

  it("never leaves a chromatic stop as a neutral grey, even where the gamut can't hold its hue", () => {
    const REPORTED_STOPS = [
      "#140800",
      "#1d0300",
      "#011000",
      "#00110a",
      "#001b15",
      "#002928",
    ]

    for (const hex of REPORTED_STOPS) {
      const result = suggestDarkStops({ angle: 0, from: hex, to: hex })

      expect(isNeutralHex(result.from), `${hex} -> ${result.from}`).toBe(
        false
      )

      const before = hexToOklch(hex)
      const after = hexToOklch(result.from)
      const actualDrift = circularHueDelta(after.h, before.h)
      const bestDrift = bestAchievableHueDrift(hex)

      expect(
        actualDrift,
        `${hex} drift ${actualDrift.toFixed(4)} vs best achievable ${bestDrift.toFixed(4)}`
      ).toBeLessThanOrEqual(bestDrift + 0.01)
    }
  })
})
