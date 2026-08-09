import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

export type StatusTone = "neutral" | "success" | "warning" | "danger"

export interface StatusBadgeProps {
  children: ReactNode
  tone?: StatusTone
  className?: string
}

const toneClassName: Record<StatusTone, string> = {
  neutral: "",
  success: "border-transparent bg-success text-success-foreground",
  warning: "border-transparent bg-warning text-warning-foreground",
  danger: "",
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge
      variant={tone === "danger" ? "destructive" : "secondary"}
      className={cn(toneClassName[tone], className)}
    >
      {children}
    </Badge>
  )
}
