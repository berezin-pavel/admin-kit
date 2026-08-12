"use client"

import type { ReactNode } from "react"
import { Bar, BarChart, CartesianGrid, Line, LineChart, XAxis } from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetChartSeries {
  id: string
  label: string
  values: readonly number[]
}

export interface WidgetChartProps {
  title: string
  labels: readonly string[]
  series: readonly WidgetChartSeries[]
  kind?: "line" | "bar"
  hint?: string
  empty?: ReactNode
  emptyTitle?: string
  className?: string
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
  empty,
  emptyTitle = "No data",
  className,
}: WidgetChartProps) {
  const isEmpty = labels.length === 0 || series.length === 0

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {isEmpty ? (
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
                />
                <ChartTooltip
                  isAnimationActive={false}
                  content={<ChartTooltipContent />}
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
                />
                <ChartTooltip
                  isAnimationActive={false}
                  content={<ChartTooltipContent />}
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
    </Card>
  )
}
