import { afterEach, describe, expect, it, vi } from "vitest"

import { DEMO_LOCALE_COOKIE } from "./demo-cookie"
import {
  DEMO_LOCALE_DEFAULT,
  DEMO_LOCALE_OPTIONS,
  isDemoLocale,
  parseDemoLocale,
} from "./locale-store"

async function loadStore(cookie: string) {
  vi.resetModules()
  vi.stubGlobal("document", { cookie })
  return import("./locale-store")
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("DEMO_LOCALE_OPTIONS", () => {
  it("offers the two demo locales", () => {
    expect(DEMO_LOCALE_OPTIONS.map((option) => option.value)).toEqual(["en", "ru"])
  })

  it("starts at English", () => {
    expect(DEMO_LOCALE_DEFAULT).toBe("en")
  })
})

describe("isDemoLocale", () => {
  it("accepts the shipped locales", () => {
    expect(isDemoLocale("en")).toBe(true)
    expect(isDemoLocale("ru")).toBe(true)
  })

  it("rejects anything else", () => {
    expect(isDemoLocale("de")).toBe(false)
    expect(isDemoLocale(null)).toBe(false)
    expect(isDemoLocale(undefined)).toBe(false)
  })
})

describe("parseDemoLocale", () => {
  it("returns a stored locale", () => {
    expect(parseDemoLocale("ru")).toBe("ru")
  })

  it("returns undefined for an unknown or missing value", () => {
    expect(parseDemoLocale("de")).toBeUndefined()
    expect(parseDemoLocale(undefined)).toBeUndefined()
  })
})

describe("the locale cookie", () => {
  it("supplies the locale when nothing was seeded", async () => {
    const store = await loadStore(`${DEMO_LOCALE_COOKIE}=ru`)

    expect(store.getDemoLocale()).toBe("ru")
  })

  it("falls back to English when the cookie holds an unknown locale", async () => {
    const store = await loadStore(`${DEMO_LOCALE_COOKIE}=de`)

    expect(store.getDemoLocale()).toBe("en")
  })

  it("falls back to English when the cookie is absent", async () => {
    const store = await loadStore("admin-kit-demo-appearance=%7B%7D")

    expect(store.getDemoLocale()).toBe("en")
  })

  it("loses to the value the server seeded", async () => {
    const store = await loadStore(`${DEMO_LOCALE_COOKIE}=en`)

    store.seedDemoLocale("ru")

    expect(store.getDemoLocale()).toBe("ru")
  })

  it("keeps the first seed when a later navigation seeds a stale value", async () => {
    const store = await loadStore("")

    store.seedDemoLocale("ru")
    store.seedDemoLocale("en")

    expect(store.getDemoLocale()).toBe("ru")
  })

  it("is written by the setter with a year's lifetime", async () => {
    const store = await loadStore("")

    store.setDemoLocale("ru")

    expect(document.cookie).toBe(
      `${DEMO_LOCALE_COOKIE}=ru; path=/; max-age=31536000; SameSite=Lax`
    )
    expect(store.getDemoLocale()).toBe("ru")
  })
})
