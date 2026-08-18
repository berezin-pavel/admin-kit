"use client"

import type { CSSProperties } from "react"
import { Cell, Pie, PieChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import { Skeleton } from "@/components/ui/skeleton"
import { StateEmpty } from "@/registry/state-empty/state-empty"

export interface WidgetDonutSlice {
  id: string
  label: string
  value: number
}

export interface WidgetDonutProps {
  title?: string
  hint?: string
  slices: readonly WidgetDonutSlice[]
  valueFormat?: (value: number, share: number) => string
  emptyTitle?: string
  loading?: boolean
  gradient?: string
  className?: string
}

function gradientSurfaceStyle(
  gradient?: string
): (CSSProperties & Record<string, string>) | undefined {
  return gradient
    ? {
        backgroundImage: `var(--gradient-${gradient})`,
        color: `var(--gradient-${gradient}-foreground)`,
        "--foreground": `var(--gradient-${gradient}-foreground)`,
        "--card-foreground": `var(--gradient-${gradient}-foreground)`,
        "--muted-foreground": `var(--gradient-${gradient}-foreground)`,
        "--sidebar-foreground": `var(--gradient-${gradient}-foreground)`,
      }
    : undefined
}

const sliceColorCount = 5
const skeletonLegendRowCount = 4

export interface WidgetDonutSliceShare extends WidgetDonutSlice {
  share: number
}

export function computeDonutShares(slices: readonly WidgetDonutSlice[]): {
  total: number
  shares: readonly WidgetDonutSliceShare[]
} {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0)

  return {
    total,
    shares: slices.map((slice) => ({
      ...slice,
      share: total > 0 ? slice.value / total : 0,
    })),
  }
}

function buildDonutConfig(slices: readonly WidgetDonutSlice[]): ChartConfig {
  return Object.fromEntries(
    slices.map((slice, index) => [
      slice.id,
      {
        label: slice.label,
        color: `var(--chart-${(index % sliceColorCount) + 1})`,
      },
    ])
  )
}

const defaultValueFormat = (value: number, share: number) =>
  `${Math.round(share * 100)}%`

export function WidgetDonut({
  title,
  hint,
  slices,
  valueFormat = defaultValueFormat,
  emptyTitle = "No data",
  loading = false,
  gradient,
  className,
}: WidgetDonutProps) {
  const { total, shares } = computeDonutShares(slices)
  const isEmpty = slices.length === 0 || total === 0

  return (
    <Card className={className} style={gradientSurfaceStyle(gradient)}>
      {title || hint ? (
        <CardHeader>
          {title ? (
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
          ) : null}
          {hint ? <CardDescription>{hint}</CardDescription> : null}
        </CardHeader>
      ) : null}
      <CardContent aria-busy={loading || undefined}>
        {loading ? (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <Skeleton className="aspect-square h-40 w-40 shrink-0 rounded-full" />
            <ul className="flex w-full flex-1 flex-col gap-2">
              {Array.from({ length: skeletonLegendRowCount }, (_, index) => (
                <li key={index} className="flex items-center gap-2 text-sm">
                  <Skeleton className="size-2 shrink-0 rounded-[2px]" />
                  <Skeleton className="h-3.5 flex-1" />
                  <Skeleton className="h-3.5 w-8 shrink-0" />
                </li>
              ))}
            </ul>
          </div>
        ) : isEmpty ? (
          <StateEmpty title={emptyTitle} />
        ) : (
          <div className="flex flex-col items-center gap-4 sm:flex-row">
            <ChartContainer
              config={buildDonutConfig(slices)}
              className="aspect-square h-40 w-40 shrink-0"
            >
              <PieChart>
                <ChartTooltip
                  isAnimationActive={false}
                  content={<ChartTooltipContent hideLabel nameKey="label" />}
                />
                <Pie
                  data={shares}
                  dataKey="value"
                  nameKey="label"
                  innerRadius="60%"
                  outerRadius="80%"
                  startAngle={90}
                  endAngle={450}
                  isAnimationActive={false}
                  strokeWidth={2}
                >
                  {shares.map((slice) => (
                    <Cell key={slice.id} fill={`var(--color-${slice.id})`} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <ul className="flex w-full flex-1 flex-col gap-2">
              {shares.map((slice) => (
                <li key={slice.id} className="flex items-center gap-2 text-sm">
                  <span
                    aria-hidden="true"
                    className="size-2 shrink-0 rounded-[2px]"
                    style={{ backgroundColor: `var(--color-${slice.id})` }}
                  />
                  <span className="min-w-0 flex-1 truncate">{slice.label}</span>
                  <span className="text-muted-foreground tabular-nums">
                    {valueFormat(slice.value, slice.share)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
