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
  header = true,
  actions,
  children,
  className,
}: AdminShellProps) {
  const section = nav.find((item) => item.href === activeHref)?.title ?? appName

  const menu = (
    <AdminMenu appName={appName}>
      <AdminNav nav={nav} activeHref={activeHref} renderLink={renderLink} />
    </AdminMenu>
  )

  return (
    <div className={cn("flex h-svh bg-background text-foreground", className)}>
      <AdminRail
        nav={nav}
        activeHref={activeHref}
        renderLink={renderLink}
        menu={header ? undefined : menu}
        footer={sidebarFooter}
      />
      <aside className="hidden w-60 shrink-0 flex-col border-r border-sidebar-border bg-sidebar md:flex">
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
