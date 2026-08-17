import { fireEvent, render, screen } from "@testing-library/react"
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

const revenue = {
  id: "revenue",
  name: "Revenue",
  light: { angle: 135, from: "#0ea5e9", to: "#a855f7" },
  dark: { angle: 135, from: "#075985", to: "#6b21a8" },
}

describe("ThemeEditor gradients", () => {
  it("adds a gradient with an id derived from its name", async () => {
    const onChange = vi.fn()
    render(<ThemeEditor value={theme} onChange={onChange} />)

    await userEvent.click(screen.getByRole("button", { name: "Add gradient" }))

    const added = onChange.mock.calls.at(-1)?.[0].gradients.at(-1)
    expect(added.id).toMatch(/^[a-z][a-z0-9-]*$/)
  })

  it("suggests a dark variant that is darker than the light one", async () => {
    const onChange = vi.fn()
    render(
      <ThemeEditor
        value={{ ...theme, gradients: [revenue] }}
        onChange={onChange}
      />
    )

    await userEvent.click(
      screen.getByRole("button", { name: "Suggest dark: revenue" })
    )

    const next = onChange.mock.calls.at(-1)?.[0].gradients[0]
    expect(next.dark.from).not.toBe(revenue.dark.from)
  })

  it("warns when a gradient cannot carry legible text", () => {
    render(
      <ThemeEditor
        value={{
          ...theme,
          gradients: [
            {
              ...revenue,
              light: { angle: 90, from: "#7f7f7f", to: "#8a8a8a" },
            },
          ],
        }}
        onChange={() => {}}
      />
    )

    expect(screen.getByRole("status")).toHaveTextContent(/contrast/i)
  })

  it("does not warn on a gradient that clears the threshold", () => {
    render(
      <ThemeEditor
        value={{ ...theme, gradients: [revenue] }}
        onChange={() => {}}
      />
    )

    expect(screen.queryByRole("status")).toBeNull()
  })

  it("keeps every row individually addressable after adding twice without renaming", async () => {
    const onChange = vi.fn()
    const { rerender } = render(
      <ThemeEditor value={theme} onChange={onChange} />
    )

    await userEvent.click(screen.getByRole("button", { name: "Add gradient" }))
    const afterFirstAdd = onChange.mock.calls.at(-1)?.[0]
    rerender(<ThemeEditor value={afterFirstAdd} onChange={onChange} />)

    await userEvent.click(screen.getByRole("button", { name: "Add gradient" }))
    const afterSecondAdd = onChange.mock.calls.at(-1)?.[0]
    rerender(<ThemeEditor value={afterSecondAdd} onChange={onChange} />)

    const [first, second] = afterSecondAdd.gradients
    expect(first.name).toBe(second.name)
    expect(first.id).not.toBe(second.id)
    expect(
      screen.getByRole("button", { name: `Remove: ${first.id}` })
    ).toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: `Remove: ${second.id}` })
    ).toBeInTheDocument()
  })

  it("keeps the id fixed when the name changes", () => {
    const onChange = vi.fn()
    render(
      <ThemeEditor
        value={{ ...theme, gradients: [revenue] }}
        onChange={onChange}
      />
    )

    const name = screen.getByLabelText("Name")
    fireEvent.change(name, { target: { value: "Renamed" } })

    const last = onChange.mock.calls.at(-1)?.[0].gradients[0]
    expect(last.name).toBe("Renamed")
    expect(last.id).toBe(revenue.id)
  })
})
