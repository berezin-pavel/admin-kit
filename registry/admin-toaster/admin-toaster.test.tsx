import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AdminToaster, notify } from "./admin-toaster"

describe("admin-toaster placement", () => {
  it("pins the viewport to the top right", () => {
    render(<AdminToaster />)
    const viewport = document.querySelector('[data-slot="toast-viewport"]')

    expect(viewport?.className).toContain("top-4")
    expect(viewport?.className).not.toContain("bottom-4")
    expect(viewport?.className).toContain("sm:right-4")
  })

  it("lets a shell with a header push the viewport below it", () => {
    render(<AdminToaster className="top-[4.5rem]" />)
    const viewport = document.querySelector('[data-slot="toast-viewport"]')

    expect(viewport?.className).toContain("top-[4.5rem]")
    expect(viewport?.className).not.toContain("top-4")
  })

  it("grows a toast downwards from the top edge", async () => {
    render(<AdminToaster />)
    notify.success("Order saved")

    const title = await screen.findByText("Order saved")
    const toast = title.closest('[data-slot="toast"]')

    expect(toast?.className).toContain("origin-top")
    expect(toast?.className).not.toContain("origin-bottom")
    expect(toast?.className).toContain("top-0")
  })
})
