import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"
import { describe, expect, it } from "vitest"

interface RegistryItem {
  name: string
  registryDependencies?: readonly string[]
  files: readonly { path: string }[]
}

const root = join(import.meta.dirname, "..")
const registry = JSON.parse(readFileSync(join(root, "registry.json"), "utf-8"))
const items: readonly RegistryItem[] = registry.items

const KIT_PREFIX = "berezin-pavel/admin-kit/"

const bareDependencies = new Set(
  items
    .flatMap((item) => item.registryDependencies ?? [])
    .filter((dependency) => !dependency.startsWith(KIT_PREFIX))
)

const kitDependencies = new Set(
  items
    .flatMap((item) => item.registryDependencies ?? [])
    .filter((dependency) => dependency.startsWith(KIT_PREFIX))
    .map((dependency) => dependency.slice(KIT_PREFIX.length))
)

const uiPrimitives = new Set(
  readdirSync(join(root, "components/ui"))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.replace(/\.tsx$/, ""))
)

const itemNames = new Set(items.map((item) => item.name))

describe("registry and components/ui stay in sync", () => {
  it("every primitive in components/ui has a dependent registry item", () => {
    const orphans = [...uiPrimitives].filter(
      (primitive) => !bareDependencies.has(primitive)
    )
    expect(orphans).toEqual([])
  })

  it("every bare registryDependency has its primitive in components/ui", () => {
    const missing = [...bareDependencies].filter(
      (dependency) => !uiPrimitives.has(dependency)
    )
    expect(missing).toEqual([])
  })

  it("every kit-namespaced registryDependency points at an existing item", () => {
    const missing = [...kitDependencies].filter((name) => !itemNames.has(name))
    expect(missing).toEqual([])
  })

  it("every registered file exists on disk", () => {
    const missing = items
      .flatMap((item) => item.files)
      .map((file) => file.path)
      .filter((path) => {
        try {
          readFileSync(join(root, path))
          return false
        } catch {
          return true
        }
      })
    expect(missing).toEqual([])
  })
})
