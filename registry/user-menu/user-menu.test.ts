import { describe, expect, it } from "vitest"

import { getUserMenuInitials } from "./user-menu"

describe("getUserMenuInitials", () => {
  it("takes the first letter of the first two words, uppercased", () => {
    expect(getUserMenuInitials("Alex Morgan")).toBe("AM")
  })

  it("uppercases lowercase input", () => {
    expect(getUserMenuInitials("alex morgan")).toBe("AM")
  })

  it("ignores a third and later word", () => {
    expect(getUserMenuInitials("Alex Jordan Morgan")).toBe("AJ")
  })

  it("falls back to a single letter for a one-word name", () => {
    expect(getUserMenuInitials("Alex")).toBe("A")
  })

  it("collapses repeated whitespace between words", () => {
    expect(getUserMenuInitials("Alex   Morgan")).toBe("AM")
  })

  it("trims leading and trailing whitespace", () => {
    expect(getUserMenuInitials("  Alex Morgan  ")).toBe("AM")
  })

  it("returns an empty string for an empty name", () => {
    expect(getUserMenuInitials("")).toBe("")
  })

  it("returns an empty string for a whitespace-only name", () => {
    expect(getUserMenuInitials("   ")).toBe("")
  })
})
