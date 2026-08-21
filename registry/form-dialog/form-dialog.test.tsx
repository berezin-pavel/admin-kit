import { fireEvent, render, screen } from "@testing-library/react"
import { describe, expect, it, vi } from "vitest"

import { FormDialog } from "./form-dialog"

describe("FormDialog", () => {
  it("shows the error above the footer", () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="Edit" error="Name is taken">
        <input aria-label="Name" />
      </FormDialog>
    )
    expect(screen.getByRole("alert")).toHaveTextContent("Name is taken")
  })

  it("spins the Save button while submitting", () => {
    render(
      <FormDialog open onOpenChange={() => {}} title="Edit" submitting>
        <input aria-label="Name" />
      </FormDialog>
    )
    const save = screen.getByRole("button", { name: "Save" })
    expect(save).toBeDisabled()
    expect(save).toHaveAttribute("aria-busy", "true")
    expect(save.querySelector("svg")).not.toBeNull()
  })

  it("does not submit a form that wraps the dialog in the React tree", () => {
    const outer = vi.fn((event: React.FormEvent) => event.preventDefault())
    const inner = vi.fn()
    render(
      <form onSubmit={outer}>
        <FormDialog open onOpenChange={() => {}} title="Add device" onSubmit={inner}>
          <input aria-label="Device" />
        </FormDialog>
      </form>
    )
    fireEvent.click(screen.getByRole("button", { name: "Save" }))
    expect(inner).toHaveBeenCalledTimes(1)
    expect(outer).not.toHaveBeenCalled()
  })
})
