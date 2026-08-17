import type { ReactNode } from "react"
import { WifiOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StateOfflineProps {
  title?: string
  description?: string
  actions?: ReactNode
  gradient?: string
  className?: string
}

function gradientSurfaceStyle(gradient?: string) {
  return gradient
    ? {
        backgroundImage: `var(--gradient-${gradient})`,
        color: `var(--gradient-${gradient}-foreground)`,
      }
    : undefined
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
      style={gradientSurfaceStyle(gradient)}
    >
      <WifiOff className="size-8 text-destructive" />
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
