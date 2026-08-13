import { describe, expect, it } from "vitest"

import { formatFileSize } from "./file-field"

describe("formatFileSize", () => {
  it("renders bytes with no decimal", () => {
    expect(formatFileSize(0)).toBe("0 B")
    expect(formatFileSize(512)).toBe("512 B")
    expect(formatFileSize(1023)).toBe("1023 B")
  })

  it("renders kilobytes with one decimal", () => {
    expect(formatFileSize(1024)).toBe("1.0 KB")
    expect(formatFileSize(1536)).toBe("1.5 KB")
  })

  it("renders megabytes with one decimal", () => {
    expect(formatFileSize(1024 * 1024)).toBe("1.0 MB")
    expect(formatFileSize(1.5 * 1024 * 1024)).toBe("1.5 MB")
  })
})
