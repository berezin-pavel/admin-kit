import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { DateTimeField } from "./date-time-field"

describe("DateTimeField popover", () => {
  it("closes on Enter in the time input", () => {
    const onChange = vi.fn()
    render(
      <DateTimeField value="2026-08-21T10:30" onChange={onChange} label="When" />
    )

    fireEvent.click(screen.getByRole("button", { name: /When/ }))
    const time = screen.getByDisplayValue("10:30")
    expect(time).toBeInTheDocument()

    fireEvent.keyDown(time, { key: "Enter" })
    expect(screen.queryByDisplayValue("10:30")).not.toBeInTheDocument()
  })
})
