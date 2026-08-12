import type { ComponentType } from "react"
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

import type { DemoLocale } from "./locale-store"

export type OrderStatus = "delivered" | "in-transit" | "paid" | "cancelled"

export interface OrderRow {
  number: string
  customer: string
  product: string
  status: OrderStatus
  total: string
  createdAt: Date
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

export const orderStatusLabelByLocale: Record<
  DemoLocale,
  Record<OrderStatus, string>
> = {
  en: {
    delivered: "Delivered",
    "in-transit": "Shipped",
    paid: "Paid",
    cancelled: "Cancelled",
  },
  ru: {
    delivered: "Доставлен",
    "in-transit": "В пути",
    paid: "Оплачен",
    cancelled: "Отменён",
  },
}

const NAV_TITLES: Record<
  DemoLocale,
  { overview: string; orders: string; order: string }
> = {
  en: { overview: "Overview", orders: "Orders", order: "Order #4187" },
  ru: { overview: "Обзор", orders: "Заказы", order: "Заказ №4187" },
}

export function getDemoNav(locale: DemoLocale): readonly AdminNavItem[] {
  const titles = NAV_TITLES[locale]

  return [
    { href: "/demo", title: titles.overview, icon: LayoutDashboard },
    { href: "/demo/orders", title: titles.orders, icon: ShoppingCart },
    { href: "/demo/order", title: titles.order, icon: Package },
  ]
}

const MONTHS: Record<DemoLocale, readonly string[]> = {
  en: [
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
  ],
  ru: [
    "Янв",
    "Фев",
    "Мар",
    "Апр",
    "Май",
    "Июн",
    "Июл",
    "Авг",
    "Сен",
    "Окт",
    "Ноя",
    "Дек",
  ],
}

export function getDemoMonths(locale: DemoLocale): readonly string[] {
  return MONTHS[locale]
}

const FINANCE_SERIES_LABELS: Record<
  DemoLocale,
  { revenue: string; expenses: string; profit: string }
> = {
  en: { revenue: "Revenue", expenses: "Expenses", profit: "Profit" },
  ru: { revenue: "Выручка", expenses: "Расходы", profit: "Прибыль" },
}

const FINANCE_SERIES_VALUES = {
  revenue: [298, 312, 356, 379, 402, 431, 458, 486, 512, 549, 601, 668],
  expenses: [210, 205, 230, 235, 245, 255, 260, 270, 275, 285, 300, 320],
  profit: [88, 107, 126, 144, 157, 176, 198, 216, 237, 264, 301, 348],
}

export function getDemoFinanceSeries(
  locale: DemoLocale
): readonly WidgetChartSeries[] {
  const labels = FINANCE_SERIES_LABELS[locale]

  return [
    { id: "revenue", label: labels.revenue, values: FINANCE_SERIES_VALUES.revenue },
    {
      id: "expenses",
      label: labels.expenses,
      values: FINANCE_SERIES_VALUES.expenses,
    },
    { id: "profit", label: labels.profit, values: FINANCE_SERIES_VALUES.profit },
  ]
}

const ORDERS_BY_CHANNEL_LABELS: Record<
  DemoLocale,
  { online: string; retail: string }
> = {
  en: { online: "Online", retail: "Retail" },
  ru: { online: "Онлайн", retail: "Розница" },
}

const ORDERS_BY_CHANNEL_VALUES = {
  online: [115, 109, 133, 145, 157, 173, 184, 195, 188, 214, 235, 271],
  retail: [95, 89, 102, 105, 110, 116, 117, 117, 110, 116, 121, 131],
}

export function getDemoOrdersByChannelSeries(
  locale: DemoLocale
): readonly WidgetChartSeries[] {
  const labels = ORDERS_BY_CHANNEL_LABELS[locale]

  return [
    {
      id: "online",
      label: labels.online,
      values: ORDERS_BY_CHANNEL_VALUES.online,
    },
    {
      id: "retail",
      label: labels.retail,
      values: ORDERS_BY_CHANNEL_VALUES.retail,
    },
  ]
}

const NEW_CUSTOMERS_LABEL: Record<DemoLocale, string> = {
  en: "New customers",
  ru: "Новые клиенты",
}

const NEW_CUSTOMERS_VALUES = [40, 38, 52, 61, 58, 66, 70, 75, 68, 82, 91, 103]

export function getDemoNewCustomersSeries(
  locale: DemoLocale
): readonly WidgetChartSeries[] {
  return [
    {
      id: "customers",
      label: NEW_CUSTOMERS_LABEL[locale],
      values: NEW_CUSTOMERS_VALUES,
    },
  ]
}

const ORDER_COLUMN_TITLES: Record<
  DemoLocale,
  { number: string; customer: string; product: string; status: string; total: string }
> = {
  en: {
    number: "Number",
    customer: "Customer",
    product: "Product",
    status: "Status",
    total: "Amount",
  },
  ru: {
    number: "Номер",
    customer: "Покупатель",
    product: "Товар",
    status: "Статус",
    total: "Сумма",
  },
}

export function getDemoOrderColumns(
  locale: DemoLocale
): readonly WidgetTableColumn<OrderRow>[] {
  const titles = ORDER_COLUMN_TITLES[locale]
  const statusLabel = orderStatusLabelByLocale[locale]

  return [
    {
      id: "number",
      title: titles.number,
      sortable: true,
      cell: (row) => row.number,
    },
    { id: "customer", title: titles.customer, cell: (row) => row.customer },
    { id: "product", title: titles.product, cell: (row) => row.product },
    {
      id: "status",
      title: titles.status,
      cell: (row) => (
        <span className={cn("font-medium", orderStatusClassName[row.status])}>
          {statusLabel[row.status]}
        </span>
      ),
    },
    {
      id: "total",
      title: titles.total,
      align: "right",
      sortable: true,
      cell: (row) => row.total,
    },
  ]
}

const ORDER_CUSTOMERS: Record<DemoLocale, readonly string[]> = {
  en: [
    "Smith E.",
    "Cooper D.",
    "Novak O.",
    "Walker P.",
    "Frost T.",
    "Hawkins I.",
    "Bennett A.",
    "Peters S.",
    "Sanders M.",
    "Nichols R.",
    "Fisher N.",
    "Roman K.",
    "White Y.",
    "Foster A.",
    "Reed V.",
  ],
  ru: [
    "Смирнова Е.",
    "Кузнецов Д.",
    "Новикова О.",
    "Волков П.",
    "Морозова Т.",
    "Соколов И.",
    "Иванова А.",
    "Петров С.",
    "Сидорова М.",
    "Николаев Р.",
    "Фёдорова Н.",
    "Романов К.",
    "Беляева Ю.",
    "Ковалёв А.",
    "Орлова В.",
  ],
}

const ORDER_PRODUCTS: Record<DemoLocale, readonly string[]> = {
  en: [
    "Nova Sneakers",
    "Pulse Headphones",
    "City Backpack",
    "Basic Hoodie",
    "Loop Travel Mug",
    "Trail Cap",
    "Rainy Umbrella",
    "Cozy Blanket",
    "Weekend Bag",
    "Ember Candle",
  ],
  ru: [
    "Кроссовки Nova",
    "Наушники Pulse",
    "Рюкзак City",
    "Худи Basic",
    "Термокружка Loop",
    "Кепка Trail",
    "Зонт Rainy",
    "Плед Cozy",
    "Сумка Weekend",
    "Свеча Ember",
  ],
}

const ORDER_STATUS_CYCLE: readonly OrderStatus[] = [
  "delivered",
  "in-transit",
  "paid",
  "cancelled",
]

const ORDER_COUNT = 100
const LATEST_ORDER_NUMBER = 4187
const ORDER_REFERENCE_DATE = { year: 2026, month: 7, day: 10 }

function formatThousands(value: number, separator: string): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator)
}

