import { DemoColorField } from "@/components/demo-color-field"
import { DemoConfirmDialog } from "@/components/demo-confirm-dialog"
import { DemoDateField } from "@/components/demo-date-field"
import { DemoDateTimeField } from "@/components/demo-date-time-field"
import { DemoHint } from "@/components/demo-hint"
import { DemoStandaloneTable } from "@/components/demo-standalone-table"
import { DemoTimeField } from "@/components/demo-time-field"
import { DemoToaster } from "@/components/demo-toaster"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetPlaceholder } from "@/registry/widget-placeholder/widget-placeholder"

import {
  demoFinanceSeries,
  demoMonths,
  demoNewCustomersSeries,
  demoOrdersByChannelSeries,
  demoProductItems,
} from "./data"

export default function DemoPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-3">
        <WidgetMetric
          title="Orders"
          value="312"
          trend={{ direction: "up", value: "+12%" }}
          hint="over the last 30 days"
        />
        <WidgetMetric
          title="Revenue"
          value="$486,300"
          trend={{ direction: "up", value: "+8%" }}
          hint="over the last 30 days"
        />
        <WidgetMetric
          title="Average order"
          value="$1,559"
          trend={{ direction: "down", value: "−4%" }}
          hint="over the last 30 days"
        />
      </div>
      <WidgetChart
        title="Revenue, expenses, and profit by month"
        labels={demoMonths}
        series={demoFinanceSeries}
        hint="in thousands of dollars"
      />
      <div className="grid gap-4 md:grid-cols-2">
        <WidgetChart
          title="Orders by channel"
          labels={demoMonths}
          series={demoOrdersByChannelSeries}
          kind="bar"
        />
        <WidgetChart
          title="New customers by month"
          labels={demoMonths}
          series={demoNewCustomersSeries}
        />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <DemoStandaloneTable />
        <div className="flex flex-col gap-4">
          <WidgetList title="Products" items={demoProductItems} />
          <WidgetPlaceholder
            title="Conversion widget"
            hint="Connect analytics to add it here"
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Form fields</CardTitle>
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
          <CardTitle>Feedback and hints</CardTitle>
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
