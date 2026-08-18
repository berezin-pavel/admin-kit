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
  it("sets the page gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Ocean" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toBe("ocean")
  })

  it("clears the page gradient with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: "ocean" }}
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
    expect(last?.pages.orders).toBe("ocean")
  })

  it("sets a page override to no backdrop with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: "ocean", pages: { orders: "ocean" } }}
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
          pages: { orders: "ocean" },
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
