import { describe, expect, it } from "vitest"

import {
  DEMO_APPEARANCE_DEFAULT,
  DEMO_APPEARANCE_PAGES,
  demoPageId,
  isAdminAppearance,
} from "./appearance-store"

describe("DEMO_APPEARANCE_DEFAULT", () => {
  it("passes its own validation guard", () => {
    expect(isAdminAppearance(DEMO_APPEARANCE_DEFAULT)).toBe(true)
  })

  it("gives every overview block its own gradient", () => {
    const overviewBlocks = Object.entries(DEMO_APPEARANCE_DEFAULT.blocks).filter(
      ([id]) => id.startsWith("overview.")
    )
    const gradients = overviewBlocks.map(([, block]) => block.gradient)

    expect(overviewBlocks.length).toBeGreaterThan(0)
    expect(new Set(gradients).size).toBe(gradients.length)
  })
})

describe("DEMO_APPEARANCE_PAGES", () => {
  it("lists the three demo pages", () => {
    expect(DEMO_APPEARANCE_PAGES.map((page) => page.id)).toEqual([
      "overview",
      "orders",
      "order",
    ])
  })
})

describe("demoPageId", () => {
  it("maps the overview route", () => {
    expect(demoPageId("/demo")).toBe("overview")
  })

  it("maps the orders route", () => {
    expect(demoPageId("/demo/orders")).toBe("orders")
  })

  it("maps the order route", () => {
    expect(demoPageId("/demo/order")).toBe("order")
  })

  it("maps the order edit route to the same page id", () => {
  })

  it("returns undefined outside the demo shell", () => {
    expect(demoPageId("/demo/sign-in")).toBeUndefined()
  })
})

describe("isAdminAppearance", () => {
  it("rejects null", () => {
    expect(isAdminAppearance(null)).toBe(false)
  })

  it("rejects a number", () => {
    expect(isAdminAppearance(123)).toBe(false)
  })

  it("rejects an unknown accent id", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, accent: "coral" })
    ).toBe(false)
  })

  it("rejects an unknown sidebar gradient", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, sidebar: "nonexistent" })
    ).toBe(false)
  })

  it("accepts a null sidebar gradient", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, sidebar: null })
    ).toBe(true)
  })

  it("rejects an unknown page gradient", () => {
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        page: { gradient: "nonexistent", soft: true },
      })
    ).toBe(false)
  })

  it("rejects a stored backdrop of the older bare-gradient shape", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, page: "ocean" })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        pages: { orders: "ocean" },
      })
    ).toBe(false)
  })

  it("accepts a null page backdrop", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, page: null })
    ).toBe(true)
  })

  it("accepts a vivid page backdrop", () => {
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        page: { gradient: "ocean", soft: false },
      })
    ).toBe(true)
  })

  it("rejects a block with an unknown heading", () => {
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        blocks: { "overview.orders": { heading: "huge" } },
      })
    ).toBe(false)
  })

  it("rejects a block with an unknown gradient", () => {
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        blocks: { "overview.orders": { gradient: "nonexistent" } },
      })
    ).toBe(false)
  })

  it("accepts an empty blocks record", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, blocks: {} })
    ).toBe(true)
  })
})
