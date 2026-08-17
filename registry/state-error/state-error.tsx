import type { ReactNode } from "react"
import { CircleAlert } from "lucide-react"

import { cn } from "@/lib/utils"

export interface StateErrorProps {
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

export function StateError({
  title = "Something went wrong",
  description,
  actions,
  gradient,
  className,
}: StateErrorProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
      style={gradientSurfaceStyle(gradient)}
    >
      <CircleAlert className="size-8 text-destructive" />
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {actions}
    </div>
  )
}
