import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { AppearanceMenu } from "./appearance-menu"
import { defaultAdminAppearance, type AdminAppearance } from "@/registry/admin-appearance/appearance-palette"
import { appearanceThemes } from "@/registry/admin-appearance/appearance-themes"
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

    expect(await screen.findByText("Neutral")).toBeInTheDocument()
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
      await screen.findByText(localeRu.appearanceMenu.families.neutral)
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

  it("sets the header gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Header" }))
    await user.click(await screen.findByRole("option", { name: "Ember" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.header).toBe("ember")
    expect(last?.sidebar).toBeNull()
  })

  it("clears the header gradient with No gradient", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, header: "ember" }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Header" }))
    await user.click(await screen.findByRole("option", { name: "No gradient" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.header).toBeNull()
  })

  it("labels the header select in Russian", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    await openMenu(localeRu.appearanceMenu.label)

    expect(
      screen.getByRole("combobox", { name: localeRu.appearanceMenu.header })
    ).toBeInTheDocument()
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

describe("AppearanceMenu themes", () => {
  it("renders a button per theme", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    await openMenu()

    for (const theme of appearanceThemes) {
      expect(screen.getByRole("button", { name: theme.name })).toBeInTheDocument()
    }
    expect(appearanceThemes).toHaveLength(20)
  })

  it("hands the whole preset to onChange when a theme is picked", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("button", { name: "Sage" }))

    expect(onChange).toHaveBeenCalledWith(
      appearanceThemes.find((theme) => theme.id === "sage")?.appearance
    )
  })

  it("keeps the block and page choices a theme knows nothing about", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    const value: AdminAppearance = {
      ...defaultAdminAppearance,
      blocks: { revenue: { heading: "large" } },
      pages: { orders: { gradient: "#123456", soft: false } },
    }
    render(<AppearanceMenu value={value} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("button", { name: "Sage" }))

    const next = onChange.mock.calls.at(-1)?.[0]
    const sage = appearanceThemes.find((theme) => theme.id === "sage")?.appearance

    expect(next?.blocks).toEqual(value.blocks)
    expect(next?.pages).toEqual(value.pages)
    expect(next?.sidebar).toBe(sage?.sidebar)
    expect(next?.accent).toBe(sage?.accent)
  })

  it("names the themes in Russian", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    await openMenu(localeRu.appearanceMenu.label)

    expect(
      screen.getByRole("button", { name: localeRu.appearanceMenu.themes.slate })
    ).toBeInTheDocument()
  })
})

describe("AppearanceMenu custom accent", () => {
  it("applies a hex typed into the accent field", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    const field = screen.getByRole("textbox", { name: "Custom color hex" })
    await user.clear(field)
    await user.type(field, "#123456")

    expect(onChange).toHaveBeenCalledWith({
      ...defaultAdminAppearance,
      accent: "#123456",
    })
  })

  it("stays quiet while the typed value is not a colour", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    const field = screen.getByRole("textbox", { name: "Custom color hex" })
    await user.clear(field)
    await user.type(field, "#12zz")

    expect(onChange).not.toHaveBeenCalled()
  })

  it("shows the custom accent and checks no palette radio", async () => {
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, accent: "#123456" }}
        onChange={() => {}}
      />
    )

    await openMenu()

    expect(screen.getByRole("textbox", { name: "Custom color hex" })).toHaveValue(
      "#123456"
    )
    for (const radio of screen.getAllByRole("radio")) {
      expect(radio).toHaveAttribute("aria-checked", "false")
    }
  })
})

describe("AppearanceMenu custom surface colours", () => {
  it("puts a starting colour in the slot when Custom color is picked", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sidebar" }))
    await user.click(await screen.findByRole("option", { name: "Custom color…" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.sidebar).toBe("#6b7280")
  })

  it("keeps the colour already in the slot when Custom color is picked again", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, sidebar: "#0f172a" }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Sidebar" }))
    await user.click(await screen.findByRole("option", { name: "Custom color…" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.sidebar).toBe("#0f172a")
  })

  it("shows the colour in the trigger and offers its own inputs", async () => {
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, sidebar: "#0f172a" }}
        onChange={() => {}}
      />
    )

    await openMenu()

    expect(screen.getByRole("combobox", { name: "Sidebar" })).toHaveTextContent(
      "#0f172a"
    )
    expect(
      screen.getAllByRole("textbox", { name: "Custom color hex" })
    ).toHaveLength(2)
  })

  it("applies a hex typed beside the sidebar select", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, sidebar: "#0f172a" }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    const fields = screen.getAllByRole("textbox", { name: "Custom color hex" })
    await user.clear(fields[1])
    await user.type(fields[1], "#eceff3")

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.sidebar).toBe("#eceff3")
  })

  it("softens a custom page background by default", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Custom color…" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toEqual({ gradient: "#6b7280", soft: true })
  })

  it("names the custom option in Russian", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    const user = await openMenu(localeRu.appearanceMenu.label)
    await user.click(
      screen.getByRole("combobox", { name: localeRu.appearanceMenu.sidebar })
    )

    expect(
      await screen.findByRole("option", { name: localeRu.appearanceMenu.custom })
    ).toBeInTheDocument()
  })
})

describe("AppearanceMenu drag handle", () => {
  const pointer = (type: string, clientX: number, clientY: number) =>
    new MouseEvent(type, { bubbles: true, clientX, clientY })

  const handleOf = () => {
    const handle = document.querySelector('[data-slot="appearance-drag-handle"]')
    if (!(handle instanceof HTMLElement)) {
      throw new Error("the popup has no drag handle")
    }
    return handle
  }

  it("moves the popup by the distance the handle is dragged", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    await openMenu()
    const content = screen.getByRole("dialog", { name: "Appearance" })

    expect(content.style.transform).toBe("")

    fireEvent(handleOf(), pointer("pointerdown", 100, 100))
    fireEvent(window, pointer("pointermove", 140, 160))
    fireEvent(window, pointer("pointerup", 140, 160))

    expect(content.style.transform).toBe("translate3d(40px, 60px, 0)")
  })

  it("stops moving once the pointer is released", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    await openMenu()
    const content = screen.getByRole("dialog", { name: "Appearance" })

    fireEvent(handleOf(), pointer("pointerdown", 0, 0))
    fireEvent(window, pointer("pointermove", 10, 10))
    fireEvent(window, pointer("pointerup", 10, 10))
    fireEvent(window, pointer("pointermove", 90, 90))

    expect(content.style.transform).toBe("translate3d(10px, 10px, 0)")
  })

  it("keeps the handle out of the accessibility tree", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    await openMenu()

    expect(handleOf()).toHaveAttribute("aria-hidden", "true")
  })
})
