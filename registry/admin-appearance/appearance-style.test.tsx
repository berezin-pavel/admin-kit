import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AppearanceCanvas,
  AppearanceStyle,
  backdropThemeColors,
} from "./appearance-style"
import { customDarkColor } from "./appearance-css"
import {
  CUSTOM_COLOR_ANGLE,
  customColorStops,
  defaultAdminAppearance,
  gradientPalette,
  softStops,
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

  it("paints the canvas from the custom colour's soft variable", () => {
    const { container } = render(
      <AppearanceCanvas backdrop={{ gradient: "#aabbcc", soft: true }} />
    )

    expect(container.querySelector("style")?.innerHTML).toBe(
      "html{background-image:var(--custom-aabbcc-soft)}body{background-color:transparent}"
    )
  })

  it("paints the canvas from the colour's own variable when it is not softened", () => {
    const { container } = render(
      <AppearanceCanvas backdrop={{ gradient: "#AABBCC", soft: false }} />
    )

    expect(container.querySelector("style")?.innerHTML).toBe(
      "html{background-image:var(--custom-aabbcc)}body{background-color:transparent}"
    )
  })

  it("takes the dark theme colour of a custom backdrop from its dark variant", () => {
    const light = "#eef1f4"
    const dark = customDarkColor(light)

    expect(dark).not.toBe(light)
    expect(backdropThemeColors({ gradient: light, soft: false })).toEqual({
      light,
      dark,
    })
    expect(backdropThemeColors({ gradient: light, soft: true })).toEqual({
      light: softStops(customColorStops(light), "light").stops[0],
      dark: softStops(
        { angle: CUSTOM_COLOR_ANGLE, stops: [dark, dark, dark] },
        "dark"
      ).stops[0],
    })
  })

  it("leaves a dark custom backdrop as it is in both schemes", () => {
    expect(backdropThemeColors({ gradient: "#0f172a", soft: false })).toEqual({
      light: "#0f172a",
      dark: "#0f172a",
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
