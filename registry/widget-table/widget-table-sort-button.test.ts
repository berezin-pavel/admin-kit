import { describe, expect, it } from "vitest"

import { getNextSort } from "./widget-table-sort-button"

describe("getNextSort", () => {
  it("goes from no sorting to ascending on the same column", () => {
    expect(getNextSort("name", undefined)).toEqual({
      columnId: "name",
      direction: "asc",
    })
  })

  it("goes from ascending to descending on the same column", () => {
    expect(
      getNextSort("name", { columnId: "name", direction: "asc" })
    ).toEqual({ columnId: "name", direction: "desc" })
  })

  it("goes from descending back to no sorting on the same column", () => {
    expect(
      getNextSort("name", { columnId: "name", direction: "desc" })
    ).toBeUndefined()
  })

  it("switches to ascending when a different column is clicked", () => {
    expect(
      getNextSort("email", { columnId: "name", direction: "desc" })
    ).toEqual({ columnId: "email", direction: "asc" })
  })
})
