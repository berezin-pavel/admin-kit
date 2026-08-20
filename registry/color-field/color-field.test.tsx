import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it } from "vitest"

import { localeRu } from "@/registry/locale-ru/locale-ru"

import { ColorField, isValidHexColor, toHexDigits } from "./color-field"

const noop = () => {}

describe("isValidHexColor", () => {
  it("accepts a lowercase hex color with a hash", () => {
    expect(isValidHexColor("#ef4444")).toBe(true)
  })

  it("accepts an uppercase hex color", () => {
    expect(isValidHexColor("#EF4444")).toBe(true)
  })

  it("rejects a value without a hash", () => {
    expect(isValidHexColor("ef4444")).toBe(false)
  })

  it("rejects a short hex value", () => {
    expect(isValidHexColor("#fff")).toBe(false)
  })

  it("rejects an incomplete value while typing", () => {
    expect(isValidHexColor("#ef44")).toBe(false)
  })

  it("rejects an empty string", () => {
    expect(isValidHexColor("")).toBe(false)
  })

  it("rejects non-hex characters", () => {
    expect(isValidHexColor("#gggggg")).toBe(false)
  })
})

describe("toHexDigits", () => {
  it("lowercases the digits", () => {
    expect(toHexDigits("EF4444")).toBe("ef4444")
  })

  it("strips a leading hash", () => {
    expect(toHexDigits("#ef4444")).toBe("ef4444")
  })

  it("strips non-hex characters", () => {
    expect(toHexDigits("ef-44#44!!")).toBe("ef4444")
  })

  it("truncates to 6 digits", () => {
    expect(toHexDigits("ef4444aaaa")).toBe("ef4444")
  })

  it("never lets an incomplete value escape as a full color", () => {
    expect(toHexDigits("ef4")).toBe("ef4")
    expect(toHexDigits("ef4").length).toBeLessThan(6)
  })
})

describe("customColorLabel", () => {
  it("defaults to the English sr-only label on the custom swatch", async () => {
    const user = userEvent.setup()
    render(<ColorField value="#336699" onChange={noop} />)

    await user.click(screen.getByRole("button"))

    expect(screen.getByText("Custom color")).toBeInTheDocument()
  })

  it("renders the passed customColorLabel on the custom swatch", async () => {
    const user = userEvent.setup()
    render(
      <ColorField
        value="#336699"
        onChange={noop}
        customColorLabel={localeRu.colorField.customColorLabel}
      />
    )

    await user.click(screen.getByRole("button"))

    expect(
      screen.getByText(localeRu.colorField.customColorLabel)
    ).toBeInTheDocument()
    expect(screen.queryByText("Custom color")).not.toBeInTheDocument()
  })
})
