import { describe, expect, it } from "vitest"

import { addTag } from "./tags-field"

describe("addTag", () => {
  it("appends a trimmed tag", () => {
    expect(addTag(["a"], "  b  ")).toEqual(["a", "b"])
  })

  it("ignores an empty or whitespace-only value", () => {
    expect(addTag(["a"], "")).toEqual(["a"])
    expect(addTag(["a"], "   ")).toEqual(["a"])
  })

  it("ignores a duplicate tag", () => {
    expect(addTag(["a", "b"], "a")).toEqual(["a", "b"])
  })

  it("treats duplicates case-sensitively", () => {
    expect(addTag(["a"], "A")).toEqual(["a", "A"])
  })
})
