"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import { DemoOrderBreadcrumbs } from "@/components/demo-order-breadcrumbs"
import { notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { DateField } from "@/registry/date-field/date-field"
import { FileField } from "@/registry/file-field/file-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { NumberField } from "@/registry/number-field/number-field"
import { PageForm } from "@/registry/page-form/page-form"
import { SelectField } from "@/registry/select-field/select-field"
import { TagsField } from "@/registry/tags-field/tags-field"
import { TextField } from "@/registry/text-field/text-field"
import { TextareaField } from "@/registry/textarea-field/textarea-field"

import { getDemoProductOptions } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const INITIAL_CUSTOMER = "Emily Carter"
const INITIAL_PRODUCT = "sneakers-nova"
const INITIAL_AMOUNT = "2340"
const INITIAL_DATE = "2026-08-03"
const INITIAL_PAID = true
const INITIAL_COMMENT = "Gift wrap requested, deliver after 6pm."
const INITIAL_TAGS: readonly string[] = ["Gift", "Priority"]

export function DemoOrderEdit() {
  const router = useRouter()
  const locale = useDemoLocale()
  const strings = demoDictionary[locale].orderEdit
  const productOptions = getDemoProductOptions(locale)

  const [customer, setCustomer] = useState(INITIAL_CUSTOMER)
  const [product, setProduct] = useState(INITIAL_PRODUCT)
  const [amount, setAmount] = useState(INITIAL_AMOUNT)
  const [date, setDate] = useState(INITIAL_DATE)
  const [paid, setPaid] = useState(INITIAL_PAID)
  const [comment, setComment] = useState(INITIAL_COMMENT)
  const [tags, setTags] = useState<readonly string[]>(INITIAL_TAGS)
  const [attachment, setAttachment] = useState<File | null>(null)
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
                <TextField
                  label={strings.customerLabel}
                  value={customer}
                  onChange={setCustomer}
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
                <TagsField
                  label={strings.tagsLabel}
                  value={tags}
                  onChange={setTags}
                  suggestions={strings.tagsSuggestions}
                  placeholder={
                    locale === "ru" ? localeRu.tagsField.placeholder : undefined
                  }
                  removeLabel={
                    locale === "ru" ? localeRu.tagsField.removeLabel : undefined
                  }
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
