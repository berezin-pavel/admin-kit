import { DateTimeFieldView } from "./date-time-field-view"
import type { ShowcaseEntry } from "./types"

export const dateTimeFieldEntry: ShowcaseEntry = {
  item: "date-time-field",
  title: "Date and time field",
  description:
    "A field for picking a date together with a time: the value is a YYYY-MM-DDTHH:mm string with no seconds or timezone, and an empty string means \"none selected\". Controlled, structured like date-field but not dependent on it — string parsing isn't shared, and the elements are placed one by one. The popover has a time field next to the calendar: changing the date keeps the already-picked time, changing the time keeps the date, and if there's no date yet it uses today. The trigger button spells out the value, like \"August 10, 2026, 14:30\".",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => <DateTimeFieldView />,
    },
    {
      id: "filled",
      name: "Filled",
      render: () => <DateTimeFieldView initialValue="2026-08-10T14:30" />,
    },
    {
      id: "label",
      name: "With a label",
      render: () => (
        <DateTimeFieldView
          label="Pick up order"
          initialValue="2026-08-14T11:00"
        />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <DateTimeFieldView
          label="Pick up order"
          initialValue="2026-08-14T11:00"
          disabled
        />
      ),
    },
  ],
}
