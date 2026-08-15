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
  logo?: ReactNode
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  sidebarFooter?: ReactNode
  sidebarActions?: ReactNode
  sidebarProfile?: ReactNode
  collapsed?: boolean
  children?: ReactNode
  className?: string
  labels?: AdminShellLabels
}

export type AdminShellProps = AdminShellBaseProps &
  ({ header?: true; actions?: ReactNode } | { header: false; actions?: never })

export function AdminShell({
  appName,
  logo,
  nav,
  activeHref,
  renderLink,
  sidebarFooter,
  sidebarActions,
  sidebarProfile,
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

  const brand = logo ? (
    <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden">
      {logo}
    </span>
  ) : null

  const menu = (
    <AdminMenu
      appName={appName}
      logo={logo}
      actions={sidebarActions}
      profile={sidebarProfile}
      footer={sidebarFooter}
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
        "flex h-svh flex-col gap-2 bg-background p-2 text-foreground md:flex-row md:gap-4 md:p-4",
        className
      )}
    >
      {header === false ? (
        <div className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-card px-2 ring-1 ring-foreground/10 md:hidden">
          {menu}
          {brand}
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {appName}
          </span>
          {sidebarActions ? (
            <div className="flex shrink-0 items-center gap-1">
              {sidebarActions}
            </div>
          ) : null}
        </div>
      ) : null}
      <aside
        className={cn(
          "hidden w-60 shrink-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:flex",
          collapsed && "md:w-14"
        )}
      >
        {collapsed ? (
          brand ? (
            <div className="flex h-12 shrink-0 items-center justify-center">
              {brand}
            </div>
          ) : null
        ) : (
          <div className="flex h-12 shrink-0 items-center justify-between gap-2 px-4 text-sm font-semibold">
            <span className="flex min-w-0 items-center gap-2">
              {brand}
              {appName}
            </span>
            {sidebarActions ? (
              <div className="flex shrink-0 items-center gap-1">
                {sidebarActions}
              </div>
            ) : null}
          </div>
        )}
        {sidebarProfile ? (
          <div
            className={cn(
              "shrink-0 border-b border-sidebar-border px-2 pt-1 pb-2",
              collapsed &&
                "flex justify-center [&_[data-slot=user-menu-chevron]]:hidden [&_[data-slot=user-menu-details]]:hidden [&_[data-slot=user-menu]]:size-8 [&_[data-slot=user-menu]]:justify-center [&_[data-slot=user-menu]]:rounded-full [&_[data-slot=user-menu]]:p-0"
            )}
          >
            {sidebarProfile}
          </div>
        ) : null}
        {collapsed && sidebarActions ? (
          <div className="flex shrink-0 flex-col items-center gap-1 px-2 py-2">
            {sidebarActions}
          </div>
        ) : null}
        <AdminNav
          nav={nav}
          activeHref={activeHref}
          renderLink={renderLink}
          collapsed={collapsed}
          sectionsLabel={sectionsLabel}
        />
        {sidebarFooter ? (
          <div
            className={cn(
              "mt-auto flex shrink-0 items-center gap-2 border-t border-sidebar-border p-2",
              collapsed ? "flex-col" : "flex-row"
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
