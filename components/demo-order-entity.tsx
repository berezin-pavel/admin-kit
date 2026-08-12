"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { Hint } from "@/registry/hint/hint"
import {
  PageEntity,
  type PageEntitySection,
} from "@/registry/page-entity/page-entity"
import { StatusBadge } from "@/registry/status-badge/status-badge"

import { orderStatusLabelByLocale, orderStatusTone } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoOrderEntity() {
  const [cancelling, setCancelling] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].orderEntity
  const statusLabel = orderStatusLabelByLocale[locale]

  const status = cancelled ? "cancelled" : "delivered"

  const sections: readonly PageEntitySection[] = [
    {
      id: "order",
      title: strings.sectionOrder,
      fields: [
        {
          id: "status",
          label: strings.fieldStatus,
          value: (
            <StatusBadge tone={orderStatusTone[status]}>
              {statusLabel[status]}
            </StatusBadge>
          ),
        },
        {
          id: "created",
          label: strings.fieldPlaced,
          value: strings.fieldPlacedValue,
        },
        {
          id: "channel",
          label: strings.fieldChannel,
          value: strings.fieldChannelValue,
        },
        {
          id: "total",
          label: (
            <span className="inline-flex items-center gap-1">
              {strings.fieldTotal}
              <Hint text={strings.fieldTotalHint} />
            </span>
          ),
          value: strings.fieldTotalValue,
        },
      ],
    },
    {
      id: "customer",
      title: strings.sectionCustomer,
      fields: [
        { id: "name", label: strings.fieldName, value: strings.fieldNameValue },
        { id: "email", label: strings.fieldEmail, value: strings.fieldEmailValue },
        { id: "phone", label: strings.fieldPhone, value: strings.fieldPhoneValue },
      ],
    },
    {
      id: "delivery",
      title: strings.sectionDelivery,
      fields: [
        {
          id: "address",
          label: strings.fieldAddress,
          value: strings.fieldAddressValue,
        },
        {
          id: "courier",
          label: strings.fieldCarrier,
          value: strings.fieldCarrierValue,
        },
        {
          id: "eta",
          label: strings.fieldDelivered,
          value: strings.fieldDeliveredValue,
        },
      ],
    },
  ]

  const cancelOrder = () => {
    setCancelling(true)

    window.setTimeout(() => {
      setCancelled(true)
      setCancelling(false)
      setConfirmOpen(false)
      notify.warning(strings.cancelToastTitle, {
        description: strings.cancelToastDescription,
      })
    }, 700)
  }

  return (
    <div className="flex flex-col gap-4">
      <DemoOrderBreadcrumbs />
      <PageEntity
        title={strings.title}
        description={strings.description}
        actions={
          <>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                notify.success(strings.sendReceiptToastTitle, {
                  description: strings.sendReceiptToastDescription,
                })
              }
            >
              {strings.sendReceiptButton}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={cancelled}
              onClick={() => setConfirmOpen(true)}
            >
              {strings.cancelOrderButton}
            </Button>
          </>
        }
        sections={sections}
      />
      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title={strings.cancelConfirmTitle}
        description={strings.cancelConfirmDescription}
        confirmLabel={strings.cancelConfirmLabel}
        cancelLabel={strings.cancelConfirmCancelLabel}
        tone="danger"
        loading={cancelling}
        onConfirm={cancelOrder}
      />
    </div>
  )
}
