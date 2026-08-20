"use client"

import { useState } from "react"
import { CreditCard, PackageX, TriangleAlert, UserPlus } from "lucide-react"

import {
  NotificationsMenu,
  type NotificationItem,
} from "@/registry/notifications-menu/notifications-menu"

const initialNotifications: readonly NotificationItem[] = [
  {
    id: "payment",
    title: "Order #1042 paid",
    description: "The card payment cleared and the order moved to packing.",
    timestamp: "2 minutes ago",
    icon: CreditCard,
  },
  {
    id: "stock",
    title: "Espresso beans are out of stock",
    description:
      "Three orders are waiting for the restock. The supplier promised Friday.",
    timestamp: "40 minutes ago",
    icon: PackageX,
  },
  {
    id: "teammate",
    title: "Anna joined the workspace",
    timestamp: "Yesterday",
    icon: UserPlus,
    read: true,
  },
  {
    id: "failure",
    title: "Nightly export failed",
    description: "The report job stopped on a timeout and will retry tonight.",
    timestamp: "Yesterday",
    icon: TriangleAlert,
    read: true,
  },
]

export function NotificationsMenuView() {
  const [notifications, setNotifications] = useState(initialNotifications)

  return (
    <NotificationsMenu
      notifications={notifications}
      onSelect={(id) =>
        setNotifications((current) =>
          current.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        )
      }
      onMarkAllRead={() =>
        setNotifications((current) =>
          current.map((notification) => ({ ...notification, read: true }))
        )
      }
    />
  )
}
