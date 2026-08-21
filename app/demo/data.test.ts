import { describe, expect, it } from "vitest"

import {
  flattenDemoProducts,
  flattenDemoSections,
  getDemoProductSections,
} from "./data"

describe("flattenDemoSections", () => {
  it("visits every section depth-first with the right parent and depth", () => {
    const sections = getDemoProductSections("en")
    const flat = flattenDemoSections(sections)

    const footwear = flat.find((entry) => entry.section.id === "footwear")
    const sneakers = flat.find((entry) => entry.section.id === "sneakers")
    const boots = flat.find((entry) => entry.section.id === "boots")

    expect(footwear?.parentId).toBeNull()
    expect(footwear?.depth).toBe(0)
    expect(sneakers?.parentId).toBe("footwear")
    expect(sneakers?.depth).toBe(1)
    expect(boots?.parentId).toBe("footwear")

    const footwearIndex = flat.findIndex((entry) => entry.section.id === "footwear")
    const sneakersIndex = flat.findIndex((entry) => entry.section.id === "sneakers")
    const electronicsIndex = flat.findIndex(
      (entry) => entry.section.id === "electronics"
    )
    expect(footwearIndex).toBeLessThan(sneakersIndex)
    expect(sneakersIndex).toBeLessThan(electronicsIndex)
  })

  it("builds a slash-separated path from the section titles", () => {
    const sections = getDemoProductSections("en")
    const flat = flattenDemoSections(sections)

    const sneakers = flat.find((entry) => entry.section.id === "sneakers")
    const accessories = flat.find((entry) => entry.section.id === "accessories")

    expect(sneakers?.path).toBe("Footwear / Sneakers")
    expect(accessories?.path).toBe("Accessories")
  })

  it("counts every section, top-level and nested", () => {
    const sections = getDemoProductSections("en")
    const flat = flattenDemoSections(sections)

    expect(flat.length).toBe(11)
  })
})

describe("flattenDemoProducts", () => {
  it("attaches each product to its own section and path", () => {
    const sections = getDemoProductSections("en")
    const flat = flattenDemoProducts(sections)

    const nova = flat.find((entry) => entry.product.id === "sneakers-nova")

    expect(nova?.section.id).toBe("sneakers")
    expect(nova?.path).toBe("Footwear / Sneakers")
  })

  it("matches the sum of every section's own rows", () => {
    const sections = getDemoProductSections("en")
    const flat = flattenDemoProducts(sections)
    const expectedCount = flattenDemoSections(sections).reduce(
      (sum, entry) => sum + (entry.section.rows?.length ?? 0),
      0
    )

    expect(flat.length).toBe(expectedCount)
  })

  it("gives the accessories section around 120 products for show-more", () => {
    const sections = getDemoProductSections("en")
    const accessories = flattenDemoProducts(sections).filter(
      (entry) => entry.section.id === "accessories"
    )

    expect(accessories.length).toBe(120)
  })
})
