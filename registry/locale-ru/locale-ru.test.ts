import { describe, expect, it } from "vitest"

import {
  accentIds,
  isGradientId,
} from "@/registry/admin-appearance/appearance-palette"
import { localeRu } from "./locale-ru"

describe("localeRu gradient names", () => {
  it("only names valid gradient ids in adminAppearance.gradients", () => {
    for (const key of Object.keys(localeRu.adminAppearance.gradients)) {
      expect(isGradientId(key)).toBe(true)
    }
  })

  it("only names valid gradient ids in appearanceMenu.gradients", () => {
    for (const key of Object.keys(localeRu.appearanceMenu.gradients)) {
      expect(isGradientId(key)).toBe(true)
    }
  })
})

describe("localeRu accent names", () => {
  it.each(accentIds.map((id) => [id] as const))(
    "names %s in appearanceMenu.accents",
    (id) => {
      expect(localeRu.appearanceMenu.accents[id]).toBeTruthy()
    }
  )
})
