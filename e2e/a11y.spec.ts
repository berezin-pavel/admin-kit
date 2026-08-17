import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

import AxeBuilder from "@axe-core/playwright"
import { expect, test } from "@playwright/test"

const showcaseDir = join(import.meta.dirname, "..", "showcase")

function readPreviews() {
  const previews: { item: string; view: string }[] = []

  for (const file of readdirSync(showcaseDir)) {
    if (!file.endsWith(".tsx") || file.endsWith("-view.tsx")) continue

    const source = readFileSync(join(showcaseDir, file), "utf8")
    const item = source.match(/\bitem:\s*"([a-z0-9-]+)"/)?.[1]
    if (!item) continue

    for (const match of source.matchAll(/\bid:\s*"([a-z0-9-]+)",\s*\n\s*name:/g)) {
      previews.push({ item, view: match[1] })
    }
  }

  return previews
}

const additionalRoutes = ["/demo/appearance"]

test("no showcase preview or demo route has a WCAG A or AA violation", async ({
  page,
}) => {
  test.setTimeout(900_000)

  const previews = readPreviews()
  expect(previews.length).toBeGreaterThan(40)

  const routes = [
    ...previews.map((preview) => ({
      path: `/preview/${preview.item}/${preview.view}`,
      label: `${preview.item}/${preview.view}`,
    })),
    ...additionalRoutes.map((path) => ({ path, label: path })),
  ]

  const byRule = new Map<string, { count: number; where: Set<string> }>()

  for (const route of routes) {
    await page.goto(route.path)
    await page.waitForLoadState("networkidle")

    const { violations } = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze()

    for (const violation of violations) {
      const entry = byRule.get(violation.id) ?? { count: 0, where: new Set() }
      entry.count += violation.nodes.length
      if (entry.where.size < 5) {
        entry.where.add(route.label)
      }
      byRule.set(violation.id, entry)
    }
  }

  const summary = [...byRule.entries()]
    .sort((a, b) => b[1].count - a[1].count)
    .map(
      ([rule, entry]) =>
        `${rule}: ${entry.count} nodes, e.g. ${[...entry.where].join(", ")}`
    )

  expect(summary).toEqual([])
})
