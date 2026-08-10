import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { AdminHeader } from "./admin-header"
import { AdminMenu } from "./admin-menu"
import {
  AdminNav,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "./admin-nav"

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
  sidebarVariant = "card",
  header = true,
  actions,
  children,
  className,
}: AdminShellProps) {
  const section = nav.find((item) => item.href === activeHref)?.title ?? appName
  const isCard = sidebarVariant === "card"

  const menu = (
    <AdminMenu
      appName={appName}
      footer={sidebarFooter}
      showOnDesktop={collapsed}
    >
      <AdminNav nav={nav} activeHref={activeHref} renderLink={renderLink} />
    </AdminMenu>
  )

  return (
    <div
      className={cn(
        "flex h-svh bg-background text-foreground",
        isCard && "gap-2 p-2 md:gap-4 md:p-4",
        className
      )}
    >
      <aside
        className={cn(
          "flex w-14 shrink-0 flex-col overflow-hidden",
          !collapsed && "md:w-60",
          isCard
            ? "rounded-xl bg-card ring-1 ring-foreground/10"
            : "border-r border-sidebar-border bg-sidebar"
        )}
      >
        {header === false ? (
          <div
            className={cn(
              "flex shrink-0 justify-center p-3",
              !collapsed && "md:hidden"
            )}
          >
            {menu}
          </div>
        ) : null}
        <div
          className={cn(
            "hidden h-14 shrink-0 items-center px-6 text-sm font-semibold",
            !collapsed && "md:flex"
          )}
        >
          {appName}
        </div>
        <AdminNav
          nav={nav}
          activeHref={activeHref}
          renderLink={renderLink}
          collapsed={collapsed}
          responsive
        />
        {sidebarFooter ? (
          <div
            className={cn(
              "mt-auto flex shrink-0 flex-col items-center gap-2 border-t border-sidebar-border p-3",
              !collapsed && "md:flex-row"
            )}
          >
            {sidebarFooter}
          </div>
        ) : null}
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        {header ? (
          <AdminHeader section={section} actions={actions} menu={menu} />
        ) : null}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
