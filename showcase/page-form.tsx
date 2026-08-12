import {
  PageFormErrorView,
  PageFormReadyView,
  PageFormSubmittingView,
} from "./page-form-view"
import type { ShowcaseEntry } from "./types"

export const pageFormEntry: ShowcaseEntry = {
  item: "page-form",
  title: "Form page",
  description:
    "A create/edit record page: a title with a description and an actions slot, sections rendered as cards, and a footer with Cancel (ghost) and Save (default), right-aligned. The consumer lays fields out inside each section's children — the page doesn't know about text-field, select-field, or any other field, it just renders what's passed in. submitting disables both buttons and sets aria-busy on the underlying form element without touching the fields inside; status swaps the sections for a state screen while the header stays in place, the same way page-list and page-entity do it.",
  views: [
    {
      id: "ready",
      name: "Ready, with fields wired to state",
      render: () => <PageFormReadyView />,
    },
    {
      id: "submitting",
      name: "Submitting",
      render: () => <PageFormSubmittingView />,
    },
    {
      id: "error",
      name: "Error state",
      render: () => <PageFormErrorView />,
    },
  ],
}
