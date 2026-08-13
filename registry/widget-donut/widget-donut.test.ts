import { describe, expect, it } from "vitest"

import { computeDonutShares } from "./widget-donut"

describe("computeDonutShares", () => {
  it("computes each slice's share of the total", () => {
    const { total, shares } = computeDonutShares([
      { id: "a", label: "A", value: 30 },
      { id: "b", label: "B", value: 70 },
    ])

    expect(total).toBe(100)
    expect(shares).toEqual([
      { id: "a", label: "A", value: 30, share: 0.3 },
      { id: "b", label: "B", value: 70, share: 0.7 },
    ])
  })

  it("returns a zero share for every slice when the total is zero", () => {
    const { total, shares } = computeDonutShares([
      { id: "a", label: "A", value: 0 },
    ])

    expect(total).toBe(0)
    expect(shares).toEqual([{ id: "a", label: "A", value: 0, share: 0 }])
  })

  it("returns an empty result for no slices", () => {
    expect(computeDonutShares([])).toEqual({ total: 0, shares: [] })
  })
})
