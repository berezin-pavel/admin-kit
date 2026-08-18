"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { Block } from "@/registry/admin-appearance/block"
import type { GradientId } from "@/registry/admin-appearance/appearance-palette"
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetChartSeries {
  id: string
  label: string
  values: readonly number[]
}

export type WidgetChartHeading = "regular" | "large"

export interface WidgetChartProps {
  title: string
  labels: readonly string[]
  series: readonly WidgetChartSeries[]
  kind?: "line" | "bar"
  hint?: string
  toolbar?: ReactNode
  heading?: WidgetChartHeading
  summary?: ReactNode
  empty?: ReactNode
  emptyTitle?: string
  loading?: boolean
  gradient?: GradientId
  blockId?: string
  className?: string
}

const headingClassName: Record<WidgetChartHeading, string> = {
  regular: "text-[0.84375rem] font-semibold text-foreground",
  large: "text-[1.15rem] font-semibold text-foreground",
}

const seriesColorCount = 5

function buildChartConfig(series: readonly WidgetChartSeries[]): ChartConfig {
  return Object.fromEntries(
    series.map((item, index) => [
      item.id,
      {
        label: item.label,
        color: `var(--chart-${(index % seriesColorCount) + 1})`,
      },
    ])
  )
}

function buildChartData(
  labels: readonly string[],
  series: readonly WidgetChartSeries[]
) {
  return labels.map((label, index) => {
    const row: Record<string, string | number> = { label }
    for (const item of series) {
      const value = item.values[index]
      if (value !== undefined) {
        row[item.id] = value
      }
    }
    return row
  })
}

export function WidgetChart({
  title,
  labels,
  series,
  kind = "line",
  hint,
  toolbar,
  heading = "regular",
  summary,
  empty,
  emptyTitle = "No data",
  loading = false,
  gradient,
  blockId,
  className,
}: WidgetChartProps) {
  const isEmpty = labels.length === 0 || series.length === 0

  return (
    <Block id={blockId} gradient={gradient} headings className={className}>
      <CardHeader className="flex flex-wrap items-center justify-between gap-4">
        <CardTitle className={headingClassName[heading]}>{title}</CardTitle>
        {summary ? (
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm text-muted-foreground">{summary}</span>
            {toolbar}
          </div>
        ) : toolbar ? (
          <div className="flex items-center gap-2">{toolbar}</div>
        ) : null}
      </CardHeader>
      <CardContent
        className="flex flex-col gap-3"
        aria-busy={loading || undefined}
      >
        {loading ? (
          <Skeleton className="h-56 w-full" />
        ) : isEmpty ? (
          (empty ?? <StateEmpty title={emptyTitle} />)
        ) : (
          <ChartContainer
            config={buildChartConfig(series)}
            className="aspect-auto h-56"
          >
            {kind === "line" ? (
              <LineChart
                data={buildChartData(labels, series)}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <ChartTooltip
                  isAnimationActive={false}
                  content={<ChartTooltipContent className="bg-card backdrop-blur-lg" />}
                />
                {series.length > 1 ? (
                  <ChartLegend content={<ChartLegendContent />} />
                ) : null}
                {series.map((item) => (
                  <Line
                    key={item.id}
                    dataKey={item.id}
                    type="monotone"
                    stroke={`var(--color-${item.id})`}
                    strokeWidth={2}
                    dot={false}
                  />
                ))}
              </LineChart>
            ) : (
              <BarChart
                data={buildChartData(labels, series)}
                margin={{ left: 12, right: 12 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tick={{ fill: "var(--muted-foreground)" }}
                />
                <ChartTooltip
                  isAnimationActive={false}
                  content={<ChartTooltipContent className="bg-card backdrop-blur-lg" />}
                />
                {series.length > 1 ? (
                  <ChartLegend content={<ChartLegendContent />} />
                ) : null}
                {series.map((item) => (
                  <Bar
                    key={item.id}
                    dataKey={item.id}
                    fill={`var(--color-${item.id})`}
                    radius={4}
                  />
                ))}
              </BarChart>
            )}
          </ChartContainer>
        )}
        {hint ? <p className="text-sm text-muted-foreground">{hint}</p> : null}
      </CardContent>
    </Block>
  )
}
