import type { ReactNode } from "react"

import { AdminHeader } from "./admin-header"
import { AdminNav, type AdminNavItem } from "./admin-nav"

export interface AdminShellProps {
  title: string
  nav: readonly AdminNavItem[]
  activeHref: string
  actions?: ReactNode
  children?: ReactNode
}

export function AdminShell({
  title,
  nav,
  activeHref,
  actions,
  children,
}: AdminShellProps) {
  return (
    <div className="flex min-h-svh bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 border-r border-sidebar-border bg-sidebar md:block">
        <div className="flex h-14 items-center px-6 text-sm font-semibold">
          {title}
        </div>
        <AdminNav items={nav} activeHref={activeHref} />
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader title={title} actions={actions} />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
