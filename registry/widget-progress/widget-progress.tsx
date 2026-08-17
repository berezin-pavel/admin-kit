import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

export type WidgetProgressTone = "default" | "success" | "warning" | "danger"

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
  loading?: boolean
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

export function WidgetProgress({
  title,
  value,
  max = 100,
  target,
  targetLabel = "Goal",
  tone = "default",
  hint,
  loading = false,
  gradient,
  className,
}: WidgetProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const percent = Math.round((clampedValue / max) * 100)
  const targetPercent =
    target === undefined
      ? undefined
      : (Math.min(Math.max(target, 0), max) / max) * 100

  return (
    <Card className={className} style={gradientSurfaceStyle(gradient)}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
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
    </Card>
  )
}
