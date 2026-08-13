"use client"

import { useMemo, useState } from "react"

import {
  DateRangeField,
  defaultDateRangePresets,
  formatDateRangeValue,
  parseDateRangeValue,
} from "@/registry/date-range-field/date-range-field"
import {
  WidgetChart,
  type WidgetChartSeries,
} from "@/registry/widget-chart/widget-chart"

function getDefaultRangeValue(): string {
  const thisWeek = defaultDateRangePresets.find(
    (preset) => preset.id === "this-week"
  )
  const today = new Date(2026, 7, 13)

  return formatDateRangeValue(
    thisWeek ? thisWeek.getRange(today) : { from: today, to: today }
  )
}

function buildDay(offset: number): { label: string; revenue: number } {
  const revenue = 14000 + ((offset * 37 + 11) % 23) * 700
  return { label: `Aug ${offset + 1}`, revenue }
}

export function WidgetChartToolbarView() {
  const [value, setValue] = useState(getDefaultRangeValue)

  const { labels, series } = useMemo(() => {
    const range = parseDateRangeValue(value)
    const dayCount = range
      ? Math.min(
          14,
          Math.round(
            (range.to.getTime() - range.from.getTime()) / 86400000
          ) + 1
        )
      : 7
    const days = Array.from({ length: dayCount }, (_, index) =>
      buildDay(index)
    )

    return {
      labels: days.map((day) => day.label),
      series: [
        {
          id: "revenue",
          label: "Revenue",
          values: days.map((day) => day.revenue),
        },
        {
          id: "expenses",
          label: "Expenses",
          values: days.map((day) => Math.round(day.revenue * 0.62)),
        },
      ] satisfies readonly WidgetChartSeries[],
    }
  }, [value])

  return (
    <WidgetChart
      title="Finance by day"
      labels={labels}
      series={series}
      toolbar={
        <DateRangeField value={value} onChange={setValue} className="w-64" />
      }
    />
  )
}
