import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

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

  it("swaps one page gradient for another", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: "ocean" }}
        onChange={onChange}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Ember" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toBe("ember")
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

  it("offers no soften control any more", async () => {
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, page: "ocean" }}
        onChange={() => {}}
      />
    )

    await openMenu()

    expect(screen.queryAllByRole("checkbox")).toHaveLength(0)
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
        value={{
          ...defaultAdminAppearance,
          page: "ocean",
          pages: { orders: "ocean" },
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
        value={{ ...defaultAdminAppearance, pages: { orders: "ocean" } }}
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

  it("leaves the default page background alone when a row changes", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{
          ...defaultAdminAppearance,
          page: "ocean",
          pages: { orders: "ember" },
        }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Orders" }))
    await user.click(await screen.findByRole("option", { name: "Grape" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toBe("grape")
    expect(last?.page).toBe("ocean")
  })

  it("edits a custom colour set on a single page", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(
      <AppearanceMenu
        value={{ ...defaultAdminAppearance, pages: { orders: "#0f172a" } }}
        onChange={onChange}
        pages={pages}
      />
    )

    const user = await openMenu()
    const fields = screen.getAllByRole("textbox", { name: "Custom color hex" })
    await user.clear(fields.at(-1) as HTMLElement)
    await user.type(fields.at(-1) as HTMLElement, "#eceff3")

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.pages.orders).toBe("#eceff3")
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
  it("offers every theme as an option of one select", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Theme" }))

    for (const theme of appearanceThemes) {
      expect(
        await screen.findByRole("option", { name: theme.name })
      ).toBeInTheDocument()
    }
    expect(appearanceThemes).toHaveLength(26)
  })

  it("keeps the trigger on its label, since picking is an action", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    const user = await openMenu()
    const trigger = screen.getByRole("combobox", { name: "Theme" })
    await user.click(trigger)
    await user.click(await screen.findByRole("option", { name: "Sage" }))

    expect(trigger).toHaveTextContent("Theme")
  })

  it("hands the whole preset to onChange when a theme is picked", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Theme" }))
    await user.click(await screen.findByRole("option", { name: "Sage" }))

    expect(onChange).toHaveBeenCalledWith(
      appearanceThemes.find((theme) => theme.id === "sage")?.appearance
    )
  })

  it("keeps the block and page choices a theme knows nothing about", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    const value: AdminAppearance = {
      ...defaultAdminAppearance,
      blocks: { revenue: { heading: "large" } },
      pages: { orders: "#123456" },
    }
    render(<AppearanceMenu value={value} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Theme" }))
    await user.click(await screen.findByRole("option", { name: "Sage" }))

    const next = onChange.mock.calls.at(-1)?.[0]
    const sage = appearanceThemes.find((theme) => theme.id === "sage")?.appearance

    expect(next?.blocks).toEqual(value.blocks)
    expect(next?.pages).toEqual(value.pages)
    expect(next?.sidebar).toBe(sage?.sidebar)
    expect(next?.accent).toBe(sage?.accent)
  })

  it("applies a green preset from the new half of the list", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Theme" }))
    await user.click(await screen.findByRole("option", { name: "Pine" }))

    const next = onChange.mock.calls.at(-1)?.[0]
    expect(next?.sidebar).toBe("#1f3a2e")
    expect(next?.page).toBe("#e8efe9")
  })

  it("names the themes in Russian", async () => {
    render(
      <AppearanceMenu
        value={defaultAdminAppearance}
        onChange={() => {}}
        labels={localeRu.appearanceMenu}
      />
    )

    const user = await openMenu(localeRu.appearanceMenu.label)
    await user.click(
      screen.getByRole("combobox", { name: localeRu.appearanceMenu.theme })
    )

    expect(
      await screen.findByRole("option", {
        name: localeRu.appearanceMenu.themes.slate,
      })
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

  it("puts a starting colour in the page background too", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    const user = await openMenu()
    await user.click(screen.getByRole("combobox", { name: "Page background" }))
    await user.click(await screen.findByRole("option", { name: "Custom color…" }))

    const last = onChange.mock.calls.at(-1)?.[0]
    expect(last?.page).toBe("#6b7280")
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

  beforeEach(() => {
    vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
      callback(0)
      return 0
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

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

  it("moves the popup without re-rendering it on every pointermove", async () => {
    const onChange = vi.fn<(next: AdminAppearance) => void>()
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={onChange} />)

    await openMenu()
    const content = screen.getByRole("dialog", { name: "Appearance" })

    fireEvent(handleOf(), pointer("pointerdown", 0, 0))
    for (let step = 1; step <= 20; step++) {
      fireEvent(window, pointer("pointermove", step, step * 2))
    }
    fireEvent(window, pointer("pointerup", 20, 40))

    expect(content.style.transform).toBe("translate3d(20px, 40px, 0)")
    expect(onChange).not.toHaveBeenCalled()
  })

  it("keeps the handle out of the accessibility tree", async () => {
    render(<AppearanceMenu value={defaultAdminAppearance} onChange={() => {}} />)

    await openMenu()

    expect(handleOf()).toHaveAttribute("aria-hidden", "true")
  })
})
