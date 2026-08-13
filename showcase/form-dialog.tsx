import { FormDialogView } from "./form-dialog-view"
import type { ShowcaseEntry } from "./types"

export const formDialogEntry: ShowcaseEntry = {
  item: "form-dialog",
  title: "Form dialog",
  description:
    "A modal with a real form for quick edits: fields come in as children, the footer holds Cancel and Save, and Save submits an actual form element. Controlled open/onOpenChange; submitting disables both buttons, sets aria-busy and blocks closing by Escape or an outside click while the operation runs — the same guard confirm-dialog uses. For a full create/edit page reach for page-form instead.",
  views: [
    {
      id: "default",
      name: "Quick product edit",
      render: () => <FormDialogView />,
    },
    {
      id: "submitting",
      name: "Blocked while saving",
      render: () => <FormDialogView simulateSaving />,
    },
  ],
}
