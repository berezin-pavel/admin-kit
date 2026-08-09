import { TrendingDown, TrendingUp } from "lucide-react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type MetricDirection = "up" | "down"

export interface WidgetMetricProps {
  title: string
  value: string
  hint?: string
  trend?: { direction: MetricDirection; value: string }
  className?: string
}

export function WidgetMetric({
  title,
  value,
  hint,
  trend,
  className,
}: WidgetMetricProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-semibold tabular-nums">{value}</span>
          {trend ? (
            <span
              className={cn(
                "flex items-center gap-1 text-sm",
                trend.direction === "down" ? "text-destructive" : "text-primary"
              )}
            >
              <TrendIcon className="size-4" />
              {trend.value}
            </span>
          ) : null}
        </div>
        {hint ? (
          <span className="text-sm text-muted-foreground">{hint}</span>
        ) : null}
      </CardContent>
    </Card>
  )
}
