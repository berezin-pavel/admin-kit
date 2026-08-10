import { DateFieldView } from "./date-field-view"
import type { ShowcaseEntry } from "./types"

export const dateFieldEntry: ShowcaseEntry = {
  item: "date-field",
  title: "Date field",
  description:
    "A field for picking a single date via a calendar in a popover: the value is a YYYY-MM-DD string, and an empty string means \"none selected\". Controlled, with no Date object or timezone in the props — parsing and formatting go through local date components so the value doesn't drift by a day during serialization. The trigger button, sized like the field, spells out the date, and picking a date in the calendar closes the popover right away.",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => <DateFieldView />,
    },
    {
      id: "filled",
      name: "Filled",
      render: () => <DateFieldView initialValue="2026-08-10" />,
    },
    {
      id: "label",
      name: "With a label",
      render: () => (
        <DateFieldView label="Delivery date" initialValue="2026-08-14" />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <DateFieldView
          label="Delivery date"
          initialValue="2026-08-14"
          disabled
        />
      ),
    },
  ],
}
