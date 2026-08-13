import { DateRangeFieldView } from "./date-range-field-view"
import type { ShowcaseEntry } from "./types"

export const dateRangeFieldEntry: ShowcaseEntry = {
  item: "date-range-field",
  title: "Date range field",
  description:
    "A field for picking a date range: a trigger button showing the range, and a popover with a preset column (Today, Yesterday, This week, This month, This year, Last week, Last month, Last year) next to a two-month range calendar. The value is a single \"YYYY-MM-DD..YYYY-MM-DD\" string — same reasoning as date-field, so the range survives serialization without a Date object or timezone in the props, and stays a single PageListFilter-compatible value. Picking a preset applies it and closes the popover right away; picking a range on the calendar does the same once both ends are chosen — a lone start date stays inside the popover's own state and never escapes outward.",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => <DateRangeFieldView label="Order date" />,
    },
    {
      id: "filled",
      name: "This month preset chosen",
      render: () => (
        <DateRangeFieldView
          label="Order date"
          initialValue="2026-08-01..2026-08-13"
        />
      ),
    },
    {
      id: "error",
      name: "Error",
      render: () => (
        <DateRangeFieldView
          label="Order date"
          error="Pick both a start and an end date"
        />
      ),
    },
  ],
}
