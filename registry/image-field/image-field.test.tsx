import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { useState } from "react"
import { describe, expect, it, vi } from "vitest"

import { ImageField, type ImageFieldItem } from "./image-field"

const items: readonly ImageFieldItem[] = [
  { id: "1", url: "/one.png", name: "Front" },
  { id: "2", url: "/two.png", name: "Back" },
  { id: "3", url: "/three.png" },
]

function ControlledImageField({
  initial = items,
  maxItems,
}: {
  initial?: readonly ImageFieldItem[]
  maxItems?: number
}) {
  const [value, setValue] = useState(initial)

  return (
    <ImageField
      label="Photos"
      value={value}
      onChange={setValue}
      onSelect={() => {}}
      maxItems={maxItems}
    />
  )
}

describe("ImageField", () => {
  it("names an image without a name by its position", () => {
    render(<ControlledImageField />)

    expect(screen.getByRole("img", { name: "Image 3" })).toBeInTheDocument()
  })

  it("reorders through the move buttons", async () => {
    const user = userEvent.setup()
    render(<ControlledImageField />)

    await user.click(screen.getByRole("button", { name: "Move later: Front" }))

    const images = screen.getAllByRole("img")
    expect(images.map((image) => image.getAttribute("alt"))).toEqual([
      "Back",
      "Front",
      "Image 3",
    ])
  })

  it("pins the move buttons at both ends of the list", () => {
    render(<ControlledImageField />)

    expect(
      screen.getByRole("button", { name: "Move earlier: Front" })
    ).toBeDisabled()
    expect(
      screen.getByRole("button", { name: "Move later: Image 3" })
    ).toBeDisabled()
  })

  it("removes an image straight away, with no apply step", async () => {
    const user = userEvent.setup()
    render(<ControlledImageField />)

    await user.click(screen.getByRole("button", { name: "Remove: Back" }))

    expect(screen.queryByRole("img", { name: "Back" })).not.toBeInTheDocument()
    expect(screen.getAllByRole("img")).toHaveLength(2)
  })

  it("opens the original in a new tab through a real link", () => {
    render(<ControlledImageField />)

    const link = screen.getByRole("link", { name: "Open in a new tab: Front" })
    expect(link).toHaveAttribute("href", "/one.png")
    expect(link).toHaveAttribute("target", "_blank")
  })

  it("shows the picked image in a dialog", async () => {
    const user = userEvent.setup()
    render(<ControlledImageField />)

    await user.click(screen.getByRole("button", { name: "Preview: Back" }))

    const dialog = await screen.findByRole("dialog", { name: "Back" })
    expect(dialog).toBeInTheDocument()
  })

  it("hides the drop zone once maxItems is reached", () => {
    const { unmount } = render(<ControlledImageField maxItems={3} />)

    expect(
      screen.queryByText("Drop images here or click to choose")
    ).not.toBeInTheDocument()

    unmount()
    render(<ControlledImageField initial={items.slice(0, 1)} maxItems={3} />)

    expect(
      screen.getByText("Drop images here or click to choose")
    ).toBeInTheDocument()
  })

  it("shows progress and speed while an image uploads, and hides its actions", () => {
    render(
      <ControlledImageField
        initial={[
          { id: "1", url: "/one.png", name: "Front", progress: 42, speed: "1.5 MB/s" },
        ]}
      />
    )

    expect(screen.getByRole("progressbar", { name: "Uploading: Front" })).toHaveAttribute(
      "aria-valuenow",
      "42"
    )
    expect(screen.getByText("42%")).toBeInTheDocument()
    expect(screen.getByText("1.5 MB/s")).toBeInTheDocument()
    expect(
      screen.queryByRole("button", { name: "Preview: Front" })
    ).not.toBeInTheDocument()
    expect(
      screen.getByRole("button", { name: "Remove: Front" })
    ).toBeInTheDocument()
  })

  it("shows the server's error on the failed image", () => {
    render(
      <ControlledImageField
        initial={[{ id: "1", url: "/one.png", name: "Front", error: "Upload failed" }]}
      />
    )

    expect(screen.getByText("Upload failed")).toBeInTheDocument()
    expect(
      screen.queryByRole("link", { name: "Open in a new tab: Front" })
    ).not.toBeInTheDocument()
  })

  it("steps through every image in the preview dialog", async () => {
    const user = userEvent.setup()
    render(<ControlledImageField />)

    await user.click(screen.getByRole("button", { name: "Preview: Front" }))

    expect(await screen.findByRole("dialog", { name: "Front" })).toBeInTheDocument()
    expect(screen.getByText("1 of 3")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Next image" }))
    expect(await screen.findByRole("dialog", { name: "Back" })).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Previous image" }))
    await user.click(screen.getByRole("button", { name: "Previous image" }))
    expect(
      await screen.findByRole("dialog", { name: "Image 3" })
    ).toBeInTheDocument()
  })

  it("hands picked files to onSelect without touching value", async () => {
    const user = userEvent.setup()
    const onSelect = vi.fn()
    const onChange = vi.fn()
    render(
      <ImageField
        label="Photos"
        value={[]}
        onChange={onChange}
        onSelect={onSelect}
      />
    )

    const file = new File(["x"], "front.png", { type: "image/png" })
    await user.upload(screen.getByLabelText("Photos"), file)

    expect(onSelect).toHaveBeenCalledWith([file])
    expect(onChange).not.toHaveBeenCalled()
  })
})
