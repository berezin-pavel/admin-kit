import type { ReactNode } from "react"

import { Badge } from "@/components/ui/badge"

export type StatusTone = "neutral" | "success" | "warning" | "danger"

export interface StatusBadgeProps {
  children: ReactNode
  tone?: StatusTone
  className?: string
}

type BadgeVariant = "secondary" | "default" | "outline" | "destructive"

const toneVariant: Record<StatusTone, BadgeVariant> = {
  neutral: "secondary",
  success: "default",
  warning: "outline",
  danger: "destructive",
}

export function StatusBadge({
  children,
  tone = "neutral",
  className,
}: StatusBadgeProps) {
  return (
    <Badge variant={toneVariant[tone]} className={className}>
      {children}
    </Badge>
  )
}
