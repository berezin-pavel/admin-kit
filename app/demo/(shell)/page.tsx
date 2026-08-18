"use client"

import { useMemo, useState } from "react"

import { DemoStandaloneTable } from "@/components/demo-standalone-table"
import {
  DateRangeField,
  defaultDateRangePresets,
  formatDateRangeValue,
  parseDateRangeValue,
} from "@/registry/date-range-field/date-range-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { WidgetActivity } from "@/registry/widget-activity/widget-activity"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetDonut } from "@/registry/widget-donut/widget-donut"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetProgress } from "@/registry/widget-progress/widget-progress"
import { Button } from "@/components/ui/button"
import { RotateCw } from "lucide-react"

import {
  formatDemoCurrency,
  formatDemoNumber,
  getDemoActivityEntries,
  getDemoDailyMetrics,
  getDemoMetricsInRange,
  getDemoMonths,
  getDemoGoalTone,
  getDemoMonthlyOrdersGoal,
  getDemoMonthlyRevenueGoal,
  getDemoNewCustomersSeries,
  getDemoOrderStatusSlices,
  getDemoOrdersByChannelSeries,
  getDemoPreviousRange,
  getDemoPaymentSlices,
  getDemoProductItems,
  getDemoTopCustomerItems,
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
  const donutEmptyTitle =
    locale === "ru" ? localeRu.widgetDonut.emptyTitle : undefined
  const activityLabels = locale === "ru" ? localeRu.widgetActivity : undefined
  const targetLabel =
    locale === "ru" ? localeRu.widgetProgress.targetLabel : undefined

  const [rangeValue, setRangeValue] = useState(getDefaultOverviewRangeValue)
  const [reloading, setReloading] = useState(false)
  const dailyMetrics = useMemo(() => getDemoDailyMetrics(), [])
  const range = useMemo(() => parseDateRangeValue(rangeValue), [rangeValue])

  const periodMetrics = useMemo(
    () => getDemoMetricsInRange(dailyMetrics, range),
    [dailyMetrics, range]
  )

  const summary = useMemo(
    () => summarizeDemoMetrics(periodMetrics),
    [periodMetrics]
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
    () => getDemoRevenueChartData(periodMetrics, locale),
    [periodMetrics, locale]
  )

  const ordersTrend = useMemo(
    () => periodMetrics.map((metric) => metric.orders),
    [periodMetrics]
  )
  const revenueTrend = useMemo(
    () => periodMetrics.map((metric) => metric.revenue),
    [periodMetrics]
  )
  const averageOrderTrend = useMemo(
    () =>
      periodMetrics.map((metric) =>
        metric.orders > 0 ? Math.round(metric.revenue / metric.orders) : 0
      ),
    [periodMetrics]
  )

  const donutSlices = useMemo(
    () => getDemoOrderStatusSlices(locale, range),
    [locale, range]
  )
  const paymentSlices = useMemo(() => getDemoPaymentSlices(locale), [locale])
  const refundsTrend = useMemo(
    () => periodMetrics.map((metric) => Math.round(metric.orders * 0.018)),
    [periodMetrics]
  )
  const refunds = refundsTrend.reduce((sum, value) => sum + value, 0)
  const activityEntries = useMemo(
    () => getDemoActivityEntries(locale),
    [locale]
  )
  const monthlyGoal = useMemo(
    () => getDemoMonthlyRevenueGoal(dailyMetrics),
    [dailyMetrics]
  )
  const monthlyOrdersGoal = useMemo(
    () => getDemoMonthlyOrdersGoal(dailyMetrics),
    [dailyMetrics]
  )

  const reload = () => {
    setReloading(true)
    window.setTimeout(() => setReloading(false), 1200)
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <WidgetMetric
          title={strings.metricOrdersTitle}
          value={formatDemoNumber(summary.orderCount, locale)}
          trend={
            previousSummary
              ? buildDemoMetricTrend(summary.orderCount, previousSummary.orderCount)
              : undefined
          }
          trendValues={ordersTrend}
          trendTooltipFormat={(value) => formatDemoNumber(value, locale)}
          hint={strings.metricHint}
          loading={reloading}
          blockId="overview.orders"
        />
        <WidgetMetric
          title={strings.metricRevenueTitle}
          value={formatDemoCurrency(summary.revenue, locale)}
          trend={
            previousSummary
              ? buildDemoMetricTrend(summary.revenue, previousSummary.revenue)
              : undefined
          }
          trendValues={revenueTrend}
          trendTooltipFormat={(value) => formatDemoCurrency(value, locale)}
          hint={strings.metricHint}
          loading={reloading}
          blockId="overview.revenue"
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
          trendValues={averageOrderTrend}
          trendTooltipFormat={(value) => formatDemoCurrency(value, locale)}
          hint={strings.metricHint}
          loading={reloading}
          blockId="overview.average"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <WidgetProgress
          title={strings.progressTitle}
          value={monthlyGoal.value}
          max={monthlyGoal.max}
          target={monthlyGoal.target}
          targetLabel={targetLabel}
          tone={getDemoGoalTone(monthlyGoal)}
          hint={strings.progressHint(
            formatDemoCurrency(monthlyGoal.value, locale),
            formatDemoCurrency(monthlyGoal.max, locale)
          )}
          loading={reloading}
          blockId="overview.goal-revenue"
        />
        <WidgetProgress
          title={strings.progressOrdersTitle}
          value={monthlyOrdersGoal.value}
          max={monthlyOrdersGoal.max}
          target={monthlyOrdersGoal.target}
          targetLabel={targetLabel}
          tone={getDemoGoalTone(monthlyOrdersGoal)}
          hint={strings.progressOrdersHint(
            formatDemoNumber(monthlyOrdersGoal.value, locale),
            formatDemoNumber(monthlyOrdersGoal.max, locale)
          )}
          loading={reloading}
          blockId="overview.goal-orders"
        />
        <WidgetMetric
          title={strings.metricRefundsTitle}
          value={formatDemoNumber(refunds, locale)}
          hint={strings.metricHint}
          trend={{ direction: "down", value: "-0.4%", tone: "positive" }}
          trendValues={refundsTrend}
          loading={reloading}
          blockId="overview.refunds"
        />
      </div>
      <WidgetChart
        title={strings.financeChartTitle}
        labels={revenueChart.labels}
        series={revenueChart.series}
        hint={strings.financeChartHint}
        emptyTitle={chartEmptyTitle}
        loading={reloading}
        blockId="overview.finance"
        toolbar={
          <>
            <Button variant="outline" onClick={reload} disabled={reloading}>
              <RotateCw className={reloading ? "size-4 animate-spin" : "size-4"} />
              {strings.reloadButton}
            </Button>
            <DateRangeField
            value={rangeValue}
            onChange={setRangeValue}
            className="w-64"
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
          </>
        }
      />
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetChart
          title={strings.ordersByChannelChartTitle}
          labels={getDemoMonths(locale)}
          series={getDemoOrdersByChannelSeries(locale)}
          kind="bar"
          emptyTitle={chartEmptyTitle}
          loading={reloading}
          blockId="overview.channel"
        />
        <WidgetChart
          title={strings.newCustomersChartTitle}
          labels={getDemoMonths(locale)}
          series={getDemoNewCustomersSeries(locale)}
          emptyTitle={chartEmptyTitle}
          loading={reloading}
          blockId="overview.customers"
        />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetDonut
          title={strings.donutTitle}
          hint={strings.metricHint}
          slices={donutSlices}
          emptyTitle={donutEmptyTitle}
          loading={reloading}
          blockId="overview.split"
        />
        <WidgetDonut
          title={strings.paymentsDonutTitle}
          hint={strings.metricHint}
          slices={paymentSlices}
          emptyTitle={donutEmptyTitle}
          loading={reloading}
          blockId="overview.payments"
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-4">
          <DemoStandaloneTable loading={reloading} blockId="overview.recent-orders" />
          <WidgetList
            title={strings.productsTitle}
            items={getDemoProductItems(locale)}
            emptyTitle={emptyTitle}
            loading={reloading}
            blockId="overview.products"
            className="flex-1"
          />
        </div>
        <div className="flex flex-col gap-4">
          <WidgetActivity
            title={strings.activityTitle}
            entries={activityEntries}
            labels={activityLabels}
            locale={locale === "ru" ? localeRu.widgetActivity.locale : undefined}
            dayFormat={
              locale === "ru" ? localeRu.widgetActivity.dayFormat : undefined
            }
            loading={reloading}
            blockId="overview.activity"
          />
          <WidgetList
            title={strings.topCustomersTitle}
            items={getDemoTopCustomerItems(locale)}
            emptyTitle={emptyTitle}
            loading={reloading}
            blockId="overview.top-customers"
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
