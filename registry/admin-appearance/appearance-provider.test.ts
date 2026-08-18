import { describe, expect, it } from "vitest"

import { setBlockAppearance } from "./appearance-provider"
import { defaultAdminAppearance } from "./appearance-palette"

describe("setBlockAppearance", () => {
  it("adds a new block entry from an empty blocks map", () => {
    const next = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
    })

    expect(next.blocks).toEqual({ a: { gradient: "ember" } })
  })

  it("merges a patch into an existing block entry", () => {
    const value = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
    })
    const next = setBlockAppearance(value, "a", { heading: "large" })

    expect(next.blocks).toEqual({
      a: { gradient: "ember", heading: "large" },
    })
  })

  it("keeps an explicit null distinct from an unset key", () => {
    const next = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: null,
    })

    expect(next.blocks.a).toEqual({ gradient: null })
    expect(next.blocks.a).not.toHaveProperty("heading")
  })

  it("removes a key from the stored entry when the patch sets it to undefined", () => {
    const value = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
      heading: "large",
    })
    const next = setBlockAppearance(value, "a", { gradient: undefined })

    expect(next.blocks.a).toEqual({ heading: "large" })
    expect(next.blocks.a).not.toHaveProperty("gradient")
  })

  it("deletes the block entry once its last key is removed", () => {
    const value = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
    })
    const next = setBlockAppearance(value, "a", { gradient: undefined })

    expect(next.blocks).toEqual({})
    expect(next.blocks).not.toHaveProperty("a")
  })

  it("does not mutate the input appearance or its blocks map", () => {
    const value = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
    })
    const before = JSON.stringify(value)

    setBlockAppearance(value, "a", { heading: "large" })
    setBlockAppearance(value, "b", { gradient: "ocean" })

    expect(JSON.stringify(value)).toBe(before)
    expect(defaultAdminAppearance.blocks).toEqual({})
  })

  it("leaves other blocks untouched", () => {
    const value = setBlockAppearance(defaultAdminAppearance, "a", {
      gradient: "ember",
    })
    const next = setBlockAppearance(value, "b", { gradient: "ocean" })

    expect(next.blocks).toEqual({
      a: { gradient: "ember" },
      b: { gradient: "ocean" },
    })
  })
})
