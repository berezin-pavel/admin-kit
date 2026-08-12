"use client"

import { DemoColorField } from "@/components/demo-color-field"
import { DemoConfirmDialog } from "@/components/demo-confirm-dialog"
import { DemoDateField } from "@/components/demo-date-field"
import { DemoDateTimeField } from "@/components/demo-date-time-field"
import { DemoHint } from "@/components/demo-hint"
import { DemoStandaloneTable } from "@/components/demo-standalone-table"
import { DemoTimeField } from "@/components/demo-time-field"
import { DemoToaster } from "@/components/demo-toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetPlaceholder } from "@/registry/widget-placeholder/widget-placeholder"

import {
  getDemoFinanceSeries,
  getDemoMonths,
  getDemoNewCustomersSeries,
  getDemoOrdersByChannelSeries,
  getDemoProductItems,
} from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export default function DemoPage() {
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].overview
  const emptyTitle = locale === "ru" ? localeRu.widgetList.emptyTitle : undefined
  const chartEmptyTitle =
    locale === "ru" ? localeRu.widgetChart.emptyTitle : undefined

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <WidgetMetric
          title={strings.metricOrdersTitle}
          value="312"
          trend={{ direction: "up", value: "+12%" }}
          hint={strings.metricHint}
        />
        <WidgetMetric
          title={strings.metricRevenueTitle}
          value={locale === "ru" ? "₽ 486 300" : "$486,300"}
          trend={{ direction: "up", value: "+8%" }}
          hint={strings.metricHint}
        />
        <WidgetMetric
          title={strings.metricAverageOrderTitle}
          value={locale === "ru" ? "₽ 1 559" : "$1,559"}
          trend={{ direction: "down", value: "−4%" }}
          hint={strings.metricHint}
        />
      </div>
      <WidgetChart
        title={strings.financeChartTitle}
        labels={getDemoMonths(locale)}
        series={getDemoFinanceSeries(locale)}
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
