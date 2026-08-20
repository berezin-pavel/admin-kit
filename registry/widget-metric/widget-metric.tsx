"use client"

import type { ReactNode } from "react"
import { TrendingDown, TrendingUp } from "lucide-react"
import { Line, LineChart, ResponsiveContainer, Tooltip } from "recharts"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"
import { Block } from "@/registry/admin-appearance/block"
import {
  resolveBlockGradient,
  useBlockAppearance,
} from "@/registry/admin-appearance/appearance-provider"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"

export type MetricDirection = "up" | "down"
export type MetricTone = "positive" | "negative"
export type WidgetMetricHeading = "regular" | "large"

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
  trendTooltipFormat?: (value: number) => string
  heading?: WidgetMetricHeading
  summary?: ReactNode
  loading?: boolean
  gradient?: GradientId
  blockId?: string
  className?: string
}

const headingClassName: Record<WidgetMetricHeading, string> = {
  regular: "text-[0.84375rem] font-semibold text-foreground",
  large: "text-[1.15rem] font-semibold text-foreground",
}

export function WidgetMetric({
  title,
  value,
  hint,
  trend,
  trendValues,
  trendTooltipFormat = String,
  heading = "regular",
  summary,
  loading = false,
  gradient,
  blockId,
  className,
}: WidgetMetricProps) {
  const TrendIcon = trend?.direction === "down" ? TrendingDown : TrendingUp
  const tone =
    trend?.tone ?? (trend?.direction === "down" ? "negative" : "positive")
  const painted = resolveBlockGradient(useBlockAppearance(blockId), gradient)

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
        className="flex flex-col gap-1"
        aria-busy={loading || undefined}
      >
        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-9 w-24" />
            <Skeleton className="h-4 w-32" />
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
              <span className="text-3xl font-semibold whitespace-nowrap tabular-nums">
                {value}
              </span>
              {trend ? (
                <span
                  className={cn(
                    "flex items-center gap-1 text-sm whitespace-nowrap",
                    !painted &&
                      (tone === "negative" ? "text-destructive" : "text-success")
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
                    <Tooltip
                      isAnimationActive={false}
                      cursor={{ stroke: "var(--color-border)" }}
                      content={({ active, payload }) =>
                        active && payload?.length ? (
                          <div className="rounded-md border border-border bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md">
                            {trendTooltipFormat(Number(payload[0].value))}
                          </div>
                        ) : null
                      }
                    />
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
          </>
        )}
      </CardContent>
    </Block>
  )
}
