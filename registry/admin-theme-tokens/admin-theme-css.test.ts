import { describe, expect, it } from "vitest"

import { contrastRatio, formatOklch, oklchToHex } from "./admin-theme-color"
import {
  adminThemeToCss,
  gradientCss,
  gradientForeground,
  isAdminTheme,
  isGradientId,
  isHexColor,
} from "./admin-theme-css"
import {
  defaultAdminThemeSources,
  type AdminTheme,
} from "./admin-theme-tokens"

const revenue = {
  id: "revenue",
  name: "Revenue",
  light: {
    angle: 135,
    from: "#0ea5e9",
    via: "#6366f1",
    viaPosition: 50,
    to: "#a855f7",
  },
  dark: { angle: 135, from: "#075985", to: "#6b21a8" },
}

const theme: AdminTheme = {
  sources: defaultAdminThemeSources,
  gradients: [revenue],
}

describe("isGradientId", () => {
  it("accepts a lowercase kebab identifier", () => {
    expect(isGradientId("revenue-2024")).toBe(true)
  })

  it("rejects anything that could close a declaration", () => {
    for (const bad of [
      "a); background: url(http://evil)",
      "Revenue",
      "2024",
      "",
      "a b",
      "--x",
    ]) {
      expect(isGradientId(bad), bad).toBe(false)
    }
  })
})

describe("isHexColor", () => {
  it("accepts #rrggbb only", () => {
    expect(isHexColor("#0ea5e9")).toBe(true)
    expect(isHexColor("#0EA5E9")).toBe(true)
    expect(isHexColor("#fff")).toBe(false)
    expect(isHexColor("red")).toBe(false)
    expect(isHexColor("#0ea5e9; color: red")).toBe(false)
  })
})

describe("isAdminTheme", () => {
  it("rejects null", () => {
    expect(isAdminTheme(JSON.parse("null"))).toBe(false)
  })

  it("rejects a number", () => {
    expect(isAdminTheme(JSON.parse("123"))).toBe(false)
  })

  it("rejects an array", () => {
    expect(isAdminTheme(JSON.parse("[]"))).toBe(false)
  })

  it("rejects an object with no sources", () => {
    expect(isAdminTheme({ gradients: [] })).toBe(false)
  })

  it("rejects sources missing one of the six keys", () => {
    const sourcesWithoutRadius = {
      brand: defaultAdminThemeSources.brand,
      surface: defaultAdminThemeSources.surface,
      success: defaultAdminThemeSources.success,
      warning: defaultAdminThemeSources.warning,
      danger: defaultAdminThemeSources.danger,
    }
    expect(
      isAdminTheme({
        sources: sourcesWithoutRadius,
        gradients: theme.gradients,
      })
    ).toBe(false)
  })

  it("rejects a theme whose gradients is not an array", () => {
    expect(
      isAdminTheme({ sources: defaultAdminThemeSources, gradients: {} })
    ).toBe(false)
  })

  it("rejects a source with the wrong type (brand not a string)", () => {
    const badSources = { ...defaultAdminThemeSources, brand: 123 }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a gradient entry that is null", () => {
    expect(
      isAdminTheme({ sources: defaultAdminThemeSources, gradients: [null] })
    ).toBe(false)
  })

  it("rejects a source that looks like a color but isn't hex", () => {
    const badSources = { ...defaultAdminThemeSources, brand: "blue" }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a radius that is a string", () => {
    const badSources = { ...defaultAdminThemeSources, radius: "0.45" }
    expect(isAdminTheme({ sources: badSources, gradients: [] })).toBe(false)
  })

  it("rejects a gradient missing its dark stops", () => {
    const gradientWithoutDark = {
      id: revenue.id,
      name: revenue.name,
      light: revenue.light,
    }
    expect(
      isAdminTheme({
        sources: defaultAdminThemeSources,
        gradients: [gradientWithoutDark],
      })
    ).toBe(false)
  })

  it("rejects a gradient whose angle is a string", () => {
    const badGradient = {
      ...revenue,
      light: { ...revenue.light, angle: "135" },
    }
    expect(
      isAdminTheme({
        sources: defaultAdminThemeSources,
        gradients: [badGradient],
      })
    ).toBe(false)
  })

  it("accepts a well-formed theme", () => {
    expect(isAdminTheme(theme)).toBe(true)
  })
})

describe("gradientCss", () => {
  it("prints three stops with their positions", () => {
    expect(gradientCss(revenue.light)).toBe(
      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 50%, #a855f7 100%)"
    )
  })

  it("prints two stops when there is no middle", () => {
    expect(gradientCss(revenue.dark)).toBe(
      "linear-gradient(135deg, #075985 0%, #6b21a8 100%)"
    )
  })

  it("clamps an out-of-range viaPosition instead of emitting it raw", () => {
    expect(gradientCss({ ...revenue.light, viaPosition: 0 })).toBe(
      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 1%, #a855f7 100%)"
    )
    expect(gradientCss({ ...revenue.light, viaPosition: 100 })).toBe(
      "linear-gradient(135deg, #0ea5e9 0%, #6366f1 99%, #a855f7 100%)"
    )
  })
})

