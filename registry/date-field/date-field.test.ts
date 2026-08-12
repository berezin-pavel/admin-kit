import { describe, expect, it } from "vitest"

import { formatDateValue, parseDateValue } from "./date-field"

describe("parseDateValue / formatDateValue round trip", () => {
  it("round-trips a regular date", () => {
    const parsed = parseDateValue("2026-08-12")
    expect(parsed).toBeInstanceOf(Date)
    expect(formatDateValue(parsed as Date)).toBe("2026-08-12")
  })

  it("round-trips the first day of the year without a UTC shift", () => {
    const parsed = parseDateValue("2026-01-01")
    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(0)
    expect(parsed?.getDate()).toBe(1)
    expect(formatDateValue(parsed as Date)).toBe("2026-01-01")
  })

  it("round-trips the last day of the year without a UTC shift", () => {
    const parsed = parseDateValue("2026-12-31")
    expect(formatDateValue(parsed as Date)).toBe("2026-12-31")
  })
})

describe("parseDateValue with invalid input", () => {
  it("returns undefined for an empty string", () => {
    expect(parseDateValue("")).toBeUndefined()
  })

  it("returns undefined for non-numeric garbage", () => {
    expect(parseDateValue("garbage")).toBeUndefined()
  })

  it("returns undefined when a component is zero", () => {
    expect(parseDateValue("2026-00-10")).toBeUndefined()
    expect(parseDateValue("0000-01-10")).toBeUndefined()
  })

  it("returns undefined for a day that overflows its month", () => {
    expect(parseDateValue("2026-02-30")).toBeUndefined()
  })

  it("returns undefined for a month above 12", () => {
    expect(parseDateValue("2026-13-01")).toBeUndefined()
  })

  it("accepts February 29 on a leap year", () => {
    const parsed = parseDateValue("2028-02-29")
    expect(parsed?.getFullYear()).toBe(2028)
    expect(parsed?.getMonth()).toBe(1)
    expect(parsed?.getDate()).toBe(29)
  })

  it("accepts the last day of a 31-day month", () => {
    const parsed = parseDateValue("2026-01-31")
    expect(parsed?.getMonth()).toBe(0)
    expect(parsed?.getDate()).toBe(31)
  })
})

describe("formatDateValue", () => {
  it("pads single-digit months and days", () => {
    expect(formatDateValue(new Date(2026, 0, 5))).toBe("2026-01-05")
  })

  it("uses local date components, not toISOString", () => {
    const date = new Date(2026, 5, 15, 23, 59)
    expect(formatDateValue(date)).toBe("2026-06-15")
  })
})
