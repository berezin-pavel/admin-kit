import type { IconCatalogEntry } from "./icon-catalog"

export interface IconSearchOptions {
  query: string
  keywords?: Readonly<Record<string, readonly string[]>>
}

export function normalizeIconQuery(query: string): string {
  return query
    .trim()
    .toLowerCase()
    .replace(/\u0451/g, "\u0435")
    .replace(/\s+/g, " ")
}

function splitWords(value: string): readonly string[] {
  return value.split(/[\s-]+/).filter(Boolean)
}

function hasWordPrefix(words: readonly string[], query: string): boolean {
  return words.some((word) => word.startsWith(query))
}

function scoreWord(
  entry: IconCatalogEntry,
  word: string,
  extraKeywords: readonly string[]
): number | null {
  if (entry.name === word) {
    return 0
  }

  if (hasWordPrefix(entry.name.split("-"), word)) {
    return 1
  }

  const keywordPool = [...entry.tags, ...extraKeywords]

  if (keywordPool.some((keyword) => keyword === word)) {
    return 2
  }

  if (keywordPool.some((keyword) => hasWordPrefix(splitWords(keyword), word))) {
    return 2
  }

  if (entry.name.includes(word)) {
    return 3
  }

  if (keywordPool.some((keyword) => keyword.includes(word))) {
    return 4
  }

  return null
}

export function searchIcons(
  catalog: readonly IconCatalogEntry[],
  options: IconSearchOptions
): readonly IconCatalogEntry[] {
  const normalized = normalizeIconQuery(options.query)

  if (normalized === "") {
    return catalog
  }

  const words = splitWords(normalized)
  const keywords = options.keywords ?? {}

  const scored: { entry: IconCatalogEntry; score: number }[] = []

  for (const entry of catalog) {
    const extraKeywords = (keywords[entry.name] ?? []).map((keyword) =>
      normalizeIconQuery(keyword)
    )

    let total = 0
    let matchesEveryWord = true

    for (const word of words) {
      const wordScore = scoreWord(entry, word, extraKeywords)
      if (wordScore === null) {
        matchesEveryWord = false
        break
      }
      total += wordScore
    }

    if (matchesEveryWord) {
      scored.push({ entry, score: total })
    }
  }

  scored.sort((a, b) => {
    if (a.score !== b.score) {
      return a.score - b.score
    }
    return a.entry.name.localeCompare(b.entry.name)
  })

  return scored.map((item) => item.entry)
}
