import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AppearanceStyle } from "./appearance-style"
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
