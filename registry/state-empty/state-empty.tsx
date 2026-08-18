import type { ReactNode } from "react"

import { cn } from "@/lib/utils"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export interface StateEmptyProps {
  title: string
  description?: string
  actions?: ReactNode
  gradient?: GradientId
  className?: string
}

export function StateEmpty({
  title,
  description,
  actions,
  gradient,
  className,
}: StateEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
      data-gradient={gradient}
    >
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