describe("gradientForeground", () => {
  const NEAR_WHITE = { l: 0.985, c: 0, h: 0 }
  const NEAR_BLACK = { l: 0.205, c: 0, h: 0 }

  it("picks near-black for an all-light gradient and clears 4.5:1 against the worst stop", () => {
    const lightStops = { angle: 90, from: "#e0f2fe", to: "#fce7f3" }

    expect(gradientForeground(lightStops)).toBe(formatOklch(NEAR_BLACK))

    const worstContrast = Math.min(
      contrastRatio(lightStops.from, oklchToHex(NEAR_BLACK)),
      contrastRatio(lightStops.to, oklchToHex(NEAR_BLACK))
    )
    expect(worstContrast).toBeGreaterThanOrEqual(4.5)
  })

  it("picks near-white for an all-dark gradient and clears 4.5:1 against the worst stop", () => {
    const darkStops = { angle: 90, from: "#0c4a6e", to: "#4a044e" }

    expect(gradientForeground(darkStops)).toBe(formatOklch(NEAR_WHITE))

    const worstContrast = Math.min(
      contrastRatio(darkStops.from, oklchToHex(NEAR_WHITE)),
      contrastRatio(darkStops.to, oklchToHex(NEAR_WHITE))
    )
    expect(worstContrast).toBeGreaterThanOrEqual(4.5)
  })

  it("picks whichever candidate genuinely scores higher when the two are close", () => {
    const midStops = { angle: 90, from: "#808080", to: "#828282" }

    const worstAgainst = (candidate: typeof NEAR_WHITE) =>
      Math.min(
        contrastRatio(midStops.from, oklchToHex(candidate)),
        contrastRatio(midStops.to, oklchToHex(candidate))
      )

    const genuineWinner =
      worstAgainst(NEAR_WHITE) >= worstAgainst(NEAR_BLACK)
        ? NEAR_WHITE
        : NEAR_BLACK

    expect(genuineWinner).toBe(NEAR_BLACK)
    expect(gradientForeground(midStops)).toBe(formatOklch(genuineWinner))
  })
})

describe("adminThemeToCss", () => {
  const css = adminThemeToCss(theme)

  it("doubles the root selector so it beats the installed globals.css", () => {
    expect(css).toContain(":root:root {")
    expect(css).toContain(":root:root.dark {")
  })

  it("emits a gradient and its foreground in both schemes", () => {
    expect(css).toContain("--gradient-revenue: linear-gradient(135deg")
    expect(css).toContain("--gradient-revenue-foreground:")
    expect(css.match(/--gradient-revenue:/g)).toHaveLength(2)
  })

  it("emits the radius once, in the light block", () => {
    expect(css.match(/--radius:/g)).toHaveLength(1)
  })

  it("drops a gradient with an unusable id instead of emitting it", () => {
    const hostile = adminThemeToCss({
      ...theme,
      gradients: [{ ...revenue, id: "a); background: url(http://evil)" }],
    })
    expect(hostile).not.toContain("evil")
    expect(hostile).not.toContain("--gradient-a)")
  })

  it("drops a gradient with an unusable colour", () => {
    const hostile = adminThemeToCss({
      ...theme,
      gradients: [
        { ...revenue, light: { ...revenue.light, from: "red; color: blue" } },
      ],
    })
    expect(hostile).not.toContain("color: blue")
  })

  it("drops a gradient whose viaPosition could close its declaration and start another", () => {
    for (const payload of [
      "50%; } body { display: none } /*",
      "0; background-image: url(http://evil/?x=1)",
    ]) {
      const hostileViaPosition = JSON.parse(JSON.stringify(payload))
      const hostile = adminThemeToCss({
        ...theme,
        gradients: [
          {
            ...revenue,
            light: { ...revenue.light, viaPosition: hostileViaPosition },
          },
        ],
      })
      expect(hostile, payload).not.toContain("--gradient-revenue")
      expect(hostile, payload).not.toContain("background-image")
      expect(hostile, payload).not.toContain("display: none")
    }
  })

  it("drops a gradient whose viaPosition is not a finite number", () => {
    for (const viaPosition of [Number.NaN, Number.POSITIVE_INFINITY]) {
      const hostile = adminThemeToCss({
        ...theme,
        gradients: [
          { ...revenue, light: { ...revenue.light, viaPosition } },
        ],
      })
      expect(hostile, String(viaPosition)).not.toContain("--gradient-revenue")
    }
  })
})
