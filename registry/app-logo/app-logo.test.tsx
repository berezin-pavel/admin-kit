import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { AppLogo } from "./app-logo"

function Diamond({ className }: { className?: string }) {
  return <svg data-testid="diamond" className={className} />
}

describe("AppLogo", () => {
  it("falls back to the first letter of the name, upper-cased by style", () => {
    const { container } = render(<AppLogo name="admin kit" />)

    expect(container.textContent).toBe("a")
    expect(container.querySelector(".uppercase")).not.toBeNull()
  })

  it("skips leading whitespace when picking the letter", () => {
    const { container } = render(<AppLogo name="   shop" />)

    expect(container.textContent).toBe("s")
  })

  it("renders the icon instead of the letter", () => {
    const { container, getByTestId } = render(
      <AppLogo name="Admin kit" icon={Diamond} />
    )

    expect(getByTestId("diamond")).toBeInTheDocument()
    expect(container.textContent).toBe("")
  })

  it("stays out of the accessibility tree and takes a className", () => {
    const { container } = render(<AppLogo name="Admin kit" className="size-8" />)
    const mark = container.querySelector('[data-slot="app-logo"]')

    expect(mark).toHaveAttribute("aria-hidden", "true")
    expect(mark).toHaveClass("size-8")
  })
})
