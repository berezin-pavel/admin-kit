import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { GlobalSearch, type GlobalSearchItem } from "./global-search"

const items: readonly GlobalSearchItem[] = [
  { id: "orders", label: "Orders", group: "Sections", hint: "/orders" },
  { id: "products", label: "Products", group: "Sections" },
  { id: "invite", label: "Invite a teammate", group: "Actions" },
  { id: "profile", label: "Profile" },
]

function optionNames() {
  return screen.getAllByRole("option").map((option) => option.textContent)
}

function OpenSearch({
  onSelect = () => {},
}: {
  onSelect?: (id: string) => void
}) {
  const [open, setOpen] = useState(true)

  return (
    <GlobalSearch
      items={items}
      open={open}
      onOpenChange={setOpen}
      onSelect={onSelect}
    />
  )
}

describe("GlobalSearch trigger", () => {
  it("shows the label and the shortcut in the field variant", () => {
    render(
      <GlobalSearch
        items={items}
        open={false}
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.getByRole("button", { name: /Search…/ })).toBeInTheDocument()
    expect(screen.getByText("⌘K")).toBeInTheDocument()
  })

  it("names the icon-only trigger", () => {
    render(
      <GlobalSearch
        items={items}
        variant="icon"
        open={false}
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    expect(screen.getByRole("button", { name: "Search…" })).toBeInTheDocument()
  })

  it("opens on click", async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <GlobalSearch
        items={items}
        open={false}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
      />
    )

    await user.click(screen.getByRole("button", { name: /Search…/ }))

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })
})

describe("GlobalSearch filtering", () => {
  it("groups the items, keeping the ungrouped ones last", () => {
    render(<OpenSearch />)

    expect(screen.getByRole("group", { name: "Sections" })).toBeInTheDocument()
    expect(screen.getByRole("group", { name: "Actions" })).toBeInTheDocument()
    expect(optionNames()).toEqual([
      "Orders/orders",
      "Products",
      "Invite a teammate",
      "Profile",
    ])
  })

  it("filters on the label, ignoring case", async () => {
    const user = userEvent.setup()
    render(<OpenSearch />)

    await user.type(screen.getByRole("combobox"), "prod")

    expect(optionNames()).toEqual(["Products"])
  })

  it("filters on the group name too", async () => {
    const user = userEvent.setup()
    render(<OpenSearch />)

    await user.type(screen.getByRole("combobox"), "actions")

    expect(optionNames()).toEqual(["Invite a teammate"])
  })

  it("shows the empty label when nothing matches", async () => {
    const user = userEvent.setup()
    render(<OpenSearch />)

    await user.type(screen.getByRole("combobox"), "nothing here")

    expect(screen.queryAllByRole("option")).toHaveLength(0)
    expect(screen.getByText("Nothing found")).toBeInTheDocument()
  })
})

describe("GlobalSearch keyboard", () => {
  it("moves the active option with the arrow keys", async () => {
    const user = userEvent.setup()
    render(<OpenSearch />)

    const input = screen.getByRole("combobox")
    expect(screen.getAllByRole("option")[0]).toHaveAttribute(
      "aria-selected",
      "true"
    )
    expect(input).toHaveAttribute(
      "aria-activedescendant",
      screen.getAllByRole("option")[0].id
    )

    await user.type(input, "{ArrowDown}")

    expect(screen.getAllByRole("option")[1]).toHaveAttribute(
      "aria-selected",
      "true"
    )

    await user.type(input, "{ArrowUp}{ArrowUp}")

    expect(screen.getAllByRole("option")[3]).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  it("selects the active option on Enter and closes", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<OpenSearch onSelect={onSelect} />)

    await user.type(screen.getByRole("combobox"), "{ArrowDown}{Enter}")

    expect(onSelect).toHaveBeenCalledWith("products")
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument()
  })

  it("selects on click", async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<OpenSearch onSelect={onSelect} />)

    await user.click(screen.getByRole("option", { name: /Invite a teammate/ }))

    expect(onSelect).toHaveBeenCalledWith("invite")
  })
})

describe("GlobalSearch dialog box", () => {
  it("closes from the cross beside the input", async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <GlobalSearch
        items={items}
        open={true}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
      />
    )

    await user.click(screen.getByRole("button", { name: "Close" }))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("names the cross from the labels", () => {
    render(
      <GlobalSearch
        items={items}
        open={true}
        onOpenChange={() => {}}
        onSelect={() => {}}
        labels={{ close: "Закрыть" }}
      />
    )

    expect(screen.getByRole("button", { name: "Закрыть" })).toBeInTheDocument()
  })

  it("hangs the box below the top edge instead of centring it", () => {
    render(
      <GlobalSearch
        items={items}
        open={true}
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    const box = document.querySelector('[data-slot="global-search"]')

    expect(box?.className).toContain("top-[12vh]")
    expect(box?.className).toContain("translate-y-0")
    expect(box?.className).not.toContain("-translate-y-1/2")
  })

  it("keeps the result list one fixed height, so typing never resizes the box", () => {
    render(
      <GlobalSearch
        items={items}
        open={true}
        onOpenChange={() => {}}
        onSelect={() => {}}
      />
    )

    const list = screen.getByRole("listbox")

    expect(list.className).toContain("h-80")
    expect(list.className).not.toContain("max-h-80")
  })
})

describe("GlobalSearch hotkey", () => {
  it("opens on meta+k", () => {
    const onOpenChange = vi.fn()
    render(
      <GlobalSearch
        items={items}
        open={false}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
      />
    )

    fireEvent.keyDown(document.body, { key: "k", metaKey: true })

    expect(onOpenChange).toHaveBeenCalledWith(true)
  })

  it("closes on ctrl+k while open", () => {
    const onOpenChange = vi.fn()
    render(
      <GlobalSearch
        items={items}
        open={true}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
      />
    )

    fireEvent.keyDown(screen.getByRole("combobox"), {
      key: "k",
      ctrlKey: true,
    })

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it("ignores the hotkey while a closed search sits behind a text input", () => {
    const onOpenChange = vi.fn()
    render(
      <>
        <input aria-label="Elsewhere" />
        <GlobalSearch
          items={items}
          open={false}
          onOpenChange={onOpenChange}
          onSelect={() => {}}
        />
      </>
    )

    fireEvent.keyDown(screen.getByLabelText("Elsewhere"), {
      key: "k",
      metaKey: true,
    })

    expect(onOpenChange).not.toHaveBeenCalled()
  })

  it("stays quiet with hotkey turned off", () => {
    const onOpenChange = vi.fn()
    render(
      <GlobalSearch
        items={items}
        hotkey={false}
        open={false}
        onOpenChange={onOpenChange}
        onSelect={() => {}}
      />
    )

    fireEvent.keyDown(document.body, { key: "k", metaKey: true })

    expect(onOpenChange).not.toHaveBeenCalled()
  })
})
