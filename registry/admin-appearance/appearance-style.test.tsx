import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AppearanceCanvas,
  AppearanceStyle,
  backdropThemeColors,
} from "./appearance-style"
import { customDarkColor } from "./appearance-css"
import {
  defaultAdminAppearance,
  gradientPalette,
} from "./appearance-palette"

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
  it("paints the document canvas with the palette gradient's soft tint", () => {
    const { container } = render(<AppearanceCanvas backdrop="ocean" />)
    const style = container.querySelector("style")

    expect(style?.innerHTML).toBe(
      "html{background-image:var(--gradient-ocean-soft)}body{background-color:transparent}"
    )
  })

  it("paints the full gradient when the canvas is asked for the vivid one", () => {
    const { container } = render(<AppearanceCanvas backdrop="ocean" vivid />)
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
    render(<AppearanceCanvas backdrop="ocean" />)
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')

    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveAttribute("content", backdropThemeColors("ocean").light)
    expect(metas[1]).toHaveAttribute("media", "(prefers-color-scheme: dark)")
  })

  it("takes the soft stop unless the vivid one is asked for", () => {
    const ocean = gradientPalette.find((entry) => entry.id === "ocean")

    expect(backdropThemeColors("ocean", true)).toEqual({
      light: ocean?.light.stops[0],
      dark: ocean?.dark.stops[0],
    })
    expect(backdropThemeColors("ocean")).toEqual({
      light: ocean?.softLight.stops[0],
      dark: ocean?.softDark.stops[0],
    })
  })

  it("paints a custom backdrop with the colour itself, softened or not", () => {
    const { container: soft } = render(<AppearanceCanvas backdrop="#aabbcc" />)
    const { container: vivid } = render(
      <AppearanceCanvas backdrop="#AABBCC" vivid />
    )

    expect(soft.querySelector("style")?.innerHTML).toBe(
      "html{background-image:var(--custom-aabbcc)}body{background-color:transparent}"
    )
    expect(vivid.querySelector("style")?.innerHTML).toBe(
      "html{background-image:var(--custom-aabbcc)}body{background-color:transparent}"
    )
  })

  it("takes the dark theme colour of a custom backdrop from its dark variant", () => {
    const light = "#eef1f4"
    const dark = customDarkColor(light)

    expect(dark).not.toBe(light)
    expect(backdropThemeColors(light)).toEqual({ light, dark })
    expect(backdropThemeColors(light, true)).toEqual({ light, dark })
  })

  it("adapts a dark custom backdrop for the dark scheme too", () => {
    const colors = backdropThemeColors("#0f172a")

    expect(colors.light).toBe("#0f172a")
    expect(colors.dark).toBe(customDarkColor("#0f172a"))
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
