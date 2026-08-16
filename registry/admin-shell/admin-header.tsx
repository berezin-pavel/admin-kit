import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface AdminHeaderProps {
  section: string
  actions?: ReactNode
  menu?: ReactNode
  narrowActions?: ReactNode
  className?: string
}

export function AdminHeader({
  section,
  actions,
  menu,
  narrowActions,
  className,
}: AdminHeaderProps) {
  return (
    <header
      className={cn(
        "flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {menu}
        <span className="text-sm font-medium">{section}</span>
      </div>
      <div className="flex items-center gap-2">
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
