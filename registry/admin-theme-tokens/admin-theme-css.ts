import {
  contrastRatio,
  formatOklch,
  oklchToHex,
  type Oklch,
} from "./admin-theme-color"
import {
  deriveAdminTheme,
  type AdminTheme,
  type AdminThemeGradient,
  type AdminThemeScheme,
  type AdminThemeSources,
  type GradientStops,
} from "./admin-theme-tokens"

const GRADIENT_ID_PATTERN = /^[a-z][a-z0-9-]*$/
const HEX_PATTERN = /^#[0-9a-f]{6}$/i
const NEAR_WHITE: Oklch = { l: 0.985, c: 0, h: 0 }
const NEAR_BLACK: Oklch = { l: 0.205, c: 0, h: 0 }
const VIA_POSITION_DEFAULT = 50
const VIA_POSITION_MIN = 1
const VIA_POSITION_MAX = 99

export function isGradientId(value: string): boolean {
  return GRADIENT_ID_PATTERN.test(value)
}

export function isHexColor(value: string): boolean {
  return HEX_PATTERN.test(value)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isValidColor(value: unknown): value is string {
  return typeof value === "string" && isHexColor(value)
}

function isValidGradientId(value: unknown): value is string {
  return typeof value === "string" && isGradientId(value)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value)
}

function isAdminThemeSources(value: unknown): value is AdminThemeSources {
  return (
    isRecord(value) &&
    isValidColor(value.brand) &&
    isValidColor(value.surface) &&
    isValidColor(value.success) &&
    isValidColor(value.warning) &&
    isValidColor(value.danger) &&
    isFiniteNumber(value.radius)
  )
}

function isGradientStops(value: unknown): value is GradientStops {
  return (
    isRecord(value) &&
    isFiniteNumber(value.angle) &&
    isValidColor(value.from) &&
    isValidColor(value.to) &&
    (value.via === undefined || isValidColor(value.via))
  )
}

function isAdminThemeGradient(value: unknown): value is AdminThemeGradient {
  return (
    isRecord(value) &&
    isValidGradientId(value.id) &&
    typeof value.name === "string" &&
    isGradientStops(value.light) &&
    isGradientStops(value.dark)
  )
}

export function isAdminTheme(value: unknown): value is AdminTheme {
  return (
    isRecord(value) &&
    isAdminThemeSources(value.sources) &&
    Array.isArray(value.gradients) &&
    value.gradients.every(isAdminThemeGradient)
  )
}

function stopsOf(stops: GradientStops) {
  return stops.via
    ? [stops.from, stops.via, stops.to]
    : [stops.from, stops.to]
}

function isUsable(stops: GradientStops) {
  return (
    Number.isFinite(stops.angle) &&
    stops.angle >= 0 &&
    stops.angle <= 360 &&
    (stops.viaPosition === undefined || Number.isFinite(stops.viaPosition)) &&
    stopsOf(stops).every(isHexColor)
  )
}

function clampViaPosition(viaPosition: number) {
  return Math.min(VIA_POSITION_MAX, Math.max(VIA_POSITION_MIN, viaPosition))
}

export function gradientCss(stops: GradientStops): string {
  const positions = stops.via
    ? [
        "0%",
        `${clampViaPosition(stops.viaPosition ?? VIA_POSITION_DEFAULT)}%`,
        "100%",
      ]
    : ["0%", "100%"]

  const printed = stopsOf(stops)
    .map((color, index) => `${color.toLowerCase()} ${positions[index]}`)
    .join(", ")

  return `linear-gradient(${stops.angle}deg, ${printed})`
}

export function gradientForeground(stops: GradientStops): string {
  const worstAgainst = (candidate: Oklch) =>
    Math.min(
      ...stopsOf(stops).map((stop) =>
        contrastRatio(stop, oklchToHex(candidate))
      )
    )

  return formatOklch(
    worstAgainst(NEAR_WHITE) >= worstAgainst(NEAR_BLACK)
      ? NEAR_WHITE
      : NEAR_BLACK
  )
}

function usableGradients(gradients: readonly AdminThemeGradient[]) {
  return gradients.filter(
    (gradient) =>
      isGradientId(gradient.id) &&
      isUsable(gradient.light) &&
      isUsable(gradient.dark)
  )
}

function block(
  selector: string,
  scheme: AdminThemeScheme,
  gradients: readonly AdminThemeGradient[],
  pick: (gradient: AdminThemeGradient) => GradientStops
) {
  const lines = Object.entries(scheme).map(
    ([token, value]) => `  --${token}: ${value};`
  )

  for (const gradient of gradients) {
    const stops = pick(gradient)
    lines.push(`  --gradient-${gradient.id}: ${gradientCss(stops)};`)
    lines.push(
      `  --gradient-${gradient.id}-foreground: ${gradientForeground(stops)};`
    )
  }

  return `${selector} {\n${lines.join("\n")}\n}`
}

export function adminThemeToCss(theme: AdminTheme): string {
  const { light, dark } = deriveAdminTheme(theme.sources)
  const gradients = usableGradients(theme.gradients)

  return [
    block(":root:root", light, gradients, (gradient) => gradient.light),
    block(":root:root.dark", dark, gradients, (gradient) => gradient.dark),
  ].join("\n\n")
}
