import type { ComponentType } from "react"
import {
  Backpack,
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
  Shirt,
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
  { overview: string; orders: string; order: string }
> = {
  en: {
    overview: "Overview",
    orders: "Orders",
    order: "Order #4187",
  },
  ru: {
    overview: "Обзор",
    orders: "Заказы",
    order: "Заказ №4187",
  },
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
