import { describe, expect, it } from "vitest"

import {
  contrastRatio,
  formatOklch,
  hexToOklch,
  oklchToHex,
} from "./admin-theme-color"

describe("hexToOklch", () => {
  it("maps white to full lightness and no chroma", () => {
    const white = hexToOklch("#ffffff")
    expect(white.l).toBeCloseTo(1, 3)
    expect(white.c).toBeCloseTo(0, 3)
  })

  it("maps black to no lightness", () => {
    expect(hexToOklch("#000000").l).toBeCloseTo(0, 3)
  })

  it("accepts upper case", () => {
    expect(hexToOklch("#FF0000").h).toBeCloseTo(hexToOklch("#ff0000").h, 6)
  })
})

describe("oklchToHex", () => {
  it("round-trips every channel", () => {
    for (const hex of ["#0ea5e9", "#a855f7", "#22c55e", "#78716c", "#111827"]) {
      expect(oklchToHex(hexToOklch(hex))).toBe(hex)
    }
  })

  it("clamps a colour outside the sRGB gamut instead of returning NaN", () => {
    expect(oklchToHex({ l: 0.6, c: 0.4, h: 150 })).toMatch(/^#[0-9a-f]{6}$/)
  })
})

describe("formatOklch", () => {
  it("prints three decimals of lightness and chroma", () => {
    expect(formatOklch({ l: 0.5081, c: 0.1183, h: 165.6124 })).toBe(
      "oklch(0.508 0.118 165.612)"
    )
  })
})

describe("contrastRatio", () => {
  it("scores black on white at the WCAG maximum", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 2)
  })

  it("scores a colour against itself at one", () => {
    expect(contrastRatio("#0ea5e9", "#0ea5e9")).toBeCloseTo(1, 6)
  })

  it("does not depend on argument order", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(
      contrastRatio("#ffffff", "#000000"),
      6
    )
  })
})
