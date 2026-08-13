"use client"

import { useState } from "react"

import { Button } from "@/components/ui/button"
import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { ConfirmDialog } from "@/registry/confirm-dialog/confirm-dialog"
import { FormDialog } from "@/registry/form-dialog/form-dialog"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { NumberField } from "@/registry/number-field/number-field"
import { SelectField } from "@/registry/select-field/select-field"
import { Hint } from "@/registry/hint/hint"
import {
  PageEntity,
  type PageEntitySection,
} from "@/registry/page-entity/page-entity"
import { StatusBadge } from "@/registry/status-badge/status-badge"

import {
  formatDemoCurrency,
  orderStatusLabelByLocale,
  orderStatusTone,
} from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoOrderEntity() {
  const [cancelling, setCancelling] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [total, setTotal] = useState("2340")
  const [channel, setChannel] = useState("online")
  const [draftTotal, setDraftTotal] = useState(total)
  const [draftChannel, setDraftChannel] = useState(channel)
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
          value:
            strings.editChannelOptions.find(
              (option) => option.value === channel
            )?.label ?? strings.fieldChannelValue,
        },
        {
          id: "total",
          label: (
            <span className="inline-flex items-center gap-1">
              {strings.fieldTotal}
              <Hint text={strings.fieldTotalHint} />
            </span>
          ),
          value: formatDemoCurrency(Number(total) || 0, locale),
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
              onClick={() => {
                setDraftTotal(total)
                setDraftChannel(channel)
                setEditOpen(true)
              }}
            >
              {strings.editButton}
            </Button>
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
      <FormDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        title={strings.editDialogTitle}
        description={strings.editDialogDescription}
        submitting={saving}
        submitLabel={
          locale === "ru" ? localeRu.formDialog.submitLabel : undefined
        }
        cancelLabel={
          locale === "ru" ? localeRu.formDialog.cancelLabel : undefined
        }
        onSubmit={() => {
          setSaving(true)

          window.setTimeout(() => {
            setTotal(draftTotal)
            setChannel(draftChannel)
            setSaving(false)
            setEditOpen(false)
            notify.success(strings.editToastTitle)
          }, 700)
        }}
      >
        <NumberField
          label={strings.editTotalLabel}
          value={draftTotal}
          onChange={setDraftTotal}
          min={0}
        />
        <SelectField
          label={strings.editChannelLabel}
          value={draftChannel}
          onChange={setDraftChannel}
          options={strings.editChannelOptions}
          placeholder={
            locale === "ru" ? localeRu.selectField.placeholder : undefined
          }
        />
      </FormDialog>
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
