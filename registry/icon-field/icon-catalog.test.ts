import { describe, expect, it } from "vitest"
import lucideIconNodes from "lucide-static/icon-nodes.json"
import * as lucideLab from "@lucide/lab"

import { iconCatalog, iconNames, isIconName } from "./icon-catalog"
import { parseIconNodes } from "./icon-nodes"

const KEBAB_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

describe("iconCatalog freshness", () => {
  it("carries one entry per lucide-static icon", () => {
    const staticNames = new Set(Object.keys(lucideIconNodes))
    const lucideCatalogNames = new Set(
      iconCatalog
        .filter((entry) => entry.pack === "lucide")
        .map((entry) => entry.name)
    )

    expect(lucideCatalogNames.size).toBe(staticNames.size)
    for (const name of staticNames) {
      expect(lucideCatalogNames.has(name)).toBe(true)
    }
  })

  it("carries one entry per @lucide/lab icon export", () => {
    const labExportCount = Object.values(lucideLab).filter((value) =>
      Array.isArray(value)
    ).length
    const labCatalogEntries = iconCatalog.filter(
      (entry) => entry.pack === "lab"
    )

    expect(labCatalogEntries.length).toBe(labExportCount)
    expect(labCatalogEntries.length).toBe(356)
  })

  it("has no duplicate names", () => {
    const names = iconCatalog.map((entry) => entry.name)
    expect(new Set(names).size).toBe(names.length)
  })

  it("uses kebab-case for every name", () => {
    for (const entry of iconCatalog) {
      expect(entry.name).toMatch(KEBAB_PATTERN)
    }
  })

  it("keeps iconNames in sync with iconCatalog", () => {
    expect(iconNames).toEqual(iconCatalog.map((entry) => entry.name))
  })

  it("sorts lucide entries before lab entries", () => {
    const packs = iconCatalog.map((entry) => entry.pack)
    const firstLabIndex = packs.indexOf("lab")
    const lastLucideIndex = packs.lastIndexOf("lucide")

    expect(firstLabIndex).toBeGreaterThan(lastLucideIndex)
  })

  it("has a parsed node for every catalogue name", () => {
    const nodes = parseIconNodes()
    for (const name of iconNames) {
      expect(nodes[name]).toBeDefined()
    }
  })

  it("recognises catalogue names via isIconName", () => {
    expect(isIconName("shopping-cart")).toBe(true)
    expect(isIconName("not-a-real-icon")).toBe(false)
  })
})
