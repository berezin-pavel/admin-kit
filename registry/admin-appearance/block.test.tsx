import { useState } from "react"
import { fireEvent, render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { Block } from "./block"
import { AppearanceProvider, useBlockAppearance } from "./appearance-provider"
import {
  defaultAdminAppearance,
  gradientFamilies,
  gradientFamilyNames,
  type AdminAppearance,
} from "./appearance-palette"

function ReadBlockAppearance({ id }: { id?: string }) {
  const appearance = useBlockAppearance(id)
  return <pre>{JSON.stringify(appearance)}</pre>
}

function Harness({
  initial = defaultAdminAppearance,
  editable = true,
  headings = false,
  onChangeSpy,
}: {
  initial?: AdminAppearance
  editable?: boolean
  headings?: boolean
  onChangeSpy: (next: AdminAppearance) => void
}) {
  const [value, setValue] = useState(initial)

  return (
    <AppearanceProvider
      value={value}
      editable={editable}
      onChange={(next) => {
        onChangeSpy(next)
        setValue(next)
      }}
    >
      <Block id="a" headings={headings}>
        <p>Content</p>
      </Block>
    </AppearanceProvider>
  )
}

describe("Block without a provider", () => {
  it("paints the card from the gradient prop", () => {
    const { container } = render(<Block gradient="ocean">Content</Block>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).toHaveAttribute("data-block", "")
    expect(card).toHaveAttribute("data-gradient", "ocean")
  })

  it("sets no data-gradient without the prop", () => {
    const { container } = render(<Block>Content</Block>)
    const card = container.querySelector('[data-slot="card"]')

    expect(card).not.toHaveAttribute("data-gradient")
  })

  it("renders no corner button", () => {
    render(<Block gradient="ocean">Content</Block>)

    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("useBlockAppearance", () => {
  it("returns {} outside a provider", () => {
    render(<ReadBlockAppearance id="a" />)

    expect(screen.getByText("{}")).toBeInTheDocument()
  })

  it("returns {} inside a provider without an id", () => {
    render(
      <AppearanceProvider
        value={{ ...defaultAdminAppearance, blocks: { a: { gradient: "ember" } } }}
        onChange={() => {}}
      >
        <ReadBlockAppearance />
      </AppearanceProvider>
    )

    expect(screen.getByText("{}")).toBeInTheDocument()
  })
})

describe("Block corner menu visibility", () => {
  it("shows the corner button when the provider is editable and the block has an id", () => {
    render(
      <AppearanceProvider value={defaultAdminAppearance} onChange={() => {}} editable>
        <Block id="a">Content</Block>
      </AppearanceProvider>
    )

    expect(
      screen.getByRole("button", { name: "Block appearance" })
    ).toBeInTheDocument()
  })

  it("renders no button when the provider is not editable", () => {
    render(
      <AppearanceProvider value={defaultAdminAppearance} onChange={() => {}}>
        <Block id="a">Content</Block>
      </AppearanceProvider>
    )

    expect(screen.queryByRole("button")).toBeNull()
  })

  it("renders no button when the block has no id, even editable", () => {
    render(
      <AppearanceProvider value={defaultAdminAppearance} onChange={() => {}} editable>
        <Block>Content</Block>
      </AppearanceProvider>
    )

    expect(screen.queryByRole("button")).toBeNull()
  })
})

describe("Block gradient resolution", () => {
  it("lets a stored gradient override the prop", () => {
    const value: AdminAppearance = {
      ...defaultAdminAppearance,
      blocks: { a: { gradient: "ember" } },
    }
    const { container } = render(
      <AppearanceProvider value={value} onChange={() => {}}>
        <Block id="a" gradient="ocean">
          Content
        </Block>
      </AppearanceProvider>
    )

    expect(container.querySelector('[data-slot="card"]')).toHaveAttribute(
      "data-gradient",
      "ember"
    )
  })

  it("lets a stored explicit null win over the prop", () => {
    const value: AdminAppearance = {
      ...defaultAdminAppearance,
      blocks: { a: { gradient: null } },
    }
    const { container } = render(
      <AppearanceProvider value={value} onChange={() => {}}>
        <Block id="a" gradient="ocean">
          Content
        </Block>
      </AppearanceProvider>
    )

    expect(container.querySelector('[data-slot="card"]')).not.toHaveAttribute(
      "data-gradient"
    )
  })
})

describe("Block corner menu interaction", () => {
  it("shows the no-gradient tile plus all eighty-seven palette swatches as radios", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(screen.getAllByRole("radio")).toHaveLength(88)
  })

  it("names a swatch in a tooltip on hover", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    await user.hover(screen.getByRole("radio", { name: "Ember" }))

    expect(
      await screen.findByText("Ember", {}, { timeout: 3000 })
    ).toBeInTheDocument()
  })

  it("reports the picked gradient through onChange", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    await user.click(screen.getByRole("radio", { name: "Ember" }))

    const last = onChangeSpy.mock.calls.at(-1)?.[0]
    expect(last?.blocks.a.gradient).toBe("ember")
  })

  it("reports null when the no-gradient tile is picked", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(
      <Harness
        onChangeSpy={onChangeSpy}
        initial={{
          ...defaultAdminAppearance,
          blocks: { a: { gradient: "ember" } },
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    await user.click(screen.getByRole("radio", { name: "No gradient" }))

    const last = onChangeSpy.mock.calls.at(-1)?.[0]
    expect(last?.blocks.a.gradient).toBeNull()
  })

  it("marks the stored gradient as checked", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(
      <Harness
        onChangeSpy={onChangeSpy}
        initial={{
          ...defaultAdminAppearance,
          blocks: { a: { gradient: "ember" } },
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(screen.getByRole("radio", { name: "Ember" })).toHaveAttribute(
      "aria-checked",
      "true"
    )
    expect(screen.getByRole("radio", { name: "Ocean" })).toHaveAttribute(
      "aria-checked",
      "false"
    )
  })

  it("reports the picked heading and leaves the gradient untouched", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(
      <Harness
        onChangeSpy={onChangeSpy}
        headings
        initial={{
          ...defaultAdminAppearance,
          blocks: { a: { gradient: "ember" } },
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    await user.click(screen.getByRole("radio", { name: "Large" }))

    const last = onChangeSpy.mock.calls.at(-1)?.[0]
    expect(last?.blocks.a.heading).toBe("large")
    expect(last?.blocks.a.gradient).toBe("ember")
  })

  it("does not render the heading group without the headings prop", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(screen.queryByRole("radiogroup", { name: "Heading" })).toBeNull()
  })

  it("scopes the gradient radiogroup to its own accessible name", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} headings />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const gradientGroup = screen.getByRole("radiogroup", { name: "Gradient" })
    expect(within(gradientGroup).getAllByRole("radio")).toHaveLength(88)

    const headingGroup = screen.getByRole("radiogroup", { name: "Heading" })
    expect(within(headingGroup).getAllByRole("radio")).toHaveLength(3)
  })

  it("groups the gradient swatches under a caption per family", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const gradientGroup = screen.getByRole("radiogroup", { name: "Gradient" })
    for (const family of gradientFamilies) {
      expect(
        within(gradientGroup).getByText(gradientFamilyNames[family])
      ).toBeInTheDocument()
    }
  })
})

describe("Block corner menu keyboard navigation", () => {
  it("gives the gradient radiogroup a single tab stop, on the checked swatch", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(
      <Harness
        onChangeSpy={onChangeSpy}
        initial={{
          ...defaultAdminAppearance,
          blocks: { a: { gradient: "ember" } },
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const radios = screen.getAllByRole("radio")
    const tabbable = radios.filter((radio) => radio.tabIndex === 0)
    expect(tabbable).toHaveLength(1)
    expect(tabbable[0]).toHaveAttribute("aria-label", "Ember")
    for (const radio of radios) {
      if (radio !== tabbable[0]) {
        expect(radio).toHaveAttribute("tabindex", "-1")
      }
    }
  })

  it("moves focus with ArrowRight and updates the tab stop without selecting", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const noGradient = screen.getByRole("radio", { name: "No gradient" })
    noGradient.focus()
    await user.keyboard("{ArrowRight}")

    const radios = screen.getAllByRole("radio")
    const focused = radios.find((radio) => radio === document.activeElement)
    expect(focused).not.toBe(noGradient)
    expect(focused).toHaveAttribute("tabindex", "0")
    expect(noGradient).toHaveAttribute("tabindex", "-1")
    expect(onChangeSpy).not.toHaveBeenCalled()
  })

  it("wraps to the last swatch with ArrowLeft from the first item", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const gradientGroup = screen.getByRole("radiogroup", { name: "Gradient" })
    const radios = within(gradientGroup).getAllByRole("radio")
    radios[0].focus()
    await user.keyboard("{ArrowLeft}")

    expect(radios.at(-1)).toHaveFocus()
  })

  it("jumps to the first and last swatch with Home and End", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const gradientGroup = screen.getByRole("radiogroup", { name: "Gradient" })
    const radios = within(gradientGroup).getAllByRole("radio")
    radios[3].focus()

    await user.keyboard("{End}")
    expect(radios.at(-1)).toHaveFocus()

    await user.keyboard("{Home}")
    expect(radios[0]).toHaveFocus()
  })

  it("selects the focused swatch with Enter, same as clicking it", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    screen.getByRole("radio", { name: "No gradient" }).focus()
    await user.keyboard("{ArrowRight}{Enter}")

    const last = onChangeSpy.mock.calls.at(-1)?.[0]
    expect(last?.blocks.a.gradient).not.toBeUndefined()
  })

  it("gives the heading radiogroup its own single tab stop", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} headings />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    const headingGroup = screen.getByRole("radiogroup", { name: "Heading" })
    const radios = within(headingGroup).getAllByRole("radio")
    const tabbable = radios.filter((radio) => radio.tabIndex === 0)
    expect(tabbable).toHaveLength(1)
  })
})

