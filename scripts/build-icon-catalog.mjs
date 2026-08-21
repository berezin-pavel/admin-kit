import { fileURLToPath } from "node:url"
import { readFileSync, writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import dynamicIconImports from "lucide-react/dynamicIconImports.mjs"
import tags from "lucide-static/tags.json" with { type: "json" }

const scriptDir = dirname(fileURLToPath(import.meta.url))
const outputPath = join(
  scriptDir,
  "..",
  "registry",
  "icon-field",
  "icon-catalog.ts"
)

function readLabIconPairs() {
  const dtsPath = fileURLToPath(
    import.meta.resolve("@lucide/lab/dist/lucide-lab.d.ts")
  )
  const source = readFileSync(dtsPath, "utf8")
  const pattern = /@name ([a-z0-9-]+)[\s\S]*?declare const (\w+): IconNode;/g

  const pairs = []
  for (const match of source.matchAll(pattern)) {
    pairs.push({ kebabName: match[1], exportName: match[2] })
  }
  return pairs
}

function buildLucideSources() {
  return Object.keys(dynamicIconImports)
    .sort()
    .map((name) => ({
      name,
      tags: tags[name] ?? [],
    }))
}

function buildLabSources(labPairs, lucideNames) {
  return [...labPairs]
    .sort((a, b) => a.kebabName.localeCompare(b.kebabName))
    .map(({ kebabName, exportName }) => ({
      name: lucideNames.has(kebabName) ? `${kebabName}-lab` : kebabName,
      tags: [],
      exportName,
    }))
}

function formatTags(entryTags) {
  return `[${entryTags.map((tag) => JSON.stringify(tag)).join(", ")}]`
}

function formatSource(source) {
  return `  { name: ${JSON.stringify(source.name)}, tags: ${formatTags(source.tags)} },`
}

function formatLabExportNames(labSources) {
  return labSources
    .map(
      (source) =>
        `  ${JSON.stringify(source.name)}: ${JSON.stringify(source.exportName)},`
    )
    .join("\n")
}

function generate() {
  const labPairs = readLabIconPairs()
  if (labPairs.length !== 356) {
    throw new Error(
      `Expected 356 @lucide/lab icons, found ${labPairs.length}`
    )
  }

  const lucideSources = buildLucideSources()
  const lucideNames = new Set(lucideSources.map((source) => source.name))
  const labSources = buildLabSources(labPairs, lucideNames)
  const allNames = [
    ...lucideSources.map((source) => source.name),
    ...labSources.map((source) => source.name),
  ]

  const nameLines = allNames.map((name) => `  | ${JSON.stringify(name)}`).join("\n")

  const output = `export type IconPack = "lucide" | "lab"

export interface IconCatalogEntry {
  name: string
  pack: IconPack
  tags: readonly string[]
}

interface IconCatalogSource {
  name: string
  tags: readonly string[]
}

function withPack(
  pack: IconPack,
  sources: readonly IconCatalogSource[]
): IconCatalogEntry[] {
  return sources.map((source) => ({ ...source, pack }))
}

const lucideIconSources: readonly IconCatalogSource[] = [
${lucideSources.map(formatSource).join("\n")}
]

const labIconSources: readonly IconCatalogSource[] = [
${labSources.map(formatSource).join("\n")}
]

export const iconCatalog: readonly IconCatalogEntry[] = [
  ...withPack("lucide", lucideIconSources),
  ...withPack("lab", labIconSources),
]

export type IconName =
${nameLines}

export const iconNames: readonly IconName[] = iconCatalog.map(
  (entry) => entry.name
) as readonly IconName[]

export const labIconExportNames: Readonly<Record<string, string>> = {
${formatLabExportNames(labSources)}
}
`

  writeFileSync(outputPath, output)

  const collisions =
    labPairs.length - labSources.filter((s) => !s.name.endsWith("-lab")).length
  console.log(`lucide icons: ${lucideSources.length}`)
  console.log(`lab icons: ${labSources.length}`)
  console.log(`total: ${allNames.length}`)
  console.log(
    `lucide icons with tags: ${lucideSources.filter((s) => s.tags.length > 0).length}`
  )
  console.log(
    `lab/lucide name collisions resolved with -lab suffix: ${collisions}`
  )
  console.log(`wrote ${outputPath}`)
}

generate()
