"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { ColorField } from "@/registry/color-field/color-field"
import { ComboboxField } from "@/registry/combobox-field/combobox-field"
import { DateField } from "@/registry/date-field/date-field"
import { DateTimeField } from "@/registry/date-time-field/date-time-field"
import { FileField } from "@/registry/file-field/file-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { MultiSelectField } from "@/registry/multi-select-field/multi-select-field"
import { NumberField } from "@/registry/number-field/number-field"
import { PageForm } from "@/registry/page-form/page-form"
import { SelectField } from "@/registry/select-field/select-field"
import { TextareaField } from "@/registry/textarea-field/textarea-field"
import { TimeField } from "@/registry/time-field/time-field"

import { getDemoCustomerOptions, getDemoProductOptions } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const INITIAL_CUSTOMER = "customer-6"
const INITIAL_PRODUCT = "sneakers-nova"
const INITIAL_AMOUNT = "2340"
const INITIAL_DATE = "2026-08-03"
const INITIAL_PAID = true
const INITIAL_COMMENT = "Gift wrap requested, deliver after 6pm."
const INITIAL_TAGS: readonly string[] = ["gift", "priority"]
const INITIAL_CHANNELS: readonly string[] = ["online", "retail"]
const INITIAL_PICKUP = "2026-08-14T11:00"
const INITIAL_DELIVERY_TIME = "11:30"
const INITIAL_LABEL_COLOR = "#f97316"

export function DemoOrderEdit() {
  const router = useRouter()
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].orderEdit
  const productOptions = getDemoProductOptions(locale)
  const customerOptions = getDemoCustomerOptions(locale)

  const [customer, setCustomer] = useState(INITIAL_CUSTOMER)
  const [product, setProduct] = useState(INITIAL_PRODUCT)
  const [amount, setAmount] = useState(INITIAL_AMOUNT)
  const [date, setDate] = useState(INITIAL_DATE)
  const [paid, setPaid] = useState(INITIAL_PAID)
  const [comment, setComment] = useState(INITIAL_COMMENT)
  const [tags, setTags] = useState<readonly string[]>(INITIAL_TAGS)
  const [channels, setChannels] = useState<readonly string[]>(INITIAL_CHANNELS)
  const [attachment, setAttachment] = useState<File | null>(null)
  const [pickup, setPickup] = useState(INITIAL_PICKUP)
  const [deliveryTime, setDeliveryTime] = useState(INITIAL_DELIVERY_TIME)
  const [labelColor, setLabelColor] = useState(INITIAL_LABEL_COLOR)
  const [supplierDiscount, setSupplierDiscount] = useState("")
  const [submitting, setSubmitting] = useState(false)

  return (
    <div className="flex flex-col gap-4">
      <DemoOrderBreadcrumbs current="edit" />
      <PageForm
        title={strings.title}
        description={strings.description}
        submitLabel={locale === "ru" ? localeRu.pageForm.submitLabel : undefined}
        cancelLabel={locale === "ru" ? localeRu.pageForm.cancelLabel : undefined}
        sections={[
          {
            title: strings.sectionTitle,
            children: (
              <div className="flex flex-col gap-4">
                <ComboboxField
                  label={strings.customerLabel}
                  value={customer}
                  onChange={setCustomer}
                  options={customerOptions}
                  placeholder={strings.customerPlaceholder}
                  emptyLabel={strings.customerEmptyLabel}
                />
                <SelectField
                  label={strings.productLabel}
                  value={product}
                  onChange={setProduct}
                  options={productOptions}
                  placeholder={
                    locale === "ru" ? localeRu.selectField.placeholder : undefined
                  }
                />
                <NumberField
                  label={strings.amountLabel}
                  value={amount}
                  onChange={setAmount}
                  min={0}
                />
                <DateField
                  label={strings.dateLabel}
                  value={date}
                  onChange={setDate}
                  locale={locale === "ru" ? localeRu.dateField.locale : undefined}
                  displayFormat={
                    locale === "ru" ? localeRu.dateField.displayFormat : undefined
                  }
                />
                <CheckboxField
                  label={strings.paidLabel}
                  checked={paid}
                  onChange={setPaid}
                />
                <TextareaField
                  label={strings.commentLabel}
                  value={comment}
                  onChange={setComment}
                  placeholder={strings.commentPlaceholder}
                />
                <div className="grid gap-4 sm:grid-cols-2">
                  <DateTimeField
                    label={strings.pickupLabel}
                    value={pickup}
                    onChange={setPickup}
                    locale={
                      locale === "ru"
                        ? localeRu.dateTimeField.locale
                        : undefined
                    }
                    displayFormat={
                      locale === "ru"
                        ? localeRu.dateTimeField.displayFormat
                        : undefined
                    }
                    placeholder={
                      locale === "ru"
                        ? localeRu.dateTimeField.placeholder
                        : undefined
                    }
                  />
                  <TimeField
                    label={strings.deliveryTimeLabel}
                    value={deliveryTime}
                    onChange={setDeliveryTime}
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <ColorField
                    label={strings.labelColorLabel}
                    value={labelColor}
                    onChange={setLabelColor}
                    placeholder={
                      locale === "ru"
                        ? localeRu.colorField.placeholder
                        : undefined
                    }
                    hexInputLabel={
                      locale === "ru"
                        ? localeRu.colorField.hexInputLabel
                        : undefined
                    }
                  />
                  <NumberField
                    label={strings.supplierDiscountLabel}
                    value={supplierDiscount}
                    onChange={setSupplierDiscount}
                    hint={strings.supplierDiscountHint}
                    placeholder={strings.supplierDiscountPlaceholder}
                    min={0}
                    max={100}
                  />
                </div>
                <MultiSelectField
                  label={strings.tagsLabel}
                  value={tags}
                  onChange={setTags}
                  options={strings.tagsOptions}
                  placeholder={strings.tagsPlaceholder}
                  emptyLabel={strings.tagsEmptyLabel}
                  removeLabel={strings.removeItemLabel}
                />
                <MultiSelectField
                  label={strings.channelsLabel}
                  value={channels}
                  onChange={setChannels}
                  options={strings.channelsOptions}
                  placeholder={strings.channelsPlaceholder}
                  emptyLabel={strings.channelsEmptyLabel}
                  removeLabel={strings.removeItemLabel}
                  hint={strings.channelsHint}
                  maxItems={3}
                />
                <FileField
                  label={strings.attachmentLabel}
                  value={attachment}
                  onChange={setAttachment}
                  buttonLabel={
                    locale === "ru" ? localeRu.fileField.buttonLabel : undefined
                  }
                  noFileLabel={
                    locale === "ru" ? localeRu.fileField.noFileLabel : undefined
                  }
                  clearLabel={
                    locale === "ru" ? localeRu.fileField.clearLabel : undefined
                  }
                />
              </div>
            ),
          },
        ]}
        submitting={submitting}
        onSubmit={() => {
          setSubmitting(true)

          window.setTimeout(() => {
            setSubmitting(false)
            notify.success(strings.saveToastTitle, {
              description: strings.saveToastDescription,
            })
            router.push("/demo/orders")
          }, 700)
        }}
        onCancel={() => router.push("/demo/orders")}
      />
    </div>
  )
}
