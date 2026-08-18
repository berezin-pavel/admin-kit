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
  const threeStops = ["#ff0000", "#00ff00", "#0000ff"]
  const fiveStops = ["#ff0000", "#ff8800", "#00ff00", "#0088ff", "#0000ff"]

  it("returns the requested number of samples", () => {
    expect(sampleGradient(threeStops, 33)).toHaveLength(33)
  })

  it("starts at the first stop and ends at the last stop", () => {
    const samples = sampleGradient(threeStops, 11)
    expect(samples[0]).toBe(threeStops[0].toLowerCase())
    expect(samples[samples.length - 1]).toBe(
      threeStops[threeStops.length - 1].toLowerCase()
    )
  })

  it("hits the middle stop at the midpoint for an odd count", () => {
    const samples = sampleGradient(threeStops, 33)
    expect(samples[16]).toBe(threeStops[1].toLowerCase())
  })

  it("hits every stop exactly at its evenly spaced position for a five-stop gradient", () => {
    const samples = sampleGradient(fiveStops, 33)
    expect(samples[0]).toBe(fiveStops[0].toLowerCase())
    expect(samples[8]).toBe(fiveStops[1].toLowerCase())
    expect(samples[16]).toBe(fiveStops[2].toLowerCase())
    expect(samples[24]).toBe(fiveStops[3].toLowerCase())
    expect(samples[32]).toBe(fiveStops[4].toLowerCase())
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
