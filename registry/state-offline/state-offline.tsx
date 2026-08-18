import type { CSSProperties, ReactNode } from "react"
import { WifiOff } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StateOfflineProps {
  title?: string
  description?: string
  actions?: ReactNode
  gradient?: string
  className?: string
}

function gradientSurfaceStyle(
  gradient?: string
): (CSSProperties & Record<string, string>) | undefined {
  return gradient
    ? {
        backgroundImage: `var(--gradient-${gradient})`,
        color: `var(--gradient-${gradient}-foreground)`,
        "--foreground": `var(--gradient-${gradient}-foreground)`,
        "--card-foreground": `var(--gradient-${gradient}-foreground)`,
        "--muted-foreground": `var(--gradient-${gradient}-foreground)`,
        "--sidebar-foreground": `var(--gradient-${gradient}-foreground)`,
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
      <WifiOff className={cn("size-8", !gradient && "text-destructive")} />
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
