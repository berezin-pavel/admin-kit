import type { ComponentType } from "react"
import {
  Backpack,
  ChartColumn,
  Coffee,
  CreditCard,
  Crown,
  Droplet,
  Keyboard,
  Layers,
  Headphones,
  LayoutDashboard,
  Package,
  PackageCheck,
  PackageSearch,
  RotateCcw,
  Shirt,
  TriangleAlert,
  UserRound,
  ShoppingCart,
  SportShoe,
  Truck,
  XCircle,
} from "lucide-react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { enUS, ru } from "date-fns/locale"

import type { AdminNavItem } from "@/registry/admin-shell/admin-shell"
import type { ComboboxFieldOption } from "@/registry/combobox-field/combobox-field"
import type { GlobalSearchItem } from "@/registry/global-search/global-search"
import { resolveIcon } from "@/registry/icon-field/icon-field"
import type { NotificationItem } from "@/registry/notifications-menu/notifications-menu"
import type { DateRange } from "@/registry/date-range-field/date-range-field"
import type { SelectFieldOption } from "@/registry/select-field/select-field"
import {
  StatusBadge,
  type StatusTone,
} from "@/registry/status-badge/status-badge"
import type { WidgetActivityEntry } from "@/registry/widget-activity/widget-activity"
import type { WidgetChartSeries } from "@/registry/widget-chart/widget-chart"
import type { WidgetDonutSlice } from "@/registry/widget-donut/widget-donut"
import type { WidgetListItem } from "@/registry/widget-list/widget-list"
import type { WidgetTableColumn } from "@/registry/widget-table/widget-table"
import type { TreeTableSection } from "@/registry/widget-tree-table/widget-tree-table"

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
  {
    overview: string
    orders: string
    products: string
    order: string
    salesGroup: string
    catalogueGroup: string
  }
> = {
  en: {
    overview: "Overview",
    orders: "Orders",
    products: "Products",
    order: "Order #4187",
    salesGroup: "Sales",
    catalogueGroup: "Catalogue",
  },
  ru: {
    overview: "Обзор",
    orders: "Заказы",
    products: "Товары",
    order: "Заказ №4187",
    salesGroup: "Продажи",
    catalogueGroup: "Каталог",
  },
}

export function getDemoNav(locale: DemoLocale): readonly AdminNavItem[] {
  const titles = NAV_TITLES[locale]

  return [
    { href: "/demo", title: titles.overview, icon: LayoutDashboard },
    {
      href: "/demo/orders",
      title: titles.orders,
      icon: ShoppingCart,
      group: titles.salesGroup,
    },
    {
      href: "/demo/products",
      title: titles.products,
      icon: PackageSearch,
      group: titles.catalogueGroup,
    },
    {
      href: "/demo/order",
      title: titles.order,
      icon: Package,
      group: titles.salesGroup,
    },
  ]
}

export function getDemoFlushNav(locale: DemoLocale): readonly AdminNavItem[] {
  const titles = NAV_TITLES[locale]

  return [
    { href: "/demo-flush", title: titles.overview, icon: LayoutDashboard },
    {
      href: "/demo-flush/orders",
      title: titles.orders,
      icon: ShoppingCart,
      group: titles.salesGroup,
    },
    {
      href: "/demo-flush/products",
      title: titles.products,
      icon: PackageSearch,
      group: titles.catalogueGroup,
    },
    {
      href: "/demo-flush/order",
      title: titles.order,
      icon: Package,
      group: titles.salesGroup,
    },
  ]
}

const SEARCH_LABELS: Record<
  DemoLocale,
  { pagesGroup: string; pagesHint: string; ordersGroup: string; ordersHint: string }
> = {
  en: {
    pagesGroup: "Pages",
    pagesHint: "Navigation",
    ordersGroup: "Orders",
    ordersHint: "Order card",
  },
  ru: {
    pagesGroup: "Страницы",
    pagesHint: "Навигация",
    ordersGroup: "Заказы",
    ordersHint: "Карточка заказа",
  },
}

const SEARCH_ORDER_COUNT = 6

export function getDemoSearchItems(
  locale: DemoLocale
): readonly GlobalSearchItem[] {
  const titles = NAV_TITLES[locale]
  const labels = SEARCH_LABELS[locale]

  const pages: readonly GlobalSearchItem[] = [
    {
      id: "page:/demo",
      label: titles.overview,
      group: labels.pagesGroup,
      icon: LayoutDashboard,
      hint: labels.pagesHint,
    },
    {
      id: "page:/demo/orders",
      label: titles.orders,
      group: labels.pagesGroup,
      icon: ShoppingCart,
      hint: labels.pagesHint,
    },
    {
      id: "page:/demo/products",
      label: titles.products,
      group: labels.pagesGroup,
      icon: PackageSearch,
      hint: labels.pagesHint,
    },
    {
      id: "page:/demo/order",
      label: titles.order,
      group: labels.pagesGroup,
      icon: Package,
      hint: labels.pagesHint,
    },
  ]

  const orders: readonly GlobalSearchItem[] = getDemoOrderRows(locale)
    .slice(0, SEARCH_ORDER_COUNT)
    .map((row) => ({
      id: `order:${row.number}`,
      label: `#${row.number} — ${row.customer}`,
      group: labels.ordersGroup,
      icon: PackageCheck,
      hint: labels.ordersHint,
    }))

  return [...pages, ...orders]
}

