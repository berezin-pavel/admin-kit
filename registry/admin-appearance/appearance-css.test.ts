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
      from: "#AABBCC",
      via: "#112233",
      to: "#FFFFFF",
    })
    expect(css).toBe("linear-gradient(135deg, #aabbcc 0%, #112233 50%, #ffffff 100%)")
  })
})

describe("gradientForeground", () => {
  it("picks near-white text for a dark gradient", () => {
    const foreground = gradientForeground({
      angle: 135,
      from: "#1a1a1a",
      via: "#101010",
      to: "#050505",
    })
    expect(foreground).toBe("oklch(0.985 0 0)")
  })

  it("picks near-black text for a pale gradient", () => {
    const foreground = gradientForeground({
      angle: 135,
      from: "#fdf6ec",
      via: "#fbeee0",
      to: "#f8e6d4",
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
      isAdminAppearance({ ...defaultAdminAppearance, sidebar: "neon" })
    ).toBe(false)
    expect(
      isAdminAppearance({ ...defaultAdminAppearance, signIn: "neon" })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        page: { gradient: "neon", soft: true },
      })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        pages: { orders: { gradient: "neon", soft: true } },
      })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        blocks: { revenue: { gradient: "neon" } },
      })
    ).toBe(false)
  })

  it("rejects a non-boolean soft flag", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        page: { gradient: null, soft: "yes" },
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
        blocks: { revenue: "muted" },
      })
    ).toBe(false)
  })

  it("accepts a fully populated appearance", () => {
    expect(
      isAdminAppearance({
        accent: "blue",
        sidebar: "ocean",
        signIn: "midnight",
        page: { gradient: null, soft: true },
        pages: { orders: { gradient: "ocean", soft: false } },
        blocks: { revenue: { gradient: "meadow", heading: "prominent" } },
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

  it("gives --secondary the same tint strength as --muted", () => {
    expect(css).toContain(
      "--secondary: color-mix(in oklch, var(--surface-foreground) 16%, transparent);"
    )
  })

  it("emits backdrop selectors including the soft variant", () => {
    expect(css).toContain('[data-backdrop="ocean"][data-backdrop-soft]')
  })

  it("emits gradient variables for all twenty gradients", () => {
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
      blocks: { 'revenue"}malicious{color': { heading: "muted" } },
    })
    expect(malicious).not.toContain("}malicious{")
  })

  it("throws a clear error for an unknown accent id", () => {
    expect(() =>
      appearanceCss({ ...defaultAdminAppearance, accent: "neon" as never })
    ).toThrow()
  })
})
