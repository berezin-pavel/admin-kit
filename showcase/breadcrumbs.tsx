import { Breadcrumbs } from "@/registry/breadcrumbs/breadcrumbs"

import type { ShowcaseEntry } from "./types"

export const breadcrumbsEntry: ShowcaseEntry = {
  item: "breadcrumbs",
  title: "Breadcrumbs",
  description:
    "A trail of the page's ancestors, built on the breadcrumb primitive. Every item but the last renders as a link when it has an href — through renderLink when given, a plain <a> otherwise, the same pattern admin-shell uses; the last item is the current page and never links, even with an href set. An item without href in the middle renders as plain text. Server-compatible: no state, no \"use client\".",
  views: [
    {
      id: "trail",
      name: "Three-level trail, last item current",
      render: () => (
        <Breadcrumbs
          items={[
            { label: "Orders", href: "#" },
            { label: "Order #4187", href: "#" },
            { label: "Edit" },
          ]}
        />
      ),
    },
    {
      id: "unlinked-middle",
      name: "A middle item without href renders as text",
      render: () => (
        <Breadcrumbs
          items={[
            { label: "Orders", href: "#" },
            { label: "Archived" },
            { label: "Order #4187" },
          ]}
        />
      ),
    },
  ],
}
