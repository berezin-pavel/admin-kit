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
  it("sets the page gradient and toggles soft tint", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    const { rerender } = render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Ocean" }))

    let last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page.gradient).toBe("ocean")
    expect(last).toBeDefined()
    if (!last) {
      throw new Error("onChange was not called")
    }

    rerender(<AppearanceMenu value={last} onChange={onChange} />)

    await user.click(screen.getByRole("checkbox", { name: "Soft tint" }))

    last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page.soft).toBe(false)
  })

  it("disables the soft tint checkbox while there is no gradient", async () => {
    render(
      <AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />
    )

    await openMenu()

    expect(screen.getByRole("checkbox", { name: "Soft tint" })).toHaveAttribute(
      "aria-disabled",
      "true"
    )
  })
})

describe("AppearanceMenu per page", () => {
  const pages = [{ id: "orders", label: "Orders" }]

  it("creates a page override from the inherited default", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: { gradient: null, soft: true } }}
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

  it("toggles the per-page soft tint", async () => {
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
    await user.click(screen.getByRole("checkbox", { name: "Orders: Soft tint" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toEqual({ gradient: "ocean", soft: false })
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
      screen.getByRole("button", { name: "Оформление" })
    ).toBeInTheDocument()
  })
})
