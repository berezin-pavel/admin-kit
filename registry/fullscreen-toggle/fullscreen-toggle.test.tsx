import { act, fireEvent, render, screen } from "@testing-library/react"
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest"

import { FullscreenToggle } from "./fullscreen-toggle"

let fullscreenElement: Element | null = null

beforeEach(() => {
  fullscreenElement = null
  Object.defineProperty(document, "fullscreenEnabled", {
    configurable: true,
    get: () => true,
  })
  Object.defineProperty(document, "fullscreenElement", {
    configurable: true,
    get: () => fullscreenElement,
  })
  document.documentElement.requestFullscreen = vi.fn(() => {
    fullscreenElement = document.documentElement
    document.dispatchEvent(new Event("fullscreenchange"))
    return Promise.resolve()
  })
  document.exitFullscreen = vi.fn(() => {
    fullscreenElement = null
    document.dispatchEvent(new Event("fullscreenchange"))
    return Promise.resolve()
  })
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe("FullscreenToggle", () => {
  it("requests full screen on the document and flips to the exit state", () => {
    render(<FullscreenToggle />)

    const button = screen.getByRole("button", { name: "Enter full screen" })
    expect(button).toHaveAttribute("aria-pressed", "false")

    act(() => {
      fireEvent.click(button)
    })
    expect(document.documentElement.requestFullscreen).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole("button", { name: "Exit full screen" })
    ).toHaveAttribute("aria-pressed", "true")

    act(() => {
      fireEvent.click(screen.getByRole("button", { name: "Exit full screen" }))
    })
    expect(document.exitFullscreen).toHaveBeenCalledTimes(1)
    expect(
      screen.getByRole("button", { name: "Enter full screen" })
    ).toBeInTheDocument()
  })

  it("takes localized labels", () => {
    render(<FullscreenToggle labels={{ enter: "Full", exit: "Normal" }} />)
    expect(screen.getByRole("button", { name: "Full" })).toBeInTheDocument()
  })

  it("renders nothing where the browser forbids full screen", () => {
    Object.defineProperty(document, "fullscreenEnabled", {
      configurable: true,
      get: () => false,
    })
    const { container } = render(<FullscreenToggle />)
    expect(container).toBeEmptyDOMElement()
  })
})
