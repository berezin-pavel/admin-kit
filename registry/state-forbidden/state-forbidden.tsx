import type { ReactNode } from "react"
import { Lock } from "lucide-react"

import { cn } from "@/lib/utils"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export interface StateForbiddenProps {
  title?: string
  description?: string
  actions?: ReactNode
  gradient?: GradientId
  className?: string
}

export function StateForbidden({
  title = "No access",
  description,
  actions,
  gradient,
  className,
}: StateForbiddenProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
      data-gradient={gradient}
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
