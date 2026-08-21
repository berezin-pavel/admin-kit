import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"

import { PageEntity } from "./page-entity"

const sections = [
  {
    id: "details",
    fields: [{ id: "name", label: "Name", value: "Anna" }],
  },
]

describe("page entity state actions", () => {
  it("renders a Retry action inside the error state", () => {
    render(
      <PageEntity
        title="Order"
        sections={sections}
        status="error"
        stateActions={{ error: <button type="button">Retry</button> }}
      />
    )

    expect(screen.getByRole("button", { name: "Retry" })).toBeInTheDocument()
  })
})
