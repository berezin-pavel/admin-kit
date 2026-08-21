import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AdminNav, type AdminNavItem } from "./admin-nav"

const nav: readonly AdminNavItem[] = [
  { href: "/", title: "Overview" },
  { href: "/orders", title: "Orders", group: "Sales" },
  { href: "/order", title: "Order", group: "Sales" },
  { href: "/products", title: "Products", group: "Catalogue" },
]

describe("AdminNav groups", () => {
  it("writes a group heading once before its first item", () => {
    render(<AdminNav nav={nav} activeHref="/" />)
    expect(screen.getAllByText("Sales")).toHaveLength(1)
    expect(screen.getByText("Catalogue")).toBeInTheDocument()
    const items = screen.getAllByRole("link").map((link) => link.textContent)
    expect(items).toEqual(["Overview", "Orders", "Order", "Products"])
  })

  it("keeps the heading for screen readers and draws a separator when collapsed", () => {
    const { container } = render(<AdminNav nav={nav} activeHref="/" collapsed />)
    expect(screen.getByText("Sales")).toHaveClass("sr-only")
    expect(container.querySelectorAll('[aria-hidden="true"].h-px')).toHaveLength(2)
  })
})
