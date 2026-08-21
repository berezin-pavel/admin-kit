import { fileURLToPath } from "node:url"
import { writeFileSync } from "node:fs"
import { dirname, join } from "node:path"

import iconNodes from "lucide-static/icon-nodes.json" with { type: "json" }
import tags from "lucide-static/tags.json" with { type: "json" }
import * as lucideLab from "@lucide/lab"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const registryDir = join(scriptDir, "..", "registry", "icon-field")
const catalogPath = join(registryDir, "icon-catalog.ts")
const nodesPath = join(registryDir, "icon-nodes.ts")

function camelToKebab(name) {
  return name
    .replace(/([A-Z])/g, "-$1")
    .replace(/([a-zA-Z])([0-9])/g, "$1-$2")
    .toLowerCase()
}

function stripKeyAttr(node) {
  return node.map(([element, attrs]) => [
    element,
    Object.fromEntries(
      Object.entries(attrs).filter(([attrName]) => attrName !== "key")
    ),
  ])
}

function buildLucideSources() {
  return Object.keys(iconNodes)
    .sort()
    .map((name) => ({
      name,
      tags: tags[name] ?? [],
      node: stripKeyAttr(iconNodes[name]),
    }))
}

function buildLabSources(lucideNames) {
  const entries = Object.entries(lucideLab).filter(([, value]) =>
    Array.isArray(value)
  )

  return entries
    .map(([exportName, node]) => {
      const kebabName = camelToKebab(exportName)
      const name = lucideNames.has(kebabName) ? `${kebabName}-lab` : kebabName
      return { name, tags: [], node: stripKeyAttr(node) }
    })
    .sort((a, b) => a.name.localeCompare(b.name))
}

function formatTags(entryTags) {
  return `[${entryTags.map((tag) => JSON.stringify(tag)).join(", ")}]`
}

function formatSource(source) {
  return `  { name: ${JSON.stringify(source.name)}, tags: ${formatTags(source.tags)} },`
}

function generate() {
  const lucideSources = buildLucideSources()
  const lucideNames = new Set(lucideSources.map((source) => source.name))
  const labSources = buildLabSources(lucideNames)

  if (labSources.length !== 356) {
    throw new Error(
      `Expected 356 @lucide/lab icons, found ${labSources.length}`
    )
  }

  const allSources = [...lucideSources, ...labSources]
  const nameLines = allSources
    .map((source) => `  | ${JSON.stringify(source.name)}`)
    .join("\n")

  const catalogOutput = `export type IconPack = "lucide" | "lab"

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

const iconNameSet: ReadonlySet<string> = new Set(iconNames)

export function isIconName(value: string): value is IconName {
  return iconNameSet.has(value)
}
`

  const nodesRecord = {}
  for (const source of allSources) {
    nodesRecord[source.name] = source.node
  }
  const nodesJson = JSON.stringify(nodesRecord)
  const nodesLiteral = JSON.stringify(nodesJson)

  const nodesOutput = `import type { IconNode } from "lucide-react"

export const iconNodesJson: string = ${nodesLiteral}

export function parseIconNodes(): Readonly<Record<string, IconNode>> {
  return JSON.parse(iconNodesJson)
}
`

  writeFileSync(catalogPath, catalogOutput)
  writeFileSync(nodesPath, nodesOutput)

  console.log(`lucide icons: ${lucideSources.length}`)
  console.log(`lab icons: ${labSources.length}`)
  console.log(`total: ${allSources.length}`)
  console.log(
    `lab/lucide name collisions resolved with -lab suffix: ${
      labSources.filter((s) => s.name.endsWith("-lab")).length
    }`
  )
  console.log(`wrote ${catalogPath}`)
  console.log(`wrote ${nodesPath}`)
}

generate()
