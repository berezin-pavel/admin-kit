import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { UserMenu } from "./user-menu"

const items = [{ id: "profile", label: "Profile", onSelect: () => {} }]

describe("UserMenu variant=\"icon\"", () => {
  it("exposes the label prop as the trigger's accessible name", () => {
    render(
      <UserMenu name="Alex Morgan" email="alex@example.com" items={items} />
    )

    expect(
      screen.getByRole("button", { name: "Open user menu" })
    ).toBeInTheDocument()
  })
})

describe("UserMenu variant=\"row\"", () => {
  it("renders a single trigger whose accessible name covers the person", () => {
    render(
      <UserMenu
        variant="row"
        name="Alex Morgan"
        email="alex@example.com"
        items={items}
      />
    )

    const buttons = screen.getAllByRole("button")

    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName(/Alex Morgan/)
    expect(buttons[0]).toHaveAccessibleName(/alex@example\.com/)
  })

  it("stays a single trigger without an email", () => {
    render(<UserMenu variant="row" name="Jordan Lee" items={items} />)

    const buttons = screen.getAllByRole("button")

    expect(buttons).toHaveLength(1)
    expect(buttons[0]).toHaveAccessibleName(/Jordan Lee/)
  })

  it("truncates the name and email instead of rendering them in full", () => {
    render(
      <UserMenu
        variant="row"
        name="Bartholomew Fitzgerald-Whitmore"
        email="bartholomew.fitzgerald-whitmore@example.com"
        items={items}
      />
    )

    const name = screen.getByText("Bartholomew Fitzgerald-Whitmore")
    const email = screen.getByText(
      "bartholomew.fitzgerald-whitmore@example.com"
    )

    expect(name).toHaveClass("truncate")
    expect(email).toHaveClass("truncate")
  })
})

describe("UserMenu trigger contract", () => {
  it.each(["icon", "row"] as const)(
    "marks the %s trigger with data-slot=user-menu for the shell to style",
    (variant) => {
      render(<UserMenu variant={variant} name="Alex Morgan" items={items} />)

      expect(screen.getByRole("button")).toHaveAttribute(
        "data-slot",
        "user-menu"
      )
    }
  )

  it.each(["icon", "row"] as const)(
    "draws the initials of the %s variant inside a fixed-size avatar",
    (variant) => {
      render(<UserMenu variant={variant} name="Alex Morgan" items={items} />)

      const initials = screen.getByText("AM")

      expect(initials).toHaveAttribute("data-slot", "avatar-fallback")
      expect(initials.parentElement).toHaveAttribute("data-size", "sm")
    }
  )
})
