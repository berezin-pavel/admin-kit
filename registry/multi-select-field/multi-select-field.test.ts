import { describe, expect, it } from "vitest"

import { toggleMultiSelectValue } from "./multi-select-field"

describe("toggleMultiSelectValue", () => {
  it("appends an absent option to the end", () => {
    expect(toggleMultiSelectValue(["a"], "b")).toEqual(["a", "b"])
  })

  it("adds to an empty selection", () => {
    expect(toggleMultiSelectValue([], "a")).toEqual(["a"])
  })

  it("removes a present option, preserving the order of the rest", () => {
    expect(toggleMultiSelectValue(["a", "b", "c"], "b")).toEqual(["a", "c"])
  })

  it("removes the only selected option", () => {
    expect(toggleMultiSelectValue(["a"], "a")).toEqual([])
  })

  it("is reversible: toggling the same option twice restores the original set", () => {
    const start = ["a", "b"]
    const toggled = toggleMultiSelectValue(start, "c")
    expect(toggleMultiSelectValue(toggled, "c")).toEqual(start)
  })

  it("re-adds a removed option at the end rather than its old position", () => {
    const removed = toggleMultiSelectValue(["a", "b", "c"], "a")
    expect(removed).toEqual(["b", "c"])
    expect(toggleMultiSelectValue(removed, "a")).toEqual(["b", "c", "a"])
  })

  it("accumulates repeated toggles in selection order", () => {
    let value: readonly string[] = []
    value = toggleMultiSelectValue(value, "a")
    value = toggleMultiSelectValue(value, "b")
    value = toggleMultiSelectValue(value, "c")
    expect(value).toEqual(["a", "b", "c"])

    value = toggleMultiSelectValue(value, "b")
    expect(value).toEqual(["a", "c"])

    value = toggleMultiSelectValue(value, "b")
    expect(value).toEqual(["a", "c", "b"])
  })
})
