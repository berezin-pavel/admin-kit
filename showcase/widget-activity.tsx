import { CreditCard, PackageCheck, Truck, XCircle } from "lucide-react"

import {
  WidgetActivity,
  type WidgetActivityEntry,
} from "@/registry/widget-activity/widget-activity"

import type { ShowcaseEntry } from "./types"

function formatTimestamp(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

function dayAt(daysAgo: number, hour: number, minute: number): Date {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  date.setHours(hour, minute, 0, 0)
  return date
}

function buildEntries(): readonly WidgetActivityEntry[] {
  return [
    {
      id: "1",
      title: "Order #4192 paid",
      meta: "Emily Carter",
      icon: CreditCard,
      timestamp: formatTimestamp(dayAt(0, 9, 15)),
    },
    {
      id: "2",
      title: "Order #4189 shipped",
      meta: "Daniel Cooper",
      icon: Truck,
      timestamp: formatTimestamp(dayAt(0, 17, 40)),
    },
    {
      id: "3",
      title: "Order #4185 delivered",
      meta: "Olivia Novak",
      icon: PackageCheck,
      timestamp: formatTimestamp(dayAt(1, 10, 5)),
    },
    {
      id: "4",
      title: "Order #4181 cancelled",
      meta: "Peter Walker",
      icon: XCircle,
      timestamp: formatTimestamp(dayAt(1, 15, 20)),
    },
    {
      id: "5",
      title: "Order #4172 delivered",
      meta: "Tanya Frost",
      icon: PackageCheck,
      timestamp: formatTimestamp(dayAt(4, 12, 0)),
    },
  ]
}

export const widgetActivityEntry: ShowcaseEntry = {
  item: "widget-activity",
  title: "Activity widget",
  description:
    "A card with a feed of recent events for a dashboard: rows grouped by calendar day under Today / Yesterday / an absolute date header, each with an optional icon, a title, a muted meta line, and a right-aligned time. timestamp follows date-time-field's strict local-component format (YYYY-MM-DDTHH:mm) and is parsed the same way. Without entries it shows a default state.",
  views: [
    {
      id: "grouped",
      name: "Today, yesterday, and earlier",
      render: () => <WidgetActivity title="Recent activity" entries={buildEntries()} />,
    },
    {
      id: "empty",
      name: "No activity",
      render: () => <WidgetActivity title="Recent activity" entries={[]} />,
    },
  ],
}
