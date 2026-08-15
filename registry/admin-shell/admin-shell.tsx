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

  const menu = (
    <AdminMenu
      appName={appName}
      logo={logo}
      actions={sidebarActions}
      profile={sidebarProfile}
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
        {logo ? (
          <div
            className={cn(
              "flex h-12 shrink-0 items-center justify-center",
              !collapsed && "md:hidden"
            )}
          >
            <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden">
              {logo}
            </span>
          </div>
        ) : null}
        {header === false ? (
          <div
            className={cn(
              "flex shrink-0 justify-center px-2 pb-2",
              !collapsed && "md:hidden"
            )}
          >
            {menu}
          </div>
        ) : null}
        <div
          className={cn(
            "hidden h-12 shrink-0 items-center justify-between gap-2 px-4 text-sm font-semibold",
            !collapsed && "md:flex"
          )}
        >
          <span className="flex min-w-0 items-center gap-2">
            {logo ? (
              <span className="flex size-5 shrink-0 items-center justify-center overflow-hidden">
                {logo}
              </span>
            ) : null}
            {appName}
          </span>
          {sidebarActions ? (
            <div className="flex shrink-0 items-center gap-1">
              {sidebarActions}
            </div>
          ) : null}
        </div>
        {sidebarProfile ? (
          <div
            className={cn(
              "flex shrink-0 justify-center border-b border-sidebar-border px-2 pt-1 pb-2 [&_[data-slot=user-menu-chevron]]:hidden [&_[data-slot=user-menu-details]]:hidden [&_[data-slot=user-menu]]:size-8 [&_[data-slot=user-menu]]:justify-center [&_[data-slot=user-menu]]:rounded-full [&_[data-slot=user-menu]]:p-0",
              !collapsed && "md:hidden"
            )}
          >
            {sidebarProfile}
          </div>
        ) : null}
        {sidebarActions ? (
          <div
            className={cn(
              "flex shrink-0 flex-col items-center gap-1 px-2 py-2",
              !collapsed && "md:hidden"
            )}
          >
            {sidebarActions}
          </div>
        ) : null}
        {sidebarProfile ? (
          <div
            className={cn(
              "hidden shrink-0 border-b border-sidebar-border px-2 pt-1 pb-2",
              !collapsed && "md:block"
            )}
          >
            {sidebarProfile}
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
              "mt-auto flex shrink-0 flex-col items-center gap-2 border-t border-sidebar-border p-2",
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
