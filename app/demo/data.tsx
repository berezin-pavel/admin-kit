import {
  Backpack,
  Coffee,
  Headphones,
  LayoutDashboard,
  Package,
  Shirt,
  ShoppingCart,
  SportShoe,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { AdminNavItem } from "@/registry/admin-shell/admin-shell"
import type { StatusTone } from "@/registry/status-badge/status-badge"
import type { WidgetChartSeries } from "@/registry/widget-chart/widget-chart"
import type { WidgetListItem } from "@/registry/widget-list/widget-list"
import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"

export const demoNav: readonly AdminNavItem[] = [
  { href: "/demo", title: "Overview", icon: LayoutDashboard },
  { href: "/demo/orders", title: "Orders", icon: ShoppingCart },
  { href: "/demo/order", title: "Order #4187", icon: Package },
]

export const demoMonths = [
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

export const demoFinanceSeries: readonly WidgetChartSeries[] = [
  {
    id: "revenue",
    label: "Revenue",
    values: [298, 312, 356, 379, 402, 431, 458, 486, 512, 549, 601, 668],
  },
  {
    id: "expenses",
    label: "Expenses",
    values: [210, 205, 230, 235, 245, 255, 260, 270, 275, 285, 300, 320],
  },
  {
    id: "profit",
    label: "Profit",
    values: [88, 107, 126, 144, 157, 176, 198, 216, 237, 264, 301, 348],
  },
]

export const demoOrdersByChannelSeries: readonly WidgetChartSeries[] = [
  {
    id: "online",
    label: "Online",
    values: [115, 109, 133, 145, 157, 173, 184, 195, 188, 214, 235, 271],
  },
  {
    id: "retail",
    label: "Retail",
    values: [95, 89, 102, 105, 110, 116, 117, 117, 110, 116, 121, 131],
  },
]

export const demoNewCustomersSeries: readonly WidgetChartSeries[] = [
  {
    id: "customers",
    label: "New customers",
    values: [40, 38, 52, 61, 58, 66, 70, 75, 68, 82, 91, 103],
  },
]

export type OrderStatus = "delivered" | "in-transit" | "paid" | "cancelled"

export interface OrderRow {
  number: string
  customer: string
  product: string
  status: OrderStatus
  total: string
}

export const orderStatusLabel: Record<OrderStatus, string> = {
  delivered: "Delivered",
  "in-transit": "Shipped",
  paid: "Paid",
  cancelled: "Cancelled",
}

export const orderStatusTone: Record<OrderStatus, StatusTone> = {
  delivered: "success",
  "in-transit": "neutral",
  paid: "warning",
  cancelled: "danger",
}

const orderStatusClassName: Record<OrderStatus, string> = {
  delivered: "text-primary",
  "in-transit": "text-muted-foreground",
  paid: "text-muted-foreground",
  cancelled: "text-destructive",
}

export const demoOrderColumns: readonly WidgetTableColumn<OrderRow>[] = [
  { id: "number", title: "Number", cell: (row) => row.number },
  { id: "customer", title: "Customer", cell: (row) => row.customer },
  { id: "product", title: "Product", cell: (row) => row.product },
  {
    id: "status",
    title: "Status",
    cell: (row) => (
      <span className={cn("font-medium", orderStatusClassName[row.status])}>
        {orderStatusLabel[row.status]}
      </span>
    ),
  },
  { id: "total", title: "Amount", align: "right", cell: (row) => row.total },
]

export const demoOrderRows: readonly OrderRow[] = [
  {
    number: "4187",
    customer: "Smith E.",
    product: "Nova Sneakers",
    status: "delivered",
    total: "$2,340",
  },
  {
    number: "4186",
    customer: "Cooper D.",
    product: "Pulse Headphones",
    status: "in-transit",
    total: "$890",
  },
  {
    number: "4185",
    customer: "Novak O.",
    product: "City Backpack",
    status: "paid",
    total: "$1,120",
  },
  {
    number: "4184",
    customer: "Walker P.",
    product: "Basic Hoodie",
    status: "delivered",
    total: "$1,480",
  },
  {
    number: "4183",
    customer: "Frost T.",
    product: "Loop Travel Mug",
    status: "cancelled",
    total: "$640",
  },
  {
    number: "4182",
    customer: "Hawkins I.",
    product: "Nova Sneakers",
    status: "in-transit",
    total: "$2,890",
  },
]

export const demoProductItems: readonly WidgetListItem[] = [
  {
    id: "sneakers-nova",
    title: "Nova Sneakers",
    description: "Footwear",
    meta: "86 sales",
    icon: SportShoe,
  },
  {
    id: "headphones-pulse",
    title: "Pulse Headphones",
    description: "Electronics",
    meta: "64 sales",
    icon: Headphones,
  },
  {
    id: "backpack-city",
    title: "City Backpack",
    description: "Accessories",
    meta: "51 sales",
    icon: Backpack,
  },
  {
    id: "hoodie-basic",
    title: "Basic Hoodie",
    description: "Apparel",
    meta: "43 sales",
    icon: Shirt,
  },
  {
    id: "mug-loop",
    title: "Loop Travel Mug",
    description: "Accessories",
    meta: "38 sales",
    icon: Coffee,
  },
]