const NOTIFICATION_META: readonly {
  id: string
  read: boolean
  icon: ComponentType<{ className?: string }>
}[] = [
  { id: "order-placed", read: false, icon: Package },
  { id: "payment-received", read: false, icon: CreditCard },
  { id: "refund-requested", read: false, icon: RotateCcw },
  { id: "stock-low", read: true, icon: TriangleAlert },
  { id: "weekly-digest", read: true, icon: ChartColumn },
]

const NOTIFICATION_COPY: Record<
  DemoLocale,
  readonly { title: string; description: string; timestamp: string }[]
> = {
  en: [
    {
      title: "New order #4187",
      description: "Smith E. paid for four items",
      timestamp: "14:12",
    },
    {
      title: "Payment received",
      description: "$1,240 credited for order #4186",
      timestamp: "13:40",
    },
    {
      title: "Refund requested",
      description: "Cooper D. asks to return the headphones",
      timestamp: "11:05",
    },
    {
      title: "Low stock",
      description: "Six running shoes left in the warehouse",
      timestamp: "Yesterday",
    },
    {
      title: "Weekly digest",
      description: "Revenue is 12% above the previous week",
      timestamp: "Monday",
    },
  ],
  ru: [
    {
      title: "Новый заказ №4187",
      description: "Смирнова Е. оплатила четыре товара",
      timestamp: "14:12",
    },
    {
      title: "Платёж получен",
      description: "112 400 ₽ зачислены по заказу №4186",
      timestamp: "13:40",
    },
    {
      title: "Запрошен возврат",
      description: "Кузнецов Д. просит вернуть наушники",
      timestamp: "11:05",
    },
    {
      title: "Мало товара",
      description: "На складе осталось шесть пар кроссовок",
      timestamp: "Вчера",
    },
    {
      title: "Итоги недели",
      description: "Выручка на 12% выше прошлой недели",
      timestamp: "Понедельник",
    },
  ],
}

export function getDemoNotifications(
  locale: DemoLocale
): readonly NotificationItem[] {
  const copy = NOTIFICATION_COPY[locale]

  return NOTIFICATION_META.map((meta, index) => ({
    id: meta.id,
    read: meta.read,
    icon: meta.icon,
    title: copy[index].title,
    description: copy[index].description,
    timestamp: copy[index].timestamp,
  }))
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

export interface DemoDailyMetric {
  date: Date
  orders: number
  revenue: number
  expenses: number
}

const DAILY_HISTORY_DAYS = 365

function computeDailyOrderCount(dayOffset: number): number {
  const cycle = (dayOffset * 7 + 11) % 24
  return 8 + cycle
}

function computeDailyAverageOrderValue(dayOffset: number): number {
  const cycle = (dayOffset * 17 + 9) % 40
  return 900 + cycle * 18
}

function computeDailyExpenseShare(dayOffset: number): number {
  const cycle = (dayOffset * 13 + 5) % 20
  return 0.55 + cycle / 100
}

function buildDailyMetric(anchor: Date, dayOffset: number): DemoDailyMetric {
  const date = new Date(anchor)
  date.setDate(date.getDate() - dayOffset)
  const orders = computeDailyOrderCount(dayOffset)
  const revenue = orders * computeDailyAverageOrderValue(dayOffset)

  return {
    date,
    orders,
    revenue,
    expenses: Math.round(revenue * computeDailyExpenseShare(dayOffset)),
  }
}

export function getDemoDailyMetrics(
  today: Date = new Date()
): readonly DemoDailyMetric[] {
  const anchor = new Date(today.getFullYear(), today.getMonth(), today.getDate())

  return Array.from({ length: DAILY_HISTORY_DAYS }, (_, dayOffset) =>
    buildDailyMetric(anchor, dayOffset)
  ).reverse()
}

function isDateWithinRange(date: Date, range: DateRange): boolean {
  return (
    date.getTime() >= range.from.getTime() && date.getTime() <= range.to.getTime()
  )
}

export function getDemoMetricsInRange(
  metrics: readonly DemoDailyMetric[],
  range: DateRange | undefined
): readonly DemoDailyMetric[] {
  return range ? metrics.filter((metric) => isDateWithinRange(metric.date, range)) : []
}

export interface DemoRangeSummary {
  orderCount: number
  revenue: number
  averageOrder: number
}

export function summarizeDemoMetrics(
  metrics: readonly DemoDailyMetric[]
): DemoRangeSummary {
  const orderCount = metrics.reduce((sum, metric) => sum + metric.orders, 0)
  const revenue = metrics.reduce((sum, metric) => sum + metric.revenue, 0)
  const averageOrder = orderCount > 0 ? Math.round(revenue / orderCount) : 0

  return { orderCount, revenue, averageOrder }
}

export function getDemoPreviousRange(range: DateRange): DateRange {
  const spanDays =
    Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1
  const to = new Date(range.from)
  to.setDate(to.getDate() - 1)
  const from = new Date(to)
  from.setDate(from.getDate() - (spanDays - 1))

  return { from, to }
}

export interface DemoMonthlyGoal {
  value: number
  max: number
  target: number
}

export function getDemoMonthlyRevenueGoal(
  metrics: readonly DemoDailyMetric[],
  today: Date = new Date()
): DemoMonthlyGoal {
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const previousMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )

  const monthToDateRevenue = metrics
    .filter(
      (metric) =>
        metric.date.getTime() >= monthStart.getTime() &&
        metric.date.getTime() <= today.getTime()
    )
    .reduce((sum, metric) => sum + metric.revenue, 0)

  const previousMonthRevenue = metrics
    .filter(
      (metric) =>
        metric.date.getTime() >= previousMonthStart.getTime() &&
        metric.date.getTime() < monthStart.getTime()
    )
    .reduce((sum, metric) => sum + metric.revenue, 0)

  const target =
    previousMonthRevenue > 0 ? previousMonthRevenue : monthToDateRevenue
  const max = Math.max(Math.round(target * 1.2), monthToDateRevenue)

  return { value: monthToDateRevenue, max, target }
}

