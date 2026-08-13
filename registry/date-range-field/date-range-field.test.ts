import { describe, expect, it } from "vitest"

import {
  defaultDateRangePresets,
  formatDateRangeValue,
  parseDateRangeValue,
} from "./date-range-field"

describe("parseDateRangeValue / formatDateRangeValue round trip", () => {
  it("round-trips a regular range", () => {
    const parsed = parseDateRangeValue("2026-06-01..2026-06-27")
    expect(parsed).toBeDefined()
    expect(formatDateRangeValue(parsed!)).toBe("2026-06-01..2026-06-27")
  })

  it("round-trips a single-day range", () => {
    const parsed = parseDateRangeValue("2026-01-01..2026-01-01")
    expect(parsed?.from.getTime()).toBe(parsed?.to.getTime())
    expect(formatDateRangeValue(parsed!)).toBe("2026-01-01..2026-01-01")
  })

  it("uses local date components on both ends, not toISOString", () => {
    const parsed = parseDateRangeValue("2026-06-01..2026-06-27")
    expect(parsed?.from.getHours()).toBe(0)
    expect(parsed?.to.getHours()).toBe(0)
  })
})

describe("parseDateRangeValue with invalid input", () => {
  it("returns undefined for an empty string", () => {
    expect(parseDateRangeValue("")).toBeUndefined()
  })

  it("returns undefined for garbage", () => {
    expect(parseDateRangeValue("garbage")).toBeUndefined()
  })

  it("returns undefined when the separator is missing", () => {
    expect(parseDateRangeValue("2026-06-01")).toBeUndefined()
  })

  it("returns undefined when the from half is invalid", () => {
    expect(parseDateRangeValue("2026-02-30..2026-06-27")).toBeUndefined()
  })

  it("returns undefined when the to half is invalid", () => {
    expect(parseDateRangeValue("2026-06-01..2026-13-01")).toBeUndefined()
  })

  it("returns undefined when from is after to", () => {
    expect(parseDateRangeValue("2026-06-27..2026-06-01")).toBeUndefined()
  })

  it("accepts a range spanning a leap day", () => {
    const parsed = parseDateRangeValue("2028-02-27..2028-02-29")
    expect(parsed?.to.getDate()).toBe(29)
  })
})

function preset(id: string) {
  const found = defaultDateRangePresets.find((candidate) => candidate.id === id)
  if (!found) {
    throw new Error(`missing preset ${id}`)
  }
  return found
}

describe("defaultDateRangePresets against a mid-week Wednesday", () => {
  const today = new Date(2026, 7, 12)

  it("today", () => {
    expect(formatDateRangeValue(preset("today").getRange(today))).toBe(
      "2026-08-12..2026-08-12"
    )
  })

  it("yesterday", () => {
    expect(formatDateRangeValue(preset("yesterday").getRange(today))).toBe(
      "2026-08-11..2026-08-11"
    )
  })

  it("this-week starts Monday and ends today", () => {
    expect(formatDateRangeValue(preset("this-week").getRange(today))).toBe(
      "2026-08-10..2026-08-12"
    )
  })

  it("this-month starts on the 1st and ends today", () => {
    expect(formatDateRangeValue(preset("this-month").getRange(today))).toBe(
      "2026-08-01..2026-08-12"
    )
  })

  it("this-year starts Jan 1 and ends today", () => {
    expect(formatDateRangeValue(preset("this-year").getRange(today))).toBe(
      "2026-01-01..2026-08-12"
    )
  })

  it("last-week is the full previous Monday-to-Sunday week", () => {
    expect(formatDateRangeValue(preset("last-week").getRange(today))).toBe(
      "2026-08-03..2026-08-09"
    )
  })

  it("last-month is the full previous month", () => {
    expect(formatDateRangeValue(preset("last-month").getRange(today))).toBe(
      "2026-07-01..2026-07-31"
    )
  })

  it("last-year is the full previous year", () => {
    expect(formatDateRangeValue(preset("last-year").getRange(today))).toBe(
      "2025-01-01..2025-12-31"
    )
  })
})

describe("defaultDateRangePresets on Jan 1, a Monday", () => {
  const today = new Date(2029, 0, 1)

  it("this-week is just today, since today is the week start", () => {
    expect(formatDateRangeValue(preset("this-week").getRange(today))).toBe(
      "2029-01-01..2029-01-01"
    )
  })

  it("this-month is just today", () => {
    expect(formatDateRangeValue(preset("this-month").getRange(today))).toBe(
      "2029-01-01..2029-01-01"
    )
  })

  it("this-year is just today", () => {
    expect(formatDateRangeValue(preset("this-year").getRange(today))).toBe(
      "2029-01-01..2029-01-01"
    )
  })

  it("last-week is the prior Monday-to-Sunday week", () => {
    expect(formatDateRangeValue(preset("last-week").getRange(today))).toBe(
      "2028-12-25..2028-12-31"
    )
  })

  it("last-month rolls back across a year boundary", () => {
    expect(formatDateRangeValue(preset("last-month").getRange(today))).toBe(
      "2028-12-01..2028-12-31"
    )
  })

  it("last-year is the full previous year", () => {
    expect(formatDateRangeValue(preset("last-year").getRange(today))).toBe(
      "2028-01-01..2028-12-31"
    )
  })
})
