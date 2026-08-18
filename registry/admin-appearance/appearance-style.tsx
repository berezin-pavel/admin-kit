import { appearanceCss } from "./appearance-css"
import type { AdminAppearance } from "./appearance-palette"

export function AppearanceStyle({ value }: { value: AdminAppearance }) {
  return <style dangerouslySetInnerHTML={{ __html: appearanceCss(value) }} />
}
