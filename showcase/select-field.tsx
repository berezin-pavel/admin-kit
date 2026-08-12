import { SelectFieldView } from "./select-field-view"
import type { ShowcaseEntry } from "./types"

export const selectFieldEntry: ShowcaseEntry = {
  item: "select-field",
  title: "Select field",
  description:
    "A single-choice select over a value/label options list, built on components/ui/select with alignItemWithTrigger={false} and align=\"start\", like the rest of the kit's selects. An empty value shows the placeholder (\"Select…\" by default).",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => <SelectFieldView label="Status" />,
    },
    {
      id: "selected",
      name: "Selected",
      render: () => (
        <SelectFieldView label="Status" initialValue="paid" />
      ),
    },
    {
      id: "hint",
      name: "With a hint",
      render: () => (
        <SelectFieldView
          label="Shipping carrier"
          options={[
            { value: "courier", label: "In-house courier" },
            { value: "post", label: "Postal service" },
            { value: "pickup", label: "Store pickup" },
          ]}
          hint="Affects the delivery estimate shown to the customer"
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <SelectFieldView label="Status" error="Select a status" />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <SelectFieldView label="Status" initialValue="delivered" disabled />
      ),
    },
  ],
}
