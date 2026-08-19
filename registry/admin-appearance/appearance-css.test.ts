import { describe, expect, it } from "vitest"
import {
  appearanceCss,
  gradientCss,
  gradientForeground,
  isAdminAppearance,
} from "./appearance-css"
import { defaultAdminAppearance, gradientIds } from "./appearance-palette"

describe("gradientCss", () => {
  it("formats a linear-gradient with three stops at 0/50/100 percent", () => {
    const css = gradientCss({
      angle: 135,
      stops: ["#AABBCC", "#112233", "#FFFFFF"],
    })
    expect(css).toBe("linear-gradient(135deg, #aabbcc 0%, #112233 50%, #ffffff 100%)")
  })

  it("formats a linear-gradient with five stops at evenly spaced percentages", () => {
    const css = gradientCss({
      angle: 140,
      stops: ["#111111", "#222222", "#333333", "#444444", "#555555"],
    })
    expect(css).toBe(
      "linear-gradient(140deg, #111111 0%, #222222 25%, #333333 50%, #444444 75%, #555555 100%)"
    )
  })
})

describe("gradientForeground", () => {
  it("picks near-white text for a dark gradient", () => {
    const foreground = gradientForeground({
      angle: 135,
      stops: ["#1a1a1a", "#101010", "#050505"],
    })
    expect(foreground).toBe("oklch(0.985 0 0)")
  })

  it("picks near-black text for a pale gradient", () => {
    const foreground = gradientForeground({
      angle: 135,
      stops: ["#fdf6ec", "#fbeee0", "#f8e6d4"],
    })
    expect(foreground).toBe("oklch(0.205 0 0)")
  })
})

describe("isAdminAppearance", () => {
  it("accepts the default appearance", () => {
    expect(isAdminAppearance(defaultAdminAppearance)).toBe(true)
  })

  it("rejects an unknown accent", () => {
    expect(
      isAdminAppearance({ ...defaultAdminAppearance, accent: "neon" })
    ).toBe(false)
  })

  it("rejects an unknown gradient id in sidebar, signIn, page, pages, or blocks", () => {
    expect(
      isAdminAppearance({ ...defaultAdminAppearance, sidebar: "nonexistent" })
    ).toBe(false)
    expect(
      isAdminAppearance({ ...defaultAdminAppearance, signIn: "nonexistent" })
    ).toBe(false)
    expect(
      isAdminAppearance({ ...defaultAdminAppearance, page: "nonexistent" })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        pages: { orders: "nonexistent" },
      })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        blocks: { revenue: { gradient: "nonexistent" } },
      })
    ).toBe(false)
  })

  it("accepts a page and per-page overrides made of gradient ids and null", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        page: "ocean",
        pages: { orders: null },
      })
    ).toBe(true)
  })

  it("rejects a page value that is an object instead of a gradient id or null", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        page: { gradient: "ocean" },
      })
    ).toBe(false)
  })

  it("rejects an unknown block heading", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        blocks: { revenue: { heading: "huge" } },
      })
    ).toBe(false)
  })

  it("rejects a blocks value that is not an object", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        blocks: { revenue: "regular" },
      })
    ).toBe(false)
  })

  it("accepts a fully populated appearance", () => {
    expect(
      isAdminAppearance({
        accent: "blue",
        sidebar: "ocean",
        signIn: "midnight",
        page: null,
        pages: { orders: "ocean" },
        blocks: { revenue: { gradient: "meadow", heading: "large" } },
      })
    ).toBe(true)
  })
})

