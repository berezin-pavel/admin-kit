import { TextareaFieldView } from "./textarea-field-view"
import type { ShowcaseEntry } from "./types"

export const textareaFieldEntry: ShowcaseEntry = {
  item: "textarea-field",
  title: "Textarea field",
  description:
    "A multi-line text input on components/ui/textarea. The value is a string, and rows sets the visible height (4 by default). Same anatomy and aria wiring as the rest of the kit's fields.",
  views: [
    {
      id: "empty",
      name: "Empty",
      render: () => (
        <TextareaFieldView
          label="Comment"
          placeholder="Add a note for the fulfillment team"
        />
      ),
    },
    {
      id: "filled",
      name: "Filled",
      render: () => (
        <TextareaFieldView
          label="Comment"
          initialValue="Gift wrap requested, deliver after 6pm."
        />
      ),
    },
    {
      id: "hint",
      name: "With a hint",
      render: () => (
        <TextareaFieldView
          label="Internal note"
          placeholder="Visible only to the team"
          hint="Not shown to the customer, only to staff working the order"
          rows={3}
        />
      ),
    },
    {
      id: "error",
      name: "With an error",
      render: () => (
        <TextareaFieldView label="Comment" error="Comment is required" />
      ),
    },
    {
      id: "disabled",
      name: "Disabled",
      render: () => (
        <TextareaFieldView
          label="Comment"
          initialValue="Handled by support, ticket #881"
          disabled
        />
      ),
    },
  ],
}
