import { MultiSelectFieldView } from "./multi-select-field-view"
import type { ShowcaseEntry } from "./types"

export const multiSelectFieldEntry: ShowcaseEntry = {
  item: "multi-select-field",
  title: "Multi-select field",
  description:
    "Pick several options out of a fixed, searchable list — the values come from options, not free text, so it's the field for \"assign these roles\" or \"filter by these warehouses.\" Selected options show as removable chips; type to filter, Backspace on an empty input drops the last chip. maxItems disables further options once reached without hiding them, so it's clear why nothing happens.",
  views: [
    {
      id: "default",
      name: "Default",
      render: () => (
        <MultiSelectFieldView
          label="Warehouses"
          initialValue={["nyc-01", "lax-distribution", "hou-gulf"]}
        />
      ),
    },
    {
      id: "limit",
      name: "With a limit",
      render: () => (
        <MultiSelectFieldView
          label="Warehouses"
          hint="Choose up to 3 warehouses to compare"
          initialValue={["nyc-01", "lax-distribution"]}
          maxItems={3}
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <MultiSelectFieldView
          label="Warehouses"
          error="Select at least one warehouse"
        />
      ),
    },
  ],
}
