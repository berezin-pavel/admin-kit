import { describe, expect, it } from "vitest"

import { iconCatalog, iconNames } from "@/registry/icon-field/icon-catalog"
import { searchIcons } from "@/registry/icon-field/icon-search"

import { iconNamesRu, loadIconKeywordsRu } from "./icon-names-ru"
import { localeRu } from "./locale-ru"

const CART_LABEL = "\u043a\u043e\u0440\u0437\u0438\u043d\u0430 \u043f\u043e\u043a\u0443\u043f\u043e\u043a"
const CART_WORD = "\u043a\u043e\u0440\u0437\u0438\u043d\u0430"
const PURCHASES_WORD = "\u043f\u043e\u043a\u0443\u043f\u043e\u043a"

describe("iconNamesRu", () => {
  it("names every icon in the catalogue", () => {
    for (const name of iconNames) {
      expect(iconNamesRu[name], name).toBeTruthy()
      expect(iconNamesRu[name].trim().length, name).toBeGreaterThan(0)
    }
  })
})

describe("loadIconKeywordsRu", () => {
  const keywords = loadIconKeywordsRu()

  it("returns words for every icon", () => {
    for (const name of iconNames) {
      expect(keywords[name], name).toBeTruthy()
      expect(keywords[name].length, name).toBeGreaterThan(0)
    }
  })

  it("returns lowercase, non-empty keywords", () => {
    for (const name of iconNames) {
      for (const word of keywords[name]) {
        expect(word.length, `${name}: "${word}"`).toBeGreaterThan(0)
        expect(word, `${name}: "${word}"`).toBe(word.toLowerCase())
      }
    }
  })

  it("splits a Russian label into the phrase plus its words", () => {
    expect(keywords["shopping-cart"]).toEqual([
      CART_LABEL,
      CART_WORD,
      PURCHASES_WORD,
    ])
  })

  it("finds shopping-cart and trash-2 by searching the Russian word for cart", () => {
    const results = searchIcons(iconCatalog, {
      query: CART_WORD,
      keywords,
    })
    const names = results.map((entry) => entry.name)

    expect(names).toContain("shopping-cart")
    expect(names).toContain("trash-2")
  })
})

describe("localeRu.iconField.loadKeywords", () => {
  it("resolves to the same keyword map as loadIconKeywordsRu", async () => {
    const resolved = await localeRu.iconField.loadKeywords()

    expect(resolved).toEqual(loadIconKeywordsRu())
  })
})
