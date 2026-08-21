import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageForm } from "./page-form"

const sections = [
  {
    id: "details",
    title: "Details",
    children: <input aria-label="Name" />,
  },
]

describe("page form state actions", () => {
  it("renders a Retry action inside the error state", () => {
    render(
      <PageForm
        title="Edit order"
        sections={sections}
        status="error"
        stateActions={{ error: <button type="button">Retry</button> }}
      />
    )

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })
})
