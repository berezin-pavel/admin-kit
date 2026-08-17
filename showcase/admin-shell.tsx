import { LayoutDashboard, ShoppingCart } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  AdminShell,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "@/registry/admin-shell/admin-shell"
import type { GradientStops } from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

import { AdminShellFooterView } from "./admin-shell-footer-view"
import { GradientFrame } from "./gradient-frame"
import type { ShowcaseEntry } from "./types"

const sidebarGradientStops: GradientStops = {
  angle: 135,
  from: "#0f172a",
  to: "#4c1d95",
}

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
    "The persistent frame of the admin panel: an optional header, a side navigation, and a work area. The sidebar belongs to the wide screen and is drawn as a card — a panel with padding, rounding, and a border. On a narrow screen it is gone entirely and the burger takes over: the panel holds every section with its label and the sidebarFooter, while the brand and the account row stay on the top bar, where they are already visible. The controlled collapsed prop shrinks the sidebar on a wide screen to a strip of icons, and the sidebar toggle in the footer brings it back — no burger appears there, because a control that reopens the sidebar is already on screen. The header prop can remove the header entirely: without it a narrow screen gets a compact bar with the burger, the logo, the app name, and the account on the right. Every row of the sidebar shares one grid: the logo, the account avatar, and the nav icons sit in the same 24px box, so their centre never moves when the sidebar collapses. The top of the sidebar is a brand row — an optional logo slot before appName. Directly under it, sidebarProfile renders a full-width account row, separated from the navigation by a divider; in the icon strip it collapses to just the trigger's avatar, and on a narrow screen it moves to the right of the top bar. sidebarActions stays available alongside it for anything else that belongs next to the brand, like a notifications button. The sidebarFooter prop is a slot at the bottom of the sidebar, the icon strip, and the burger panel for a theme toggle, sidebar toggle, or build version. Nav items and the active section are set by props, and the link renderer can be swapped for your own router.",
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
      id: "with-actions",
      name: "With actions in the header",
      render: () => (
        <AdminShell
          appName="My Store"
          nav={nav}
          activeHref="/orders"
          actions={<Button size="sm">Create order</Button>}
        />
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
      name: "With router-based navigation",
      render: () => (
        <AdminShell
          appName="My Store"
          nav={nav}
          activeHref="/orders"
          renderLink={renderNextLink}
        />
      ),
    },
    {
      id: "mobile-menu-footer",
      name: "Navigation and sidebarFooter in the burger panel (open on a narrow screen)",
      render: () => (
        <AdminShellFooterView header={false}>
          <div className="text-sm text-muted-foreground">
            On a narrow screen there is no sidebar at all: the top bar keeps
            the logo, the app name, and the account, and the burger opens a
            panel with the navigation and the same sidebarFooter at the
            bottom — neither the name nor the account is repeated there.
          </div>
        </AdminShellFooterView>
      ),
    },
    {
      id: "sidebar-footer",
      name: "With a logo, an account row, and a slot at the bottom of the sidebar",
      render: () => (
        <AdminShellFooterView>
          <div className="text-sm text-muted-foreground">
            The logo sits on the brand row, sidebarProfile holds the
            account row right under it (click it to open the menu),
            sidebarActions holds an unrelated notifications button, and
            the footer holds the sidebar, theme and language toggles —
            every one of them controlled from the outside.
          </div>
        </AdminShellFooterView>
      ),
    },
    {
      id: "collapsed",
      name: "Collapsed sidebar on a wide screen",
      render: () => (
        <AdminShell
          appName="My Store"
          nav={nav}
          activeHref="/orders"
          collapsed
        >
          <div className="text-sm text-muted-foreground">
            The controlled collapsed prop shrinks the sidebar on a wide
            screen to a strip of icons.
          </div>
        </AdminShell>
      ),
    },
    {
      id: "collapsed-with-profile",
      name: "Collapsed sidebar with a logo and an account row",
      render: () => (
        <AdminShellFooterView defaultCollapsed>
          <div className="text-sm text-muted-foreground">
            Collapsed, the logo and the account row shrink to the same
            icon-strip footprint as a nav item — the account trigger still
            opens the same menu, and no burger joins them. Expand it with
            the sidebar toggle in the footer to see the full brand and
            account rows again.
          </div>
        </AdminShellFooterView>
      ),
    },
    {
      id: "sidebar-gradient",
      name: "Sidebar painted by sidebarGradient",
      render: () => (
        <GradientFrame id="midnight" stops={sidebarGradientStops}>
          <AdminShellFooterView sidebarGradient="midnight">
            <div className="text-sm text-muted-foreground">
              sidebarGradient replaces the sidebar card background and
              carries its own foreground down to the nav rows, the account
              row, and the footer toggles — the same tokens a themed
              consumer would supply, applied here through gradient-frame so
              the preview route has something to resolve them against.
            </div>
          </AdminShellFooterView>
        </GradientFrame>
      ),
    },
  ],
}
