import { readFileSync, readdirSync } from "node:fs"
import { join } from "node:path"

import { expect, test, type Page } from "@playwright/test"

const showcaseDir = join(import.meta.dirname, "..", "showcase")

const CONTRAST_MINIMUM = 4.5
const MINIMUM_GRADIENT_ROUTES = 12

interface Rgba {
  r: number
  g: number
  b: number
  a: number
}

interface GradientFailure {
  gradientId: string
  element: string
  text: string
  inkColor: string
  stopColor: string
  ratio: number
}

interface GradientContrastResult {
  selfTestRatio: number
  gradientCount: number
  measuredCount: number
  failures: GradientFailure[]
}

function readPreviews() {
  const previews: { item: string; view: string }[] = []

  for (const file of readdirSync(showcaseDir)) {
    if (!file.endsWith(".tsx") || file.endsWith("-view.tsx")) continue

    const source = readFileSync(join(showcaseDir, file), "utf8")

    const itemMatches = [...source.matchAll(/\bitem:\s*"([a-z0-9-]+)"/g)].map(
      (match) => ({ item: match[1], index: match.index ?? 0 })
    )
    if (itemMatches.length === 0) continue

    for (const match of source.matchAll(
      /\bid:\s*"([a-z0-9-]+)",\s*name:/g
    )) {
      const position = match.index ?? 0
      const owningItem = [...itemMatches]
        .reverse()
        .find((candidate) => candidate.index < position)
      if (!owningItem) continue

      previews.push({ item: owningItem.item, view: match[1] })
    }
  }

  return previews
}

