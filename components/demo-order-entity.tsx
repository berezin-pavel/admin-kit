"use client"

import { useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import {
  History,
  LayoutDashboard,
  Pencil,
  RotateCw,
  ShoppingBag,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { cn } from "@/lib/utils"
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
import { PageTabs, type PageTabsItem } from "@/registry/page-tabs/page-tabs"
import { StatusBadge } from "@/registry/status-badge/status-badge"
import { WidgetActivity } from "@/registry/widget-activity/widget-activity"
import { WidgetList } from "@/registry/widget-list/widget-list"

import {
  formatDemoCurrency,
  getDemoOrderLineItems,
  getDemoOrderTimelineEntries,
  orderStatusLabelByLocale,
  orderStatusTone,
} from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const RELOAD_DELAY_MS = 1200

const EDIT_TAB = "edit"

export function DemoOrderEntity() {
  const router = useRouter()
  const [cancelling, setCancelling] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [total, setTotal] = useState("2340")
  const [channel, setChannel] = useState("online")
  const [draftTotal, setDraftTotal] = useState(total)
  const [draftChannel, setDraftChannel] = useState(channel)
  const [tab, setTab] = useState("overview")
  const [reloading, setReloading] = useState(false)
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].orderEntity
  const statusLabel = orderStatusLabelByLocale[locale]
  const timelineEntries = useMemo(
    () => getDemoOrderTimelineEntries(locale),
    [locale]
  )
  const lineItems = useMemo(() => getDemoOrderLineItems(locale), [locale])

  const status = cancelled ? "cancelled" : "delivered"

  const sections: readonly PageEntitySection[] = [
    {
      id: "order",
      title: strings.sectionOrder,
      columns: 3,
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
      columns: 3,
      fields: [
        { id: "name", label: strings.fieldName, value: strings.fieldNameValue },
        { id: "email", label: strings.fieldEmail, value: strings.fieldEmailValue },
        { id: "phone", label: strings.fieldPhone, value: strings.fieldPhoneValue },
      ],
    },
    {
      id: "delivery",
      title: strings.sectionDelivery,
      columns: 3,
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

  const reload = () => {
    setReloading(true)
    window.setTimeout(() => setReloading(false), RELOAD_DELAY_MS)
  }

  const tabItems: readonly PageTabsItem[] = [
    {
      id: "overview",
      label: strings.tabOverviewLabel,
      icon: LayoutDashboard,
      content: (
        <PageEntity
          title={strings.title}
          description={strings.description}
          status={reloading ? "loading" : "ready"}
          sections={sections}
        />
      ),
    },
    {
      id: "history",
      label: strings.tabHistoryLabel,
      icon: History,
      content: (
        <WidgetActivity
          title={strings.historyTitle}
          entries={timelineEntries}
          labels={locale === "ru" ? localeRu.widgetActivity : undefined}
          locale={locale === "ru" ? localeRu.widgetActivity.locale : undefined}
          dayFormat={
            locale === "ru" ? localeRu.widgetActivity.dayFormat : undefined
          }
          loading={reloading}
        />
      ),
    },
    {
      id: "related",
      label: strings.tabRelatedLabel,
      icon: ShoppingBag,
      content: (
        <WidgetList
          title={strings.relatedTitle}
          items={lineItems}
          emptyTitle={
            locale === "ru" ? localeRu.widgetList.emptyTitle : undefined
          }
          loading={reloading}
        />
      ),
    },
    {
      id: EDIT_TAB,
      label: strings.tabEditLabel,
      icon: Pencil,
      content: null,
    },
  ]

  return (
    <div className="flex flex-col gap-4">
      <DemoOrderBreadcrumbs />
      <PageTabs
        items={tabItems}
        value={tab}
        onValueChange={(next) => {
          if (next === EDIT_TAB) {
            router.push("/demo/order/edit")
            return
          }

          setTab(next)
        }}
        actions={
          <>
            <Button
              variant="outline"
              onClick={reload}
              disabled={reloading}
            >
              <RotateCw className={cn("size-4", reloading && "animate-spin")} />
              {strings.reloadButton}
            </Button>
            <Button
              variant="outline"
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
              disabled={cancelled}
              onClick={() => setConfirmOpen(true)}
            >
              {strings.cancelOrderButton}
            </Button>
          </>
        }
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
