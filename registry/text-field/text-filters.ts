export type TextFilterInputMode =
  | "text"
  | "tel"
  | "email"
  | "numeric"
  | "decimal"
  | "url"

export interface TextFilter {
  sanitize: (raw: string) => string
  isComplete?: (value: string) => boolean
  inputMode?: TextFilterInputMode
  type?: "text" | "email" | "password" | "url" | "tel"
}

const CYRILLIC_TO_LATIN: Readonly<Record<string, string>> = {
  "а": "a",
  "б": "b",
  "в": "v",
  "г": "g",
  "д": "d",
  "е": "e",
  "ё": "e",
  "ж": "zh",
  "з": "z",
  "и": "i",
  "й": "y",
  "к": "k",
  "л": "l",
  "м": "m",
  "н": "n",
  "о": "o",
  "п": "p",
  "р": "r",
  "с": "s",
  "т": "t",
  "у": "u",
  "ф": "f",
  "х": "h",
  "ц": "ts",
  "ч": "ch",
  "ш": "sh",
  "щ": "sch",
  "ъ": "",
  "ы": "y",
  "ь": "",
  "э": "e",
  "ю": "yu",
  "я": "ya",
}

export function transliterate(
  value: string,
  table: Readonly<Record<string, string>> = CYRILLIC_TO_LATIN
): string {
  return [...value.toLowerCase()]
    .map((char) => (char in table ? table[char] : char))
    .join("")
}

export const digitsFilter: TextFilter = {
  sanitize: (raw) => raw.replace(/\D/g, ""),
  inputMode: "numeric",
}

export function phoneFilter(mask: string): TextFilter {

  return {
    inputMode: "tel",
    type: "tel",
    sanitize: (raw) => {
      const digits = raw.replace(/\D/g, "").split("")
      if (digits.length === 0) {
        return ""
      }
      let output = ""
      let literalPrefix = true
      for (const char of mask) {
        if (char === "#") {
          literalPrefix = false
          const digit = digits.shift()
          if (digit === undefined) {
            break
          }
          output += digit
          if (digits.length === 0) {
            break
          }
          continue
        }
        if (literalPrefix && /\d/.test(char) && digits[0] === char) {
          digits.shift()
          if (digits.length === 0) {
            output += char
            break
          }
        }
        output += char
      }
      return output
    },
    isComplete: (value) => value.length >= mask.length,
  }
}

export const emailFilter: TextFilter = {
  inputMode: "email",
  type: "email",
  sanitize: (raw) => {
    const cleaned = raw.toLowerCase().replace(/[^a-z0-9@._+-]/g, "")
    const at = cleaned.indexOf("@")
    if (at === -1) {
      return cleaned
    }
    return cleaned.slice(0, at + 1) + cleaned.slice(at + 1).replace(/@/g, "")
  },
  isComplete: (value) => /^[a-z0-9._+-]+@[a-z0-9-]+(\.[a-z0-9-]+)+$/.test(value),
}

export function slugFilter(
  table: Readonly<Record<string, string>> = CYRILLIC_TO_LATIN
): TextFilter {
  return {
    sanitize: (raw) =>
      transliterate(raw, table)
        .replace(/[\s_]+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
        .replace(/-{2,}/g, "-")
        .replace(/^-/, ""),
    isComplete: (value) => /^[a-z0-9]+(-[a-z0-9]+)*$/.test(value),
  }
}

export const codeFilter: TextFilter = {
  sanitize: (raw) =>
    raw
      .toUpperCase()
      .replace(/[\s_]+/g, "-")
      .replace(/[^A-Z0-9-]/g, "")
      .replace(/-{2,}/g, "-"),
}

export const textFilters = {
  digits: digitsFilter,
  phone: phoneFilter("+# (###) ###-##-##"),
  email: emailFilter,
  slug: slugFilter(),
  code: codeFilter,
} as const
