export const DEMO_APPEARANCE_COOKIE = "admin-kit-demo-appearance"
export const DEMO_LOCALE_COOKIE = "admin-kit-demo-locale"

export const DEMO_COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365

export function readCookieValue(
  source: string,
  name: string
): string | undefined {
  for (const entry of source.split(";")) {
    const separator = entry.indexOf("=")
    if (separator === -1) {
      continue
    }
    if (entry.slice(0, separator).trim() !== name) {
      continue
    }
    try {
      return decodeURIComponent(entry.slice(separator + 1).trim())
    } catch {
      return undefined
    }
  }
  return undefined
}

export function readDemoCookie(name: string): string | undefined {
  if (typeof document === "undefined") {
    return undefined
  }
  return readCookieValue(document.cookie, name)
}

export function writeDemoCookie(name: string, value: string) {
  if (typeof document === "undefined") {
    return
  }
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${DEMO_COOKIE_MAX_AGE_SECONDS}; SameSite=Lax`
}

export function isServerRender(): boolean {
  return typeof document === "undefined"
}
