import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import {
  AppearanceStyle,
  AppearanceThemeColor,
  backdropThemeColors,
} from "./appearance-style"
import { defaultAdminAppearance } from "./appearance-palette"

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
    render(<AppearanceThemeColor gradient="ocean" />)
    const metas = document.head.querySelectorAll('meta[name="theme-color"]')

    expect(metas).toHaveLength(2)
    expect(metas[0]).toHaveAttribute("content", backdropThemeColors("ocean")?.light)
    expect(metas[1]).toHaveAttribute("media", "(prefers-color-scheme: dark)")
  })

  it("renders nothing without a backdrop", () => {
    document.head
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((node) => node.remove())
    const { container } = render(<AppearanceThemeColor gradient={null} />)
    expect(container.innerHTML).toBe("")
    expect(document.head.querySelectorAll('meta[name="theme-color"]')).toHaveLength(0)
  })
})
