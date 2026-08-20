import { afterEach, describe, expect, it, vi } from "vitest"

import { appearanceThemes } from "@/registry/admin-appearance/appearance-themes"
import type {
  AdminAppearance,
  CustomColor,
} from "@/registry/admin-appearance/appearance-palette"

import { DEMO_APPEARANCE_COOKIE } from "./demo-cookie"
import {
  DEMO_APPEARANCE_DEFAULT,
  DEMO_APPEARANCE_PAGES,
  demoPageId,
  isAdminAppearance,
  parseDemoAppearance,
} from "./appearance-store"

const jadeTheme = appearanceThemes.find((theme) => theme.id === "jade")

function withAccent(accent: CustomColor): AdminAppearance {
  return { ...DEMO_APPEARANCE_DEFAULT, accent }
}

function cookieFor(value: unknown): string {
  return `${DEMO_APPEARANCE_COOKIE}=${encodeURIComponent(JSON.stringify(value))}`
}

async function loadStore(cookie: string) {
  vi.resetModules()
  vi.stubGlobal("document", { cookie })
  return import("./appearance-store")
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("DEMO_APPEARANCE_DEFAULT", () => {
  it("passes its own validation guard", () => {
    expect(isAdminAppearance(DEMO_APPEARANCE_DEFAULT)).toBe(true)
  })

  it("finds the Jade theme in the shipped presets", () => {
    expect(jadeTheme).toBeDefined()
  })

  it("is the Jade preset plus the demo's heading choices", () => {
    expect(DEMO_APPEARANCE_DEFAULT).toEqual({
      ...jadeTheme?.appearance,
      blocks: {
        "overview.finance": { heading: "large" },
        "orders.table": { heading: "none" },
      },
    })
  })

  it("leaves every block at the theme's own colours", () => {
    for (const [id, block] of Object.entries(DEMO_APPEARANCE_DEFAULT.blocks)) {
      expect(block.gradient, id).toBeUndefined()
    }
  })

  it("keeps only the two heading choices the demo layout depends on", () => {
    expect(DEMO_APPEARANCE_DEFAULT.blocks).toEqual({
      "overview.finance": { heading: "large" },
      "orders.table": { heading: "none" },
    })
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

  it("maps the flush demo overview route", () => {
    expect(demoPageId("/demo-flush")).toBe("overview")
  })

  it("maps the flush demo orders route", () => {
    expect(demoPageId("/demo-flush/orders")).toBe("orders")
    expect(demoPageId("/demo-flush/order")).toBe("order")
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

  it("rejects an unknown header gradient", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, header: "nonexistent" })
    ).toBe(false)
  })

  it("rejects a stored value from before the header gradient existed", () => {
    const stored: Record<string, unknown> = { ...DEMO_APPEARANCE_DEFAULT }
    delete stored.header

    expect(isAdminAppearance(stored)).toBe(false)
  })

  it("accepts a header gradient from the palette", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, header: "slate" })
    ).toBe(true)
  })

  it("rejects an unknown page gradient", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, page: "nonexistent" })
    ).toBe(false)
  })

  it("rejects a stored backdrop of the older soft-flag shape", () => {
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        page: { gradient: "ocean", soft: true },
      })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...DEMO_APPEARANCE_DEFAULT,
        pages: { orders: { gradient: "ocean", soft: false } },
      })
    ).toBe(false)
  })

  it("accepts a null page backdrop", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, page: null })
    ).toBe(true)
  })

  it("accepts a page backdrop from the palette and a custom one", () => {
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, page: "ocean" })
    ).toBe(true)
    expect(
      isAdminAppearance({ ...DEMO_APPEARANCE_DEFAULT, pages: { orders: "#112233" } })
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

describe("parseDemoAppearance", () => {
  it("returns undefined without a stored value", () => {
    expect(parseDemoAppearance(undefined)).toBeUndefined()
    expect(parseDemoAppearance("")).toBeUndefined()
  })

  it("returns undefined for a value that is not JSON", () => {
    expect(parseDemoAppearance("not-json")).toBeUndefined()
  })

  it("returns undefined for JSON the guard rejects", () => {
    expect(parseDemoAppearance(JSON.stringify({ accent: "coral" }))).toBeUndefined()
  })

  it("returns a stored appearance", () => {
    const stored = withAccent("#112233")
    expect(parseDemoAppearance(JSON.stringify(stored))).toEqual(stored)
  })
})

describe("the appearance cookie", () => {
  it("supplies the appearance when nothing was seeded", async () => {
    const stored = withAccent("#112233")
    const store = await loadStore(cookieFor(stored))

    expect(store.getDemoAppearance()).toEqual(stored)
  })

  it("falls back to the default when the cookie is unreadable", async () => {
    const store = await loadStore(`${DEMO_APPEARANCE_COOKIE}=not-json`)

    expect(store.getDemoAppearance()).toEqual(DEMO_APPEARANCE_DEFAULT)
  })

  it("falls back to the default when the cookie is absent", async () => {
    const store = await loadStore("admin-kit-demo-locale=ru")

    expect(store.getDemoAppearance()).toEqual(DEMO_APPEARANCE_DEFAULT)
  })

  it("loses to the value the server seeded", async () => {
    const stored = withAccent("#112233")
    const seeded = withAccent("#445566")
    const store = await loadStore(cookieFor(stored))

    store.seedDemoAppearance(seeded)

    expect(store.getDemoAppearance()).toEqual(seeded)
  })

  it("keeps the first seed when a later navigation seeds a stale value", async () => {
    const first = withAccent("#445566")
    const stale = withAccent("#778899")
    const store = await loadStore("")

    store.seedDemoAppearance(first)
    store.seedDemoAppearance(stale)

    expect(store.getDemoAppearance()).toEqual(first)
  })

  it("is written by the setter with a year's lifetime", async () => {
    const store = await loadStore("")
    const next = withAccent("#112233")

    store.setDemoAppearance(next)

    expect(document.cookie).toBe(
      `${cookieFor(next)}; path=/; max-age=31536000; SameSite=Lax`
    )
    expect(store.getDemoAppearance()).toEqual(next)
  })
})
