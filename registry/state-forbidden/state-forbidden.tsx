import type { ReactNode } from "react"
import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StateForbiddenProps {
  title?: string
  description?: string
  actions?: ReactNode
  className?: string
}

export function StateForbidden({
  title = "No access",
  description,
  actions,
  className,
}: StateForbiddenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <Lock className="size-8 text-muted-foreground" />
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
