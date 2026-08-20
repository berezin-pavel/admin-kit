import { Button } from "@/components/ui/button"
import {
  WidgetChart,
  type WidgetChartSeries,
} from "@/registry/widget-chart/widget-chart"

import { WidgetChartToolbarView } from "./widget-chart-toolbar-view"
import type { ShowcaseEntry } from "./types"

const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const

const revenueSeries: readonly WidgetChartSeries[] = [
  {
    id: "revenue",
    label: "Revenue",
    values: [
      820, 932, 901, 1204, 1390, 1280, 1340, 1450, 1510, 1602, 1780, 2040,
    ],
  },
]

const revenueExpenseProfitSeries: readonly WidgetChartSeries[] = [
  {
    id: "revenue",
    label: "Revenue",
    values: [
      820, 932, 901, 1204, 1390, 1280, 1340, 1450, 1510, 1602, 1780, 2040,
    ],
  },
  {
    id: "expenses",
    label: "Expenses",
    values: [560, 610, 640, 720, 780, 760, 790, 830, 860, 900, 960, 1080],
  },
  {
    id: "profit",
    label: "Profit",
    values: [260, 322, 261, 484, 610, 520, 550, 620, 650, 702, 820, 960],
  },
]

const regionSeries: readonly WidgetChartSeries[] = [
  {
    id: "north",
    label: "North",
    values: [120, 132, 141, 154, 190, 180, 174, 190, 210, 202, 220, 240],
  },
  {
    id: "south",
    label: "South",
    values: [98, 112, 105, 130, 148, 142, 150, 160, 168, 172, 185, 205],
  },
  {
    id: "east",
    label: "East",
    values: [76, 84, 90, 96, 110, 108, 112, 120, 126, 130, 140, 155],
  },
  {
    id: "west",
    label: "West",
    values: [64, 70, 68, 78, 88, 92, 95, 100, 104, 110, 118, 128],
  },
  {
    id: "central",
    label: "Central",
    values: [140, 150, 158, 170, 185, 178, 182, 195, 205, 212, 225, 245],
  },
  {
    id: "online",
    label: "Online",
    values: [200, 220, 235, 260, 300, 290, 305, 330, 350, 365, 390, 420],
  },
]

export const widgetChartEntry: ShowcaseEntry = {
  item: "widget-chart",
  title: "Chart widget",
  description:
    "A card with a chart for a dashboard: a shared labels axis and a list of series, each with its own values. The kind prop switches between a line and bars, series color cycles through the chart-1…chart-5 tokens, and the legend appears once there's more than one series. Without labels or without at least one series it shows a default state.",
  views: [
    {
      id: "single-line",
      name: "One series, line",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          labels={months}
          series={revenueSeries}
        />
      ),
    },
    {
      id: "single-bar",
      name: "One series, bars",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          labels={months}
          series={revenueSeries}
          kind="bar"
        />
      ),
    },
    {
      id: "three-series-line",
      name: "Three series, lines",
      render: () => (
        <WidgetChart
          title="Revenue, expenses, and profit"
          labels={months}
          series={revenueExpenseProfitSeries}
          hint="in thousands of dollars"
        />
      ),
    },
    {
      id: "three-series-bar",
      name: "Three series, bars",
      render: () => (
        <WidgetChart
          title="Revenue, expenses, and profit"
          labels={months}
          series={revenueExpenseProfitSeries}
          kind="bar"
        />
      ),
    },
    {
      id: "six-series",
      name: "Six series, cycling colors",
      render: () => (
        <WidgetChart
          title="Sales by region"
          labels={months}
          series={regionSeries}
        />
      ),
    },
    {
      id: "large-heading",
      name: "Large heading with a summary",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          labels={months}
          series={revenueSeries}
          heading="large"
          summary="$2,040 this month"
        />
      ),
    },
    {
      id: "large-heading-with-toolbar",
      name: "Large heading, summary, and a toolbar",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          labels={months}
          series={revenueSeries}
          heading="large"
          summary="$2,040 this month"
          toolbar={
            <Button type="button" variant="outline" size="sm">
              This month
            </Button>
          }
        />
      ),
    },
    {
      id: "with-toolbar",
      name: "With a period picker in the toolbar",
      render: () => <WidgetChartToolbarView />,
    },
    {
      id: "empty",
      name: "No data",
      render: () => (
        <WidgetChart title="Revenue by month" labels={[]} series={[]} />
      ),
    },
    {
      id: "loading",
      name: "Loading",
      render: () => (
        <WidgetChart
          title="Revenue by month"
          labels={months}
          series={revenueSeries}
          loading
        />
      ),
    },
    {
      id: "gradient",
      name: "With a gradient backdrop",
      render: () => (
        <WidgetChart
          title="Revenue, expenses, and profit"
          labels={months}
          series={revenueExpenseProfitSeries}
          hint="in thousands of dollars"
          gradient="purple"
        />
      ),
    },
  ],
}
