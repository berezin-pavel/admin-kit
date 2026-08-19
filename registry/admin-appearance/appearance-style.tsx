import { appearanceCss } from "./appearance-css"
import { gradientPalette, type AdminAppearance, type PageBackdrop } from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}

const THEME_BACKGROUND = { light: "#ffffff", dark: "#0a0a0a" }

export function backdropThemeColors(
  backdrop: PageBackdrop | null | undefined
): { light: string; dark: string } {
  const entry = gradientPalette.find(
    (candidate) => candidate.id === backdrop?.gradient
  )
  if (!entry || !backdrop) {
    return THEME_BACKGROUND
  }
  return backdrop.soft
    ? { light: entry.softLight.stops[0], dark: entry.softDark.stops[0] }
    : { light: entry.light.stops[0], dark: entry.dark.stops[0] }
}

export function AppearanceCanvas({
  backdrop,
}: {
  backdrop: PageBackdrop | null | undefined
}) {
  const colors = backdropThemeColors(backdrop)
  return (
    <>
      {backdrop && (
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background-image:var(--gradient-${backdrop.gradient}${backdrop.soft ? "-soft" : ""})}body{background-color:transparent}`,
          }}
        />
      )}
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
