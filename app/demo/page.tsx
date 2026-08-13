"use client"

import { useMemo, useState } from "react"

import { DemoColorField } from "@/components/demo-color-field"
import { DemoConfirmDialog } from "@/components/demo-confirm-dialog"
import { DemoDateField } from "@/components/demo-date-field"
import { DemoDateTimeField } from "@/components/demo-date-time-field"
import { DemoHint } from "@/components/demo-hint"
import { DemoStandaloneTable } from "@/components/demo-standalone-table"
import { DemoTimeField } from "@/components/demo-time-field"
import { DemoToaster } from "@/components/demo-toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DateRangeField,
  defaultDateRangePresets,
  formatDateRangeValue,
  parseDateRangeValue,
} from "@/registry/date-range-field/date-range-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { PageHeader } from "@/registry/page-header/page-header"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetPlaceholder } from "@/registry/widget-placeholder/widget-placeholder"

import {
  formatDemoCurrency,
  formatDemoNumber,
  getDemoDailyMetrics,
  getDemoMetricsInRange,
  getDemoMonths,
  getDemoNewCustomersSeries,
  getDemoOrdersByChannelSeries,
  getDemoPreviousRange,
  getDemoProductItems,
  getDemoRevenueChartData,
  summarizeDemoMetrics,
} from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

function getDefaultOverviewRangeValue(): string {
  const today = new Date()
  const thisMonth = defaultDateRangePresets.find(
    (preset) => preset.id === "this-month"
  )

  return formatDateRangeValue(
    thisMonth
      ? thisMonth.getRange(today)
      : { from: today, to: today }
  )
}

interface DemoMetricTrend {
  direction: "up" | "down"
  value: string
}

function buildDemoMetricTrend(
  current: number,
  previous: number
): DemoMetricTrend | undefined {
  if (previous === 0) {
    return undefined
  }

  const change = Math.round(((current - previous) / previous) * 100)

  if (change === 0) {
    return undefined
  }

  return {
    direction: change > 0 ? "up" : "down",
    value: `${change > 0 ? "+" : ""}${change}%`,
  }
}

export default function DemoPage() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].overview
  const emptyTitle = locale === "ru" ? localeRu.widgetList.emptyTitle : undefined
  const chartEmptyTitle =
    locale === "ru" ? localeRu.widgetChart.emptyTitle : undefined

  const [rangeValue, setRangeValue] = useState(getDefaultOverviewRangeValue)
  const dailyMetrics = useMemo(() => getDemoDailyMetrics(), [])
  const range = useMemo(() => parseDateRangeValue(rangeValue), [rangeValue])

  const summary = useMemo(
    () => summarizeDemoMetrics(getDemoMetricsInRange(dailyMetrics, range)),
    [dailyMetrics, range]
  )
  const previousSummary = useMemo(() => {
    if (!range) {
      return undefined
    }

    return summarizeDemoMetrics(
      getDemoMetricsInRange(dailyMetrics, getDemoPreviousRange(range))
    )
  }, [dailyMetrics, range])

  const revenueChart = useMemo(
    () => getDemoRevenueChartData(getDemoMetricsInRange(dailyMetrics, range), locale),
    [dailyMetrics, range, locale]
  )

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title={strings.title}
        actions={
          <DateRangeField
            value={rangeValue}
            onChange={setRangeValue}
            locale={locale === "ru" ? localeRu.dateRangeField.locale : undefined}
            displayFormat={
              locale === "ru" ? localeRu.dateRangeField.displayFormat : undefined
            }
            placeholder={
              locale === "ru" ? localeRu.dateRangeField.placeholder : undefined
            }
            presets={
              locale === "ru" ? localeRu.dateRangeField.presets : undefined
            }
          />
        }
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <WidgetMetric
          title={strings.metricOrdersTitle}
          value={formatDemoNumber(summary.orderCount, locale)}
          trend={
            previousSummary
              ? buildDemoMetricTrend(summary.orderCount, previousSummary.orderCount)
              : undefined
          }
          hint={strings.metricHint}
        />
        <WidgetMetric
          title={strings.metricRevenueTitle}
          value={formatDemoCurrency(summary.revenue, locale)}
          trend={
            previousSummary
              ? buildDemoMetricTrend(summary.revenue, previousSummary.revenue)
              : undefined
          }
          hint={strings.metricHint}
        />
        <WidgetMetric
          title={strings.metricAverageOrderTitle}
          value={formatDemoCurrency(summary.averageOrder, locale)}
          trend={
            previousSummary
              ? buildDemoMetricTrend(
                  summary.averageOrder,
                  previousSummary.averageOrder
                )
              : undefined
          }
          hint={strings.metricHint}
        />
      </div>
      <WidgetChart
        title={strings.financeChartTitle}
        labels={revenueChart.labels}
        series={revenueChart.series}
        hint={strings.financeChartHint}
        emptyTitle={chartEmptyTitle}
      />
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetChart
          title={strings.ordersByChannelChartTitle}
          labels={getDemoMonths(locale)}
          series={getDemoOrdersByChannelSeries(locale)}
          kind="bar"
          emptyTitle={chartEmptyTitle}
        />
        <WidgetChart
          title={strings.newCustomersChartTitle}
          labels={getDemoMonths(locale)}
          series={getDemoNewCustomersSeries(locale)}
          emptyTitle={chartEmptyTitle}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DemoStandaloneTable />
        <div className="flex flex-col gap-4">
          <WidgetList
            title={strings.productsTitle}
            items={getDemoProductItems(locale)}
            emptyTitle={emptyTitle}
          />
          <WidgetPlaceholder
            title={strings.placeholderTitle}
            hint={strings.placeholderHint}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{strings.formFieldsCardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <DemoDateField />
          <DemoDateTimeField />
          <DemoTimeField />
          <DemoColorField />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{strings.feedbackCardTitle}</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-6">
          <DemoToaster />
          <DemoConfirmDialog />
          <DemoHint />
        </CardContent>
      </Card>
    </div>
  )
}
