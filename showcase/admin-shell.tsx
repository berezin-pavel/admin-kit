import { LayoutDashboard, ShoppingCart } from "lucide-react"
import Link from "next/link"

import {
  AdminShell,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "@/registry/admin-shell/admin-shell"

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

export const adminShellEntry: ShowcaseEntry = {
  item: "admin-shell",
  title: "Admin shell",
  description:
    "The persistent frame of the admin panel: a header, a side navigation, and an empty work area. Nav items and the active section are set by props, and the link renderer can be swapped for your own router.",
  views: [
    {
      name: "With an empty work area",
      render: () => <AdminShell title="Admin Panel" nav={nav} activeHref="/" />,
    },
    {
      name: "With content in the work area",
      render: () => (
        <AdminShell title="Admin Panel" nav={nav} activeHref="/orders">
          <div className="text-sm text-muted-foreground">
            Widgets go here.
          </div>
        </AdminShell>
      ),
    },
    {
      name: "With link rendering through next/link",
      render: () => (
        <AdminShell
          title="Admin Panel"
          nav={nav}
          activeHref="/orders"
          renderLink={renderNextLink}
        />
      ),
    },
  ],
}
