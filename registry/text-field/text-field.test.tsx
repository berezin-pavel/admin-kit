import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { TextField } from "./text-field"
import { phoneFilter, textFilters } from "./text-filters"

describe("TextField filter", () => {
  it("passes the sanitized value to onChange and sets the input mode", () => {
    const onChange = vi.fn()
    render(
      <TextField
        value=""
        onChange={onChange}
        label="Phone"
        filter={phoneFilter("+7 (###) ###-##-##")}
      />
    )
    const input = screen.getByLabelText("Phone")
    expect(input).toHaveAttribute("inputmode", "tel")
    expect(input).toHaveAttribute("type", "tel")
    fireEvent.change(input, { target: { value: "9991" } })
    expect(onChange).toHaveBeenCalledWith("+7 (999) 1")
  })

  it("keeps an explicit type over the filter's", () => {
    render(
      <TextField value="" onChange={() => {}} label="Slug" type="url" filter={textFilters.slug} />
    )
    expect(screen.getByLabelText("Slug")).toHaveAttribute("type", "url")
  })

  it("leaves the value alone without a filter", () => {
    const onChange = vi.fn()
    render(<TextField value="" onChange={onChange} label="Name" />)
    fireEvent.change(screen.getByLabelText("Name"), { target: { value: " A b " } })
    expect(onChange).toHaveBeenCalledWith(" A b ")
  })
})
