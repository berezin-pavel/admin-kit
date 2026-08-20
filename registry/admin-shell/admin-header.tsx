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
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border",
        rowClassName ?? "px-6",
        className
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        {menu}
        {leading}
        {tabs ? (
          <div
            data-slot="admin-header-tabs"
            className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
          >
            {tabs}
          </div>
        ) : (
          <span className="truncate text-sm font-medium">{section}</span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        {narrowActions ? (
          <div className="flex items-center gap-1 md:hidden">
            {narrowActions}
          </div>
        ) : null}
        {actions}
      </div>
    </header>
  )
}
