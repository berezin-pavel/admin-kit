import { StatusBadge } from "@/registry/status-badge/status-badge"

import type { ShowcaseEntry } from "./types"

export const statusBadgeEntry: ShowcaseEntry = {
  item: "status-badge",
  title: "Status badge",
  description:
    "A badge for a record's state: an order is new or cancelled, a product is in stock or out of stock. Color is set by a separate tone prop, not derived from the text.",
  views: [
    {
      id: "neutral",
      name: "Neutral",
      render: () => <StatusBadge>New</StatusBadge>,
    },
    {
      id: "success",
      name: "Success",
      render: () => <StatusBadge tone="success">In stock</StatusBadge>,
    },
    {
      id: "warning",
      name: "Warning",
      render: () => <StatusBadge tone="warning">Running low</StatusBadge>,
    },
    {
      id: "danger",
      name: "Danger",
      render: () => <StatusBadge tone="danger">Cancelled</StatusBadge>,
    },
  ],
}
