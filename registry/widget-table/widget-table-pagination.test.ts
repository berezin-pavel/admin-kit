import { describe, expect, it } from "vitest"

import { getPageNumbers } from "./widget-table-pagination"

describe("getPageNumbers", () => {
  it("returns every page without ellipsis when there are few pages", () => {
    expect(getPageNumbers(1, 5)).toEqual([1, 2, 3, 4, 5])
  })

  it("returns every page without ellipsis when there are exactly seven pages", () => {
    expect(getPageNumbers(1, 7)).toEqual([1, 2, 3, 4, 5, 6, 7])
  })

  it("returns a single page for a single-page table", () => {
    expect(getPageNumbers(1, 1)).toEqual([1])
  })

  it("shows a trailing ellipsis when on the first page of many", () => {
    expect(getPageNumbers(1, 10)).toEqual([1, 2, 3, 4, 5, "ellipsis", 10])
  })

  it("shows both ellipses when on a middle page", () => {
    expect(getPageNumbers(5, 10)).toEqual([
      1,
      "ellipsis",
      4,
      5,
      6,
      "ellipsis",
      10,
    ])
  })

  it("shows a leading ellipsis when on the last page of many", () => {
    expect(getPageNumbers(10, 10)).toEqual([
      1,
      "ellipsis",
      6,
      7,
      8,
      9,
      10,
    ])
  })
})
