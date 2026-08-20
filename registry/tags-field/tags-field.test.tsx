import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"

import { addTag, TagsField } from "./tags-field"

describe("addTag", () => {
  it("appends a trimmed tag", () => {
    expect(addTag(["a"], "  b  ")).toEqual(["a", "b"])
  })

  it("ignores an empty or whitespace-only value", () => {
    expect(addTag(["a"], "")).toEqual(["a"])
    expect(addTag(["a"], "   ")).toEqual(["a"])
  })

  it("ignores a duplicate tag", () => {
    expect(addTag(["a", "b"], "a")).toEqual(["a", "b"])
  })

  it("treats duplicates case-sensitively", () => {
    expect(addTag(["a"], "A")).toEqual(["a", "A"])
  })
})

const suggestions = ["Kitchen", "Bathroom", "Bedroom"]

function TagsFieldHarness({
  initial = [],
  onChangeSpy,
}: {
  initial?: readonly string[]
  onChangeSpy: (next: readonly string[]) => void
}) {
  const [value, setValue] = useState<readonly string[]>(initial)

  return (
    <TagsField
      label="Rooms"
      value={value}
      suggestions={suggestions}
      onChange={(next) => {
        onChangeSpy(next)
        setValue(next)
      }}
    />
  )
}

async function openWithSuggestions(query = "e") {
  const user = userEvent.setup()
  const input = screen.getByRole("combobox", { name: "Rooms" })
  await user.click(input)
  await user.type(input, query)
  return { user, input }
}

describe("TagsField combobox roles and attributes", () => {
  it("marks the input as a combobox tied to the listbox", async () => {
    render(<TagsFieldHarness onChangeSpy={vi.fn()} />)

    const { input } = await openWithSuggestions()

    expect(input).toHaveAttribute("aria-autocomplete", "list")
    expect(input).toHaveAttribute("aria-expanded", "true")
    const listbox = screen.getByRole("listbox")
    expect(input).toHaveAttribute("aria-controls", listbox.id)
    for (const option of screen.getAllByRole("option")) {
      expect(option.id).toBeTruthy()
    }
  })

  it("has no aria-activedescendant until an option is highlighted", async () => {
    render(<TagsFieldHarness onChangeSpy={vi.fn()} />)

    const { input } = await openWithSuggestions()

    expect(input).not.toHaveAttribute("aria-activedescendant")
  })
})

describe("TagsField combobox keyboard selection", () => {
  it("highlights an option with ArrowDown and selects it with Enter", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const { user, input } = await openWithSuggestions()
    await user.keyboard("{ArrowDown}")

    const options = screen.getAllByRole("option")
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id)
    expect(options[0]).toHaveAttribute("aria-selected", "true")

    await user.keyboard("{Enter}")

    expect(onChangeSpy).toHaveBeenCalledWith([options[0].textContent])
    expect(input).toHaveValue("")
  })

  it("cycles through options with repeated ArrowDown, wrapping at the end", async () => {
    render(<TagsFieldHarness onChangeSpy={vi.fn()} />)

    const { user, input } = await openWithSuggestions()
    const optionCount = screen.getAllByRole("option").length

    for (let step = 0; step < optionCount + 1; step++) {
      await user.keyboard("{ArrowDown}")
    }

    const options = screen.getAllByRole("option")
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id)
  })

  it("moves the highlight back with ArrowUp", async () => {
    render(<TagsFieldHarness onChangeSpy={vi.fn()} />)

    const { user, input } = await openWithSuggestions()
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowUp}")

    const options = screen.getAllByRole("option")
    expect(input).toHaveAttribute("aria-activedescendant", options[0].id)
  })

  it("commits the typed draft on Enter when no option is highlighted", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const { user, input } = await openWithSuggestions("Sunroom")
    await user.keyboard("{Enter}")

    expect(onChangeSpy).toHaveBeenCalledWith(["Sunroom"])
    expect(input).toHaveValue("")
  })

  it("closes the listbox with Escape without touching the tags", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const { user, input } = await openWithSuggestions()
    await user.keyboard("{ArrowDown}{Escape}")

    expect(screen.queryByRole("listbox")).not.toBeInTheDocument()
    expect(input).toHaveAttribute("aria-expanded", "false")
    expect(onChangeSpy).not.toHaveBeenCalled()
  })

  it("still commits the draft with a comma, same as before", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const { user } = await openWithSuggestions("Garage")
    await user.keyboard(",")

    expect(onChangeSpy).toHaveBeenCalledWith(["Garage"])
  })
})

describe("TagsField combobox mouse selection", () => {
  it("still selects a suggestion by clicking it", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const { user } = await openWithSuggestions()
    const option = screen.getAllByRole("option")[0]
    await user.click(option)

    expect(onChangeSpy).toHaveBeenCalledWith([option.textContent])
  })
})

describe("TagsField IME composition", () => {
  it("does not commit the draft on Enter while composing", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const user = userEvent.setup()
    const input = screen.getByRole("combobox", { name: "Rooms" })
    await user.click(input)
    await user.type(input, "Living")

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: "Enter",
        bubbles: true,
        composed: true,
        isComposing: true,
      })
    )

    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(input).toHaveValue("Living")
  })

  it("does not commit the draft on a comma while composing", async () => {
    const onChangeSpy = vi.fn<(next: readonly string[]) => void>()
    render(<TagsFieldHarness onChangeSpy={onChangeSpy} />)

    const user = userEvent.setup()
    const input = screen.getByRole("combobox", { name: "Rooms" })
    await user.click(input)
    await user.type(input, "Living")

    input.dispatchEvent(
      new KeyboardEvent("keydown", {
        key: ",",
        bubbles: true,
        composed: true,
        isComposing: true,
      })
    )

    expect(onChangeSpy).not.toHaveBeenCalled()
    expect(input).toHaveValue("Living")
  })
})
