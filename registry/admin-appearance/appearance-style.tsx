import { appearanceCss, customDarkColor } from "./appearance-css"
import {
  customColorVariable,
  gradientPalette,
  isCustomColor,
  isGradientId,
  type AdminAppearance,
  type SurfaceChoice,
} from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}

const THEME_BACKGROUND = { light: "#ffffff", dark: "#0a0a0a" }

export function backdropThemeColors(
  backdrop: SurfaceChoice | null | undefined,
  vivid = false
): { light: string; dark: string } {
  if (!backdrop) {
    return THEME_BACKGROUND
  }
  if (isCustomColor(backdrop)) {
    return {
      light: backdrop.toLowerCase(),
      dark: customDarkColor(backdrop),
    }
  }
  const entry = gradientPalette.find((candidate) => candidate.id === backdrop)
  if (!entry) {
    return THEME_BACKGROUND
  }
  return vivid
    ? { light: entry.light.stops[0], dark: entry.dark.stops[0] }
    : { light: entry.softLight.stops[0], dark: entry.softDark.stops[0] }
}

function canvasBackgroundImage(
  backdrop: SurfaceChoice,
  vivid: boolean
): string | null {
  if (isCustomColor(backdrop)) {
    return `var(${customColorVariable(backdrop)})`
  }
  if (!isGradientId(backdrop)) {
    return null
  }
  return `var(--gradient-${backdrop}${vivid ? "" : "-soft"})`
}

export function AppearanceCanvas({
  backdrop,
  vivid = false,
  scheme,
}: {
  backdrop: SurfaceChoice | null | undefined
  vivid?: boolean
  scheme?: "light" | "dark"
}) {
  const colors = backdropThemeColors(backdrop, vivid)
  const backgroundImage = backdrop
    ? canvasBackgroundImage(backdrop, vivid)
    : null
  return (
    <>
      {backgroundImage && (
        <style
          dangerouslySetInnerHTML={{
            __html: `html{background-image:${backgroundImage}}body{background-color:transparent}`,
          }}
        />
      )}
      {scheme ? (
        <meta name="theme-color" content={colors[scheme]} />
      ) : (
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
      )}
    </>
  )
}
