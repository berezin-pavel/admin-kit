import { ConfirmDialogView } from "./confirm-dialog-view"
import type { ShowcaseEntry } from "./types"

export const confirmDialogEntry: ShowcaseEntry = {
  item: "confirm-dialog",
  title: "Confirm dialog",
  description:
    "A confirmation modal built on top of components/ui/alert-dialog. Fully controlled: open and onOpenChange are owned by the consumer, and closing after success is the consumer's job too. tone colors the confirm button (default/danger); loading disables both buttons and blocks closing via Escape or an outside click while the operation is running.",
  views: [
    {
      id: "default",
      name: "Regular confirmation",
      render: () => (
        <ConfirmDialogView
          triggerLabel="Publish changes"
          title="Publish changes?"
          description="The product card becomes visible to customers as soon as you confirm."
          tone="default"
        />
      ),
    },
    {
      id: "danger",
      name: "Dangerous action",
      render: () => (
        <ConfirmDialogView
          triggerLabel="Delete order"
          title="Delete order #1042?"
          description="This action is irreversible: the order and its related data will be deleted with no way to recover them."
          tone="danger"
        />
      ),
    },
    {
      id: "loading",
      name: "Loading state",
      render: () => (
        <ConfirmDialogView
          triggerLabel="Delete order"
          title="Delete order #1042?"
          description="This action is irreversible: the order and its related data will be deleted with no way to recover them."
          tone="danger"
          simulateLoading
        />
      ),
    },
  ],
}
