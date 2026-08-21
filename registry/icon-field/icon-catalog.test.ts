import { describe, expect, it } from "vitest"
import dynamicIconImports from "lucide-react/dynamicIconImports.mjs"
import * as lucideLab from "@lucide/lab"

import { iconCatalog, iconNames } from "./icon-catalog"

const KEBAB_PATTERN = /^[a-z0-9]+(-[a-z0-9]+)*$/

describe("iconCatalog freshness", () => {
  it("carries every lucide-react dynamic icon name", () => {
    const dynamicNames = new Set(Object.keys(dynamicIconImports))
    const lucideCatalogNames = new Set(
      iconCatalog
        .filter((entry) => entry.pack === "lucide")
        .map((entry) => entry.name)
    )

    expect(lucideCatalogNames.size).toBe(dynamicNames.size)
    for (const name of dynamicNames) {
      expect(lucideCatalogNames.has(name)).toBe(true)
    }
  })

  it("carries one entry per @lucide/lab icon export", () => {
    const labExportCount = Object.keys(lucideLab).filter(
      (key) => key !== "default" && key !== "module.exports"
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
})
