import { describe, expect, it } from "vitest"

import type { IconCatalogEntry } from "./icon-catalog"
import { normalizeIconQuery, searchIcons } from "./icon-search"

const KORZINA = "\u043a\u043e\u0440\u0437\u0438\u043d\u0430"
const KORZ = "\u043a\u043e\u0440\u0437"
const YOZHIK = "\u0451\u0436\u0438\u043a"
const YEZHIK = "\u0435\u0436\u0438\u043a"

const catalog: readonly IconCatalogEntry[] = [
  { name: "shopping-cart", pack: "lucide", tags: ["cart", "checkout", "buy"] },
  { name: "shopping-bag", pack: "lucide", tags: ["bag", "purchase", "buy"] },
  { name: "trash", pack: "lucide", tags: ["delete", "remove", "bin"] },
  { name: "trash-2", pack: "lucide", tags: ["delete", "remove", "bin"] },
  { name: "archive", pack: "lucide", tags: ["box", "store"] },
  { name: "cart", pack: "lab", tags: [] },
]

describe("normalizeIconQuery", () => {
  it("trims and lowercases", () => {
    expect(normalizeIconQuery("  Shopping Cart  ")).toBe("shopping cart")
  })

  it("collapses repeated spaces", () => {
    expect(normalizeIconQuery("shopping    cart")).toBe("shopping cart")
  })

  it("normalizes the Cyrillic yo letter to ye", () => {
    expect(normalizeIconQuery(KORZINA)).toBe(KORZINA)
    expect(normalizeIconQuery(YOZHIK)).toBe(YEZHIK)
  })
})

describe("searchIcons", () => {
  it("returns the catalogue unchanged for an empty query", () => {
    expect(searchIcons(catalog, { query: "" })).toBe(catalog)
    expect(searchIcons(catalog, { query: "   " })).toBe(catalog)
  })

  it("ranks an exact name match first", () => {
    const result = searchIcons(catalog, { query: "cart" })
    expect(result[0].name).toBe("cart")
  })

  it("ranks a name word-prefix above a tag match", () => {
    const result = searchIcons(catalog, { query: "shop" })
    expect(result.map((entry) => entry.name)).toEqual([
      "shopping-bag",
      "shopping-cart",
    ])
  })

  it("matches a name substring that isn't a word-prefix", () => {
    const result = searchIcons(catalog, { query: "rash" })
    expect(result.map((entry) => entry.name).sort()).toEqual([
      "trash",
      "trash-2",
    ])
  })

  it("matches an exact tag before a tag substring", () => {
    const result = searchIcons(catalog, { query: "buy" })
    expect(result.map((entry) => entry.name).sort()).toEqual([
      "shopping-bag",
      "shopping-cart",
    ])
  })

  it("drops entries that don't match at all", () => {
    const result = searchIcons(catalog, { query: "zzz-nomatch" })
    expect(result).toEqual([])
  })

  it("requires every word of a multi-word query to match", () => {
    const result = searchIcons(catalog, { query: "shopping buy" })
    expect(result.map((entry) => entry.name).sort()).toEqual([
      "shopping-bag",
      "shopping-cart",
    ])

    const noMatch = searchIcons(catalog, { query: "shopping trash" })
    expect(noMatch).toEqual([])
  })

  it("breaks score ties by name", () => {
    const result = searchIcons(catalog, { query: "buy" })
    expect(result.map((entry) => entry.name)).toEqual([
      "shopping-bag",
      "shopping-cart",
    ])
  })

  it("merges extra keywords into tag matching", () => {
    const withoutKeywords = searchIcons(catalog, { query: KORZINA })
    expect(withoutKeywords).toEqual([])

    const withKeywords = searchIcons(catalog, {
      query: KORZINA,
      keywords: {
        "shopping-cart": [KORZINA],
      },
    })
    expect(withKeywords.map((entry) => entry.name)).toEqual(["shopping-cart"])
  })

  it("matches a keyword word-prefix", () => {
    const result = searchIcons(catalog, {
      query: KORZ,
      keywords: {
        "shopping-cart": [KORZINA],
      },
    })
    expect(result.map((entry) => entry.name)).toEqual(["shopping-cart"])
  })
})