function measureGradientContrast(minimumRatio: number): GradientContrastResult {
  const probe = document.createElement("div")
  probe.style.position = "fixed"
  probe.style.top = "-9999px"
  document.body.appendChild(probe)

  function toRgba(colorString: string): Rgba {
    probe.style.color = ""
    probe.style.color = `color-mix(in srgb, ${colorString} 100%, transparent 0%)`
    const resolved = getComputedStyle(probe).color

    const spaceMatch = resolved.match(
      /color\(srgb\s+([-\d.]+)\s+([-\d.]+)\s+([-\d.]+)(?:\s*\/\s*([-\d.]+))?\)/
    )
    if (spaceMatch) {
      return {
        r: Number.parseFloat(spaceMatch[1]) * 255,
        g: Number.parseFloat(spaceMatch[2]) * 255,
        b: Number.parseFloat(spaceMatch[3]) * 255,
        a: spaceMatch[4] === undefined ? 1 : Number.parseFloat(spaceMatch[4]),
      }
    }

    const rgbMatch = resolved.match(/rgba?\(([^)]+)\)/)
    if (rgbMatch) {
      const parts = rgbMatch[1]
        .split(",")
        .map((part) => Number.parseFloat(part))
      return {
        r: parts[0],
        g: parts[1],
        b: parts[2],
        a: parts.length === 4 ? parts[3] : 1,
      }
    }

    return { r: 0, g: 0, b: 0, a: 0 }
  }

  function relativeLuminance(color: Rgba): number {
    const channel = (value: number) => {
      const normalized = value / 255
      return normalized <= 0.04045
        ? normalized / 12.92
        : ((normalized + 0.055) / 1.055) ** 2.4
    }
    return (
      0.2126 * channel(color.r) +
      0.7152 * channel(color.g) +
      0.0722 * channel(color.b)
    )
  }

  function contrastRatio(a: Rgba, b: Rgba): number {
    const lumA = relativeLuminance(a)
    const lumB = relativeLuminance(b)
    const lighter = Math.max(lumA, lumB)
    const darker = Math.min(lumA, lumB)
    return (lighter + 0.05) / (darker + 0.05)
  }

  function compositeOver(foreground: Rgba, background: Rgba): Rgba {
    const alpha = foreground.a
    return {
      r: foreground.r * alpha + background.r * (1 - alpha),
      g: foreground.g * alpha + background.g * (1 - alpha),
      b: foreground.b * alpha + background.b * (1 - alpha),
      a: 1,
    }
  }

  function extractColorFunctions(value: string): string[] {
    return (
      value.match(/(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^)]*\)/gi) ??
      []
    )
  }

  function isClippedToNothing(el: Element, style: CSSStyleDeclaration): boolean {
    if (
      style.overflow !== "hidden" &&
      style.overflowX !== "hidden" &&
      style.overflowY !== "hidden"
    ) {
      return false
    }
    const rect = el.getBoundingClientRect()
    return rect.width <= 1 && rect.height <= 1
  }

  function isVisible(el: Element): boolean {
    const style = getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden") {
      return false
    }
    if (Number.parseFloat(style.opacity) === 0) return false
    return !isClippedToNothing(el, style)
  }

  function inkColorOf(el: Element): Rgba | null {
    const tag = el.tagName.toLowerCase()
    const style = getComputedStyle(el)
    const raw =
      tag === "tspan" || tag === "text"
        ? style.getPropertyValue("fill")
        : style.getPropertyValue("color")
    if (!raw || raw === "none") return null
    return toRgba(raw)
  }

  function describeElement(el: Element, text: string): string {
    const tag = el.tagName.toLowerCase()
    const className = el.getAttribute("class")
    const label = className
      ? `${tag}.${className.trim().split(/\s+/).slice(0, 2).join(".")}`
      : tag
    return `${label} "${text}"`
  }

  const selfTestRatio = contrastRatio(toRgba("black"), toRgba("white"))

  const failures: GradientFailure[] = []
  let measuredCount = 0
  let gradientCount = 0

  const roots = Array.from(document.querySelectorAll("*")).filter(
    (el): el is HTMLElement =>
      el instanceof HTMLElement &&
      el.style.backgroundImage.includes("var(--gradient-")
  )

  for (const root of roots) {
    const idMatch = root.style.backgroundImage.match(
      /var\(--gradient-([a-z0-9-]+)\)/
    )
    if (!idMatch) continue

    const gradientId = idMatch[1]
    const computedImage = getComputedStyle(root).backgroundImage
    const stopStrings = extractColorFunctions(computedImage)
    if (stopStrings.length === 0) continue

    gradientCount += 1
    const stops = stopStrings.map(toRgba)

    const paintsItsOwnSurface = (el: Element): boolean => {
      const style = getComputedStyle(el)
      if (style.backgroundImage !== "none") return true
      return toRgba(style.backgroundColor).a > 0.05
    }

    const walk = (el: Element): void => {
      for (const child of Array.from(el.childNodes)) {
        if (child.nodeType !== Node.TEXT_NODE) continue
        const text = (child.nodeValue ?? "").trim()
        if (text.length === 0) continue
        if (!isVisible(el)) continue

        const ink = inkColorOf(el)
        if (!ink || ink.a <= 0.05) continue

        measuredCount += 1
        let worstRatio = Number.POSITIVE_INFINITY
        let worstStop = stops[0]
        for (const stop of stops) {
          const effectiveInk = ink.a < 0.999 ? compositeOver(ink, stop) : ink
          const ratio = contrastRatio(effectiveInk, stop)
          if (ratio < worstRatio) {
            worstRatio = ratio
            worstStop = stop
          }
        }

        if (worstRatio < minimumRatio) {
          failures.push({
            gradientId,
            element: describeElement(el, text),
            text: text.slice(0, 60),
            inkColor: `rgba(${ink.r.toFixed(1)}, ${ink.g.toFixed(1)}, ${ink.b.toFixed(1)}, ${ink.a.toFixed(2)})`,
            stopColor: `rgba(${worstStop.r.toFixed(1)}, ${worstStop.g.toFixed(1)}, ${worstStop.b.toFixed(1)}, ${worstStop.a.toFixed(2)})`,
            ratio: Math.round(worstRatio * 100) / 100,
          })
        }
      }

      for (const child of Array.from(el.children)) {
        if (!isVisible(child)) continue
        if (paintsItsOwnSurface(child)) continue
        walk(child)
      }
    }

    walk(root)
  }

  document.body.removeChild(probe)

  return { selfTestRatio, gradientCount, measuredCount, failures }
}

async function measureRoute(page: Page): Promise<GradientContrastResult> {
  return page.evaluate(measureGradientContrast, CONTRAST_MINIMUM)
}

test("the colour converter reports black on white as 21 to 1", async ({
  page,
}) => {
  await page.goto("/preview/page-auth/gradient")
  await page.waitForLoadState("networkidle")

  const result = await measureRoute(page)

  expect(result.selfTestRatio).toBeCloseTo(21, 1)
})

test("no showcase preview leaves text under 4.5 to 1 against its gradient backdrop", async ({
  page,
}) => {
  test.setTimeout(900_000)

  const previews = readPreviews()
  expect(previews.length).toBeGreaterThan(40)

  const allFailures: Array<GradientFailure & { route: string }> = []
  let totalMeasured = 0
  let routesWithGradients = 0

  for (const preview of previews) {
    const route = `/preview/${preview.item}/${preview.view}`
    await page.goto(route)
    await page.waitForLoadState("networkidle")

    const result = await measureRoute(page)
    expect(result.selfTestRatio).toBeCloseTo(21, 1)

    if (result.gradientCount > 0) {
      routesWithGradients += 1
      totalMeasured += result.measuredCount
      for (const failure of result.failures) {
        allFailures.push({ route, ...failure })
      }
    }
  }

  expect(routesWithGradients).toBeGreaterThanOrEqual(MINIMUM_GRADIENT_ROUTES)
  expect(totalMeasured).toBeGreaterThan(0)
  expect(allFailures).toEqual([])
})
