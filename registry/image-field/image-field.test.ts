import { describe, expect, it } from "vitest"

import {
  formatUploadSpeed,
  limitImageFieldFiles,
  moveImageFieldItem,
} from "./image-field"

const imageFile = (name: string) =>
  new File(["x"], name, { type: "image/png" })

describe("moveImageFieldItem", () => {
  const items = ["a", "b", "c", "d"] as const

  it("moves an item forward", () => {
    expect(moveImageFieldItem(items, 0, 2)).toEqual(["b", "c", "a", "d"])
  })

  it("moves an item backward", () => {
    expect(moveImageFieldItem(items, 3, 1)).toEqual(["a", "d", "b", "c"])
  })

  it("returns the same array when the move changes nothing", () => {
    expect(moveImageFieldItem(items, 2, 2)).toBe(items)
  })

  it("returns the same array for an index outside the list", () => {
    expect(moveImageFieldItem(items, 0, 4)).toBe(items)
    expect(moveImageFieldItem(items, -1, 0)).toBe(items)
  })
})

describe("limitImageFieldFiles", () => {
  it("drops everything that is not an image", () => {
    const files = [
      imageFile("a.png"),
      new File(["x"], "notes.txt", { type: "text/plain" }),
    ]

    expect(limitImageFieldFiles(files, 0, true).map((file) => file.name)).toEqual(
      ["a.png"]
    )
  })

  it("keeps a single file when multiple is off", () => {
    const files = [imageFile("a.png"), imageFile("b.png")]

    expect(limitImageFieldFiles(files, 0, false)).toHaveLength(1)
  })

  it("trims the selection to the remaining room", () => {
    const files = [imageFile("a.png"), imageFile("b.png"), imageFile("c.png")]

    expect(limitImageFieldFiles(files, 2, true, 4)).toHaveLength(2)
  })

  it("takes nothing once the cap is reached", () => {
    expect(limitImageFieldFiles([imageFile("a.png")], 3, true, 3)).toHaveLength(
      0
    )
  })
})

describe("formatUploadSpeed", () => {
  it("keeps whole bytes per second", () => {
    expect(formatUploadSpeed(512)).toBe("512 B/s")
  })

  it("steps up to kilobytes and megabytes", () => {
    expect(formatUploadSpeed(1536)).toBe("1.5 KB/s")
    expect(formatUploadSpeed(5 * 1024 * 1024)).toBe("5.0 MB/s")
  })

  it("rounds a large value in its unit", () => {
    expect(formatUploadSpeed(700 * 1024)).toBe("700 KB/s")
  })

  it("reports nothing sensible as zero", () => {
    expect(formatUploadSpeed(0)).toBe("0 B/s")
    expect(formatUploadSpeed(Number.NaN)).toBe("0 B/s")
  })
})
