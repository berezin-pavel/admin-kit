import { describe, expect, it } from "vitest"

import {
  appearanceCss,
  customColorsOf,
  isAdminAppearance,
  solidForeground,
} from "./appearance-css"
import { contrastRatio, oklchToHex } from "./appearance-color"
import {
  customColorStops,
  customColorVariable,
  defaultAdminAppearance,
  gradientIds,
  isCustomColor,
  type AdminAppearance,
  type CustomColor,
} from "./appearance-palette"
import { appearanceThemes } from "./appearance-themes"

function oklchStringToHex(value: string): string {
  const match = value.match(/oklch\(([\d.]+) ([\d.]+) ([\d.]+)\)/)
  if (!match) {
    throw new Error(`not an oklch colour: ${value}`)
  }
  return oklchToHex({ l: Number(match[1]), c: Number(match[2]), h: Number(match[3]) })
}

const CUSTOM: CustomColor = "#aabbcc"

describe("isCustomColor", () => {
  it("accepts a six-digit hex in either case", () => {
    expect(isCustomColor("#a1b2c3")).toBe(true)
    expect(isCustomColor("#A1B2C3")).toBe(true)
    expect(isCustomColor("#000000")).toBe(true)
  })

  it("rejects anything that is not a six-digit hex", () => {
    expect(isCustomColor("#xyz")).toBe(false)
    expect(isCustomColor("#abc")).toBe(false)
    expect(isCustomColor("a1b2c3")).toBe(false)
    expect(isCustomColor("#a1b2c3x")).toBe(false)
    expect(isCustomColor('#a1b2c3"}html{display:none')).toBe(false)
    expect(isCustomColor("")).toBe(false)
    expect(isCustomColor(null)).toBe(false)
    expect(isCustomColor(42)).toBe(false)
  })
})

describe("customColorVariable", () => {
  it("names a lowercase variable after the colour's digits", () => {
    expect(customColorVariable("#AABBCC")).toBe("--custom-aabbcc")
  })
})

describe("isAdminAppearance with custom colours", () => {
  it("accepts a custom colour in the accent and in every surface slot", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        accent: "#123456",
        sidebar: "#abcdef",
        header: "#ABCDEF",
        signIn: "#0f172a",
        page: { gradient: "#e2e8f0", soft: true },
        pages: { orders: { gradient: "#111111", soft: false } },
      })
    ).toBe(true)
  })

  it("accepts a palette gradient beside a custom colour", () => {
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        sidebar: gradientIds[0],
        header: "#abcdef",
      })
    ).toBe(true)
  })

  it("rejects a malformed colour in any slot", () => {
    for (const slot of ["accent", "sidebar", "header", "signIn"] as const) {
      expect(
        isAdminAppearance({ ...defaultAdminAppearance, [slot]: "#xyz" })
      ).toBe(false)
    }
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        page: { gradient: "#xyz", soft: true },
      })
    ).toBe(false)
    expect(
      isAdminAppearance({
        ...defaultAdminAppearance,
        pages: { orders: { gradient: "#12345", soft: true } },
      })
    ).toBe(false)
  })
})

describe("customColorsOf", () => {
  it("collects every distinct custom colour once, lowercased", () => {
    const appearance: AdminAppearance = {
      ...defaultAdminAppearance,
      sidebar: "#AABBCC",
      header: "#aabbcc",
      signIn: "#112233",
      page: { gradient: "#445566", soft: true },
      pages: { orders: { gradient: "#112233", soft: false } },
    }

    expect(customColorsOf(appearance)).toEqual([
      "#112233",
      "#445566",
      "#aabbcc",
    ])
  })

  it("finds nothing in an appearance built from the palette", () => {
    expect(customColorsOf(defaultAdminAppearance)).toEqual([])
  })
})

