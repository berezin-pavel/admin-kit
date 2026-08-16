import {
  PageFormErrorView,
  PageFormReadyView,
  PageFormSubmittingView,
  PageFormThreeColumnsView,
} from "./page-form-view"
import type { ShowcaseEntry } from "./types"

export const pageFormEntry: ShowcaseEntry = {
  item: "page-form",
  title: "Form page",
  description:
    "A create/edit record page: a title with a description and an actions slot, sections rendered as cards, and a footer with Cancel (ghost) and Save (default), right-aligned. The consumer lays fields out inside each section's children — the page doesn't know about text-field, select-field, or any other field, it just renders what's passed in. A section's columns prop takes over that layout for the common case: with 2 or 3 the section becomes a responsive grid and each field is one cell, so a form of twelve short fields stops being a single tall column; a field that needs the full width says so itself with col-span. submitting disables both buttons and sets aria-busy on the underlying form element without touching the fields inside; status swaps the sections for a state screen while the header stays in place, the same way page-list and page-entity do it.",
  views: [
    {
      id: "ready",
      name: "Ready, with fields wired to state",
      render: () => <PageFormReadyView />,
    },
    {
      id: "three-columns",
      name: "A section in three columns",
      render: () => <PageFormThreeColumnsView />,
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