export type DemoGoalTone = "success" | "warning" | "danger"

export function getDemoGoalTone(
  goal: DemoMonthlyGoal,
  today: Date = new Date()
): DemoGoalTone {
  const daysInMonth = new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    0
  ).getDate()
  const expectedByToday = goal.target * (today.getDate() / daysInMonth)

  if (goal.value >= expectedByToday) {
    return "success"
  }
  if (goal.value >= expectedByToday * 0.7) {
    return "warning"
  }
  return "danger"
}

export function getDemoMonthlyOrdersGoal(
  metrics: readonly DemoDailyMetric[],
  today: Date = new Date()
): DemoMonthlyGoal {
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1)
  const previousMonthStart = new Date(
    today.getFullYear(),
    today.getMonth() - 1,
    1
  )

  const monthToDateOrders = metrics
    .filter(
      (metric) =>
        metric.date.getTime() >= monthStart.getTime() &&
        metric.date.getTime() <= today.getTime()
    )
    .reduce((sum, metric) => sum + metric.orders, 0)

  const previousMonthOrders = metrics
    .filter(
      (metric) =>
        metric.date.getTime() >= previousMonthStart.getTime() &&
        metric.date.getTime() < monthStart.getTime()
    )
    .reduce((sum, metric) => sum + metric.orders, 0)

  const target =
    previousMonthOrders > 0 ? previousMonthOrders : monthToDateOrders
  const max = Math.max(Math.round(target * 1.2), monthToDateOrders)

  return { value: monthToDateOrders, max, target }
}

const CHART_DATE_LOCALE: Record<DemoLocale, Locale> = { en: enUS, ru }

const DAILY_FINANCE_SERIES_LABELS: Record<
  DemoLocale,
  { revenue: string; expenses: string; profit: string }
> = {
  en: { revenue: "Revenue", expenses: "Expenses", profit: "Profit" },
  ru: { revenue: "Выручка", expenses: "Расходы", profit: "Прибыль" },
}

