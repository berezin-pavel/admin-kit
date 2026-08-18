"use client"

import { CreditCard, FileDown, Truck, UserPlus } from "lucide-react"

import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import {
  WidgetQuickActions,
  type QuickAction,
} from "@/registry/widget-quick-actions/widget-quick-actions"

function buildActions(): readonly QuickAction[] {
  return [
    {
      id: "refund",
      label: "Refund order",
      icon: CreditCard,
      onSelect: () =>
        notify.success("Refund issued", {
          description: "Order #4187 refunded",
        }),
    },
    {
      id: "ship",
      label: "Mark as shipped",
      icon: Truck,
      onSelect: () =>
        notify.info("Order shipped", {
          description: "Tracking number sent to the customer",
        }),
    },
    {
      id: "export",
      label: "Export orders",
      icon: FileDown,
      onSelect: () =>
        notify.info("Export started", {
          description: "The file will arrive by email",
        }),
    },
    {
      id: "invite",
      label: "Invite teammate",
      icon: UserPlus,
      onSelect: () =>
        notify.success("Invite sent", {
          description: "An email invite is on its way",
        }),
    },
  ]
}

export function TwoColumnsView() {
  return (
    <div>
      <WidgetQuickActions title="Quick actions" actions={buildActions()} />
      <AdminToaster />
    </div>
  )
}

export function ThreeColumnsView() {
  return (
    <div>
      <WidgetQuickActions
        title="Quick actions"
        actions={buildActions()}
        columns={3}
      />
      <AdminToaster />
    </div>
  )
}

export function EmptyView() {
  return <WidgetQuickActions title="Quick actions" actions={[]} />
}

export function LargeHeadingView() {
  return (
    <div>
      <WidgetQuickActions
        title="Quick actions"
        actions={buildActions()}
        heading="large"
        summary="4 available"
      />
      <AdminToaster />
    </div>
  )
}

export function GradientView() {
  return (
    <div>
      <WidgetQuickActions
        title="Quick actions"
        actions={buildActions()}
        gradient="ember"
      />
      <AdminToaster />
    </div>
  )
}
