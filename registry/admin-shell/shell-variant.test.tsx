import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AdminShell, type AdminNavItem } from "./admin-shell"

const nav: readonly AdminNavItem[] = [{ href: "/", title: "Overview" }]

describe("admin-shell variant", () => {
  it("draws the card look by default and marks the root with it", () => {
    const { container } = render(
      <AdminShell appName="My Store" nav={nav} activeHref="/" />
    )
    const root = container.firstElementChild

    expect(root).toHaveAttribute("data-variant", "card")
    expect(root?.className).toContain("p-2")
    expect(container.querySelector("aside")?.className).toContain("rounded-xl")
  })

  it("glues the sidebar to the edge and hangs a header bar above it when flush", () => {
    const { container } = render(
      <AdminShell appName="My Store" nav={nav} activeHref="/" variant="flush" />
    )
    const root = container.firstElementChild
    const header = container.querySelector('[data-slot="admin-header"]')
    const aside = container.querySelector("aside")

    expect(root).toHaveAttribute("data-variant", "flush")
    expect(root?.className).not.toContain("p-2")
    expect(header).toBeTruthy()
    expect(header?.textContent).toContain("My Store")
    expect(header?.compareDocumentPosition(aside!)).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING
    )
    expect(aside?.className).not.toContain("rounded-xl")
    expect(aside?.className).toContain("border-r")
  })

  it("keeps the brand row inside the sidebar when the flush layout has no header", () => {
    const { container } = render(
      <AdminShell
        appName="My Store"
        nav={nav}
        activeHref="/"
        variant="flush"
        header={false}
      />
    )
    const aside = container.querySelector("aside")

    expect(container.querySelector('[data-slot="admin-header"]')).toBeNull()
    expect(aside?.textContent).toContain("My Store")
  })

  it("leaves the brand out of the sidebar once the flush header carries it", () => {
    const { container } = render(
      <AdminShell appName="My Store" nav={nav} activeHref="/" variant="flush" />
    )

    expect(container.querySelector("aside")?.textContent).not.toContain(
      "My Store"
    )
  })
})
