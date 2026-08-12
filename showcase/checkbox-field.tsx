import { CheckboxFieldView } from "./checkbox-field-view"
import type { ShowcaseEntry } from "./types"

export const checkboxFieldEntry: ShowcaseEntry = {
  item: "checkbox-field",
  title: "Checkbox field",
  description:
    "A boolean checkbox on components/ui/checkbox, with the label to the right of the box and hint/error rendered below the pair. checked and onChange are the whole contract — no internal state beyond what the consumer passes in.",
  views: [
    {
      id: "unchecked",
      name: "Unchecked",
      render: () => (
        <CheckboxFieldView label="Send confirmation email" />
      ),
    },
    {
      id: "checked",
      name: "Checked",
      render: () => (
        <CheckboxFieldView label="Paid" initialChecked />
      ),
    },
    {
      id: "hint",
      name: "With a hint",
      render: () => (
        <CheckboxFieldView
          label="Gift order"
          hint="Adds gift wrapping and a note card to the packing slip"
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <CheckboxFieldView
          label="I accept the terms"
          error="You must accept the terms to continue"
        />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <CheckboxFieldView label="Archived" initialChecked disabled />
      ),
    },
  ],
}
