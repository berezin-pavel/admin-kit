import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface AdminHeaderProps {
  section: string
  actions?: ReactNode
  menu?: ReactNode
  className?: string
}

export function AdminHeader({
  section,
  actions,
  menu,
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
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
