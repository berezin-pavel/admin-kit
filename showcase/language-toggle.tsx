import { LanguageToggleView } from "./language-toggle-view"
import type { ShowcaseEntry } from "./types"

export const languageToggleEntry: ShowcaseEntry = {
  item: "language-toggle",
  title: "Language toggle",
  description:
    "A locale-switching button that doesn't know how the locale is stored: locale, locales, and onLocaleChange come in as props, matching theme-toggle's controlled shape. A click cycles to the next entry in locales, wrapping back to the first, and the button shows the current locale's short label next to the icon.",
  views: [
    {
      id: "en",
      name: "English selected",
      render: () => <LanguageToggleView initialLocale="en" />,
    },
    {
      id: "ru",
      name: "Russian selected",
      render: () => <LanguageToggleView initialLocale="ru" />,
    },
  ],
}
