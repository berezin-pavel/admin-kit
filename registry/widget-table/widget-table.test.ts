import { createElement } from "react"
import { describe, expect, it } from "vitest"

import {
  formatPaginationRange,
  getPageSelection,
  toCsv,
  toggleHiddenColumnId,
  widgetTableLabelDefaults,
  type WidgetTableColumn,
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

describe("toggleHiddenColumnId", () => {
  it("adds a column id that isn't hidden yet", () => {
    expect(toggleHiddenColumnId([], "customer")).toEqual(["customer"])
    expect(toggleHiddenColumnId(["total"], "customer")).toEqual([
      "total",
      "customer",
    ])
  })

  it("removes a column id that's already hidden", () => {
    expect(toggleHiddenColumnId(["customer"], "customer")).toEqual([])
    expect(toggleHiddenColumnId(["total", "customer"], "customer")).toEqual([
      "total",
    ])
  })

  it("doesn't mutate the input array", () => {
    const hidden = ["total"]
    toggleHiddenColumnId(hidden, "customer")
    expect(hidden).toEqual(["total"])
  })
})

interface CsvRow {
  id: string
  name: string
  note: string
}

const csvColumns: readonly WidgetTableColumn<CsvRow>[] = [
  { id: "id", title: "ID", cell: (row) => row.id },
  { id: "name", title: "Name", cell: (row) => row.name },
  { id: "note", title: "Note", cell: (row) => row.note },
]

describe("toCsv", () => {
  it("writes a header line and one line per row, joined with CRLF", () => {
    const rows: readonly CsvRow[] = [
      { id: "1", name: "Anna", note: "vip" },
      { id: "2", name: "Sergey", note: "" },
    ]

    expect(toCsv(csvColumns, rows)).toBe(
      "ID,Name,Note\r\n1,Anna,vip\r\n2,Sergey,"
    )
  })

  it("writes only the header line for an empty row list", () => {
    expect(toCsv(csvColumns, [])).toBe("ID,Name,Note")
  })

  it("quotes a field containing a comma", () => {
    const rows: readonly CsvRow[] = [{ id: "1", name: "Bennett, A.", note: "" }]

    expect(toCsv(csvColumns, rows)).toBe('ID,Name,Note\r\n1,"Bennett, A.",')
  })

  it("quotes a field containing a double quote and doubles it", () => {
    const rows: readonly CsvRow[] = [
      { id: "1", name: 'The "Boss"', note: "" },
    ]

    expect(toCsv(csvColumns, rows)).toBe(
      'ID,Name,Note\r\n1,"The ""Boss""",'
    )
  })

  it("quotes a field containing a newline", () => {
    const rows: readonly CsvRow[] = [{ id: "1", name: "Anna\nBennett", note: "" }]

    expect(toCsv(csvColumns, rows)).toBe('ID,Name,Note\r\n1,"Anna\nBennett",')
  })

  it("falls back to an empty string when cell(row) returns arbitrary JSX", () => {
    const jsxColumns: readonly WidgetTableColumn<CsvRow>[] = [
      { id: "id", title: "ID", cell: (row) => row.id },
      {
        id: "badge",
        title: "Badge",
        cell: () => createElement("span", null, "Active"),
      },
    ]
    const rows: readonly CsvRow[] = [{ id: "1", name: "Anna", note: "" }]

    expect(toCsv(jsxColumns, rows)).toBe("ID,Badge\r\n1,")
  })

  it("uses the number returned by cell(row) as text", () => {
    interface NumericRow {
      count: number
    }
    const numericColumns: readonly WidgetTableColumn<NumericRow>[] = [
      { id: "count", title: "Count", cell: (row) => row.count },
    ]

    expect(toCsv(numericColumns, [{ count: 42 }])).toBe("Count\r\n42")
  })

  it("prefers getCellText over cell(row) when given", () => {
    const rows: readonly CsvRow[] = [{ id: "1", name: "Anna", note: "" }]

    expect(
      toCsv(csvColumns, rows, (row, column) => `${column.id}:${row.id}`)
    ).toBe("ID,Name,Note\r\nid:1,name:1,note:1")
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
    expect(resolved.filteredEmptyTitle).toBe(
      widgetTableLabelDefaults.filteredEmptyTitle
    )
    expect(resolved.filteredEmptyDescription).toBe(
      widgetTableLabelDefaults.filteredEmptyDescription
    )
    expect(resolved.clearFiltersLabel).toBe(
      widgetTableLabelDefaults.clearFiltersLabel
    )
    expect(resolved.columnsLabel).toBe(widgetTableLabelDefaults.columnsLabel)
    expect(resolved.exportLabel).toBe(widgetTableLabelDefaults.exportLabel)
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
      filteredEmptyTitle: "l",
      filteredEmptyDescription: "m",
      clearFiltersLabel: "n",
      columnsLabel: "o",
      exportLabel: "p",
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
    expect(resolved.filteredEmptyTitle).toBe("l")
    expect(resolved.filteredEmptyDescription).toBe("m")
    expect(resolved.clearFiltersLabel).toBe("n")
    expect(resolved.columnsLabel).toBe("o")
    expect(resolved.exportLabel).toBe("p")
  })
})
