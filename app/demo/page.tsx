import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
import { WidgetChart } from "@/registry/widget-chart/widget-chart"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetPlaceholder } from "@/registry/widget-placeholder/widget-placeholder"
import { WidgetTable } from "@/registry/widget-table/widget-table"

import {
  demoNav,
  demoNewCustomersByMonth,
  demoOrderColumns,
  demoOrderRows,
  demoOrdersByMonth,
  demoProductItems,
  demoRevenueByMonth,
} from "./data"

export default function DemoPage() {
  return (
    <AdminShell
      appName="My Store"
      nav={demoNav}
      activeHref="/"
      header={false}
      sidebarFooter={<DemoThemeToggle />}
    >
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
          title="Revenue by month"
          data={demoRevenueByMonth}
          hint="in thousands of dollars"
        />
        <div className="grid gap-4 md:grid-cols-2">
          <WidgetChart
            title="Orders by month"
            data={demoOrdersByMonth}
            kind="bar"
          />
          <WidgetChart
            title="New customers by month"
            data={demoNewCustomersByMonth}
          />
        </div>
        <div className="grid gap-4 lg:grid-cols-2">
          <WidgetTable
            title="Recent orders"
            columns={demoOrderColumns}
            rows={demoOrderRows}
            getRowKey={(row) => row.number}
          />
          <div className="flex flex-col gap-4">
            <WidgetList title="Products" items={demoProductItems} />
            <WidgetPlaceholder
              title="Conversion widget"
              hint="Connect analytics to add it here"
            />
          </div>
        </div>
      </div>
    </AdminShell>
  )
}
