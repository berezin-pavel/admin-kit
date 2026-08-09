import { LayoutDashboard, ShoppingCart } from "lucide-react"
import Link from "next/link"

import {
  AdminShell,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "@/registry/admin-shell/admin-shell"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

import type { ShowcaseEntry } from "./types"

const nav: readonly AdminNavItem[] = [
  { href: "/", title: "Overview", icon: LayoutDashboard },
  { href: "/orders", title: "Orders", icon: ShoppingCart },
  { href: "/users", title: "Users" },
]

const renderNextLink: AdminNavLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <Link href={href} className={className}>
    {children}
  </Link>
)

interface OrderRow {
  number: string
  customer: string
  total: string
}

const orderColumns: readonly WidgetTableColumn<OrderRow>[] = [
  { id: "number", title: "Number", cell: (row) => row.number },
  { id: "customer", title: "Customer", cell: (row) => row.customer },
  { id: "total", title: "Amount", align: "right", cell: (row) => row.total },
]

const orderRows: readonly OrderRow[] = [
  { number: "1043", customer: "Bennett A.", total: "$4,200" },
  { number: "1042", customer: "Peters S.", total: "$1,750" },
  { number: "1041", customer: "Sanders M.", total: "$12,400" },
]

export const adminShellEntry: ShowcaseEntry = {
  item: "admin-shell",
  title: "Admin shell",
  description:
    "The persistent frame of the admin panel: an optional header, a side navigation, and a work area. On a wide screen it's a sidebar with the app name; on a narrow one it's a strip of icons and a burger that opens a panel with labels. The header prop can remove the header entirely: on a narrow screen without a header, the burger moves to the top of the icon strip. Nav items and the active section are set by props, and the link renderer can be swapped for your own router.",
  views: [
    {
      id: "empty",
      name: "With an empty work area",
      render: () => (
        <AdminShell appName="My Store" nav={nav} activeHref="/" />
      ),
    },
    {
      id: "with-content",
      name: "With content in the work area",
      render: () => (
        <AdminShell appName="My Store" nav={nav} activeHref="/orders">
          <div className="text-sm text-muted-foreground">
            Widgets go here.
          </div>
        </AdminShell>
      ),
    },
    {
      id: "no-header",
      name: "Without a header",
      render: () => (
        <AdminShell
          appName="My Store"
          nav={nav}
          activeHref="/orders"
          header={false}
        >
          <div className="grid gap-4 sm:grid-cols-3">
            <WidgetMetric
              title="Orders"
              value="312"
              trend={{ direction: "up", value: "+12%" }}
            />
            <WidgetMetric title="Revenue" value="$84,200" hint="today" />
            <WidgetMetric title="Average order" value="$640" />
          </div>
          <div className="mt-4">
            <WidgetTable
              title="Recent orders"
              columns={orderColumns}
              rows={orderRows}
            />
          </div>
        </AdminShell>
      ),
    },
    {
      id: "next-link",
      name: "With link rendering through next/link",
      render: () => (
        <AdminShell
          appName="My Store"
          nav={nav}
          activeHref="/orders"
          renderLink={renderNextLink}
        />
      ),
    },
  ],
}
