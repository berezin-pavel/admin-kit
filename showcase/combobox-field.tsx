import {
  ComboboxFieldGroupedView,
  ComboboxFieldView,
} from "./combobox-field-view"
import type { ShowcaseEntry } from "./types"

export const comboboxFieldEntry: ShowcaseEntry = {
  item: "combobox-field",
  title: "Combobox field",
  description:
    "A single-select field with type-ahead search over a value/label options list, for picking one record out of hundreds — a customer, a product, a warehouse — where select-field's plain dropdown stops scaling. The visible input shows the selected option's label when closed and the typed query while searching; filterComboboxOptions matches the trimmed query as a case-insensitive substring anywhere in the label, exported and unit-tested on its own. Clearing the field (the × button, shown once something is selected) always calls onChange(\"\") — the field never holds a selection the parent doesn't know about. When any option carries a group, matching options render under their group's name as a heading and ungrouped options stay in their original order ahead of the named groups; with no groups at all the list is flat. emptyLabel (\"Nothing found\" by default) renders when a query matches nothing. Built on components/ui/combobox (Base UI's Combobox): Up/Down, Enter and Escape come from the primitive rather than hand-rolled key handling, and Enter does not submit an enclosing form while the popup is open.",
  views: [
    {
      id: "default",
      name: "Searchable list",
      render: () => <ComboboxFieldView label="Product" />,
    },
    {
      id: "grouped",
      name: "Grouped",
      render: () => <ComboboxFieldGroupedView />,
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <ComboboxFieldView label="Product" error="Select a product" />
      ),
    },
  ],
}
