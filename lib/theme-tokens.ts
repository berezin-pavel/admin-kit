import { readFileSync } from "node:fs"
import path from "node:path"

export type ThemeTokenGroup = "core" | "chart" | "sidebar"

export interface ThemeToken {
  name: string
  light: string
  dark: string
  group: ThemeTokenGroup
}

function extractBlock(css: string, selectorPattern: string) {
  const match = css.match(new RegExp(`${selectorPattern}\\s*{([^}]*)}`))

  if (!match) {
    throw new Error(`Block ${selectorPattern} not found in globals.css`)
  }

  return match[1]
}

function parseColorTokens(block: string) {
  const tokens = new Map<string, string>()
  const pattern = /--([a-z0-9-]+):\s*([^;]+);/g

  for (const match of block.matchAll(pattern)) {
    const [, name, rawValue] = match
    const value = rawValue.trim()

    if (value.startsWith("oklch(")) {
      tokens.set(name, value)
    }
  }

  return tokens
}

function groupOf(name: string): ThemeTokenGroup {
  if (name.startsWith("chart-")) {
    return "chart"
  }

  if (name.startsWith("sidebar")) {
    return "sidebar"
  }

  return "core"
}

export function getThemeTokens(): readonly ThemeToken[] {
  const cssPath = path.join(process.cwd(), "app/globals.css")
  const css = readFileSync(cssPath, "utf8")

  const lightTokens = parseColorTokens(extractBlock(css, ":root"))
  const darkTokens = parseColorTokens(extractBlock(css, "\\.dark"))

  return Array.from(lightTokens.entries()).map(([name, light]) => ({
    name,
    light,
    dark: darkTokens.get(name) ?? light,
    group: groupOf(name),
  }))
}
