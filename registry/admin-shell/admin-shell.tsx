import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { AdminHeader } from "./admin-header"
import { AdminMenu } from "./admin-menu"
import {
  AdminNav,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "./admin-nav"
import { AdminRail } from "./admin-rail"

export type { AdminNavItem, AdminNavLinkRenderer }

type AdminShellBaseProps = {
  appName: string
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  sidebarFooter?: ReactNode
  collapsed?: boolean
  sidebarVariant?: "flush" | "card"
  children?: ReactNode
  className?: string
}

export type AdminShellProps = AdminShellBaseProps &
  ({ header?: true; actions?: ReactNode } | { header: false; actions?: never })

export function AdminShell({
  appName,
  nav,
  activeHref,
  renderLink,
  sidebarFooter,
  collapsed = false,
  sidebarVariant = "flush",
  header = true,
  actions,
  children,
  className,
}: AdminShellProps) {
  const section = nav.find((item) => item.href === activeHref)?.title ?? appName
  const isCard = sidebarVariant === "card"

  const menu = (
    <AdminMenu appName={appName} footer={sidebarFooter}>
      <AdminNav nav={nav} activeHref={activeHref} renderLink={renderLink} />
    </AdminMenu>
  )

  return (
    <div
      className={cn(
        "flex h-svh bg-background text-foreground",
        isCard && "gap-4 p-4",
        className
      )}
    >
      <AdminRail
        nav={nav}
        activeHref={activeHref}
        renderLink={renderLink}
        menu={header ? undefined : menu}
        footer={sidebarFooter}
        collapsed={collapsed}
        variant={sidebarVariant}
      />
      <aside
        className={cn(
          "w-60 shrink-0 flex-col",
          isCard
            ? "rounded-xl bg-card ring-1 ring-foreground/10"
            : "border-r border-sidebar-border bg-sidebar",
          collapsed ? "hidden" : "hidden md:flex"
        )}
      >
        <div className="flex h-14 shrink-0 items-center px-6 text-sm font-semibold">
          {appName}
        </div>
        <AdminNav nav={nav} activeHref={activeHref} renderLink={renderLink} />
        {sidebarFooter ? (
          <div className="mt-auto border-t border-sidebar-border p-3">
            {sidebarFooter}
          </div>
        ) : null}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header ? (
          <AdminHeader section={section} actions={actions} menu={menu} />
        ) : null}
        <main className="min-h-0 flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  )
}
