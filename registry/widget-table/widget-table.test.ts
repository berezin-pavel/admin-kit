import { describe, expect, it } from "vitest"

import {
  formatPaginationRange,
  getPageSelection,
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

describe("getPageSelection", () => {
  it("returns none when no page key is selected", () => {
    expect(getPageSelection([1, 2, 3], new Set())).toBe("none")
    expect(getPageSelection([1, 2, 3], new Set([4, 5]))).toBe("none")
  })

  it("returns some when a subset of page keys is selected", () => {
    expect(getPageSelection([1, 2, 3], new Set([2]))).toBe("some")
    expect(getPageSelection([1, 2, 3], new Set([1, 4]))).toBe("some")
  })

  it("returns all when every page key is selected", () => {
    expect(getPageSelection([1, 2, 3], new Set([1, 2, 3]))).toBe("all")
    expect(getPageSelection([1, 2, 3], new Set([1, 2, 3, 4]))).toBe("all")
  })

  it("returns none for an empty page regardless of selection", () => {
    expect(getPageSelection([], new Set())).toBe("none")
    expect(getPageSelection([], new Set([1]))).toBe("none")
  })

  it("returns none for a non-empty page and an empty selection", () => {
    expect(getPageSelection(["a", "b"], new Set())).toBe("none")
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
    expect(resolved.selectRow).toBe(widgetTableLabelDefaults.selectRow)
    expect(resolved.selectAllOnPage).toBe(
      widgetTableLabelDefaults.selectAllOnPage
    )
    expect(resolved.selected).toBe(widgetTableLabelDefaults.selected)
    expect(resolved.clearSelection).toBe(
      widgetTableLabelDefaults.clearSelection
    )
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
      selectRow: "h",
      selectAllOnPage: "i",
      selected: () => "j",
      clearSelection: "k",
    })

    expect(resolved.emptyTitle).toBe("a")
    expect(resolved.rowsPerPage).toBe("b")
    expect(resolved.noSorting).toBe("c")
    expect(resolved.sorting).toBe("d")
    expect(resolved.previousPage).toBe("e")
    expect(resolved.nextPage).toBe("f")
    expect(resolved.range(0, 0, 0)).toBe("g")
    expect(resolved.selectRow).toBe("h")
    expect(resolved.selectAllOnPage).toBe("i")
    expect(resolved.selected(0)).toBe("j")
    expect(resolved.clearSelection).toBe("k")
  })
})