describe("appearanceCss with a custom colour", () => {
  const css = appearanceCss({ ...defaultAdminAppearance, sidebar: CUSTOM })

  it("emits the surface rule keyed by the colour itself", () => {
    expect(css).toContain(
      `[data-gradient="${CUSTOM}"] {\n  --surface-gradient: linear-gradient(135deg, ${CUSTOM} 0%, ${CUSTOM} 100%);`
    )
    expect(css).toContain("--surface-foreground:")
    expect(css).toContain("--surface-destructive:")
    expect(css).toContain("--surface-destructive-foreground:")
  })

  it("emits the popup rule for a popup opened from that surface", () => {
    expect(css).toContain(`body:has([data-gradient="${CUSTOM}"] `)
  })

  it("emits both backdrop rules and a per-scheme soft variable", () => {
    expect(css).toContain(`[data-backdrop="${CUSTOM}"] {`)
    expect(css).toContain(`[data-backdrop="${CUSTOM}"][data-backdrop-vivid] {`)
    expect(css.match(/--custom-aabbcc-soft:/g)).toHaveLength(2)
  })

  it("lowercases the colour before it reaches the css", () => {
    const upper = appearanceCss({
      ...defaultAdminAppearance,
      sidebar: "#AABBCC",
    })
    expect(upper).toContain('[data-gradient="#aabbcc"]')
    expect(upper).not.toContain("#AABBCC")
  })

  it("emits nothing custom when the appearance is built from the palette", () => {
    const plain = appearanceCss(defaultAdminAppearance)
    expect(plain).not.toContain('[data-gradient="#')
    expect(plain).not.toContain("--custom-")
  })

  it("never lets an unvalidated colour reach the emitted css", () => {
    const malicious = appearanceCss({
      ...defaultAdminAppearance,
      sidebar: '#aabbcc"}html{display:none' as CustomColor,
    })
    expect(malicious).not.toContain("html{display:none")
  })

  it("derives the accent tokens from a custom accent colour", () => {
    const custom = appearanceCss({ ...defaultAdminAppearance, accent: "#ff0044" })
    const primaryOf = (source: string) =>
      source.split("\n").find((line) => line.trim().startsWith("--primary:"))

    expect(primaryOf(custom)).toBeDefined()
    expect(primaryOf(custom)).not.toBe(primaryOf(appearanceCss(defaultAdminAppearance)))
  })
})

describe("solidForeground", () => {
  it("keeps the text at 4.5 to 1 on the sampled colours", () => {
    for (const hex of ["#808080", "#f5f5f0", "#1a1a2e"] as CustomColor[]) {
      expect(
        contrastRatio(hex, oklchStringToHex(solidForeground(hex))),
        hex
      ).toBeGreaterThanOrEqual(4.5)
    }
  })

  it("keeps the text at 4.5 to 1 across the whole colour cube", () => {
    let worst = Infinity
    let worstHex = ""

    for (let red = 0; red < 256; red += 17) {
      for (let green = 0; green < 256; green += 17) {
        for (let blue = 0; blue < 256; blue += 17) {
          const hex = `#${[red, green, blue]
            .map((channel) => channel.toString(16).padStart(2, "0"))
            .join("")}` as CustomColor
          const ratio = contrastRatio(hex, oklchStringToHex(solidForeground(hex)))
          if (ratio < worst) {
            worst = ratio
            worstHex = hex
          }
        }
      }
    }

    expect(worst, worstHex).toBeGreaterThanOrEqual(4.5)
  })

  it("falls back to pure white or black where the near pair would drop below 4.5", () => {
    expect(solidForeground("#c936c9")).toBe("oklch(0 0 0)")
  })

  it("reads the same stops the css does", () => {
    expect(customColorStops(CUSTOM)).toEqual({
      angle: 135,
      stops: [CUSTOM, CUSTOM, CUSTOM],
    })
  })
})

describe("appearanceThemes", () => {
  it("ships five presets", () => {
    expect(appearanceThemes.map((theme) => theme.id)).toEqual([
      "slate",
      "mist",
      "sage",
      "ivory",
      "dune",
    ])
  })

  it("carries a valid appearance with no block or page overrides", () => {
    for (const theme of appearanceThemes) {
      expect(isAdminAppearance(theme.appearance), theme.id).toBe(true)
      expect(theme.appearance.blocks).toEqual({})
      expect(theme.appearance.pages).toEqual({})
    }
  })

  it("builds each preset out of custom colours, so no gradient id can go stale", () => {
    for (const theme of appearanceThemes) {
      expect(isCustomColor(theme.appearance.accent), theme.id).toBe(true)
      expect(isCustomColor(theme.appearance.sidebar), theme.id).toBe(true)
      expect(isCustomColor(theme.appearance.header), theme.id).toBe(true)
      expect(isCustomColor(theme.appearance.signIn), theme.id).toBe(true)
    }
  })

  it("emits css for every preset", () => {
    for (const theme of appearanceThemes) {
      expect(() => appearanceCss(theme.appearance), theme.id).not.toThrow()
    }
  })
})
