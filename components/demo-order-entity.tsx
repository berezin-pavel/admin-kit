"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { Hint } from "@/registry/hint/hint"
import {
  PageEntity,
  type PageEntitySection,
} from "@/registry/page-entity/page-entity"
import { StatusBadge } from "@/registry/status-badge/status-badge"

import { orderStatusLabel, orderStatusTone } from "@/app/demo/data"

export function DemoOrderEntity() {
  const [cancelling, setCancelling] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)

  const status = cancelled ? "cancelled" : "delivered"

  const sections: readonly PageEntitySection[] = [
    {
      id: "order",
      title: "Order",
      fields: [
        {
          id: "status",
          label: "Status",
          value: (
            <StatusBadge tone={orderStatusTone[status]}>
              {orderStatusLabel[status]}
            </StatusBadge>
          ),
        },
        { id: "created", label: "Placed", value: "August 3, 2026, 2:12 PM" },
        { id: "channel", label: "Channel", value: "Online storefront" },
        {
          id: "total",
          label: (
            <span className="inline-flex items-center gap-1">
              Total
              <Hint text="Item total after discount, delivery is calculated separately" />
            </span>
          ),
          value: "$2,340",
        },
      ],
    },
    {
      id: "customer",
      title: "Customer",
      fields: [
        { id: "name", label: "Name", value: "Emily Carter" },
        { id: "email", label: "Email", value: "emily.carter@example.com" },
        { id: "phone", label: "Phone", value: "+1 512 555-0142" },
      ],
    },
    {
      id: "delivery",
      title: "Delivery",
      fields: [
        { id: "address", label: "Address", value: "Austin, TX, 214 Congress Ave" },
        { id: "courier", label: "Carrier", value: "In-house courier" },
        { id: "eta", label: "Delivered", value: "August 5, 2026, 11:40 AM" },
      ],
    },
  ]

  const cancelOrder = () => {
    setCancelling(true)

    window.setTimeout(() => {
      setCancelled(true)
      setCancelling(false)
      setConfirmOpen(false)
      notify.warning("Order cancelled", {
        description: "The refund will reach the customer within three days",
      })
    }, 700)
  }

  return (
    <>
      <PageEntity
        title="Order #4187"
        description="Nova sneakers, delivery in Austin"
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                notify.success("Receipt sent", {
                  description: "The email went to emily.carter@example.com",
                })
              }
            >
              Send receipt
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelled}
              onClick={() => setConfirmOpen(true)}
            >
              Cancel order
            </Button>
          </>
        }
        sections={sections}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Cancel order #4187?"
        description="The customer will get a cancellation email, and the refund will reach their card within three days."
        confirmLabel="Cancel order"
        cancelLabel="Keep it"
        tone="danger"
        loading={cancelling}
        onConfirm={cancelOrder}
      />
    </>
  )
}
