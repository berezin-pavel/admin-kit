"use client"

import { useState } from "react"

import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import {
  defaultAdminAppearance,
  type AdminAppearance,
} from "@/registry/admin-appearance/appearance-palette"
import { AppearanceMenu } from "@/registry/appearance-menu/appearance-menu"
import { WidgetList } from "@/registry/widget-list/widget-list"
import { WidgetMetric } from "@/registry/widget-metric/widget-metric"
import { WidgetProgress } from "@/registry/widget-progress/widget-progress"

const initialBlocksAppearance: AdminAppearance = {
  ...defaultAdminAppearance,
  blocks: {
    revenue: { gradient: "ember" },
    orders: { gradient: "meadow" },
    visits: { gradient: "ocean" },
  },
}

const appearanceMenuPages = [
  { id: "overview", label: "Overview" },
  { id: "orders", label: "Orders" },
]

function AppearanceBlocksGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <WidgetMetric
        blockId="revenue"
        title="Revenue"
        value="$18,420"
        trend={{ direction: "up", value: "+8.2%" }}
      />
      <WidgetProgress
        blockId="orders"
        title="Monthly goal"
        value={64}
        target={80}
      />
      <WidgetList
        blockId="visits"
        title="Recent visits"
        items={[
          { id: "1", title: "Ana Torres", description: "Viewed pricing" },
          { id: "2", title: "Mateo Ruiz", description: "Signed up" },
          { id: "3", title: "Priya Nair", description: "Started a trial" },
        ]}
      />
    </div>
  )
}

export function AdminAppearanceBlocksView() {
  const [value, setValue] = useState<AdminAppearance>(initialBlocksAppearance)

  return (
    <AppearanceProvider value={value} onChange={setValue} editable>
      <AppearanceBlocksGrid />
    </AppearanceProvider>
  )
}

export function AdminAppearanceReadOnlyView() {
  const [value, setValue] = useState<AdminAppearance>(initialBlocksAppearance)

  return (
    <AppearanceProvider value={value} onChange={setValue}>
      <AppearanceBlocksGrid />
    </AppearanceProvider>
  )
}

export function AppearanceMenuView() {
  const [value, setValue] = useState<AdminAppearance>(defaultAdminAppearance)

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
      <AppearanceMenu
        value={value}
        onChange={setValue}
        pages={appearanceMenuPages}
      />
      <pre className="min-w-0 flex-1 overflow-x-auto rounded-md bg-muted p-3 text-xs">
        {JSON.stringify(value, null, 2)}
      </pre>
    </div>
  )
}
