import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

import type { ShowcaseEntry } from "./types"

interface OrderRow extends Record<string, React.ReactNode> {
  number: string
  customer: string
  total: string
}

const columns: readonly WidgetTableColumn<OrderRow>[] = [
  { key: "number", title: "Number" },
  { key: "customer", title: "Customer" },
  { key: "total", title: "Amount", align: "right" },
]

const rows: readonly OrderRow[] = [
  { number: "1043", customer: "Bennett A.", total: "$4,200" },
  { number: "1042", customer: "Peters S.", total: "$1,750" },
  { number: "1041", customer: "Sanders M.", total: "$12,400" },
]

export const widgetTableEntry: ShowcaseEntry = {
  item: "widget-table",
  title: "Table widget",
  description:
    "A table with a title for a dashboard: columns and rows come in via props, and for an empty set of rows it renders its own state.",
  views: [
    {
      name: "Multiple rows",
      render: () => (
        <WidgetTable title="Recent orders" columns={columns} rows={rows} />
      ),
    },
    {
      name: "One row",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={rows.slice(0, 1)}
        />
      ),
    },
    {
      name: "No rows",
      render: () => (
        <WidgetTable
          title="Recent orders"
          columns={columns}
          rows={[]}
          empty={
            <p className="py-8 text-center text-sm text-muted-foreground">
              No orders yet
            </p>
          }
        />
      ),
    },
  ],
}
