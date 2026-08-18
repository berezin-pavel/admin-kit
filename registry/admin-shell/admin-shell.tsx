import type { CSSProperties, ReactNode } from "react"

import { cn } from "@/lib/utils"

import { AdminHeader } from "./admin-header"
import { AdminMenu } from "./admin-menu"
import {
  AdminNav,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "./admin-nav"
import {
  adminNarrowProfileClassName,
  adminRailProfileClassName,
  adminRowIconClassName,
  adminRowProfileClassName,
} from "./admin-row"

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
  sidebarGradient?: string
  children?: ReactNode
  className?: string
  labels?: AdminShellLabels
}

export type AdminShellProps = AdminShellBaseProps &
  ({ header?: true; actions?: ReactNode } | { header: false; actions?: never })

function gradientSurfaceStyle(
  gradient?: string
): (CSSProperties & Record<string, string>) | undefined {
  return gradient
    ? {
        backgroundImage: `var(--gradient-${gradient})`,
        color: `var(--gradient-${gradient}-foreground)`,
        "--foreground": `var(--gradient-${gradient}-foreground)`,
        "--card-foreground": `var(--gradient-${gradient}-foreground)`,
        "--muted-foreground": `var(--gradient-${gradient}-foreground)`,
        "--sidebar-foreground": `var(--gradient-${gradient}-foreground)`,
      }
    : undefined
}

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
  sidebarGradient,
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
    <span
      data-slot="admin-brand"
      className={cn(adminRowIconClassName, "overflow-hidden")}
    >
      {logo}
    </span>
  ) : null

  const narrowActions =
    sidebarActions || sidebarProfile ? (
      <div className="flex shrink-0 items-center gap-1">
        {sidebarActions}
        {sidebarProfile ? (
          <div className={adminNarrowProfileClassName}>{sidebarProfile}</div>
        ) : null}
      </div>
    ) : null

  const menu = (
    <AdminMenu
      appName={appName}
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
        <div
          data-slot="admin-top-bar"
          className="flex h-12 shrink-0 items-center gap-2 rounded-xl bg-card px-2 ring-1 ring-foreground/10 md:hidden"
        >
          {menu}
          {brand}
          <span className="min-w-0 flex-1 truncate text-sm font-semibold">
            {appName}
          </span>
          {narrowActions}
        </div>
      ) : null}
      <aside
        className={cn(
          "hidden w-60 shrink-0 flex-col overflow-hidden rounded-xl bg-card ring-1 ring-foreground/10 md:flex",
          collapsed && "md:w-14"
        )}
        style={gradientSurfaceStyle(sidebarGradient)}
      >
        {collapsed ? (
          brand ? (
            <div className="flex h-12 shrink-0 items-center px-2">
              <span className="flex size-10 items-center justify-center">
                {brand}
              </span>
            </div>
          ) : null
        ) : (
          <div className="flex h-12 shrink-0 items-center gap-1 px-2 text-sm font-semibold">
            <span className="flex min-w-0 flex-1 items-center gap-2 px-2">
              {brand}
              <span className="truncate">{appName}</span>
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
              "shrink-0 border-b border-sidebar-border px-2 pb-2",
              collapsed ? adminRailProfileClassName : adminRowProfileClassName
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
          <AdminHeader
            section={section}
            actions={actions}
            menu={menu}
            narrowActions={narrowActions}
          />
        ) : null}
        <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
