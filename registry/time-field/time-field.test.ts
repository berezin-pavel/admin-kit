import { describe, expect, it } from "vitest"

import { minutesToSeconds } from "./time-field"

describe("minutesToSeconds", () => {
  it("converts the default 5-minute step", () => {
    expect(minutesToSeconds(5)).toBe(300)
  })

  it("converts a 1-minute step", () => {
    expect(minutesToSeconds(1)).toBe(60)
  })

  it("converts a 30-minute step", () => {
    expect(minutesToSeconds(30)).toBe(1800)
  })

  it("converts a zero step", () => {
    expect(minutesToSeconds(0)).toBe(0)
  })
})
