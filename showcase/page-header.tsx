import { Button } from "@/components/ui/button"
import { PageHeader } from "@/registry/page-header/page-header"

import type { ShowcaseEntry } from "./types"

export const pageHeaderEntry: ShowcaseEntry = {
  item: "page-header",
  title: "Section header",
  description:
    "A page title, an optional description below it, and an actions slot on the right. A structural page part, not a dashboard widget.",
  views: [
    {
      id: "title-only",
      name: "Title only",
      render: () => <PageHeader title="Orders" />,
    },
    {
      id: "with-description",
      name: "With a description",
      render: () => (
        <PageHeader
          title="Orders"
          description="All store orders for the selected period"
        />
      ),
    },
    {
      id: "with-actions",
      name: "With actions",
      render: () => (
        <PageHeader
          title="Orders"
          description="All store orders for the selected period"
          actions={<Button>Create order</Button>}
        />
      ),
    },
  ],
}
