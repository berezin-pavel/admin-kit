import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export interface WidgetProgressProps {
  title: string
  value: number
  max?: number
  hint?: string
  className?: string
}

export function WidgetProgress({
  title,
  value,
  max = 100,
  hint,
  className,
}: WidgetProgressProps) {
  const clampedValue = Math.min(Math.max(value, 0), max)
  const percent = Math.round((clampedValue / max) * 100)

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <Progress value={clampedValue} max={max}>
          <span className="text-2xl font-semibold tabular-nums">
            {percent}%
          </span>
        </Progress>
        {hint ? (
          <span className="text-sm text-muted-foreground">{hint}</span>
        ) : null}
      </CardContent>
    </Card>
  )
}
