import { appearanceCss } from "./appearance-css"
import { gradientPalette, type AdminAppearance, type GradientId } from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}

const THEME_BACKGROUND = { light: "#ffffff", dark: "#0a0a0a" }

export function backdropThemeColors(
  gradient: GradientId | null | undefined
): { light: string; dark: string } {
  const entry = gradientPalette.find((candidate) => candidate.id === gradient)
  return entry
    ? { light: entry.softLight.stops[0], dark: entry.softDark.stops[0] }
    : THEME_BACKGROUND
}

export function AppearanceThemeColor({
  gradient,
}: {
  gradient: GradientId | null | undefined
}) {
  const colors = backdropThemeColors(gradient)
  return (
    <>
      <meta
        name="theme-color"
        media="(prefers-color-scheme: light)"
        content={colors.light}
      />
      <meta
        name="theme-color"
        media="(prefers-color-scheme: dark)"
        content={colors.dark}
      />
    </>
  )
}
