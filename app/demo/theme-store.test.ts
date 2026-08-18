import { describe, expect, it } from "vitest"

import {
  DEFAULT_DEMO_GRADIENT_ASSIGNMENT,
  DEFAULT_DEMO_THEME,
  DEMO_GRADIENT_BLOCK_IDS,
  isDemoGradientAssignment,
} from "./theme-store"

describe("DEFAULT_DEMO_THEME", () => {
  it("seeds its gradient library from the kit's own presets rather than hand-picked stops", () => {
    expect(DEFAULT_DEMO_THEME.gradients.length).toBeGreaterThan(0)
    for (const gradient of DEFAULT_DEMO_THEME.gradients) {
      expect(gradient.id).toBe(gradient.name.toLowerCase())
    }
  })
})

describe("DEFAULT_DEMO_GRADIENT_ASSIGNMENT", () => {
  it("only assigns gradients that exist in the default theme", () => {
    const knownIds = new Set(
      DEFAULT_DEMO_THEME.gradients.map((gradient) => gradient.id)
    )
    const assignedIds = [
      ...Object.values(DEFAULT_DEMO_GRADIENT_ASSIGNMENT.surfaces),
      ...Object.values(DEFAULT_DEMO_GRADIENT_ASSIGNMENT.blocks),
    ].filter((id): id is string => typeof id === "string")

    expect(assignedIds.length).toBeGreaterThan(0)
    for (const id of assignedIds) {
      expect(knownIds.has(id)).toBe(true)
    }
  })

  it("passes its own validation guard", () => {
    expect(isDemoGradientAssignment(DEFAULT_DEMO_GRADIENT_ASSIGNMENT)).toBe(
      true
    )
  })
})

describe("isDemoGradientAssignment", () => {
  it("rejects null", () => {
    expect(isDemoGradientAssignment(null)).toBe(false)
  })

  it("rejects a number", () => {
    expect(isDemoGradientAssignment(123)).toBe(false)
  })

  it("rejects an object with no surfaces", () => {
    expect(isDemoGradientAssignment({ blocks: {} })).toBe(false)
  })

  it("rejects an object with no blocks", () => {
    expect(isDemoGradientAssignment({ surfaces: {} })).toBe(false)
  })

  it("accepts empty surfaces and blocks", () => {
    expect(isDemoGradientAssignment({ surfaces: {}, blocks: {} })).toBe(true)
  })

  it("rejects a non-string surface value", () => {
    expect(
      isDemoGradientAssignment({ surfaces: { shell: 1 }, blocks: {} })
    ).toBe(false)
  })

  it("rejects a block id outside the known set", () => {
    expect(
      isDemoGradientAssignment({
        surfaces: {},
        blocks: { "unknown-block": "ocean" },
      })
    ).toBe(false)
  })

  it("rejects a non-string block value", () => {
    const [firstBlockId] = DEMO_GRADIENT_BLOCK_IDS
    expect(
      isDemoGradientAssignment({
        surfaces: {},
        blocks: { [firstBlockId]: 1 },
      })
    ).toBe(false)
  })

  it("accepts every known block id", () => {
    const blocks = Object.fromEntries(
      DEMO_GRADIENT_BLOCK_IDS.map((id) => [id, "ocean"])
    )
    expect(isDemoGradientAssignment({ surfaces: {}, blocks })).toBe(true)
  })
})
