import { describe, expect, it } from "vitest"

import { contrastRatio, oklchToHex, type Oklch } from "./admin-theme-color"
import { defaultAdminThemeSources, deriveAdminTheme } from "./admin-theme-tokens"

const OKLCH_PATTERN = /^oklch\((-?[\d.]+) (-?[\d.]+) (-?[\d.]+)\)$/

function parseOklch(value: string): Oklch | null {
  const match = value.match(OKLCH_PATTERN)
  if (!match) {
    return null
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

function continuousContrast(background: Oklch, foreground: Oklch) {
  const luminance = (color: Oklch) => {
    const [r, g, b] = toLinearRgb(color)
    return 0.2126 * r + 0.7152 * g + 0.0722 * b
  }
  const first = luminance(background)
  const second = luminance(foreground)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

const PAIRS = [
  ["primary", "primary-foreground"],
  ["success", "success-foreground"],
  ["warning", "warning-foreground"],
  ["destructive", "destructive-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-active", "sidebar-active-foreground"],
] as const

describe("every derived pair clears AA without relying on hex rounding", () => {
  const { light, dark } = deriveAdminTheme(defaultAdminThemeSources)

  it("agrees with itself at full precision", () => {
    for (const [name, scheme] of [
      ["light", light],
      ["dark", dark],
    ] as const) {
      for (const [background, foreground] of PAIRS) {
        const bg = parseOklch(scheme[background])
        const fg = parseOklch(scheme[foreground])
        if (!bg || !fg) {
          continue
        }

        const quantised = contrastRatio(oklchToHex(bg), oklchToHex(fg))
        const continuous = continuousContrast(bg, fg)

        expect(
          continuous,
          `${name} ${background} at full precision`
        ).toBeGreaterThanOrEqual(4.5)
        expect(
          quantised,
          `${name} ${background} through hex`
        ).toBeGreaterThanOrEqual(4.5)
      }
    }
  })

  it("keeps the two methods close enough that neither alone decides a pass", () => {
    for (const scheme of [light, dark]) {
      for (const [background, foreground] of PAIRS) {
        const bg = parseOklch(scheme[background])
        const fg = parseOklch(scheme[foreground])
        if (!bg || !fg) {
          continue
        }

        const quantised = contrastRatio(oklchToHex(bg), oklchToHex(fg))
        const continuous = continuousContrast(bg, fg)
        expect(Math.abs(quantised - continuous)).toBeLessThan(0.1)
      }
    }
  })
})
