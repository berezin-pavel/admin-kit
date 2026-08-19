import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AppearanceCanvas,
  AppearanceStyle,
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

describe("AppearanceCanvas", () => {
  it("paints the document canvas with the soft stop when the backdrop is softened", () => {
    const { container } = render(
      <AppearanceCanvas backdrop={{ gradient: "ocean", soft: true }} />
    )
    const style = container.querySelector("style")

    expect(style?.innerHTML).toBe(
      "html{background-image:var(--gradient-ocean-soft)}body{background-color:transparent}"
    )
  })

  it("paints the document canvas with the vivid stop when the backdrop is not softened", () => {
    const { container } = render(
      <AppearanceCanvas backdrop={{ gradient: "ocean", soft: false }} />
    )
    const style = container.querySelector("style")

    expect(style?.innerHTML).toBe(
      "html{background-image:var(--gradient-ocean)}body{background-color:transparent}"
    )
  })

  it("renders no style tag without a backdrop", () => {
    const { container } = render(<AppearanceCanvas backdrop={null} />)

    expect(container.querySelector("style")).toBeNull()
  })

  it("emits a theme-color meta per scheme from the backdrop's soft tint", () => {
    const backdrop = { gradient: "ocean", soft: true } as const
    render(<AppearanceCanvas backdrop={backdrop} />)
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
    render(<AppearanceCanvas backdrop={null} />)
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')

    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveAttribute("content", "#ffffff")
    expect(metas[1]).toHaveAttribute("content", "#0a0a0a")
  })
})
