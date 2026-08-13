import { describe, expect, it } from "vitest"

import {
  groupActivityEntries,
  parseActivityTimestamp,
  type WidgetActivityEntry,
} from "./widget-activity"

describe("parseActivityTimestamp", () => {
  it("parses a valid date-time value", () => {
    const parsed = parseActivityTimestamp("2026-08-12T09:30")
    expect(parsed?.getFullYear()).toBe(2026)
    expect(parsed?.getMonth()).toBe(7)
    expect(parsed?.getDate()).toBe(12)
    expect(parsed?.getHours()).toBe(9)
    expect(parsed?.getMinutes()).toBe(30)
  })

  it("returns undefined for a day that overflows its month", () => {
    expect(parseActivityTimestamp("2026-02-30T00:00")).toBeUndefined()
  })

  it("returns undefined for out-of-range hours or minutes", () => {
    expect(parseActivityTimestamp("2026-08-12T24:00")).toBeUndefined()
    expect(parseActivityTimestamp("2026-08-12T09:60")).toBeUndefined()
  })

  it("returns undefined for an empty string", () => {
    expect(parseActivityTimestamp("")).toBeUndefined()
  })
})

function entry(id: string, timestamp: string): WidgetActivityEntry {
  return { id, title: id, timestamp }
}

describe("groupActivityEntries", () => {
  it("groups entries that fall on the same calendar day", () => {
    const groups = groupActivityEntries([
      entry("a", "2026-08-12T09:00"),
      entry("b", "2026-08-12T14:00"),
      entry("c", "2026-08-11T10:00"),
    ])

    expect(groups).toHaveLength(2)
    expect(groups[0]?.dayKey).toBe("2026-08-12")
    expect(groups[0]?.entries.map((item) => item.id)).toEqual(["a", "b"])
    expect(groups[1]?.dayKey).toBe("2026-08-11")
    expect(groups[1]?.entries.map((item) => item.id)).toEqual(["c"])
  })

  it("keeps entries within a group in their given order", () => {
    const groups = groupActivityEntries([
      entry("first", "2026-08-12T18:00"),
      entry("second", "2026-08-12T08:00"),
    ])

    expect(groups[0]?.entries.map((item) => item.id)).toEqual([
      "first",
      "second",
    ])
  })

  it("skips entries with an unparseable timestamp", () => {
    const groups = groupActivityEntries([
      entry("bad", "not-a-date"),
      entry("good", "2026-08-12T09:00"),
    ])

    expect(groups).toHaveLength(1)
    expect(groups[0]?.entries.map((item) => item.id)).toEqual(["good"])
  })

  it("returns no groups for an empty entry list", () => {
    expect(groupActivityEntries([])).toEqual([])
  })
})
