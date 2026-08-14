"use client"

import { useState } from "react"
import {
  CreditCard,
  FileText,
  History,
  LayoutDashboard,
  MessageSquare,
  Plus,
  Receipt,
  Shield,
  ShoppingBag,
  Truck,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PageEntity } from "@/registry/page-entity/page-entity"
import { PageTabs, type PageTabsItem } from "@/registry/page-tabs/page-tabs"
import { WidgetList } from "@/registry/widget-list/widget-list"
import {
  WidgetTable,
  type WidgetTableColumn,
} from "@/registry/widget-table/widget-table"

interface RelatedOrderRow {
  number: string
  placedAt: string
  status: string
  total: string
}

const relatedOrderColumns: readonly WidgetTableColumn<RelatedOrderRow>[] = [
  { id: "number", title: "Order", cell: (row) => row.number },
  { id: "placedAt", title: "Placed", cell: (row) => row.placedAt },
  { id: "status", title: "Status", cell: (row) => row.status },
  { id: "total", title: "Total", align: "right", cell: (row) => row.total },
]

const relatedOrders: readonly RelatedOrderRow[] = [
  {
    number: "#10411",
    placedAt: "Jun 2, 2026",
    status: "Delivered",
    total: "$860",
  },
  {
    number: "#10289",
    placedAt: "Mar 18, 2026",
    status: "Delivered",
    total: "$1,240",
  },
  {
    number: "#10103",
    placedAt: "Jan 4, 2026",
    status: "Refunded",
    total: "$310",
  },
]

function OverviewPanel() {
  return (
    <PageEntity
      title="Order #10482"
      sections={[
        {
          id: "customer",
          title: "Customer",
          fields: [
            { id: "name", label: "Name", value: "Anna Bennett" },
            { id: "email", label: "Email", value: "anna@example.com" },
            { id: "phone", label: "Phone", value: "+1 (415) 555-0148" },
          ],
        },
        {
          id: "shipping",
          title: "Shipping",
          fields: [
            {
              id: "address",
              label: "Address",
              value: "221 Baker Street, San Francisco, CA",
            },
            {
              id: "method",
              label: "Method",
              value: "Express, 2 business days",
            },
          ],
        },
      ]}
    />
  )
}

function HistoryPanel() {
  return (
    <WidgetList
      title="Order history"
      items={[
        {
          id: "placed",
          title: "Order placed",
          description: "Anna Bennett checked out with 3 items",
          meta: "Aug 9, 09:14",
          icon: ShoppingBag,
        },
        {
          id: "paid",
          title: "Payment captured",
          description: "$4,200 charged to Visa •••• 4482",
          meta: "Aug 9, 09:15",
          icon: CreditCard,
        },
        {
          id: "packed",
          title: "Order packed",
          description: "Warehouse SF-2 prepared the shipment",
          meta: "Aug 10, 14:02",
          icon: FileText,
        },
        {
          id: "shipped",
          title: "Order shipped",
          description: "Handed off to FedEx, tracking 78120099231",
          meta: "Aug 11, 08:47",
          icon: Truck,
        },
      ]}
    />
  )
}

function RelatedOrdersPanel() {
  return (
    <WidgetTable
      title="Other orders from Anna Bennett"
      columns={relatedOrderColumns}
      rows={relatedOrders}
      getRowKey={(row) => row.number}
    />
  )
}

function NotesPanel() {
  return (
    <WidgetList
      title="Internal notes"
      items={[
        {
          id: "note-1",
          title: "Priya Shah",
          description: "Customer asked to hold shipping until Friday.",
          meta: "2h ago",
        },
        {
          id: "note-2",
          title: "Marco Diaz",
          description: "Verified billing address matches the card on file.",
          meta: "Yesterday",
        },
      ]}
    />
  )
}

function SettingsPanel() {
  return (
    <PageEntity
      title="Order settings"
      sections={[
        {
          id: "notifications",
          fields: [
            { id: "emails", label: "Customer emails", value: "Enabled" },
            { id: "sms", label: "SMS updates", value: "Disabled" },
            {
              id: "priority",
              label: "Fulfillment priority",
              value: "Standard",
            },
          ],
        },
      ]}
    />
  )
}

function RefundsPanel() {
  return (
    <p className="text-sm text-muted-foreground">
      No refund has been requested for this order.
    </p>
  )
}

function LongPanel({ description }: { description: string }) {
  return <p className="text-sm text-muted-foreground">{description}</p>
}

const defaultItems: readonly PageTabsItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    content: <OverviewPanel />,
  },
  {
    id: "history",
    label: "History",
    icon: History,
    badge: <Badge variant="secondary">4</Badge>,
    content: <HistoryPanel />,
  },
  {
    id: "related",
    label: "Related orders",
    icon: ShoppingBag,
    content: <RelatedOrdersPanel />,
  },
]

const withActionsItems: readonly PageTabsItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    content: <SettingsPanel />,
  },
  {
    id: "notes",
    label: "Notes",
    icon: MessageSquare,
    badge: <Badge variant="secondary">2</Badge>,
    content: <NotesPanel />,
  },
  {
    id: "refunds",
    label: "Refunds",
    icon: Receipt,
    disabled: true,
    content: <RefundsPanel />,
  },
]

const overflowItems: readonly PageTabsItem[] = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
    content: (
      <LongPanel description="A snapshot of order #10482: status, customer, and totals." />
    ),
  },
  {
    id: "payment",
    label: "Payment & billing details",
    icon: CreditCard,
    content: (
      <LongPanel description="Card on file, billing address, and capture history for this order." />
    ),
  },
  {
    id: "shipping",
    label: "Shipping & fulfillment",
    icon: Truck,
    content: (
      <LongPanel description="Carrier, tracking number, and delivery window for the shipment." />
    ),
  },
  {
    id: "communication",
    label: "Customer communication log",
    icon: MessageSquare,
    content: (
      <LongPanel description="Every email and SMS sent to the customer about this order." />
    ),
  },
  {
    id: "refunds-cancellations",
    label: "Refunds and cancellations",
    icon: Receipt,
    content: (
      <LongPanel description="No refund or cancellation has been filed for this order." />
    ),
  },
  {
    id: "risk",
    label: "Fraud and risk review",
    icon: Shield,
    content: (
      <LongPanel description="Automated risk score and manual review notes, if any." />
    ),
  },
  {
    id: "audit",
    label: "Internal audit trail",
    icon: FileText,
    content: (
      <LongPanel description="Every field change on this order, with the admin who made it." />
    ),
  },
  {
    id: "related-purchases",
    label: "Related purchases and orders",
    icon: ShoppingBag,
    content: <RelatedOrdersPanel />,
  },
]

export function PageTabsDefaultView() {
  const [value, setValue] = useState("overview")

  return (
    <PageTabs items={defaultItems} value={value} onValueChange={setValue} />
  )
}

export function PageTabsWithActionsView() {
  const [value, setValue] = useState("overview")

  return (
    <PageTabs
      items={withActionsItems}
      value={value}
      onValueChange={setValue}
      actions={
        <Button size="sm">
          <Plus className="size-4" />
          New note
        </Button>
      }
    />
  )
}

export function PageTabsOverflowView() {
  const [value, setValue] = useState("overview")

  return (
    <PageTabs items={overflowItems} value={value} onValueChange={setValue} />
  )
}
