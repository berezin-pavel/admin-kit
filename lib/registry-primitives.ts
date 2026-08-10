import { readFileSync } from "node:fs"
import path from "node:path"

const ADMIN_KIT_PREFIX = "berezin-pavel/admin-kit/"

interface RegistryItem {
  name: string
  title: string
  registryDependencies?: string[]
}

interface Registry {
  items: RegistryItem[]
}

export interface RequiredPrimitive {
  name: string
  requiredBy: readonly string[]
}

export function getRequiredPrimitives(): readonly RequiredPrimitive[] {
  const registryPath = path.join(process.cwd(), "registry.json")
  const registry = JSON.parse(readFileSync(registryPath, "utf8")) as Registry

  const requiredBy = new Map<string, Set<string>>()

  for (const item of registry.items) {
    for (const dependency of item.registryDependencies ?? []) {
      if (dependency.startsWith(ADMIN_KIT_PREFIX)) {
        continue
      }

      const dependents = requiredBy.get(dependency) ?? new Set<string>()
      dependents.add(item.title)
      requiredBy.set(dependency, dependents)
    }
  }

  return Array.from(requiredBy.entries())
    .map(([name, dependents]) => ({
      name,
      requiredBy: Array.from(dependents).sort((a, b) =>
        a.localeCompare(b, "ru")
      ),
    }))
    .sort((a, b) => a.name.localeCompare(b.name))
}
