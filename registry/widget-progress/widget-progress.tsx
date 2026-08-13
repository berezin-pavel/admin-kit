import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface WidgetProgressProps {
  title: string
  value: number
  max?: number
  target?: number
  targetLabel?: string
  hint?: string
  className?: string
}

export function WidgetProgress({
  title,
  value,
  max = 100,
  target,
  targetLabel = "Goal",
  hint,
  className,
}: WidgetProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const percent = Math.round((clampedValue / max) * 100)
  const targetPercent =
    target === undefined
      ? undefined
      : (Math.min(Math.max(target, 0), max) / max) * 100

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <div className="relative">
          <Progress value={clampedValue} max={max}>
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
      </CardContent>
    </Card>
  )
}
