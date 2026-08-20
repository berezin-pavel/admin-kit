import { useState } from "react"
import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { useRadioGroupNav } from "./radio-group-nav"

function RadioGroupHarness({
  count,
  initialSelected,
}: {
  count: number
  initialSelected: number
}) {
  const [selected, setSelected] = useState(initialSelected)
  const nav = useRadioGroupNav({ count, selectedIndex: selected })

  return (
    <div role="radiogroup" aria-label="Fruits">
      {Array.from({ length: count }, (_, index) => (
        <button
          key={index}
          type="button"
          role="radio"
          aria-checked={selected === index}
          aria-label={`Option ${index}`}
          onClick={() => setSelected(index)}
          {...nav.itemProps(index)}
        />
      ))}
    </div>
  )
}

function optionsOf() {
  return screen.getAllByRole("radio")
}

describe("useRadioGroupNav tab stops", () => {
  it("gives the selected item the only tab stop", () => {
    render(<RadioGroupHarness count={4} initialSelected={2} />)

    const options = optionsOf()
    expect(options.map((option) => option.tabIndex)).toEqual([-1, -1, 0, -1])
  })

  it("falls back to the first item when nothing is selected", () => {
    render(<RadioGroupHarness count={4} initialSelected={-1} />)

    const options = optionsOf()
    expect(options.map((option) => option.tabIndex)).toEqual([0, -1, -1, -1])
  })
})

describe("useRadioGroupNav arrow navigation", () => {
  it("moves focus and the tab stop forward with ArrowRight, wrapping at the end", async () => {
    const user = userEvent.setup()
    render(<RadioGroupHarness count={3} initialSelected={0} />)

    const options = optionsOf()
    options[0].focus()

    await user.keyboard("{ArrowRight}")
    expect(options[1]).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(options[2]).toHaveFocus()

    await user.keyboard("{ArrowRight}")
    expect(options[0]).toHaveFocus()
  })

  it("moves focus backward with ArrowLeft, wrapping at the start", async () => {
    const user = userEvent.setup()
    render(<RadioGroupHarness count={3} initialSelected={0} />)

    const options = optionsOf()
    options[0].focus()

    await user.keyboard("{ArrowLeft}")
    expect(options[2]).toHaveFocus()
  })

  it("treats ArrowDown and ArrowUp the same as ArrowRight and ArrowLeft", async () => {
    const user = userEvent.setup()
    render(<RadioGroupHarness count={3} initialSelected={0} />)

    const options = optionsOf()
    options[0].focus()

    await user.keyboard("{ArrowDown}")
    expect(options[1]).toHaveFocus()

    await user.keyboard("{ArrowUp}")
    expect(options[0]).toHaveFocus()
  })

  it("jumps to the first and last item with Home and End", async () => {
    const user = userEvent.setup()
    render(<RadioGroupHarness count={5} initialSelected={0} />)

    const options = optionsOf()
    options[2].focus()

    await user.keyboard("{End}")
    expect(options[4]).toHaveFocus()

    await user.keyboard("{Home}")
    expect(options[0]).toHaveFocus()
  })
})

describe("useRadioGroupNav selection", () => {
  it("still selects with Enter or Space, same as before", async () => {
    const user = userEvent.setup()
    render(<RadioGroupHarness count={3} initialSelected={0} />)

    const options = optionsOf()
    options[0].focus()

    await user.keyboard("{ArrowRight}")
    expect(options[1]).toHaveFocus()
    expect(options[1]).toHaveAttribute("aria-checked", "false")

    await user.keyboard("{Enter}")
    expect(options[1]).toHaveAttribute("aria-checked", "true")
  })
})
