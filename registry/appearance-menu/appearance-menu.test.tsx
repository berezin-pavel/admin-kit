import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AppearanceMenu } from "./appearance-menu"
import { defaultAdminAppearance, type AdminAppearance } from "@/registry/admin-appearance/appearance-palette"
import { localeRu } from "@/registry/locale-ru/locale-ru"

async function openMenu(name = "Appearance") {
  const user = userEvent.setup()
  await user.click(screen.getByRole("button", { name }))
  return user
}

describe("AppearanceMenu trigger", () => {
  it("opens from the button named Appearance", async () => {
    render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />
    )

    await openMenu()

    expect(screen.getByRole("dialog", { name: "Appearance" })).toBeInTheDocument()
  })
})

describe("AppearanceMenu accent", () => {
  it("shows twenty accent radios", async () => {
    render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />
    )

    await openMenu()

    const group = screen.getByRole("radiogroup", { name: "Accent color" })
    expect(group.querySelectorAll('[role="radio"]')).toHaveLength(20)
  })

  it("reports the picked accent through onChange, leaving the rest untouched", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("radio", { name: "Blue" }))

    expect(onChange).toHaveBeenCalledWith({ ...defaultAdminAppearance, accent: "blue" })
  })
})

describe("AppearanceMenu sidebar and sign-in selects", () => {
  it("sets the sidebar gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sidebar" }))
    await user.click(await screen.findByRole("option", { name: "Ember" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.sidebar).toBe("ember")
  })

  it("groups the sidebar gradient options under a family label", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sidebar" }))

    expect(await screen.findByText("Jewel")).toBeInTheDocument()
  })

  it("groups the sidebar gradient options with the Russian family label", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    const user = await openMenu(localeRu.appearanceMenu.label)
    await user.click(screen.getByRole("combobox", { name: localeRu.appearanceMenu.sidebar }))

    expect(
      await screen.findByText(localeRu.appearanceMenu.families.jewel)
    ).toBeInTheDocument()
  })

  it("clears the sidebar gradient with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, sidebar: "ember" }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sidebar" }))
    await user.click(await screen.findByRole("option", { name: "No gradient" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.sidebar).toBeNull()
  })

  it("sets the sign-in gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sign-in screen" }))
    await user.click(await screen.findByRole("option", { name: "Ocean" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.signIn).toBe("ocean")
  })
})

describe("AppearanceMenu page background", () => {
  it("sets the page gradient, softened by default", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Ocean" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toEqual({ gradient: "ocean", soft: true })
  })

  it("keeps the vivid choice when the gradient changes", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: false },
        }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Ember" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toEqual({ gradient: "ember", soft: false })
  })

  it("clears the page gradient with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
        }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "No gradient" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toBeNull()
  })
})

describe("AppearanceMenu soften checkbox", () => {
  it("is checked for a freshly chosen gradient", async () => {
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
        }}
        onChange={() => {}}
      />
    )

    await openMenu()

    expect(
      screen.getByRole("checkbox", { name: "Soften the colour" })
    ).toBeChecked()
  })

  it("turns the backdrop vivid when unchecked", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
        }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("checkbox", { name: "Soften the colour" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toEqual({ gradient: "ocean", soft: false })
  })

  it("is disabled while no gradient is set", async () => {
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: null }}
        onChange={() => {}}
      />
    )

    await openMenu()

    expect(
      screen.getByRole("checkbox", { name: "Soften the colour" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  it("explains itself through a tooltip", async () => {
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
        }}
        onChange={() => {}}
      />
    )

    const user = await openMenu()
    await user.hover(screen.getByRole("checkbox", { name: "Soften the colour" }))

    expect(
      await screen.findByText("Soften the colour", {}, { timeout: 3000 })
    ).toBeInTheDocument()
  })
})

describe("AppearanceMenu per page", () => {
  const pages = [{ id: "orders", label: "Orders" }]

  it("creates a page override from the inherited default", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: null }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Orders" }))
    await user.click(await screen.findByRole("option", { name: "Ocean" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toEqual({ gradient: "ocean", soft: true })
  })

  it("sets a page override to no backdrop with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
          pages: { orders: { gradient: "ocean", soft: true } },
        }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Orders" }))
    await user.click(await screen.findByRole("option", { name: "No gradient" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toBeNull()
  })

  it("deletes the override when Same as default is picked", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          pages: { orders: { gradient: "ocean", soft: true } },
        }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Orders" }))
    await user.click(await screen.findByRole("option", { name: "Same as default" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toBeUndefined()
  })

  it("softens a single page through its own checkbox", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: true },
          pages: { orders: { gradient: "ember", soft: true } },
        }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    const checkboxes = screen.getAllByRole("checkbox", {
      name: "Soften the colour",
    })
    await user.click(checkboxes[1])

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toEqual({ gradient: "ember", soft: false })
    expect(last?.page).toEqual({ gradient: "ocean", soft: true })
  })

  it("disables the checkbox of a page that inherits the default", async () => {
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: { gradient: "ocean", soft: false },
        }}
        onChange={() => {}}
        pages={pages}
      />
    )

    await openMenu()
    const checkboxes = screen.getAllByRole("checkbox", {
      name: "Soften the colour",
    })

    expect(checkboxes[1]).toHaveAttribute("aria-disabled", "true")
    expect(checkboxes[1]).not.toBeChecked()
  })
})

describe("AppearanceMenu localization", () => {
  it("renders Russian labels", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    expect(
      screen.getByRole("button", { name: localeRu.appearanceMenu.label })
    ).toBeInTheDocument()
  })
})
