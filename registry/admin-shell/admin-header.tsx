import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface AdminHeaderProps {
  section: string
  actions?: ReactNode
  menu?: ReactNode
  narrowActions?: ReactNode
  leading?: ReactNode
  tabs?: ReactNode
  gradient?: string
  className?: string
  rowClassName?: string
}

export function AdminHeader({
  section,
  actions,
  menu,
  narrowActions,
  leading,
  tabs,
  gradient,
  className,
  rowClassName,
}: AdminHeaderProps) {
  return (
    <header
      data-slot="admin-header"
      data-gradient={gradient || undefined}
      className={cn(
        "flex shrink-0 flex-col border-b border-border",
        tabs ? "min-h-14" : "h-14",
        className
      )}
    >
      <div
        className={cn(
          "flex h-14 shrink-0 items-center justify-between gap-4",
          rowClassName ?? "px-6"
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          {menu}
          {leading}
          <span className="truncate text-sm font-medium">{section}</span>
        </div>
        <div className="flex items-center gap-2">
          {narrowActions ? (
            <div className="flex items-center gap-1 md:hidden">
              {narrowActions}
            </div>
          ) : null}
          {actions}
        </div>
      </div>
      {tabs ? (
        <div data-slot="admin-header-tabs" className="flex flex-wrap items-center justify-between gap-2 px-6 pb-2">
          {tabs}
        </div>
      ) : null}
    </header>
  )
}
