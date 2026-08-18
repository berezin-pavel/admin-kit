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

  const roots = Array.from(
    document.querySelectorAll<HTMLElement>("[data-gradient], [data-backdrop]")
  )

  for (const root of roots) {
    const gradientId =
      root.getAttribute("data-gradient") ??
      root.getAttribute("data-backdrop") ??
      ""
    if (gradientId.length === 0) continue

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

const HOVER_TARGETS =
  '[data-gradient] :is(button, a[href], input, textarea, [role="radio"], [role="tab"], [role="checkbox"], [role="combobox"], [role="menuitem"])'
const HOVERS_PER_ROUTE = 120

interface HoverSample {
  gradientId: string
  text: string
  ink: string
  surface: string
  stops: string[]
}

function sampleHoveredElement(el: Element): HoverSample | null {
  const probe = document.createElement("div")
  probe.style.position = "fixed"
  probe.style.top = "-9999px"
  document.body.appendChild(probe)

  const normalize = (colorString: string): string => {
    probe.style.color = ""
    probe.style.color = `color-mix(in srgb, ${colorString} 100%, transparent 0%)`
    return getComputedStyle(probe).color
  }

  try {
    const root = el.closest("[data-gradient]")
    if (!root) return null
    const style = getComputedStyle(el)
    if (style.display === "none" || style.visibility === "hidden") return null
    if (Number.parseFloat(style.opacity) === 0) return null
    const text = (el.textContent ?? "").trim()
    const placeholder = el.getAttribute("placeholder") ?? ""
    const inkSource =
      text.length > 0
        ? style.color
        : placeholder.length > 0
          ? getComputedStyle(el, "::placeholder").color
          : null
    if (!inkSource) return null

    const stops =
      getComputedStyle(root).backgroundImage.match(
        /(?:rgba?|hsla?|oklch|oklab|lab|lch|color)\([^)]*\)/gi
      ) ?? []

    return {
      gradientId: root.getAttribute("data-gradient") ?? "",
      text: (text || placeholder).slice(0, 40),
      ink: normalize(inkSource),
      surface: normalize(style.backgroundColor),
      stops: stops.map(normalize),
    }
  } finally {
    document.body.removeChild(probe)
  }
}

function parseSrgb(resolved: string): Rgba {
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
    const parts = rgbMatch[1].split(",").map((part) => Number.parseFloat(part))
    return { r: parts[0], g: parts[1], b: parts[2], a: parts.length === 4 ? parts[3] : 1 }
  }
  return { r: 0, g: 0, b: 0, a: 0 }
}

function luminance(color: Rgba): number {
  const channel = (value: number) => {
    const normalized = value / 255
    return normalized <= 0.04045
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4
  }
  return 0.2126 * channel(color.r) + 0.7152 * channel(color.g) + 0.0722 * channel(color.b)
}

function ratioOf(a: Rgba, b: Rgba): number {
  const lighter = Math.max(luminance(a), luminance(b))
  const darker = Math.min(luminance(a), luminance(b))
  return (lighter + 0.05) / (darker + 0.05)
}

function over(foreground: Rgba, background: Rgba): Rgba {
  const alpha = foreground.a
  return {
    r: foreground.r * alpha + background.r * (1 - alpha),
    g: foreground.g * alpha + background.g * (1 - alpha),
    b: foreground.b * alpha + background.b * (1 - alpha),
    a: 1,
  }
}

function worstHoverRatio(sample: HoverSample): number {
  const ink = parseSrgb(sample.ink)
  const surface = parseSrgb(sample.surface)
  const stops = sample.stops.map(parseSrgb)
  if (stops.length === 0) return Number.POSITIVE_INFINITY
  return Math.min(
    ...stops.map((stop) => {
      const backdrop = over(surface, stop)
      return ratioOf(over(ink, backdrop), backdrop)
    })
  )
}

interface HoverFailure {
  route: string
  gradientId: string
  text: string
  ratio: number
}

async function measureHovers(page: Page, route: string) {
  const failures: HoverFailure[] = []
  const targets = page.locator(HOVER_TARGETS)
  const count = Math.min(await targets.count(), HOVERS_PER_ROUTE)
  let measured = 0

  for (let index = 0; index < count; index += 1) {
    const target = targets.nth(index)
    if (!(await target.isVisible())) continue
    await target.hover({ force: true })
    const sample = await target.evaluate(sampleHoveredElement)
    if (!sample) continue
    measured += 1
    const ratio = worstHoverRatio(sample)
    if (ratio < CONTRAST_MINIMUM) {
      failures.push({
        route,
        gradientId: sample.gradientId,
        text: sample.text,
        ratio: Math.round(ratio * 100) / 100,
      })
    }
  }

  return { measured, failures }
}

const additionalRoutes = ["/palette", "/demo", "/demo/orders", "/demo/order", "/demo/sign-in"]

test("the colour converter reports black on white as 21 to 1", async ({
  page,
}) => {
  await page.goto("/preview/page-auth/gradient")
  await page.waitForLoadState("networkidle")

  const result = await measureRoute(page)

  expect(result.selfTestRatio).toBeCloseTo(21, 1)
})

test("no preview or demo route leaves text under 4.5 to 1 against its gradient", async ({
  page,
}) => {
  test.setTimeout(900_000)

  const previews = readPreviews()
  expect(previews.length).toBeGreaterThan(40)

  const routes = [
    ...previews.map((preview) => `/preview/${preview.item}/${preview.view}`),
    ...additionalRoutes,
  ]

  const allFailures: Array<GradientFailure & { route: string }> = []
  let totalMeasured = 0
  let routesWithGradients = 0

  for (const route of routes) {
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

test("hovered controls on a gradient keep their text at 4.5 to 1 in both schemes", async ({
  page,
}) => {
  test.setTimeout(900_000)

  const hoverRoutes = ["/palette", "/demo", "/demo/orders", "/preview/admin-shell/sidebar-gradient"]
  const allFailures: HoverFailure[] = []
  let totalMeasured = 0

  for (const colorScheme of ["light", "dark"] as const) {
    await page.emulateMedia({ colorScheme })
    for (const route of hoverRoutes) {
      const response = await page.goto(route)
      if (!response || response.status() === 404) continue
      await page.waitForLoadState("networkidle")
      const { measured, failures } = await measureHovers(page, `${route} (${colorScheme})`)
      totalMeasured += measured
      allFailures.push(...failures)
    }
  }

  expect(totalMeasured).toBeGreaterThan(40)
  expect(allFailures).toEqual([])
})
