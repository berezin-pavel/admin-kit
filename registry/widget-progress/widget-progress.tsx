import type { ReactNode } from "react"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export type WidgetProgressTone = "default" | "success" | "warning" | "danger"
export type WidgetProgressHeading = "muted" | "prominent"

const toneClassName: Record<WidgetProgressTone, string | undefined> = {
  default: undefined,
  success: "[&_[data-slot=progress-indicator]]:bg-success",
  warning: "[&_[data-slot=progress-indicator]]:bg-warning",
  danger: "[&_[data-slot=progress-indicator]]:bg-destructive",
}

export interface WidgetProgressProps {
  title: string
  value: number
  max?: number
  target?: number
  targetLabel?: string
  tone?: WidgetProgressTone
  hint?: string
  heading?: WidgetProgressHeading
  summary?: ReactNode
  loading?: boolean
  gradient?: GradientId
  blockId?: string
  className?: string
}

const headingClassName: Record<WidgetProgressHeading, string> = {
  muted: "text-sm font-medium text-muted-foreground",
  prominent: "text-xl font-semibold text-foreground",
}

export function WidgetProgress({
  title,
  value,
  max = 100,
  target,
  targetLabel = "Goal",
  tone = "default",
  hint,
  heading = "muted",
  summary,
  loading = false,
  gradient,
  blockId,
  className,
}: WidgetProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const percent = Math.round((clampedValue / max) * 100)
  const targetPercent =
    target === undefined
      ? undefined
      : (Math.min(Math.max(target, 0), max) / max) * 100

  return (
    <Block id={blockId} gradient={gradient} headings className={className}>
      <CardHeader
        className={
          summary ? "flex flex-wrap items-center justify-between gap-4" : undefined
        }
      >
        <CardTitle className={headingClassName[heading]}>{title}</CardTitle>
        {summary ? (
          <span className="text-sm text-muted-foreground">{summary}</span>
        ) : null}
      </CardHeader>
      <CardContent
        className="flex flex-col gap-2"
        aria-busy={loading || undefined}
      >
        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-14" />
            <Skeleton className="h-1 w-full rounded-full" />
          </div>
        ) : (
          <>
            <div className="relative">
              <Progress
                value={clampedValue}
                max={max}
                aria-label={title}
                className={cn(toneClassName[tone])}
              >
                <span className="text-2xl font-semibold tabular-nums">
                  {percent}%
                </span>
              </Progress>
              {targetPercent !== undefined ? (
                <span
                  aria-hidden="true"
                  className="absolute bottom-0 h-1 w-0.5 bg-foreground/60"
                  style={{ left: `${targetPercent}%` }}
                />
              ) : null}
            </div>
            {hint || target !== undefined ? (
              <div className="flex items-center gap-2">
                {hint ? (
                  <span className="text-sm text-muted-foreground">{hint}</span>
                ) : null}
                {target !== undefined ? (
                  <span className="ml-auto text-sm text-muted-foreground">
                    {targetLabel}
                  </span>
                ) : null}
              </div>
            ) : null}
          </>
        )}
      </CardContent>
    </Block>
  )
}
