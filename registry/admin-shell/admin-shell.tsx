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

export interface AdminShellLabels {
  openMenu?: string
  sections?: string
}

type AdminShellBaseProps = {
  appName: string
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  sidebarFooter?: ReactNode
  sidebarActions?: ReactNode
  collapsed?: boolean
  children?: ReactNode
  className?: string
  labels?: AdminShellLabels
}

export type AdminShellProps = AdminShellBaseProps &
  ({ header?: true; actions?: ReactNode } | { header: false; actions?: never })

export function AdminShell({
  appName,
  nav,
  activeHref,
  renderLink,
  sidebarFooter,
  sidebarActions,
  collapsed = false,
  header = true,
  actions,
  children,
  className,
  labels,
}: AdminShellProps) {
  const section = nav.find((item) => item.href === activeHref)?.title ?? appName
  const openMenuLabel = labels?.openMenu ?? "Open navigation menu"
  const sectionsLabel = labels?.sections ?? "Sections"

  const menu = (
    <AdminMenu
      appName={appName}
      actions={sidebarActions}
      footer={sidebarFooter}
      showOnDesktop={collapsed}
      openMenuLabel={openMenuLabel}
    >
      <AdminNav
        nav={nav}
        activeHref={activeHref}
        renderLink={renderLink}
        sectionsLabel={sectionsLabel}
      />
    </AdminMenu>
  )

  return (
    <div
      className={cn(
        "flex h-svh gap-2 bg-background p-2 text-foreground md:gap-4 md:p-4",
        className
      )}
    >
      <aside
        className={cn(
          "flex w-14 shrink-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10",
          !collapsed && "md:w-60"
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
            "hidden h-14 shrink-0 items-center justify-between gap-2 px-6 text-sm font-semibold",
            !collapsed && "md:flex"
          )}
        >
          {appName}
          {sidebarActions ? (
            <div className="flex items-center gap-1">{sidebarActions}</div>
          ) : null}
        </div>
        {sidebarActions ? (
          <div
            className={cn(
              "flex shrink-0 flex-col items-center gap-2 p-3",
              !collapsed && "md:hidden"
            )}
          >
            {sidebarActions}
          </div>
        ) : null}
        <AdminNav
          nav={nav}
          activeHref={activeHref}
          renderLink={renderLink}
          collapsed={collapsed}
          responsive
          sectionsLabel={sectionsLabel}
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
