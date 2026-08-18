import { describe, expect, it } from "vitest"
import {
  composite,
  contrastRatio,
  formatOklch,
  hexToOklch,
  oklchToHex,
  sampleGradient,
} from "./appearance-color"

describe("hexToOklch / oklchToHex", () => {
  it("round trips within a small tolerance", () => {
    const samples = ["#007953", "#ffffff", "#000000", "#ff0000", "#3355ff"]
    for (const hex of samples) {
      const roundTripped = oklchToHex(hexToOklch(hex))
      expect(roundTripped).toBe(hex)
    }
  })

  it("formats oklch with three decimal places", () => {
    expect(formatOklch({ l: 0.5, c: 0.1, h: 120 })).toBe("oklch(0.500 0.100 120.000)")
  })
})

describe("contrastRatio", () => {
  it("gives the maximum ratio for black against white", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 0)
  })

  it("gives a ratio of 1 for identical colors", () => {
    expect(contrastRatio("#336699", "#336699")).toBeCloseTo(1, 5)
  })

  it("is symmetric", () => {
    expect(contrastRatio("#112233", "#eeddcc")).toBeCloseTo(
      contrastRatio("#eeddcc", "#112233"),
      10
    )
  })
})

describe("sampleGradient", () => {
  const stops = { angle: 135, from: "#ff0000", via: "#00ff00", to: "#0000ff" }

  it("returns the requested number of samples", () => {
    expect(sampleGradient(stops, 33)).toHaveLength(33)
  })

  it("starts at from and ends at to", () => {
    const samples = sampleGradient(stops, 11)
    expect(samples[0]).toBe(stops.from.toLowerCase())
    expect(samples[samples.length - 1]).toBe(stops.to.toLowerCase())
  })

  it("hits via at the midpoint for an odd count", () => {
    const samples = sampleGradient(stops, 33)
    expect(samples[16]).toBe(stops.via.toLowerCase())
  })
})

describe("composite", () => {
  const foreground = "#ffffff"
  const background = "#000000"

  it("returns the background at alpha 0 in both spaces", () => {
    expect(composite(foreground, 0, background, "srgb")).toBe(background)
    expect(composite(foreground, 0, background, "linear")).toBe(background)
  })

  it("returns the foreground at alpha 1 in both spaces", () => {
    expect(composite(foreground, 1, background, "srgb")).toBe(foreground)
    expect(composite(foreground, 1, background, "linear")).toBe(foreground)
  })

  it("differs between srgb and linear blending at partial alpha", () => {
    const srgbMix = composite(foreground, 0.5, background, "srgb")
    const linearMix = composite(foreground, 0.5, background, "linear")
    expect(srgbMix).not.toBe(linearMix)
  })
})
