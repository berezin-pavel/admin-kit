import { describe, expect, it } from "vitest"

import {
  formatDateTimeValue,
  mergeSelectedDate,
  mergeSelectedTime,
  parseDateTimeValue,
} from "./date-time-field"

describe("parseDateTimeValue / formatDateTimeValue round trip", () => {
  it("round-trips a date with a time", () => {
    const parsed = parseDateTimeValue("2026-08-12T14:30")
    expect(parsed).toBeInstanceOf(Date)
    expect(formatDateTimeValue(parsed as Date)).toBe("2026-08-12T14:30")
  })

  it("defaults the time to 00:00 when only a date is given", () => {
    const parsed = parseDateTimeValue("2026-08-12")
    expect(formatDateTimeValue(parsed as Date)).toBe("2026-08-12T00:00")
  })
})

describe("parseDateTimeValue with invalid input", () => {
  it("returns undefined for an empty string", () => {
    expect(parseDateTimeValue("")).toBeUndefined()
  })

  it("returns undefined for non-numeric garbage", () => {
    expect(parseDateTimeValue("garbage")).toBeUndefined()
  })

  it("silently falls back to 00:00 for an unparseable time part", () => {
    const parsed = parseDateTimeValue("2026-08-12Tzz:zz")
    expect(formatDateTimeValue(parsed as Date)).toBe("2026-08-12T00:00")
  })

  it("returns undefined for a day that overflows its month", () => {
    expect(parseDateTimeValue("2026-02-30T10:00")).toBeUndefined()
  })

  it("returns undefined for a month above 12", () => {
    expect(parseDateTimeValue("2026-13-01T10:00")).toBeUndefined()
  })

  it("returns undefined for hours at 24", () => {
    expect(parseDateTimeValue("2026-08-12T24:00")).toBeUndefined()
  })

  it("returns undefined for minutes at 60", () => {
    expect(parseDateTimeValue("2026-08-12T10:60")).toBeUndefined()
  })

  it("accepts February 29 on a leap year", () => {
    const parsed = parseDateTimeValue("2028-02-29T10:00")
    expect(parsed?.getFullYear()).toBe(2028)
    expect(parsed?.getMonth()).toBe(1)
    expect(parsed?.getDate()).toBe(29)
  })

  it("accepts the last day of a 31-day month", () => {
    const parsed = parseDateTimeValue("2026-01-31T10:00")
    expect(parsed?.getMonth()).toBe(0)
    expect(parsed?.getDate()).toBe(31)
  })
})

describe("mergeSelectedDate", () => {
  it("keeps the previously selected time when only the date changes", () => {
    const selected = new Date(2026, 0, 1, 9, 15)
    const picked = new Date(2026, 5, 20)
    const merged = mergeSelectedDate(picked, selected)

    expect(merged.getFullYear()).toBe(2026)
    expect(merged.getMonth()).toBe(5)
    expect(merged.getDate()).toBe(20)
    expect(merged.getHours()).toBe(9)
    expect(merged.getMinutes()).toBe(15)
  })

  it("defaults to midnight when there was no prior selection", () => {
    const picked = new Date(2026, 5, 20, 13, 45)
    const merged = mergeSelectedDate(picked, undefined)

    expect(merged.getHours()).toBe(0)
    expect(merged.getMinutes()).toBe(0)
  })
})

describe("mergeSelectedTime", () => {
  it("keeps the date and replaces the time", () => {
    const base = new Date(2026, 5, 20, 9, 15)
    const merged = mergeSelectedTime(base, 22, 5)

    expect(merged.getFullYear()).toBe(2026)
    expect(merged.getMonth()).toBe(5)
    expect(merged.getDate()).toBe(20)
    expect(merged.getHours()).toBe(22)
    expect(merged.getMinutes()).toBe(5)
    expect(merged.getSeconds()).toBe(0)
  })
})