export function getDemoRevenueChartData(
  metrics: readonly DemoDailyMetric[],
  locale: DemoLocale
): { labels: readonly string[]; series: readonly WidgetChartSeries[] } {
  const dateLocale = CHART_DATE_LOCALE[locale]

  return {
    labels: metrics.map((metric) =>
      format(metric.date, "d MMM", { locale: dateLocale })
    ),
    series: [
      {
        id: "revenue",
        label: DAILY_FINANCE_SERIES_LABELS[locale].revenue,
        values: metrics.map((metric) => metric.revenue),
      },
      {
        id: "expenses",
        label: DAILY_FINANCE_SERIES_LABELS[locale].expenses,
        values: metrics.map((metric) => metric.expenses),
      },
      {
        id: "profit",
        label: DAILY_FINANCE_SERIES_LABELS[locale].profit,
        values: metrics.map((metric) => metric.revenue - metric.expenses),
      },
    ],
  }
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
        <StatusBadge tone={orderStatusTone[row.status]}>
          {statusLabel[row.status]}
        </StatusBadge>
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
    "Cap",
    "Nova Sneakers",
    "Pulse Headphones",
    "City Backpack",
    "Basic Hoodie",
    "Loop Travel Mug",
    "Ember Scented Candle",
    "Trail Running Cap with Reflective Trim",
    "Mechanic Pro Low-Profile Wireless Keyboard",
    "Expedition Insulated Travel Bottle 1.2L",
    "Aurora Ultra-Soft Oversized Knit Throw Blanket for Reading Nooks",
    "Weekend Bag",
  ],
  ru: [
    "Кепка",
    "Кроссовки Nova",
    "Наушники Pulse",
    "Рюкзак City",
    "Худи Basic",
    "Термокружка Loop",
    "Ароматическая свеча Ember",
    "Беговая кепка Trail со светоотражающей окантовкой",
    "Механическая беспроводная клавиатура Mechanic Pro Low-Profile",
    "Термобутылка Expedition с двойными стенками 1,2 л",
    "Сверхмягкий большой вязаный плед Aurora для уютного чтения",
    "Сумка Weekend",
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

export function formatDemoCurrency(amount: number, locale: DemoLocale): string {
  return CURRENCY_FORMAT[locale](amount)
}

export function formatDemoNumber(value: number, locale: DemoLocale): string {
  return formatThousands(value, locale === "ru" ? " " : ",")
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

export function getDemoOrderStatusSlices(
  locale: DemoLocale,
  range: DateRange | undefined
): readonly WidgetDonutSlice[] {
  const rows = range
    ? getDemoOrderRows(locale).filter((row) => isDateWithinRange(row.createdAt, range))
    : []
  const statusLabel = orderStatusLabelByLocale[locale]

  return ORDER_STATUS_CYCLE.map((status) => ({
    id: status,
    label: statusLabel[status],
    value: rows.filter((row) => row.status === status).length,
  })).filter((slice) => slice.value > 0)
}

const ACTIVITY_ACTION_LABEL: Record<DemoLocale, Record<OrderStatus, string>> = {
  en: {
    delivered: "delivered",
    "in-transit": "shipped",
    paid: "paid",
    cancelled: "cancelled",
  },
  ru: {
    delivered: "доставлен",
    "in-transit": "отправлен",
    paid: "оплачен",
    cancelled: "отменён",
  },
}

const ACTIVITY_TITLE: Record<
  DemoLocale,
  (orderNumber: string, action: string) => string
> = {
  en: (orderNumber, action) => `Order #${orderNumber} ${action}`,
  ru: (orderNumber, action) => `Заказ №${orderNumber} ${action}`,
}

const ACTIVITY_ICON_BY_STATUS: Record<
  OrderStatus,
  ComponentType<{ className?: string }>
> = {
  delivered: PackageCheck,
  "in-transit": Truck,
  paid: CreditCard,
  cancelled: XCircle,
}

const ACTIVITY_ENTRY_COUNT = 8
const ACTIVITY_STEP_HOURS = 7

function formatActivityTimestamp(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

const ACTIVITY_ANCHOR_HOUR = 9

function activityAnchor(today: Date): Date {
  const anchor = new Date(today)
  anchor.setHours(ACTIVITY_ANCHOR_HOUR, 0, 0, 0)
  return anchor
}

export function getDemoActivityEntries(
  locale: DemoLocale,
  today: Date = activityAnchor(new Date())
): readonly WidgetActivityEntry[] {
  const rows = getDemoOrderRows(locale).slice(0, ACTIVITY_ENTRY_COUNT)
  const actionLabel = ACTIVITY_ACTION_LABEL[locale]
  const title = ACTIVITY_TITLE[locale]

  return rows.map((row, index) => ({
    id: row.number,
    title: title(row.number, actionLabel[row.status]),
    meta: row.customer,
    icon: ACTIVITY_ICON_BY_STATUS[row.status],
    timestamp: formatActivityTimestamp(
      new Date(today.getTime() - index * ACTIVITY_STEP_HOURS * 3_600_000)
    ),
  }))
}

const PRODUCT_IDS = [
  "sneakers-nova",
  "headphones-pulse",
  "backpack-city",
  "hoodie-basic",
  "mug-loop",
  "cap-plain",
  "keyboard-mechanic",
  "bottle-expedition",
  "blanket-aurora",
] as const

const PRODUCT_ICONS: readonly ComponentType<{ className?: string }>[] = [
  SportShoe,
  Headphones,
  Backpack,
  Shirt,
  Coffee,
  Crown,
  Keyboard,
  Droplet,
  Layers,
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
    { title: "Cap", description: "Apparel", meta: "31 sales" },
    {
      title: "Mechanic Pro Low-Profile Wireless Keyboard",
      description: "Electronics",
      meta: "27 sales",
    },
    {
      title: "Expedition Insulated Travel Bottle 1.2L",
      description: "Sports and outdoors, drinkware",
      meta: "19 sales",
    },
    {
      title: "Aurora Ultra-Soft Oversized Knit Throw Blanket for Reading Nooks",
      description: "Home textiles, blankets and throws for the living room",
      meta: "12 sales",
    },
  ],
  ru: [
    { title: "Кроссовки Nova", description: "Обувь", meta: "86 продаж" },
    { title: "Наушники Pulse", description: "Электроника", meta: "64 продажи" },
    { title: "Рюкзак City", description: "Аксессуары", meta: "51 продажа" },
    { title: "Худи Basic", description: "Одежда", meta: "43 продажи" },
    { title: "Термокружка Loop", description: "Аксессуары", meta: "38 продаж" },
    { title: "Кепка", description: "Одежда", meta: "31 продажа" },
    {
      title: "Механическая беспроводная клавиатура Mechanic Pro Low-Profile",
      description: "Электроника",
      meta: "27 продаж",
    },
    {
      title: "Термобутылка Expedition с двойными стенками 1,2 л",
      description: "Спорт и туризм, посуда для напитков",
      meta: "19 продаж",
    },
    {
      title: "Сверхмягкий большой вязаный плед Aurora для уютного чтения",
      description: "Домашний текстиль, пледы и покрывала для гостиной",
      meta: "12 продаж",
    },
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

const PAYMENT_METHOD_IDS = ["card", "wallet", "cash"] as const
const PAYMENT_METHOD_SHARES = [58, 27, 15]
const PAYMENT_METHOD_LABELS: Record<DemoLocale, readonly string[]> = {
  en: ["Bank card", "Wallet", "Cash on delivery"],
  ru: ["Банковская карта", "Кошелёк", "Наличные при получении"],
}

export function getDemoPaymentSlices(
  locale: DemoLocale
): readonly WidgetDonutSlice[] {
  return PAYMENT_METHOD_IDS.map((id, index) => ({
    id,
    label: PAYMENT_METHOD_LABELS[locale][index],
    value: PAYMENT_METHOD_SHARES[index],
  }))
}

interface DemoTopCustomerCopy {
  title: string
  description: string
  meta: string
}

const TOP_CUSTOMER_IDS = ["carter", "morgan", "novak", "frost", "sanders"] as const
const TOP_CUSTOMER_COPY: Record<DemoLocale, readonly DemoTopCustomerCopy[]> = {
  en: [
    { title: "Emily Carter", description: "Austin, since 2023", meta: "42 orders" },
    { title: "Alex Morgan", description: "Denver, since 2022", meta: "37 orders" },
    { title: "Olga Novak", description: "Prague, since 2024", meta: "29 orders" },
    { title: "Tom Frost", description: "Oslo, since 2021", meta: "24 orders" },
    { title: "Mia Sanders", description: "Leeds, since 2024", meta: "19 orders" },
  ],
  ru: [
    { title: "Емельянова Е.", description: "Казань, с 2023", meta: "42 заказа" },
    { title: "Морозов А.", description: "Тверь, с 2022", meta: "37 заказов" },
    { title: "Новикова О.", description: "Прага, с 2024", meta: "29 заказов" },
    { title: "Фролов Т.", description: "Осло, с 2021", meta: "24 заказа" },
    { title: "Сандерс М.", description: "Лидс, с 2024", meta: "19 заказов" },
  ],
}

export function getDemoTopCustomerItems(
  locale: DemoLocale
): readonly WidgetListItem[] {
  return TOP_CUSTOMER_COPY[locale].map((copy, index) => ({
    id: TOP_CUSTOMER_IDS[index],
    title: copy.title,
    description: copy.description,
    meta: copy.meta,
    icon: UserRound,
  }))
}

export function getDemoProductOptions(
  locale: DemoLocale
): readonly SelectFieldOption[] {
  return PRODUCT_COPY[locale].map((copy, index) => ({
    value: PRODUCT_IDS[index],
    label: copy.title,
  }))
}

export interface DemoProduct {
  id: string
  name: string
  sku: string
  price: number
  stock: number
  cost: number
  hidden: boolean
  sort: number
}

export interface DemoProductSection extends TreeTableSection<DemoProduct> {
  hidden: boolean
  sort: number
  iconId: string
  sections?: readonly DemoProductSection[]
}

const NEW_PRODUCT_IDS = [
  "sneakers-trail",
  "sneakers-court",
  "earbuds-studio",
  "speaker-bassline",
  "keyboard-compact",
  "tee-everyday",
  "fleece-zip",
  "beanie-knit",
  "sunglasses-horizon",
  "lamp-table",
  "mugset-ceramic",
] as const

type NewProductId = (typeof NEW_PRODUCT_IDS)[number]

const NEW_PRODUCT_NAMES: Record<DemoLocale, Record<NewProductId, string>> = {
  en: {
    "sneakers-trail": "Trail Runner Sneakers",
    "sneakers-court": "Court Classic Sneakers",
    "earbuds-studio": "Studio Buds Earbuds",
    "speaker-bassline": "Bassline Bluetooth Speaker",
    "keyboard-compact": "Compact 60% Keyboard",
    "tee-everyday": "Everyday Cotton Tee",
    "fleece-zip": "Zip-Up Fleece",
    "beanie-knit": "Knit Beanie",
    "sunglasses-horizon": "Horizon Sunglasses",
    "lamp-table": "Glow Table Lamp",
    "mugset-ceramic": "Ceramic Mug Set",
  },
  ru: {
    "sneakers-trail": "Кроссовки Trail Runner",
    "sneakers-court": "Кроссовки Court Classic",
    "earbuds-studio": "Наушники Studio Buds",
    "speaker-bassline": "Колонка Bassline",
    "keyboard-compact": "Клавиатура Compact 60%",
    "tee-everyday": "Футболка Everyday",
    "fleece-zip": "Флисовая кофта на молнии",
    "beanie-knit": "Вязаная шапка",
    "sunglasses-horizon": "Очки Horizon",
    "lamp-table": "Настольная лампа Glow",
    "mugset-ceramic": "Набор керамических кружек",
  },
}

interface DemoProductDetails {
  sku: string
  price: number
  cost: number
  stock: number
  hidden: boolean
}

const DEMO_PRODUCT_DETAILS: Record<string, DemoProductDetails> = {
  "sneakers-nova": { sku: "FTW-SNK-001", price: 129, cost: 72, stock: 64, hidden: false },
  "sneakers-trail": { sku: "FTW-SNK-002", price: 139, cost: 78, stock: 51, hidden: false },
  "sneakers-court": { sku: "FTW-SNK-003", price: 99, cost: 52, stock: 73, hidden: false },
  "headphones-pulse": { sku: "ELC-AUD-001", price: 89, cost: 48, stock: 120, hidden: false },
  "earbuds-studio": { sku: "ELC-AUD-002", price: 69, cost: 35, stock: 102, hidden: false },
  "speaker-bassline": { sku: "ELC-AUD-003", price: 119, cost: 61, stock: 44, hidden: false },
  "keyboard-mechanic": { sku: "ELC-KBD-001", price: 149, cost: 84, stock: 37, hidden: false },
  "keyboard-compact": { sku: "ELC-KBD-002", price: 109, cost: 58, stock: 0, hidden: true },
  "hoodie-basic": { sku: "APL-TOP-001", price: 49, cost: 22, stock: 140, hidden: false },
  "tee-everyday": { sku: "APL-TOP-002", price: 22, cost: 9, stock: 168, hidden: false },
  "fleece-zip": { sku: "APL-TOP-003", price: 64, cost: 31, stock: 47, hidden: false },
  "cap-plain": { sku: "APL-HAT-001", price: 19, cost: 8, stock: 156, hidden: false },
  "beanie-knit": { sku: "APL-HAT-002", price: 21, cost: 8, stock: 132, hidden: false },
  "backpack-city": { sku: "ACC-001", price: 59, cost: 28, stock: 95, hidden: false },
  "mug-loop": { sku: "ACC-002", price: 24, cost: 11, stock: 180, hidden: false },
  "bottle-expedition": { sku: "ACC-003", price: 34, cost: 16, stock: 88, hidden: false },
  "sunglasses-horizon": { sku: "ACC-004", price: 54, cost: 24, stock: 61, hidden: false },
  "blanket-aurora": { sku: "HOM-001", price: 79, cost: 41, stock: 22, hidden: true },
  "lamp-table": { sku: "HOM-002", price: 44, cost: 19, stock: 38, hidden: false },
  "mugset-ceramic": { sku: "HOM-003", price: 29, cost: 13, stock: 0, hidden: true },
}

function isNewProductId(id: string): id is NewProductId {
  return (NEW_PRODUCT_IDS as readonly string[]).includes(id)
}

function getDemoProductName(id: string, locale: DemoLocale): string {
  const existingIndex = PRODUCT_IDS.indexOf(
    id as (typeof PRODUCT_IDS)[number]
  )
  if (existingIndex !== -1) {
    return PRODUCT_COPY[locale][existingIndex].title
  }
  if (isNewProductId(id)) {
    return NEW_PRODUCT_NAMES[locale][id]
  }
  return id
}

function buildDemoProduct(
  id: string,
  locale: DemoLocale,
  index: number
): DemoProduct {
  const details = DEMO_PRODUCT_DETAILS[id]

  return {
    id,
    name: getDemoProductName(id, locale),
    sku: details.sku,
    price: details.price,
    stock: details.stock,
    cost: details.cost,
    hidden: details.hidden,
    sort: (index + 1) * 10,
  }
}

const GENERATED_ACCESSORY_COUNT = 116

function buildGeneratedAccessoryProduct(
  index: number,
  locale: DemoLocale
): DemoProduct {
  const number = index + 1
  const padded = String(number).padStart(3, "0")
  const priceCycle = (index * 7 + 3) % 60
  const price = 12 + priceCycle
  const costCycle = (index * 5 + 2) % 30
  const cost = Math.max(4, Math.round(price * (0.35 + costCycle / 100)))
  const stock = (index * 11 + 6) % 140

  return {
    id: `accessory-gen-${padded}`,
    name:
      locale === "ru" ? `Аксессуар ${padded}` : `Accessory ${padded}`,
    sku: `ACC-GEN-${padded}`,
    price,
    stock,
    cost,
    hidden: stock === 0,
    sort: (4 + number) * 10,
  }
}

interface ProductSectionSeed {
  id: string
  iconId: string
  color?: string
  hidden: boolean
  productIds?: readonly string[]
  sections?: readonly ProductSectionSeed[]
}

const PRODUCT_SECTION_SEEDS: readonly ProductSectionSeed[] = [
  {
    id: "footwear",
    iconId: "footprints",
    color: "#2563eb",
    hidden: false,
    sections: [
      {
        id: "sneakers",
        iconId: "sport-shoe",
        hidden: false,
        productIds: ["sneakers-nova", "sneakers-trail", "sneakers-court"],
      },
      { id: "boots", iconId: "mountain-snow", hidden: false, productIds: [] },
    ],
  },
  {
    id: "electronics",
    iconId: "headphones",
    color: "#7c3aed",
    hidden: false,
    sections: [
      {
        id: "audio",
        iconId: "music",
        hidden: false,
        productIds: [
          "headphones-pulse",
          "earbuds-studio",
          "speaker-bassline",
        ],
      },
      {
        id: "keyboards",
        iconId: "keyboard",
        hidden: false,
        productIds: ["keyboard-mechanic", "keyboard-compact"],
      },
    ],
  },
  {
    id: "apparel",
    iconId: "shirt",
    color: "#ea580c",
    hidden: false,
    sections: [
      {
        id: "tops",
        iconId: "shirt",
        hidden: false,
        productIds: ["hoodie-basic", "tee-everyday", "fleece-zip"],
      },
      {
        id: "headwear",
        iconId: "crown",
        hidden: false,
        productIds: ["cap-plain", "beanie-knit"],
      },
    ],
  },
  {
    id: "accessories",
    iconId: "backpack",
    color: "#16a34a",
    hidden: false,
    productIds: [
      "backpack-city",
      "mug-loop",
      "bottle-expedition",
      "sunglasses-horizon",
    ],
  },
  {
    id: "home",
    iconId: "sofa",
    color: "#64748b",
    hidden: false,
    productIds: ["blanket-aurora", "lamp-table", "mugset-ceramic"],
  },
] as const

const PRODUCT_SECTION_TITLES: Record<DemoLocale, Record<string, string>> = {
  en: {
    footwear: "Footwear",
    sneakers: "Sneakers",
    boots: "Boots",
    electronics: "Electronics",
    audio: "Audio",
    keyboards: "Keyboards",
    apparel: "Apparel",
    tops: "Tops",
    headwear: "Headwear",
    accessories: "Accessories",
    home: "Home",
  },
  ru: {
    footwear: "Обувь",
    sneakers: "Кроссовки",
    boots: "Ботинки",
    electronics: "Электроника",
    audio: "Аудио",
    keyboards: "Клавиатуры",
    apparel: "Одежда",
    tops: "Верх",
    headwear: "Головные уборы",
    accessories: "Аксессуары",
    home: "Дом",
  },
}

function buildDemoProductSection(
  seed: ProductSectionSeed,
  locale: DemoLocale,
  index: number
): DemoProductSection {
  return {
    id: seed.id,
    title: PRODUCT_SECTION_TITLES[locale][seed.id],
    icon: resolveIcon(seed.iconId),
    iconId: seed.iconId,
    color: seed.color,
    hidden: seed.hidden,
    sort: (index + 1) * 10,
    ...(seed.sections
      ? {
          sections: seed.sections.map((child, childIndex) =>
            buildDemoProductSection(child, locale, childIndex)
          ),
        }
      : {}),
    ...(seed.productIds
      ? {
          rows: seed.productIds.map((id, productIndex) =>
            buildDemoProduct(id, locale, productIndex)
          ),
        }
      : {}),
  }
}

export function getDemoProductSections(
  locale: DemoLocale
): readonly DemoProductSection[] {
  return PRODUCT_SECTION_SEEDS.map((seed, index) =>
    buildDemoProductSection(seed, locale, index)
  ).map((section) =>
    section.id === "accessories"
      ? {
          ...section,
          rows: [
            ...(section.rows ?? []),
            ...Array.from({ length: GENERATED_ACCESSORY_COUNT }, (_, i) =>
              buildGeneratedAccessoryProduct(i, locale)
            ),
          ],
        }
      : section
  )
}

export interface FlatDemoSection {
  section: DemoProductSection
  path: string
  parentId: string | null
  depth: number
}

export function flattenDemoSections(
  sections: readonly DemoProductSection[],
  parentPath = "",
  parentId: string | null = null,
  depth = 0
): readonly FlatDemoSection[] {
  const result: FlatDemoSection[] = []

  for (const section of sections) {
    const path = parentPath ? `${parentPath} / ${section.title}` : section.title
    result.push({ section, path, parentId, depth })

    if (section.sections) {
      result.push(
        ...flattenDemoSections(section.sections, path, section.id, depth + 1)
      )
    }
  }

  return result
}

export interface FlatDemoProduct {
  product: DemoProduct
  section: DemoProductSection
  path: string
}

export function flattenDemoProducts(
  sections: readonly DemoProductSection[]
): readonly FlatDemoProduct[] {
  const result: FlatDemoProduct[] = []

  for (const flat of flattenDemoSections(sections)) {
    for (const product of flat.section.rows ?? []) {
      result.push({ product, section: flat.section, path: flat.path })
    }
  }

  return result
}

const CUSTOMER_FIRST_NAMES: Record<DemoLocale, readonly string[]> = {
  en: [
    "Jon",
    "Kim",
    "Zoe",
    "Max",
    "Amy",
    "Alexandra",
    "Bartholomew",
    "Persephone",
    "Maximilian",
    "Anastasia",
    "Evangeline",
  ],
  ru: [
    "Ян",
    "Лев",
    "Ада",
    "Марк",
    "Инна",
    "Александра",
    "Анастасия",
    "Вячеслав",
    "Серафима",
    "Всеволод",
    "Евдокия",
  ],
}

const CUSTOMER_LAST_NAMES: Record<DemoLocale, readonly string[]> = {
  en: [
    "Roe",
    "Fox",
    "Lee",
    "Kerr",
    "Diaz",
    "Cole",
    "Featherstonehaugh",
    "Castellanos",
    "Kowalczyk",
    "Villanueva-Ortiz",
    "Whitmore-Blackburn",
    "Okonkwo-Reyes",
    "Nakamura-Silva",
  ],
  ru: [
    "Ким",
    "Пак",
    "Цой",
    "Гук",
    "Ли",
    "Тан",
    "Заболотных",
    "Виноградова",
    "Александрович",
    "Овчаренко-Белых",
    "Константинопольская",
    "Барановская-Смирнова",
    "Скворцова-Литвиненко",
  ],
}

const DEMO_CUSTOMER_COUNT = 44

function buildDemoCustomerName(index: number, locale: DemoLocale): string {
  const firstNames = CUSTOMER_FIRST_NAMES[locale]
  const lastNames = CUSTOMER_LAST_NAMES[locale]

  return `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`
}

export function getDemoCustomerOptions(
  locale: DemoLocale
): readonly ComboboxFieldOption[] {
  return Array.from({ length: DEMO_CUSTOMER_COUNT }, (_, index) => ({
    value: `customer-${index}`,
    label: buildDemoCustomerName(index, locale),
  }))
}

const ORDER_TIMELINE_TITLE: Record<
  DemoLocale,
  { placed: string; paid: string; shipped: string; delivered: string }
> = {
  en: {
    placed: "Order placed",
    paid: "Payment captured",
    shipped: "Package shipped",
    delivered: "Package delivered",
  },
  ru: {
    placed: "Заказ оформлен",
    paid: "Оплата проведена",
    shipped: "Отправлен курьером",
    delivered: "Заказ доставлен",
  },
}

const ORDER_TIMELINE_META: Record<
  DemoLocale,
  { placed: string; paid: string; shipped: string; delivered: string }
> = {
  en: {
    placed: "Emily Carter checked out",
    paid: "$2,340 charged to card",
    shipped: "Handed to the in-house courier",
    delivered: "Signed for at the door",
  },
  ru: {
    placed: "Смирнова Екатерина оформила заказ",
    paid: "Списано ₽ 2 340",
    shipped: "Передан курьеру",
    delivered: "Получен под подпись",
  },
}

export function getDemoOrderTimelineEntries(
  locale: DemoLocale
): readonly WidgetActivityEntry[] {
  const title = ORDER_TIMELINE_TITLE[locale]
  const meta = ORDER_TIMELINE_META[locale]

  return [
    {
      id: "placed",
      title: title.placed,
      meta: meta.placed,
      icon: ShoppingCart,
      timestamp: "2026-08-03T14:12",
    },
    {
      id: "paid",
      title: title.paid,
      meta: meta.paid,
      icon: CreditCard,
      timestamp: "2026-08-03T14:13",
    },
    {
      id: "shipped",
      title: title.shipped,
      meta: meta.shipped,
      icon: Truck,
      timestamp: "2026-08-04T09:20",
    },
    {
      id: "delivered",
      title: title.delivered,
      meta: meta.delivered,
      icon: PackageCheck,
      timestamp: "2026-08-05T11:40",
    },
  ]
}

interface DemoOrderLineItemCopy {
  title: string
  description: string
  meta: string
}

const ORDER_LINE_ITEMS: Record<DemoLocale, readonly DemoOrderLineItemCopy[]> = {
  en: [
    {
      title: "Nova Sneakers",
      description: "Size US 10, Midnight Blue",
      meta: "$1,890",
    },
    {
      title: "Express delivery protection",
      description: "Signature required on arrival",
      meta: "$450",
    },
  ],
  ru: [
    {
      title: "Кроссовки Nova",
      description: "Размер 44, тёмно-синие",
      meta: "₽ 1 890",
    },
    {
      title: "Защита экспресс-доставки",
      description: "Вручение под подпись",
      meta: "₽ 450",
    },
  ],
}

const ORDER_LINE_ITEM_IDS = ["sneakers-nova", "delivery-protection"] as const

const ORDER_LINE_ITEM_ICONS: readonly ComponentType<{ className?: string }>[] = [
  SportShoe,
  Truck,
]

export function getDemoOrderLineItems(
  locale: DemoLocale
): readonly WidgetListItem[] {
  return ORDER_LINE_ITEMS[locale].map((copy, index) => ({
    id: ORDER_LINE_ITEM_IDS[index],
    title: copy.title,
    description: copy.description,
    meta: copy.meta,
    icon: ORDER_LINE_ITEM_ICONS[index],
  }))
}
