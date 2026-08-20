import { appearanceCss, customDarkColor } from "./appearance-css"
import {
  CUSTOM_COLOR_ANGLE,
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
    const light = backdrop.gradient.toLowerCase()
    const dark = customDarkColor(backdrop.gradient)
    if (!backdrop.soft) {
      return { light, dark }
    }
    return {
      light: softStops(customColorStops(backdrop.gradient), "light").stops[0],
      dark: softStops(
        { angle: CUSTOM_COLOR_ANGLE, stops: [dark, dark, dark] },
        "dark"
      ).stops[0],
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
    const variable = customColorVariable(backdrop.gradient)
    return `var(${variable}${backdrop.soft ? "-soft" : ""})`
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
