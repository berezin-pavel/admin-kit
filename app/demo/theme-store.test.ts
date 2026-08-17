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

  it("accepts a well-formed theme", () => {
    expect(isAdminTheme(DEFAULT_DEMO_THEME)).toBe(true)
  })
})
