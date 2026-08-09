import {
  Backpack,
  Coffee,
  Headphones,
  LayoutDashboard,
  Package,
  Settings,
  Shirt,
  ShoppingCart,
  SportShoe,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import type { AdminNavItem } from "@/registry/admin-shell/admin-shell"
import type { WidgetChartPoint } from "@/registry/widget-chart/widget-chart"
import type { WidgetListItem } from "@/registry/widget-list/widget-list"
import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"

export const demoNav: readonly AdminNavItem[] = [
  { href: "/", title: "Overview", icon: LayoutDashboard },
  { href: "/orders", title: "Orders", icon: ShoppingCart },
  { href: "/products", title: "Products", icon: Package },
  { href: "/customers", title: "Customers", icon: Users },
  { href: "/settings", title: "Settings", icon: Settings },
]

export const demoRevenueByMonth: readonly WidgetChartPoint[] = [
  { label: "Jan", value: 298 },
  { label: "Feb", value: 312 },
  { label: "Mar", value: 356 },
  { label: "Apr", value: 379 },
  { label: "May", value: 402 },
  { label: "Jun", value: 431 },
  { label: "Jul", value: 458 },
  { label: "Aug", value: 486 },
  { label: "Sep", value: 512 },
  { label: "Oct", value: 549 },
  { label: "Nov", value: 601 },
  { label: "Dec", value: 668 },
]

export const demoOrdersByMonth: readonly WidgetChartPoint[] = [
  { label: "Jan", value: 210 },
  { label: "Feb", value: 198 },
  { label: "Mar", value: 235 },
  { label: "Apr", value: 250 },
  { label: "May", value: 267 },
  { label: "Jun", value: 289 },
  { label: "Jul", value: 301 },
  { label: "Aug", value: 312 },
  { label: "Sep", value: 298 },
  { label: "Oct", value: 330 },
  { label: "Nov", value: 356 },
  { label: "Dec", value: 402 },
]

export const demoNewCustomersByMonth: readonly WidgetChartPoint[] = [
  { label: "Jan", value: 40 },
  { label: "Feb", value: 38 },
  { label: "Mar", value: 52 },
  { label: "Apr", value: 61 },
  { label: "May", value: 58 },
  { label: "Jun", value: 66 },
  { label: "Jul", value: 70 },
  { label: "Aug", value: 75 },
  { label: "Sep", value: 68 },
  { label: "Oct", value: 82 },
  { label: "Nov", value: 91 },
  { label: "Dec", value: 103 },
]

type OrderStatus = "delivered" | "in-transit" | "paid" | "cancelled"

interface OrderRow {
  number: string
  customer: string
  product: string
  status: OrderStatus
  total: string
}

const orderStatusLabel: Record<OrderStatus, string> = {
  delivered: "Delivered",
  "in-transit": "Shipped",
  paid: "Paid",
  cancelled: "Cancelled",
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
