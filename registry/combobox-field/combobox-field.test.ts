import { describe, expect, it } from "vitest"

import { filterComboboxOptions, type ComboboxFieldOption } from "./combobox-field"

const options: readonly ComboboxFieldOption[] = [
  { value: "apple", label: "Apple" },
  { value: "banana", label: "Banana" },
  { value: "cantaloupe", label: "Cantaloupe" },
  { value: "pineapple", label: "Pineapple" },
]

describe("filterComboboxOptions", () => {
  it("returns every option unchanged for an empty query", () => {
    expect(filterComboboxOptions(options, "")).toEqual(options)
  })

  it("returns every option unchanged for a whitespace-only query", () => {
    expect(filterComboboxOptions(options, "   ")).toEqual(options)
  })

  it("matches case-insensitively", () => {
    expect(filterComboboxOptions(options, "APPLE")).toEqual([
      options[0],
      options[3],
    ])
  })

  it("matches a substring anywhere inside the label, not just a prefix", () => {
    expect(filterComboboxOptions(options, "apple")).toEqual([
      options[0],
      options[3],
    ])
  })

  it("trims surrounding whitespace before matching", () => {
    expect(filterComboboxOptions(options, "  banana  ")).toEqual([options[1]])
  })

  it("returns an empty array when nothing matches", () => {
    expect(filterComboboxOptions(options, "zzz")).toEqual([])
  })
})
