import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { defaultAdminThemeSources } from "../admin-theme-tokens/admin-theme-tokens"
import { ThemeEditor } from "./theme-editor"

const theme = { sources: defaultAdminThemeSources, gradients: [] }

describe("ThemeEditor sources", () => {
  it("reports a new brand colour without keeping it", async () => {
    const onChange = vi.fn()
    render(<ThemeEditor value={theme} onChange={onChange} />)

    const brand = screen.getByLabelText("Brand")
    await userEvent.click(brand)
    const hex = screen.getByLabelText("Color HEX code")
    await userEvent.clear(hex)
    await userEvent.type(hex, "3b82f6")

    expect(onChange).toHaveBeenCalled()
    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last.sources.brand).toBe("#3b82f6")
    expect(brand).toHaveTextContent(defaultAdminThemeSources.brand)
  })

  it("shows the value it is given after a rerender", () => {
    const { unmount } = render(
      <ThemeEditor value={theme} onChange={() => {}} />
    )
    unmount()

    render(
      <ThemeEditor
        value={{ ...theme, sources: { ...theme.sources, brand: "#3b82f6" } }}
        onChange={() => {}}
      />
    )

    expect(screen.getByLabelText("Brand")).toHaveTextContent("#3b82f6")
  })

  it("hides the CSS block unless asked", () => {
    const { unmount } = render(
      <ThemeEditor value={theme} onChange={() => {}} />
    )
    expect(screen.queryByText(/:root:root/)).toBeNull()
    unmount()

    render(<ThemeEditor value={theme} onChange={() => {}} showCss />)
    expect(screen.getByText(/:root:root/)).toBeInTheDocument()
  })
})
