import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { WidgetProgress } from "./widget-progress"

describe("widget progress with a non-positive max", () => {
  it("shows 0% instead of NaN% when max is 0", () => {
    render(<WidgetProgress title="Goal" value={5} max={0} />)

    expect(screen.getByText("0%")).toBeInTheDocument()
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
  })

  it("shows 0% instead of NaN% when max is negative", () => {
    render(<WidgetProgress title="Goal" value={5} max={-10} />)

    expect(screen.getByText("0%")).toBeInTheDocument()
    expect(screen.queryByText(/NaN/)).not.toBeInTheDocument()
  })

  it("does not place the target marker off-scale when max is 0", () => {
    render(<WidgetProgress title="Goal" value={5} max={0} target={3} />)

    const marker = document.querySelector('[aria-hidden="true"].absolute')

    expect(marker).toHaveStyle({ left: "0%" })
  })
})
