import { appearanceCss } from "./appearance-css"
import {
  customColorStops,
  customColorVariable,
  gradientPalette,
  isCustomColor,
  softStops,
  type AdminAppearance,
  type PageBackdrop,
} from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}

const THEME_BACKGROUND = { light: "#ffffff", dark: "#0a0a0a" }

export function backdropThemeColors(
  backdrop: PageBackdrop | null | undefined
): { light: string; dark: string } {
  if (!backdrop) {
    return THEME_BACKGROUND
  }
  if (isCustomColor(backdrop.gradient)) {
    const stops = customColorStops(backdrop.gradient)
    if (!backdrop.soft) {
      const hex = backdrop.gradient.toLowerCase()
      return { light: hex, dark: hex }
    }
    return {
      light: softStops(stops, "light").stops[0],
      dark: softStops(stops, "dark").stops[0],
    }
  }
  const entry = gradientPalette.find(
    (candidate) => candidate.id === backdrop.gradient
  )
  if (!entry) {
    return THEME_BACKGROUND
  }
  return backdrop.soft
    ? { light: entry.softLight.stops[0], dark: entry.softDark.stops[0] }
    : { light: entry.light.stops[0], dark: entry.dark.stops[0] }
}

function canvasBackgroundImage(backdrop: PageBackdrop): string {
  if (isCustomColor(backdrop.gradient)) {
    const hex = backdrop.gradient.toLowerCase()
    return backdrop.soft
      ? `var(${customColorVariable(backdrop.gradient)}-soft)`
      : `linear-gradient(${customColorStops(backdrop.gradient).angle}deg, ${hex} 0%, ${hex} 100%)`
  }
  return `var(--gradient-${backdrop.gradient}${backdrop.soft ? "-soft" : ""})`
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
            __html: `html{background-image:${canvasBackgroundImage(backdrop)}}body{background-color:transparent}`,
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
