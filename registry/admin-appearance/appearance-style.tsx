import { appearanceCss } from "./appearance-css"
import { gradientPalette, type AdminAppearance, type GradientId } from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}

export function backdropThemeColors(
  gradient: GradientId
): { light: string; dark: string } | undefined {
  const entry = gradientPalette.find((candidate) => candidate.id === gradient)
  return entry ? { light: entry.softLight.from, dark: entry.softDark.from } : undefined
}

export function AppearanceThemeColor({
  gradient,
}: {
  gradient: GradientId | null | undefined
}) {
  const colors = gradient ? backdropThemeColors(gradient) : undefined
  if (!colors) {
    return null
  }
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
