import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { IconField, iconFieldLabelDefaults, resolveIcon } from "./icon-field"

vi.mock("./icon-catalog", () => {
  const iconCatalog = Array.from({ length: 20 }, (_, index) => ({
    name: `icon-${index}`,
    pack: "lucide" as const,
    tags: index === 0 ? ["basket"] : [],
  }))

  return {
    iconCatalog,
    iconNames: iconCatalog.map((entry) => entry.name),
    isIconName: (value: string) =>
      iconCatalog.some((entry) => entry.name === value),
  }
})

vi.mock("./icon-nodes", () => {
  const fixtureNode = [["path", { d: "M4 4h16v16H4z" }]]
  const nodes: Record<string, unknown> = {
    "shopping-cart": fixtureNode,
  }
  for (let index = 0; index < 20; index++) {
    nodes[`icon-${index}`] = fixtureNode
  }

  return {
    parseIconNodes: () => nodes,
  }
})

const noop = () => {}

async function openField(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByTestId("icon-field-trigger"))
  await screen.findByRole("radio", { name: "icon-0" })
}

describe("resolveIcon", () => {
  it("renders an empty span before nodes load and an svg after", async () => {
    const ResolvedIcon = resolveIcon("shopping-cart")
    const { container } = render(<ResolvedIcon className="size-4" />)

    expect(container.querySelector("svg")).not.toBeInTheDocument()
    expect(container.querySelector("span")).toBeInTheDocument()

    await waitFor(() => {
      expect(container.querySelector("svg")).toBeInTheDocument()
    })
  })
})

describe("IconField anatomy", () => {
  it("renders the label", () => {
    render(<IconField value={null} onChange={noop} label="Icon" />)
    expect(screen.getByText("Icon")).toBeInTheDocument()
  })

  it("renders the hint", () => {
    render(<IconField value={null} onChange={noop} hint="Pick something" />)
    expect(screen.getByText("Pick something")).toBeInTheDocument()
  })

  it("renders the error instead of the hint", () => {
    render(
      <IconField
        value={null}
        onChange={noop}
        hint="Pick something"
        error="Required"
      />
    )
    expect(screen.getByText("Required")).toBeInTheDocument()
    expect(screen.queryByText("Pick something")).not.toBeInTheDocument()
  })

  it("marks the trigger aria-invalid when there's an error", () => {
    render(<IconField value={null} onChange={noop} error="Required" />)
    expect(
      screen.getByTestId("icon-field-trigger")
    ).toHaveAttribute("aria-invalid", "true")
  })

  it("shows the placeholder without a value", () => {
    render(<IconField value={null} onChange={noop} />)
    expect(
      screen.getByText(iconFieldLabelDefaults.placeholder)
    ).toBeInTheDocument()
  })

  it("shows the icon name as the trigger label when a value is set", () => {
    render(<IconField value="icon-3" onChange={noop} />)
    expect(screen.getByText("icon-3")).toBeInTheDocument()
  })

  it("does not render a clear button without a value", () => {
    render(<IconField value={null} onChange={noop} />)
    expect(
      screen.queryByRole("button", { name: iconFieldLabelDefaults.clear })
    ).not.toBeInTheDocument()
  })

  it("renders the selected icon's svg once nodes load", async () => {
    render(<IconField value="icon-3" onChange={noop} />)
    const trigger = screen.getByTestId("icon-field-trigger")

    await waitFor(() => {
      expect(trigger.querySelector("svg")).toBeInTheDocument()
    })
  })
})