const CURRENCY_FORMAT: Record<DemoLocale, (amount: number) => string> = {
  en: (amount) => `$${formatThousands(amount, ",")}`,
  ru: (amount) => `₽ ${formatThousands(amount, " ")}`,
}

function computeOrderAmount(index: number): number {
  const cycle = (index * 13 + 5) % 50
  const amount = 300 + cycle * cycle * 22
  return Math.round(amount / 10) * 10
}

function computeOrderCreatedAt(index: number): Date {
  const dayOffset = (index * 7 + 3) % 30
  return new Date(
    ORDER_REFERENCE_DATE.year,
    ORDER_REFERENCE_DATE.month,
    ORDER_REFERENCE_DATE.day - dayOffset
  )
}

function buildOrderRow(index: number, locale: DemoLocale): OrderRow {
  const customers = ORDER_CUSTOMERS[locale]
  const products = ORDER_PRODUCTS[locale]

  return {
    number: String(LATEST_ORDER_NUMBER - index),
    customer: customers[index % customers.length],
    product: products[(index * 3 + 1) % products.length],
    status: ORDER_STATUS_CYCLE[(index * 3 + 2) % ORDER_STATUS_CYCLE.length],
    total: CURRENCY_FORMAT[locale](computeOrderAmount(index)),
    createdAt: computeOrderCreatedAt(index),
  }
}

export function getDemoOrderRows(locale: DemoLocale): readonly OrderRow[] {
  return Array.from({ length: ORDER_COUNT }, (_, index) =>
    buildOrderRow(index, locale)
  )
}

const PRODUCT_IDS = [
  "sneakers-nova",
  "headphones-pulse",
  "backpack-city",
  "hoodie-basic",
  "mug-loop",
] as const

const PRODUCT_ICONS: readonly ComponentType<{ className?: string }>[] = [
  SportShoe,
  Headphones,
  Backpack,
  Shirt,
  Coffee,
]

interface DemoProductCopy {
  title: string
  description: string
  meta: string
}

const PRODUCT_COPY: Record<DemoLocale, readonly DemoProductCopy[]> = {
  en: [
    { title: "Nova Sneakers", description: "Footwear", meta: "86 sales" },
    { title: "Pulse Headphones", description: "Electronics", meta: "64 sales" },
    { title: "City Backpack", description: "Accessories", meta: "51 sales" },
    { title: "Basic Hoodie", description: "Apparel", meta: "43 sales" },
    { title: "Loop Travel Mug", description: "Accessories", meta: "38 sales" },
  ],
  ru: [
    { title: "Кроссовки Nova", description: "Обувь", meta: "86 продаж" },
    { title: "Наушники Pulse", description: "Электроника", meta: "64 продажи" },
    { title: "Рюкзак City", description: "Аксессуары", meta: "51 продажа" },
    { title: "Худи Basic", description: "Одежда", meta: "43 продажи" },
    { title: "Термокружка Loop", description: "Аксессуары", meta: "38 продаж" },
  ],
}

export function getDemoProductItems(
  locale: DemoLocale
): readonly WidgetListItem[] {
  return PRODUCT_COPY[locale].map((copy, index) => ({
    id: PRODUCT_IDS[index],
    title: copy.title,
    description: copy.description,
    meta: copy.meta,
    icon: PRODUCT_ICONS[index],
  }))
}
