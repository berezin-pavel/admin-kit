import { afterEach, describe, expect, it, vi } from "vitest"

import {
  readCookieValue,
  readDemoCookie,
  writeDemoCookie,
} from "./demo-cookie"

afterEach(() => {
  vi.unstubAllGlobals()
})

describe("readCookieValue", () => {
  it("finds a value among several cookies", () => {
    expect(readCookieValue("a=1; theme=jade; b=2", "theme")).toBe("jade")
  })

  it("decodes the value", () => {
    expect(readCookieValue("theme=%7B%22a%22%3A1%7D", "theme")).toBe('{"a":1}')
  })

  it("does not match a cookie whose name only starts the same", () => {
    expect(readCookieValue("themes=all", "theme")).toBeUndefined()
  })

  it("returns undefined for an empty cookie header", () => {
    expect(readCookieValue("", "theme")).toBeUndefined()
  })

  it("returns undefined when the value cannot be decoded", () => {
    expect(readCookieValue("theme=%", "theme")).toBeUndefined()
  })
})

describe("readDemoCookie", () => {
  it("returns undefined while rendering on the server", () => {
    expect(readDemoCookie("theme")).toBeUndefined()
  })

  it("reads the document's cookies in the browser", () => {
    vi.stubGlobal("document", { cookie: "theme=jade" })

    expect(readDemoCookie("theme")).toBe("jade")
  })
})

describe("writeDemoCookie", () => {
  it("does nothing while rendering on the server", () => {
    expect(() => writeDemoCookie("theme", "jade")).not.toThrow()
  })

  it("encodes the value and pins the path, lifetime and same-site policy", () => {
    vi.stubGlobal("document", { cookie: "" })

    writeDemoCookie("theme", '{"a":1}')

    expect(document.cookie).toBe(
      "theme=%7B%22a%22%3A1%7D; path=/; max-age=31536000; SameSite=Lax"
    )
  })
})