describe("Block corner menu drag handle", () => {
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
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    const content = screen.getByRole("dialog", { name: "Block appearance" })

    expect(content.style.transform).toBe("")

    fireEvent(handleOf(), pointer("pointerdown", 100, 100))
    fireEvent(window, pointer("pointermove", 130, 150))
    fireEvent(window, pointer("pointerup", 130, 150))

    expect(content.style.transform).toBe("translate3d(30px, 50px, 0)")
  })

  it("stops moving once the pointer is released", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))
    const content = screen.getByRole("dialog", { name: "Block appearance" })

    fireEvent(handleOf(), pointer("pointerdown", 0, 0))
    fireEvent(window, pointer("pointermove", 10, 10))
    fireEvent(window, pointer("pointerup", 10, 10))
    fireEvent(window, pointer("pointermove", 90, 90))

    expect(content.style.transform).toBe("translate3d(10px, 10px, 0)")
  })

  it("opens back at the corner, dropping the offset of the last drag", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    const trigger = screen.getByRole("button", { name: "Block appearance" })
    await user.click(trigger)
    const content = screen.getByRole("dialog", { name: "Block appearance" })

    fireEvent(handleOf(), pointer("pointerdown", 0, 0))
    fireEvent(window, pointer("pointermove", 20, 40))
    fireEvent(window, pointer("pointerup", 20, 40))
    await user.click(screen.getByRole("button", { name: "Close" }))

    expect(content.style.transform).toBe("translate3d(20px, 40px, 0)")

    await user.click(trigger)

    expect(
      screen.getByRole("dialog", { name: "Block appearance" }).style.transform
    ).toBe("")
  })
})

