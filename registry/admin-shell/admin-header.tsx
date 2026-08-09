import type { ReactNode } from "react"

export function AdminHeader({
  title,
  actions,
}: {
  title: string
  actions?: ReactNode
}) {
  return (
    <header className="flex h-14 items-center justify-between gap-4 border-b border-border px-6">
      <span className="text-sm font-medium">{title}</span>
      {actions ? (
        <div className="flex items-center gap-2">{actions}</div>
      ) : null}
    </header>
  )
}
