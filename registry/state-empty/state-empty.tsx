import type { ReactNode } from "react"

import { cn } from "@/lib/utils"

export interface StateEmptyProps {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}

export function StateEmpty({
  title,
  description,
  action,
  className,
}: StateEmptyProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-3 px-6 py-12 text-center",
        className
      )}
    >
      <span className="font-medium">{title}</span>
      {description ? (
        <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action}
    </div>
  )
}
