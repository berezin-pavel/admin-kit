import { describe, expect, it } from "vitest"

import {
  accentIds,
  gradientFamilies,
  gradientIds,
} from "@/registry/admin-appearance/appearance-palette"
import { localeRu } from "./locale-ru"

describe("localeRu gradient names", () => {
  it.each(gradientIds.map((id) => [id] as const))(
    "names %s in adminAppearance.gradients",
    (id) => {
      expect(localeRu.adminAppearance.gradients[id]).toBeTruthy()
    }
  )

  it.each(gradientIds.map((id) => [id] as const))(
    "names %s in appearanceMenu.gradients",
    (id) => {
      expect(localeRu.appearanceMenu.gradients[id]).toBeTruthy()
    }
  )
})

describe("localeRu family names", () => {
  it.each(gradientFamilies.map((id) => [id] as const))(
    "names %s in adminAppearance.families",
    (id) => {
      expect(localeRu.adminAppearance.families[id]).toBeTruthy()
    }
  )

  it.each(gradientFamilies.map((id) => [id] as const))(
    "names %s in appearanceMenu.families",
    (id) => {
      expect(localeRu.appearanceMenu.families[id]).toBeTruthy()
    }
  )
})

describe("localeRu accent names", () => {
  it.each(accentIds.map((id) => [id] as const))(
    "names %s in appearanceMenu.accents",
    (id) => {
      expect(localeRu.appearanceMenu.accents[id]).toBeTruthy()
    }
  )
})
