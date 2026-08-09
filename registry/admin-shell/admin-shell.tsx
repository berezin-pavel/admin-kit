import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

import { AdminHeader } from "./admin-header"
import {
  AdminNav,
  type AdminNavItem,
  type AdminNavLinkRenderer,
} from "./admin-nav"

export type { AdminNavItem, AdminNavLinkRenderer }

export interface AdminShellProps {
  title: string
  nav: readonly AdminNavItem[]
  activeHref: string
  renderLink?: AdminNavLinkRenderer
  actions?: ReactNode
  children?: ReactNode
  className?: string
}

export function AdminShell({
  title,
  nav,
  activeHref,
  renderLink,
  actions,
  children,
  className,
}: AdminShellProps) {
  const section = nav.find((item) => item.href === activeHref)?.title ?? title

  return (
    <div
      className={cn("flex min-h-svh bg-background text-foreground", className)}
    >
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
        <div className="flex h-14 items-center px-6 text-sm font-semibold">
          {title}
        </div>
        <AdminNav nav={nav} activeHref={activeHref} renderLink={renderLink} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader section={section} actions={actions} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