describe("Block corner menu surface", () => {
  it("paints the popup with the block's own gradient", async () => {
    const user = userEvent.setup()
    render(
      <Harness
        onChangeSpy={vi.fn()}
        initial={{
          ...defaultAdminAppearance,
          blocks: { a: { gradient: "ember" } },
        }}
      />
    )

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(
      screen.getByRole("dialog", { name: "Block appearance" })
    ).toHaveAttribute("data-gradient", "ember")
  })

  it("leaves the popup plain when the block carries no gradient", async () => {
    const user = userEvent.setup()
    render(<Harness onChangeSpy={vi.fn()} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(
      screen.getByRole("dialog", { name: "Block appearance" })
    ).not.toHaveAttribute("data-gradient")
  })
})

describe("Block heading attribute", () => {
  it("marks the card with the stored heading choice", () => {
    const { container } = render(
      <AppearanceProvider
        value={{
          ...defaultAdminAppearance,
          blocks: { a: { heading: "large" } },
        }}
        onChange={() => {}}
      >
        <Block id="a">
          <p>Content</p>
        </Block>
      </AppearanceProvider>
    )

    expect(container.querySelector("[data-block]")).toHaveAttribute(
      "data-heading",
      "large"
    )
  })

  it("carries no heading attribute when nothing is stored", () => {
    const { container } = render(
      <Block id="a">
        <p>Content</p>
      </Block>
    )

    expect(container.querySelector("[data-block]")).not.toHaveAttribute(
      "data-heading"
    )
  })
})
