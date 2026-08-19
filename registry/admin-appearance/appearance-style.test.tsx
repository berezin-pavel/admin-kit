import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AppearanceStyle,
  AppearanceThemeColor,
  backdropThemeColors,
} from "./appearance-style"
import { defaultAdminAppearance, gradientPalette } from "./appearance-palette"

describe("AppearanceStyle", () => {
  it("renders a style tag with the gradient and accent tokens", () => {
    const { container } = render(<AppearanceStyle value={defaultAdminAppearance} />)
    const style = container.querySelector("style")

    expect(style).not.toBeNull()
    expect(style?.innerHTML).toContain('[data-gradient="ocean"]')
    expect(style?.innerHTML).toContain("--primary:")
  })
})

describe("AppearanceThemeColor", () => {
  it("emits a theme-color meta per scheme from the backdrop's soft tint", () => {
    const backdrop = { gradient: "ocean", soft: true } as const
    render(<AppearanceThemeColor backdrop={backdrop} />)
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')

    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveAttribute("content", backdropThemeColors(backdrop).light)
    expect(metas[1]).toHaveAttribute("media", "(prefers-color-scheme: dark)")
  })

  it("takes the vivid stop when the backdrop is not softened", () => {
    const ocean = gradientPalette.find((entry) => entry.id === "ocean")

    expect(backdropThemeColors({ gradient: "ocean", soft: false })).toEqual({
      light: ocean?.light.stops[0],
      dark: ocean?.dark.stops[0],
    })
    expect(backdropThemeColors({ gradient: "ocean", soft: true })).toEqual({
      light: ocean?.softLight.stops[0],
      dark: ocean?.softDark.stops[0],
    })
  })

  it("falls back to the theme's own background without a backdrop", () => {
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((node) => node.remove())
    render(<AppearanceThemeColor backdrop={null} />)
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')

    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveAttribute("content", "#ffffff")
    expect(metas[1]).toHaveAttribute("content", "#0a0a0a")
  })
})
