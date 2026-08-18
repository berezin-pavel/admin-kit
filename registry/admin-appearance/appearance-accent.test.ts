import { describe, expect, it } from "vitest"
import { contrastRatio, hexToOklch, oklchToHex, type Oklch } from "./appearance-color"
import { deriveAccentTokens } from "./appearance-accent"
import { accentPalette } from "./appearance-palette"

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

function continuousContrast(a: Oklch, b: Oklch) {
  const luminance = (color: Oklch) => {
    const [r, g, blue] = toLinearRgb(color)
    return 0.2126 * r + 0.7152 * g + 0.0722 * blue
  }
  const first = luminance(a)
  const second = luminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)
  return (lighter + 0.05) / (darker + 0.05)
}

const PAIRS = [
  ["primary", "primary-foreground"],
  ["sidebar-primary", "sidebar-primary-foreground"],
  ["sidebar-active", "sidebar-active-foreground"],
] as const

function circularHueDistance(a: number, b: number) {
  const diff = Math.abs(a - b) % 360
  return Math.min(diff, 360 - diff)
}

describe("deriveAccentTokens", () => {
  it("clears AA on every filled pair in both schemes, by hex and at full precision, for every accent", () => {
    for (const accent of accentPalette) {
      const { light, dark } = deriveAccentTokens(accent.hex)
      for (const [name, scheme] of [
        ["light", light],
        ["dark", dark],
      ] as const) {
        for (const [background, foreground] of PAIRS) {
          const bg = parseOklch(scheme[background])
          const fg = parseOklch(scheme[foreground])
          expect(bg, `${accent.id} ${name} ${background}`).not.toBeNull()
          expect(fg, `${accent.id} ${name} ${foreground}`).not.toBeNull()
          if (!bg || !fg) {
            continue
          }

          const quantised = contrastRatio(oklchToHex(bg), oklchToHex(fg))
          const continuous = continuousContrast(bg, fg)

          expect(
            quantised,
            `${accent.id} ${name} ${background} through hex`
          ).toBeGreaterThanOrEqual(4.5)
          expect(
            continuous,
            `${accent.id} ${name} ${background} at full precision`
          ).toBeGreaterThanOrEqual(4.5)
          expect(
            Math.abs(quantised - continuous),
            `${accent.id} ${name} ${background} method agreement`
          ).toBeLessThanOrEqual(0.1)
        }
      }
    }
  })

  it("keeps chart tokens present for every accent", () => {
    for (const accent of accentPalette) {
      const { light, dark } = deriveAccentTokens(accent.hex)
      for (const index of [1, 2, 3, 4, 5]) {
        expect(light[`chart-${index}`]).toMatch(OKLCH_PATTERN)
        expect(dark[`chart-${index}`]).toMatch(OKLCH_PATTERN)
      }
    }
  })

  it("reproduces the sidebar tokens shipped in registry.json's admin-theme for the default emerald accent", () => {
    const emerald = accentPalette.find((candidate) => candidate.id === "emerald")
    expect(emerald?.hex).toBe("#007953")
    const { light, dark } = deriveAccentTokens(emerald?.hex ?? "#007953")

    expect(light["sidebar-primary"]).toBe("oklch(0.528 0.137 162.792)")
    expect(light["sidebar-primary-foreground"]).toBe("oklch(0.979 0.021 162.792)")
    expect(light["sidebar-active"]).toBe("oklch(0.940 0.030 162.792)")
    expect(light["sidebar-active-foreground"]).toBe("oklch(0.510 0.110 162.792)")

    expect(dark["sidebar-primary"]).toBe("oklch(0.522 0.115 162.792)")
    expect(dark["sidebar-primary-foreground"]).toBe("oklch(0.979 0.021 162.792)")
    expect(dark["sidebar-active"]).toBe("oklch(0.265 0.030 162.792)")
    expect(dark["sidebar-active-foreground"]).toBe("oklch(0.630 0.110 162.792)")
  })
})

describe("accent spacing", () => {
  const NEUTRAL_CHROMA_THRESHOLD = 0.03
  const resolved = accentPalette.map((accent) => ({
    id: accent.id,
    oklch: hexToOklch(accent.hex),
  }))

  it("keeps every saturated pair at least 12 degrees apart in hue, or 0.15 apart in lightness", () => {
    for (let i = 0; i < resolved.length; i++) {
      for (let j = i + 1; j < resolved.length; j++) {
        const a = resolved[i]
        const b = resolved[j]
        if (a.oklch.c < NEUTRAL_CHROMA_THRESHOLD || b.oklch.c < NEUTRAL_CHROMA_THRESHOLD) {
          continue
        }
        const hueDiff = circularHueDistance(a.oklch.h, b.oklch.h)
        const lightnessDiff = Math.abs(a.oklch.l - b.oklch.l)
        expect(
          hueDiff >= 12 || lightnessDiff >= 0.15,
          `${a.id} vs ${b.id}: hueDiff=${hueDiff.toFixed(1)} lightnessDiff=${lightnessDiff.toFixed(3)}`
        ).toBe(true)
      }
    }
  })

  it("keeps every neutral pair at least 0.15 apart in lightness", () => {
    const neutrals = resolved.filter((accent) => accent.oklch.c < NEUTRAL_CHROMA_THRESHOLD)
    for (let i = 0; i < neutrals.length; i++) {
      for (let j = i + 1; j < neutrals.length; j++) {
        const a = neutrals[i]
        const b = neutrals[j]
        const lightnessDiff = Math.abs(a.oklch.l - b.oklch.l)
        expect(
          lightnessDiff,
          `${a.id} vs ${b.id}`
        ).toBeGreaterThanOrEqual(0.15)
      }
    }
  })
})
