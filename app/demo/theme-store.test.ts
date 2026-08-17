import { describe, expect, it } from "vitest"

import { DEFAULT_DEMO_THEME, isAdminTheme } from "./theme-store"

describe("isAdminTheme", () => {
  it("rejects null", () => {
    expect(isAdminTheme(JSON.parse("null"))).toBe(false)
  })

  it("rejects a number", () => {
    expect(isAdminTheme(JSON.parse("123"))).toBe(false)
  })

  it("rejects an array", () => {
    expect(isAdminTheme(JSON.parse("[]"))).toBe(false)
  })

  it("rejects an object with no sources", () => {
    expect(isAdminTheme({ gradients: [] })).toBe(false)
  })

  it("rejects sources missing one of the six keys", () => {
    const sourcesWithoutRadius = {
      brand: DEFAULT_DEMO_THEME.sources.brand,
      surface: DEFAULT_DEMO_THEME.sources.surface,
      success: DEFAULT_DEMO_THEME.sources.success,
      warning: DEFAULT_DEMO_THEME.sources.warning,
      danger: DEFAULT_DEMO_THEME.sources.danger,
    }
    expect(
      isAdminTheme({
        sources: sourcesWithoutRadius,
        gradients: DEFAULT_DEMO_THEME.gradients,
      })
    ).toBe(false)
  })

  it("rejects a theme whose gradients is not an array", () => {
    expect(
      isAdminTheme({ sources: DEFAULT_DEMO_THEME.sources, gradients: {} })
    ).toBe(false)
  })

  it("rejects a source with the wrong type (brand not a string)", () => {
    const badSources = { ...DEFAULT_DEMO_THEME.sources, brand: 123 }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a gradient entry that is null", () => {
    expect(
      isAdminTheme({ sources: DEFAULT_DEMO_THEME.sources, gradients: [null] })
    ).toBe(false)
  })

  it("rejects a source that looks like a color but isn't hex", () => {
    const badSources = { ...DEFAULT_DEMO_THEME.sources, brand: "blue" }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a radius that is a string", () => {
    const badSources = { ...DEFAULT_DEMO_THEME.sources, radius: "0.45" }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a gradient missing its dark stops", () => {
    const gradient = DEFAULT_DEMO_THEME.gradients[0]
    const gradientWithoutDark = {
      id: gradient.id,
      name: gradient.name,
      light: gradient.light,
    }
    expect(
      isAdminTheme({
        sources: DEFAULT_DEMO_THEME.sources,
        gradients: [gradientWithoutDark],
      })
    ).toBe(false)
  })

  it("rejects a gradient whose angle is a string", () => {
    const gradient = DEFAULT_DEMO_THEME.gradients[0]
    const badGradient = {
      ...gradient,
      light: { ...gradient.light, angle: "135" },
    }
    expect(
      isAdminTheme({
        sources: DEFAULT_DEMO_THEME.sources,
        gradients: [badGradient],
      })
    ).toBe(false)
  })

  it("accepts a well-formed theme", () => {
    expect(isAdminTheme(DEFAULT_DEMO_THEME)).toBe(true)
  })
})