describe("appearanceCss", () => {
  const css = appearanceCss(defaultAdminAppearance)

  it("emits the light and dark root blocks", () => {
    expect(css).toContain(":root:root {")
    expect(css).toContain(":root:root.dark {")
  })

  it("emits the generic surface rule and per-gradient surface selectors", () => {
    expect(css).toContain("[data-gradient] {")
    expect(css).toContain('[data-gradient="ocean"]')
  })

  it("restyles a block title from the stored heading choice", () => {
    const css = appearanceCss(defaultAdminAppearance)
    expect(css).toContain('[data-block][data-heading="large"] [data-slot="card-title"]')
    expect(css).toContain('[data-block][data-heading="regular"] [data-slot="card-title"]')
    expect(css).toMatch(/\[data-heading="none"\] \[data-slot="card-title"\] \{[^}]*clip: rect\(0, 0, 0, 0\)/)
  })

  it("paints the whole document behind a backdrop so the browser canvas matches", () => {
    const css = appearanceCss(defaultAdminAppearance)
    expect(css).toContain('html:has([data-backdrop="ocean"]:not([data-backdrop-vivid])) {\n  background-image: var(--gradient-ocean-soft);')
    expect(css).toContain('html:has([data-backdrop="ocean"][data-backdrop-vivid]) {\n  background-image: var(--gradient-ocean);')
  })

  it("paints a popup opened from a gradient surface with that surface's gradient", () => {
    const css = appearanceCss(defaultAdminAppearance)
    expect(css).toContain('body:has([data-gradient] :is([aria-haspopup], [role="combobox"])[aria-expanded="true"]) :is([data-slot="popover-content"], [data-slot="select-content"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-sub-content"], [data-slot="combobox-content"]) {')
    expect(css).toContain(
      'body:has([data-gradient="ember"] :is([aria-haspopup], [role="combobox"])[aria-expanded="true"]) :is([data-slot="popover-content"], [data-slot="select-content"], [data-slot="dropdown-menu-content"], [data-slot="dropdown-menu-sub-content"], [data-slot="combobox-content"]) {\n  --surface-gradient: var(--gradient-ember);'
    )
  })

  it("lets the document canvas show through the body while a backdrop is on", () => {
    expect(appearanceCss(defaultAdminAppearance)).toContain(
      "body:has([data-backdrop]) {\n  background-color: transparent;\n}"
    )
  })

  it("makes nested card surfaces transparent on a gradient", () => {
    const css = appearanceCss(defaultAdminAppearance)
    expect(css).toMatch(/\[data-gradient\] \{[^}]*--card: color-mix\(in oklch, var\(--surface-foreground\) 20%, transparent\);/)
  })

  it("gives --secondary the same tint strength as --muted", () => {
    expect(css).toContain(
      "--secondary: color-mix(in oklch, var(--surface-foreground) 16%, transparent);"
    )
  })

  it("emits backdrop selectors including the vivid variant", () => {
    expect(css).toContain('[data-backdrop="ocean"][data-backdrop-vivid]')
  })

  it("emits gradient variables for all one hundred three gradients", () => {
    for (const id of gradientIds) {
      expect(css).toContain(`--gradient-${id}:`)
    }
  })

  it("emits the accent-derived primary token", () => {
    expect(css).toContain("--primary:")
  })

  it("changes primary but not the gradient variables when the accent changes", () => {
    const blueCss = appearanceCss({ ...defaultAdminAppearance, accent: "blue" })
    const emeraldPrimaryLine = css
      .split("\n")
      .find((line) => line.trim().startsWith("--primary:"))
    const bluePrimaryLine = blueCss
      .split("\n")
      .find((line) => line.trim().startsWith("--primary:"))
    expect(emeraldPrimaryLine).not.toBe(bluePrimaryLine)

    const gradientLine = (source: string) =>
      source.split("\n").find((line) => line.trim().startsWith("--gradient-ocean:"))
    expect(gradientLine(css)).toBe(gradientLine(blueCss))
  })

  it("never lets a block id with special characters reach the emitted css", () => {
    const malicious = appearanceCss({
      ...defaultAdminAppearance,
      blocks: { 'revenue"}malicious{color': { heading: "regular" } },
    })
    expect(malicious).not.toContain("}malicious{")
  })

  it("throws a clear error for an unknown accent id", () => {
    expect(() =>
      appearanceCss({ ...defaultAdminAppearance, accent: "neon" as never })
    ).toThrow()
  })
})
