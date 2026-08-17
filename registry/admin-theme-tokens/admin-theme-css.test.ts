import { describe, expect, it } from "vitest"

import {
  adminThemeToCss,
  gradientCss,
  gradientForeground,
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
})

describe("gradientForeground", () => {
  it("picks a foreground that clears 4.5:1 against the worst stop", () => {
    const foreground = gradientForeground(revenue.light)
    expect(foreground).toMatch(/^oklch\(/)
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
})
