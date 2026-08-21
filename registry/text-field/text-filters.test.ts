import { describe, expect, it } from "vitest"

import {
  codeFilter,
  digitsFilter,
  emailFilter,
  phoneFilter,
  slugFilter,
  textFilters,
  transliterate,
} from "./text-filters"

describe("digitsFilter", () => {
  it("keeps only digits", () => {
    expect(digitsFilter.sanitize("a1b2 3")).toBe("123")
    expect(digitsFilter.inputMode).toBe("numeric")
  })
})

describe("phoneFilter", () => {
  const ru = phoneFilter("+7 (###) ###-##-##")

  it("formats digits into the mask as they are typed", () => {
    expect(ru.sanitize("9")).toBe("+7 (9")
    expect(ru.sanitize("999")).toBe("+7 (999")
    expect(ru.sanitize("9991")).toBe("+7 (999) 1")
    expect(ru.sanitize("9991234567")).toBe("+7 (999) 123-45-67")
  })

  it("swallows a typed country digit instead of doubling it", () => {
    expect(ru.sanitize("7")).toBe("+7")
    expect(ru.sanitize("+7 999 123 45 67")).toBe("+7 (999) 123-45-67")
  })

  it("drops digits beyond the mask and clears to empty", () => {
    expect(ru.sanitize("99912345678901")).toBe("+7 (999) 123-45-67")
    expect(ru.sanitize("")).toBe("")
    expect(ru.sanitize("+7 (")).toBe("+7")
    expect(ru.sanitize("+")).toBe("")
  })

  it("reports completeness once every slot is filled", () => {
    expect(ru.isComplete?.("+7 (999) 123-45-6")).toBe(false)
    expect(ru.isComplete?.("+7 (999) 123-45-67")).toBe(true)
    expect(ru.inputMode).toBe("tel")
    expect(ru.type).toBe("tel")
  })

  it("ships a generic default mask", () => {
    expect(textFilters.phone.sanitize("12345678901")).toBe("+1 (234) 567-89-01")
  })
})

describe("emailFilter", () => {
  it("lowercases, strips spaces and keeps a single @", () => {
    expect(emailFilter.sanitize(" Jane.Doe@Example.COM ")).toBe("jane.doe@example.com")
    expect(emailFilter.sanitize("a@@b@c")).toBe("a@bc")
    expect(emailFilter.isComplete?.("jane@example.com")).toBe(true)
    expect(emailFilter.isComplete?.("jane@example")).toBe(false)
  })
})

describe("slugFilter", () => {
  it("builds kebab-case from latin text", () => {
    expect(slugFilter().sanitize("  Nova  Sneakers Pro_2")).toBe("nova-sneakers-pro-2")
  })

  it("transliterates Cyrillic", () => {
    expect(transliterate("\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438")).toBe("krossovki")
    expect(slugFilter().sanitize("\u041a\u0440\u043e\u0441\u0441\u043e\u0432\u043a\u0438 Nova")).toBe("krossovki-nova")
    expect(slugFilter().sanitize("\u0429\u0443\u043a\u0430 \u0451\u0436")).toBe("schuka-ezh")
  })

  it("takes a custom table", () => {
    expect(slugFilter({ "\u0436": "j" }).sanitize("\u0436\u0443\u043a")).toBe("j")
  })

  it("keeps a trailing dash while typing", () => {
    expect(slugFilter().sanitize("nova-")).toBe("nova-")
    expect(slugFilter().isComplete?.("nova-")).toBe(false)
    expect(slugFilter().isComplete?.("nova-sneakers")).toBe(true)
  })
})

describe("codeFilter", () => {
  it("uppercases and keeps letters, digits and dashes", () => {
    expect(codeFilter.sanitize("ftw snk_001!")).toBe("FTW-SNK-001")
  })
})
