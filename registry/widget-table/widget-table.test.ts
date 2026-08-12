import { describe, expect, it } from "vitest"

import {
  formatPaginationRange,
  widgetTableLabelDefaults,
  type WidgetTableLabels,
  type WidgetTablePagination,
} from "./widget-table"

describe("formatPaginationRange", () => {
  const range = widgetTableLabelDefaults.range

  it("formats the first page", () => {
    const pagination: WidgetTablePagination = {
      page: 1,
      pageSize: 10,
      total: 25,
    }
    expect(formatPaginationRange(pagination, range)).toBe("1–10 of 25")
  })

  it("formats a full middle page", () => {
    const pagination: WidgetTablePagination = {
      page: 2,
      pageSize: 10,
      total: 25,
    }
    expect(formatPaginationRange(pagination, range)).toBe("11–20 of 25")
  })

  it("formats the last, partial page", () => {
    const pagination: WidgetTablePagination = {
      page: 3,
      pageSize: 10,
      total: 25,
    }
    expect(formatPaginationRange(pagination, range)).toBe("21–25 of 25")
  })

  it("formats a total of zero as 0–0 of 0", () => {
    const pagination: WidgetTablePagination = {
      page: 1,
      pageSize: 10,
      total: 0,
    }
    expect(formatPaginationRange(pagination, range)).toBe("0–0 of 0")
  })

  it("formats page 1 when total is smaller than the page size", () => {
    const pagination: WidgetTablePagination = {
      page: 1,
      pageSize: 10,
      total: 5,
    }
    expect(formatPaginationRange(pagination, range)).toBe("1–5 of 5")
  })

  it("passes the computed bounds through a custom range formatter", () => {
    const pagination: WidgetTablePagination = {
      page: 2,
      pageSize: 10,
      total: 25,
    }
    const custom = (rangeStart: number, rangeEnd: number, total: number) =>
      `custom:${rangeStart}-${rangeEnd}/${total}`
    expect(formatPaginationRange(pagination, custom)).toBe("custom:11-20/25")
  })
})

function resolveLabels(labels?: WidgetTableLabels) {
  return { ...widgetTableLabelDefaults, ...labels }
}

describe("widget table labels merge", () => {
  it("keeps the remaining defaults when only one label is overridden", () => {
    const resolved = resolveLabels({ emptyTitle: "Nothing here" })

    expect(resolved.emptyTitle).toBe("Nothing here")
    expect(resolved.rowsPerPage).toBe(widgetTableLabelDefaults.rowsPerPage)
    expect(resolved.noSorting).toBe(widgetTableLabelDefaults.noSorting)
    expect(resolved.sorting).toBe(widgetTableLabelDefaults.sorting)
    expect(resolved.previousPage).toBe(widgetTableLabelDefaults.previousPage)
    expect(resolved.nextPage).toBe(widgetTableLabelDefaults.nextPage)
    expect(resolved.range).toBe(widgetTableLabelDefaults.range)
  })

  it("falls back to every default when labels is undefined", () => {
    const resolved = resolveLabels(undefined)
    expect(resolved).toEqual(widgetTableLabelDefaults)
  })

  it("overrides all keys when every key is provided", () => {
    const resolved = resolveLabels({
      emptyTitle: "a",
      rowsPerPage: "b",
      noSorting: "c",
      sorting: "d",
      previousPage: "e",
      nextPage: "f",
      range: () => "g",
    })

    expect(resolved.emptyTitle).toBe("a")
    expect(resolved.rowsPerPage).toBe("b")
    expect(resolved.noSorting).toBe("c")
    expect(resolved.sorting).toBe("d")
    expect(resolved.previousPage).toBe("e")
    expect(resolved.nextPage).toBe("f")
    expect(resolved.range(0, 0, 0)).toBe("g")
  })
})