describe("IconField popover", () => {
  it("loads the catalogue on first open and renders tiles", async () => {
    const user = userEvent.setup()
    render(<IconField value={null} onChange={noop} />)

    await user.click(
      screen.getByTestId("icon-field-trigger")
    )

    await screen.findByRole("radio", { name: "icon-0" })
    expect(screen.getAllByRole("radio")).toHaveLength(20)
  })

  it("shows the loading label until the catalogue and keywords resolve", async () => {
    const user = userEvent.setup()
    let resolveKeywords: (value: Record<string, readonly string[]>) => void = () => {}
    const keywords = new Promise<Record<string, readonly string[]>>((resolve) => {
      resolveKeywords = resolve
    })

    render(
      <IconField value={null} onChange={noop} loadKeywords={() => keywords} />
    )

    await user.click(
      screen.getByTestId("icon-field-trigger")
    )

    expect(
      screen.getByText(iconFieldLabelDefaults.loading)
    ).toBeInTheDocument()

    resolveKeywords({})

    await screen.findByRole("radio", { name: "icon-0" })
    expect(
      screen.queryByText(iconFieldLabelDefaults.loading)
    ).not.toBeInTheDocument()
  })

  it("filters tiles by the search input", async () => {
    const user = userEvent.setup()
    render(<IconField value={null} onChange={noop} />)
    await openField(user)

    await user.type(
      screen.getByRole("textbox", {
        name: iconFieldLabelDefaults.searchPlaceholder,
      }),
      "basket"
    )

    await waitFor(() => {
      expect(screen.getAllByRole("radio")).toHaveLength(1)
    })
    expect(screen.getByRole("radio", { name: "icon-0" })).toBeInTheDocument()
  })

  it("selects an icon and closes on Enter", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<IconField value={null} onChange={onChange} />)
    await openField(user)

    const tile = screen.getByRole("radio", { name: "icon-0" })
    tile.focus()
    await user.keyboard("{Enter}")

    expect(onChange).toHaveBeenCalledWith("icon-0")
    await waitFor(() => {
      expect(screen.queryByRole("radio")).not.toBeInTheDocument()
    })
  })

  it("selects an icon and closes on click", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<IconField value={null} onChange={onChange} />)
    await openField(user)

    await user.click(screen.getByRole("radio", { name: "icon-5" }))

    expect(onChange).toHaveBeenCalledWith("icon-5")
    await waitFor(() => {
      expect(screen.queryByRole("radio")).not.toBeInTheDocument()
    })
  })

  it("moves focus by the column count with ArrowDown/ArrowUp", async () => {
    const user = userEvent.setup()
    render(<IconField value={null} onChange={noop} />)
    await openField(user)

    const tiles = screen.getAllByRole("radio")
    tiles[0].focus()

    await user.keyboard("{ArrowDown}")
    expect(tiles[8]).toHaveFocus()

    await user.keyboard("{ArrowUp}")
    expect(tiles[0]).toHaveFocus()
  })

  it("shows a Show N more button when results exceed pageSize", async () => {
    const user = userEvent.setup()
    render(<IconField value={null} onChange={noop} pageSize={8} />)
    await openField(user)

    expect(screen.getAllByRole("radio")).toHaveLength(8)
    expect(
      screen.getByRole("button", { name: iconFieldLabelDefaults.showMore(8) })
    ).toBeInTheDocument()

    await user.click(
      screen.getByRole("button", { name: iconFieldLabelDefaults.showMore(8) })
    )

    expect(screen.getAllByRole("radio")).toHaveLength(16)
  })

  it("merges loadKeywords results into search", async () => {
    const user = userEvent.setup()
    render(
      <IconField
        value={null}
        onChange={noop}
        loadKeywords={() =>
          Promise.resolve({ "icon-1": ["gizmo"] } as const)
        }
      />
    )
    await openField(user)

    await user.type(
      screen.getByRole("textbox", {
        name: iconFieldLabelDefaults.searchPlaceholder,
      }),
      "gizmo"
    )

    await waitFor(() => {
      expect(screen.getAllByRole("radio")).toHaveLength(1)
    })
    expect(screen.getByRole("radio", { name: "icon-1" })).toBeInTheDocument()
  })
})

describe("IconField clear button", () => {
  it("calls onChange with null", async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<IconField value="icon-2" onChange={onChange} />)

    await user.click(
      screen.getByRole("button", { name: iconFieldLabelDefaults.clear })
    )

    expect(onChange).toHaveBeenCalledWith(null)
  })
})

