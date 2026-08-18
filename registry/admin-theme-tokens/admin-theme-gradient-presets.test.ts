import { describe, expect, it } from "vitest"

import {
  contrastRatio,
  hexToOklch,
  oklchToHex,
  type Oklch,
} from "./admin-theme-color"
import { gradientCss, gradientForeground } from "./admin-theme-css"
import { gradientPresets, type GradientStops } from "./admin-theme-tokens"

const OKLCH_PATTERN = /^oklch\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)$/
const LEGIBLE_CONTRAST = 4.5
const AIM_CONTRAST = 4.6
const MAX_PRESETS = 8

function parseOklch(value: string): Oklch {
  const match = value.match(OKLCH_PATTERN)
  if (!match) {
    throw new Error(`Not an oklch triple: ${value}`)
  }
  return { l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) }
}

function toLinearRgb({ l, c, h }: Oklch) {
  const radians = (h * Math.PI) / 180
  const a = c * Math.cos(radians)
  const b = c * Math.sin(radians)
  const long = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * b) ** 3
  return [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ].map((channel) => Math.min(1, Math.max(0, channel)))
}

function continuousLuminance(color: Oklch) {
  const [r, g, b] = toLinearRgb(color)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function hexLuminance(hex: string) {
  const [r, g, b] = toLinearRgb(hexToOklch(hex))
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function continuousContrast(stopHex: string, foreground: Oklch) {
  const first = hexLuminance(stopHex)
  const second = continuousLuminance(foreground)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

function stopsOf(stops: GradientStops) {
  return stops.via
    ? [stops.from, stops.via, stops.to]
    : [stops.from, stops.to]
}

describe("gradientPresets", () => {
  it("is a small, curated set rather than a catalogue", () => {
    expect(gradientPresets.length).toBeGreaterThan(0)
    expect(gradientPresets.length).toBeLessThanOrEqual(MAX_PRESETS)
  })

  it("gives every preset a unique, recognisable name", () => {
    const names = gradientPresets.map((preset) => preset.name)
    expect(new Set(names).size).toBe(names.length)
    for (const name of names) {
      expect(name).not.toMatch(/^#[0-9a-f]{6}$/i)
    }
  })

  it("spreads presets across the hue circle instead of clustering", () => {
    const hues = gradientPresets.map(
      (preset) => hexToOklch(preset.light.from).h
    )
    for (let i = 0; i < hues.length; i++) {
      for (let j = i + 1; j < hues.length; j++) {
        const diff = Math.abs(hues[i] - hues[j]) % 360
        const circularDiff = Math.min(diff, 360 - diff)
        expect(
          circularDiff,
          `${gradientPresets[i].name} vs ${gradientPresets[j].name}`
        ).toBeGreaterThan(20)
      }
    }
  })

  describe("clears 4.5:1 against its own computed foreground under both measurements", () => {
    for (const preset of gradientPresets) {
      for (const [schemeName, stops] of [
        ["light", preset.light],
        ["dark", preset.dark],
      ] as const) {
        it(`${preset.name} (${schemeName})`, () => {
          const foreground = parseOklch(gradientForeground(stops))

          for (const stopHex of stopsOf(stops)) {
            const quantised = contrastRatio(stopHex, oklchToHex(foreground))
            const continuous = continuousContrast(stopHex, foreground)

            expect(
              quantised,
              `${preset.name} ${schemeName} ${stopHex} through hex`
            ).toBeGreaterThanOrEqual(LEGIBLE_CONTRAST)
            expect(
              continuous,
              `${preset.name} ${schemeName} ${stopHex} at full precision`
            ).toBeGreaterThanOrEqual(LEGIBLE_CONTRAST)
            expect(
              Math.min(quantised, continuous),
              `${preset.name} ${schemeName} ${stopHex} should clear the aim margin so neither method alone decides the outcome`
            ).toBeGreaterThanOrEqual(AIM_CONTRAST)
          }
        })
      }
    }
  })

  it("never produces a gradient the editor's own warning would flag", () => {
    for (const preset of gradientPresets) {
      for (const stops of [preset.light, preset.dark]) {
        const foreground = parseOklch(gradientForeground(stops))
        const worstStopRatio = Math.min(
          ...stopsOf(stops).map((stopHex) =>
            contrastRatio(stopHex, oklchToHex(foreground))
          )
        )
        expect(worstStopRatio, preset.name).toBeGreaterThanOrEqual(
          LEGIBLE_CONTRAST
        )
      }
    }
  })

  it("renders valid CSS for every stop", () => {
    for (const preset of gradientPresets) {
      expect(gradientCss(preset.light)).toMatch(/^linear-gradient\(/)
      expect(gradientCss(preset.dark)).toMatch(/^linear-gradient\(/)
    }
  })
})
