import { useState } from "react"
import { render, screen, within } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { Block } from "./block"
import { AppearanceProvider, useBlockAppearance } from "./appearance-provider"
import { defaultAdminAppearance, type AdminAppearance } from "./appearance-palette"

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
  it("shows the no-gradient tile plus all twenty palette swatches as radios", async () => {
    const user = userEvent.setup()
    const onChangeSpy = vi.fn<(next: AdminAppearance) => void>()
    render(<Harness onChangeSpy={onChangeSpy} />)

    await user.click(screen.getByRole("button", { name: "Block appearance" }))

    expect(screen.getAllByRole("radio")).toHaveLength(21)
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
    expect(within(gradientGroup).getAllByRole("radio")).toHaveLength(21)

    const headingGroup = screen.getByRole("radiogroup", { name: "Heading" })
    expect(within(headingGroup).getAllByRole("radio")).toHaveLength(3)
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
