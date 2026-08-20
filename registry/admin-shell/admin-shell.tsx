import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { SurfaceChoice } from "@/registry/admin-appearance/appearance-palette"

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

export type AdminShellVariant = "card" | "flush"

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
  section?: string
  headerTabs?: ReactNode
  variant?: AdminShellVariant
  sidebarGradient?: string
  headerGradient?: string
  backdrop?: SurfaceChoice | null
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
  section: sectionProp,
  headerTabs,
  variant = "card",
  sidebarGradient,
  headerGradient,
  backdrop,
  header = true,
  actions,
  children,
  className,
  labels,
}: AdminShellProps) {
  const activeItem = nav.find((item) => item.href === activeHref)
  const section = sectionProp ?? activeItem?.title ?? appName
  const sectionIcon = activeItem?.icon
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

  const flush = variant === "flush"
  const headerBar = flush && header !== false

  const headerBrand = headerBar ? (
    <div
      className={cn(
        "flex h-full shrink-0 items-center gap-1 px-2 text-sm font-semibold transition-[width] duration-300 ease-in-out md:mr-3 md:border-r md:border-foreground/10",
        collapsed ? "md:w-14" : "md:w-60"
      )}
    >
      <span className="flex min-w-0 flex-1 items-center gap-2 px-2">
        {brand}
        <span className={cn("truncate", collapsed ? "sr-only" : "hidden md:inline")}>
          {appName}
        </span>
      </span>
      {sidebarActions && !collapsed ? (
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          {sidebarActions}
        </div>
      ) : null}
    </div>
  ) : null

  const menu = (
    <AdminMenu
      appName={appName}
      footer={sidebarFooter}
      openMenuLabel={openMenuLabel}
      gradient={sidebarGradient}
    >
      <AdminNav
        nav={nav}
        activeHref={activeHref}
        renderLink={renderLink}
        sectionsLabel={sectionsLabel}
      />
    </AdminMenu>
  )

  const topBar =
    header === false ? (
      <div
        data-slot="admin-top-bar"
        className={cn(
          "flex h-12 shrink-0 items-center gap-2 bg-card px-2 md:hidden",
          flush
            ? "border-b border-border"
            : "rounded-xl ring-1 ring-foreground/10"
        )}
      >
        {menu}
        {brand}
        <span className="min-w-0 flex-1 truncate text-sm font-semibold">
          {appName}
        </span>
        {narrowActions}
      </div>
    ) : null

  const sidebar = (
    <aside
      className={cn(
        "hidden w-60 shrink-0 flex-col overflow-hidden bg-card transition-[width] duration-300 ease-in-out md:flex",
        flush
          ? "border-r border-foreground/10"
          : "rounded-xl ring-1 ring-foreground/10",
        collapsed && "md:w-14"
      )}
      data-gradient={sidebarGradient || undefined}
    >
      {headerBar ? null : collapsed ? (
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
            headerBar && "pt-2",
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
  )

  const workArea = (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      {header && !headerBar ? (
        <AdminHeader
          section={section}
          icon={sectionIcon}
          actions={actions}
          menu={menu}
          narrowActions={narrowActions}
          tabs={headerTabs}
          gradient={headerGradient}
        />
      ) : null}
      <main className="min-h-0 flex-1 overflow-y-auto p-4 md:p-6">
        {children}
      </main>
    </div>
  )

  return (
    <div
      className={cn(
        "flex h-svh flex-col bg-background text-foreground",
        flush
          ? !headerBar && "md:flex-row"
          : "gap-2 p-2 md:flex-row md:gap-4 md:p-4",
        className
      )}
      data-variant={variant}
      data-backdrop={backdrop ?? undefined}
    >
      {topBar}
      {headerBar ? (
        <>
          <AdminHeader
            section={section}
            icon={sectionIcon}
            actions={actions}
            menu={menu}
            narrowActions={narrowActions}
            leading={headerBrand}
            tabs={headerTabs}
            gradient={headerGradient}
            className="bg-card"
            rowClassName="px-2 pr-4 md:px-0 md:pr-6"
          />
          <div className="flex min-h-0 flex-1">
            {sidebar}
            {workArea}
          </div>
        </>
      ) : (
        <>
          {sidebar}
          {workArea}
        </>
      )}
    </div>
  )
}
