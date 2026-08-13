"use client"

import { TrendingDown, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

export type MetricDirection = "up" | "down"
export type MetricTone = "positive" | "negative"

export interface WidgetMetricProps {
  title: string
  value: string
  hint?: string
  trend?: {
    direction: MetricDirection
    value: string
    tone?: MetricTone
  }
  trendValues?: readonly number[]
  className?: string
}

export function WidgetMetric({
  title,
  value,
  hint,
  trend,
  trendValues,
  className,
}: WidgetMetricProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp
  const tone =
    trend?.tone ?? (trend?.direction === "down" ? "negative" : "positive")

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
          <span className="text-3xl font-semibold whitespace-nowrap tabular-nums">
            {value}
          </span>
          {trend ? (
            <span
              className={cn(
                "flex items-center gap-1 text-sm whitespace-nowrap",
                tone === "negative" ? "text-destructive" : "text-primary"
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
        {trendValues && trendValues.length >= 2 ? (
          <div className="h-10 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendValues.map((point) => ({ point }))}>
                <Line
                  type="monotone"
                  dataKey="point"
                  stroke="var(--color-chart-1)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : null}
      </CardContent>
    </Card>
  )
}
