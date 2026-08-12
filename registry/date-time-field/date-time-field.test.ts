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

  it("does not validate calendar overflow: it lets the native Date roll the value over", () => {
    const parsed = parseDateTimeValue("2026-13-99T10:00")
    expect(parsed).toEqual(new Date(2026, 12, 99, 10, 0))
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
