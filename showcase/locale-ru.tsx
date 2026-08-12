import { LocaleRuView } from "./locale-ru-view"
import type { ShowcaseEntry } from "./types"

export const localeRuEntry: ShowcaseEntry = {
  item: "locale-ru",
  title: "Russian locale pack",
  description:
    "A dictionary of Russian strings shaped to match the label props of the kit's other items, plus the date-fns ru locale — spread a slice straight into labels, or pass dateField/dateTimeField's locale and displayFormat through. Renders nothing on its own; the view below feeds its widgetTable and dateField slices into a live table and date field so the wording is visible in place.",
  views: [
    {
      id: "table-and-date-field",
      name: "Table and date field with the Russian slice",
      render: () => <LocaleRuView />,
    },
  ],
}
