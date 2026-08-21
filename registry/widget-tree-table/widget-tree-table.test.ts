import { describe, expect, it } from "vitest"

import {
  collectSectionIds,
  toggleExpandedId,
  type TreeTableSection,
} from "./widget-tree-table"

describe("toggleExpandedId", () => {
  it("adds an id that isn't expanded yet", () => {
    expect(toggleExpandedId([], "footwear")).toEqual(["footwear"])
    expect(toggleExpandedId(["electronics"], "footwear")).toEqual([
      "electronics",
      "footwear",
    ])
  })

  it("removes an id that's already expanded", () => {
    expect(toggleExpandedId(["footwear"], "footwear")).toEqual([])
    expect(
      toggleExpandedId(["electronics", "footwear"], "footwear")
    ).toEqual(["electronics"])
  })

  it("doesn't mutate the input array", () => {
    const ids = ["footwear"]
    toggleExpandedId(ids, "electronics")
    expect(ids).toEqual(["footwear"])
  })
})

interface ProductRow {
  name: string
}

describe("collectSectionIds", () => {
  it("returns an empty array for an empty section list", () => {
    expect(collectSectionIds<ProductRow>([])).toEqual([])
  })

  it("returns ids depth-first across nested levels", () => {
    const sections: readonly TreeTableSection<ProductRow>[] = [
      {
        id: "footwear",
        title: "Footwear",
        sections: [
          { id: "sneakers", title: "Sneakers" },
          { id: "boots", title: "Boots" },
        ],
      },
      {
        id: "electronics",
        title: "Electronics",
        sections: [
          {
            id: "audio",
            title: "Audio",
            sections: [{ id: "headphones", title: "Headphones" }],
          },
        ],
      },
    ]

    expect(collectSectionIds(sections)).toEqual([
      "footwear",
      "sneakers",
      "boots",
      "electronics",
      "audio",
      "headphones",
    ])
  })
})
