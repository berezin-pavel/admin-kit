import { ThemeToggleView } from "./theme-toggle-view"
import type { ShowcaseEntry } from "./types"

export const themeToggleEntry: ShowcaseEntry = {
  item: "theme-toggle",
  title: "Theme toggle",
  description:
    "A theme-switching button that doesn't know how the theme is stored: isDark and onToggle come in as props. The icon shows the state a click will switch to, and the screen-reader label changes along with it.",
  views: [
    {
      id: "light",
      name: "Light theme",
      render: () => <ThemeToggleView initialIsDark={false} />,
    },
    {
      id: "dark",
      name: "Dark theme",
      render: () => <ThemeToggleView initialIsDark={true} />,
    },
  ],
}
