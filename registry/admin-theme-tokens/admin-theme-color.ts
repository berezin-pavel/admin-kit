export interface Oklch {
  l: number
  c: number
  h: number
}

const HEX_PATTERN = /^#[0-9a-f]{6}$/i

function toLinear(channel: number) {
  return channel <= 0.04045
    ? channel / 12.92
    : ((channel + 0.055) / 1.055) ** 2.4
}

function toGamma(channel: number) {
  return channel <= 0.0031308
    ? channel * 12.92
    : 1.055 * channel ** (1 / 2.4) - 0.055
}

function clampChannel(channel: number) {
  return Math.min(1, Math.max(0, channel))
}

function toLinearRgb(hex: string) {
  if (!HEX_PATTERN.test(hex)) {
    throw new Error(`Expected #rrggbb, received ${hex}`)
  }

  const value = Number.parseInt(hex.slice(1), 16)

  return {
    r: toLinear(((value >> 16) & 255) / 255),
    g: toLinear(((value >> 8) & 255) / 255),
    b: toLinear((value & 255) / 255),
  }
}

export function hexToOklch(hex: string): Oklch {
  const { r, g, b } = toLinearRgb(hex)

  const long = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b)
  const medium = Math.cbrt(
    0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b
  )
  const short = Math.cbrt(
    0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b
  )

  const l = 0.2104542553 * long + 0.793617785 * medium - 0.0040720468 * short
  const a = 1.9779984951 * long - 2.428592205 * medium + 0.4505937099 * short
  const bAxis =
    0.0259040371 * long + 0.7827717662 * medium - 0.808675766 * short

  const hue = (Math.atan2(bAxis, a) * 180) / Math.PI

  return {
    l,
    c: Math.sqrt(a * a + bAxis * bAxis),
    h: (hue + 360) % 360,
  }
}

export function oklchToHex({ l, c, h }: Oklch): string {
  const radians = (h * Math.PI) / 180
  const a = c * Math.cos(radians)
  const bAxis = c * Math.sin(radians)

  const long = (l + 0.3963377774 * a + 0.2158037573 * bAxis) ** 3
  const medium = (l - 0.1055613458 * a - 0.0638541728 * bAxis) ** 3
  const short = (l - 0.0894841775 * a - 1.291485548 * bAxis) ** 3

  const channels = [
    4.0767416621 * long - 3.3077115913 * medium + 0.2309699292 * short,
    -1.2684380046 * long + 2.6097574011 * medium - 0.3413193965 * short,
    -0.0041960863 * long - 0.7034186147 * medium + 1.707614701 * short,
  ]

  return `#${channels
    .map((channel) =>
      Math.round(clampChannel(toGamma(clampChannel(channel))) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`
}

export function formatOklch({ l, c, h }: Oklch): string {
  return `oklch(${l.toFixed(3)} ${c.toFixed(3)} ${h.toFixed(3)})`
}

export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const { r, g, b: blue } = toLinearRgb(hex)
    return 0.2126 * r + 0.7152 * g + 0.0722 * blue
  }

  const first = luminance(a)
  const second = luminance(b)
  const lighter = Math.max(first, second)
  const darker = Math.min(first, second)

  return (lighter + 0.05) / (darker + 0.05)
}
