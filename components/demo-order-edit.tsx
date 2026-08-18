"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"

import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { ColorField } from "@/registry/color-field/color-field"
import { ComboboxField } from "@/registry/combobox-field/combobox-field"
import { DateField } from "@/registry/date-field/date-field"
import { DateTimeField } from "@/registry/date-time-field/date-time-field"
import { FileField } from "@/registry/file-field/file-field"
import {
  formatUploadSpeed,
  ImageField,
  type ImageFieldItem,
} from "@/registry/image-field/image-field"
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
const INITIAL_PHOTOS: readonly ImageFieldItem[] = [
  { id: "front", url: "/demo-images/front.svg", name: "front-view.svg" },
  { id: "side", url: "/demo-images/side.svg", name: "side-view.svg" },
  { id: "sole", url: "/demo-images/sole.svg", name: "sole.svg" },
]
const MAX_UPLOAD_BYTES = 3 * 1024 * 1024
const UPLOAD_DURATION_MS = 2400
const UPLOAD_TICK_MS = 120

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
  const [photos, setPhotos] = useState(INITIAL_PHOTOS)
  const [submitting, setSubmitting] = useState(false)
  const uploadTimers = useRef(new Set<number>())

  useEffect(() => {
    const timers = uploadTimers.current

    return () => {
      timers.forEach((timer) => window.clearInterval(timer))
      timers.clear()
    }
  }, [])

  const uploadPhoto = (id: string, file: File) => {
    let elapsed = 0

    const timer = window.setInterval(() => {
      elapsed += UPLOAD_TICK_MS

      const ratio = Math.min(1, elapsed / UPLOAD_DURATION_MS)
      const speed = formatUploadSpeed(
        (file.size / (UPLOAD_DURATION_MS / 1000)) * (0.85 + Math.random() * 0.3)
      )

      if (ratio < 1) {
        setPhotos((current) =>
          current.map((item) =>
            item.id === id
              ? { ...item, progress: Math.round(ratio * 100), speed }
              : item
          )
        )
        return
      }

      window.clearInterval(timer)
      uploadTimers.current.delete(timer)
      setPhotos((current) =>
        current.map((item) =>
          item.id === id
            ? {
                id: item.id,
                url: item.url,
                name: item.name,
                error:
                  file.size > MAX_UPLOAD_BYTES
                    ? strings.photosErrorText
                    : undefined,
              }
            : item
        )
      )
    }, UPLOAD_TICK_MS)

    uploadTimers.current.add(timer)
  }

  return (
    <div className="flex flex-col gap-4">
      <PageForm
        blockId="order.edit"
        breadcrumbs={<DemoOrderBreadcrumbs current="edit" />}
        title={strings.title}
        description={strings.description}
        submitLabel={locale === "ru" ? localeRu.pageForm.submitLabel : undefined}
        cancelLabel={locale === "ru" ? localeRu.pageForm.cancelLabel : undefined}
        sections={[
          {
            title: strings.sectionTitle,
            columns: 3,
            children: (
              <>
                <ComboboxField
                  label={strings.customerLabel}
                  value={customer}
                  onChange={setCustomer}
                  options={customerOptions}
                  placeholder={strings.customerPlaceholder}
                  emptyLabel={strings.customerEmptyLabel}
                  openLabel={
                    locale === "ru" ? localeRu.comboboxField.openLabel : undefined
                  }
                  clearLabel={
                    locale === "ru" ? localeRu.comboboxField.clearLabel : undefined
                  }
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
                <DateTimeField
                  label={strings.pickupLabel}
                  value={pickup}
                  onChange={setPickup}
                  locale={
                    locale === "ru" ? localeRu.dateTimeField.locale : undefined
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
                <ColorField
                  label={strings.labelColorLabel}
                  value={labelColor}
                  onChange={setLabelColor}
                  placeholder={
                    locale === "ru" ? localeRu.colorField.placeholder : undefined
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
                <CheckboxField
                  className="pt-7"
                  label={strings.paidLabel}
                  checked={paid}
                  onChange={setPaid}
                />
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
                <ImageField
                  className="sm:col-span-2 lg:col-span-3"
                  label={strings.photosLabel}
                  hint={strings.photosHint}
                  value={photos}
                  onChange={setPhotos}
                  onSelect={(files) => {
                    const started = files.map((file, index) => ({
                      id: `${file.name}-${file.lastModified}-${index}-${Date.now()}`,
                      url: URL.createObjectURL(file),
                      name: file.name,
                      progress: 0,
                    }))

                    setPhotos((current) => [...current, ...started])
                    started.forEach((item, index) =>
                      uploadPhoto(item.id, files[index])
                    )
                  }}
                  maxItems={6}
                  labels={locale === "ru" ? localeRu.imageField : undefined}
                />
                <TextareaField
                  className="sm:col-span-2 lg:col-span-3"
                  label={strings.commentLabel}
                  value={comment}
                  onChange={setComment}
                  placeholder={strings.commentPlaceholder}
                />
              </>
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
