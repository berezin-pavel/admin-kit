import type { ReactNode } from "react"
import { WifiOff } from "lucide-react"

import { cn } from "@/lib/utils"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export interface StateOfflineProps {
  title?: string
  description?: string
  actions?: ReactNode
  gradient?: GradientId
  className?: string
}

export function StateOffline({
  title = "Connection lost",
  description,
  actions,
  gradient,
  className,
}: StateOfflineProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
      data-gradient={gradient}
    >
      <WifiOff className={cn("size-8", !gradient && "text-destructive")} />
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
