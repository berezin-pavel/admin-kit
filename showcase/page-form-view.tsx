"use client"

import { useState } from "react"

import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"
import { NumberField } from "@/registry/number-field/number-field"
import { PageForm } from "@/registry/page-form/page-form"
import { SelectField, type SelectFieldOption } from "@/registry/select-field/select-field"
import { TextField } from "@/registry/text-field/text-field"
import { TextareaField } from "@/registry/textarea-field/textarea-field"

const PRODUCT_OPTIONS: readonly SelectFieldOption[] = [
  { value: "sneakers-nova", label: "Nova Sneakers" },
  { value: "headphones-pulse", label: "Pulse Headphones" },
  { value: "backpack-city", label: "City Backpack" },
]

const INITIAL_CUSTOMER = "Emily Carter"
const INITIAL_PRODUCT = "sneakers-nova"
const INITIAL_AMOUNT = "2340"
const INITIAL_COMMENT = ""
const INITIAL_PAID = true

export function PageFormReadyView() {
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER)
  const [product, setProduct] = useState(INITIAL_PRODUCT)
  const [amount, setAmount] = useState(INITIAL_AMOUNT)
  const [comment, setComment] = useState(INITIAL_COMMENT)
  const [paid, setPaid] = useState(INITIAL_PAID)
  const [submitting, setSubmitting] = useState(false)

  return (
    <div>
      <PageForm
        title="Edit order #4187"
        description="Update the order and save the changes"
        sections={[
          {
            title: "Order",
            children: (
              <div className="flex flex-col gap-4">
                <TextField
                  label="Customer"
                  value={customer}
                  onChange={setCustomer}
                />
                <SelectField
                  label="Product"
                  value={product}
                  onChange={setProduct}
                  options={PRODUCT_OPTIONS}
                />
                <NumberField
                  label="Amount"
                  value={amount}
                  onChange={setAmount}
                  min={0}
                />
                <TextareaField
                  label="Comment"
                  value={comment}
                  onChange={setComment}
                  placeholder="Add a note for the fulfillment team"
                />
                <CheckboxField label="Paid" checked={paid} onChange={setPaid} />
              </div>
            ),
          },
        ]}
        submitting={submitting}
        onSubmit={() => {
          setSubmitting(true)
          window.setTimeout(() => {
            setSubmitting(false)
            notify.success("Order saved", {
              description: "Order #4187 updated",
            })
          }, 700)
        }}
        onCancel={() => {
          setCustomer(INITIAL_CUSTOMER)
          setProduct(INITIAL_PRODUCT)
          setAmount(INITIAL_AMOUNT)
          setComment(INITIAL_COMMENT)
          setPaid(INITIAL_PAID)
        }}
      />
      <AdminToaster />
    </div>
  )
}

export function PageFormThreeColumnsView() {
  const [customer, setCustomer] = useState(INITIAL_CUSTOMER)
  const [product, setProduct] = useState(INITIAL_PRODUCT)
  const [amount, setAmount] = useState(INITIAL_AMOUNT)
  const [comment, setComment] = useState(INITIAL_COMMENT)
  const [paid, setPaid] = useState(INITIAL_PAID)

  return (
    <PageForm
      title="Edit order #4187"
      description="Update the order and save the changes"
      sections={[
        {
          title: "Order",
          columns: 3,
          children: (
            <>
              <TextField
                label="Customer"
                value={customer}
                onChange={setCustomer}
              />
              <SelectField
                label="Product"
                value={product}
                onChange={setProduct}
                options={PRODUCT_OPTIONS}
              />
              <NumberField
                label="Amount"
                value={amount}
                onChange={setAmount}
                min={0}
              />
              <CheckboxField label="Paid" checked={paid} onChange={setPaid} />
              <TextareaField
                className="sm:col-span-2 lg:col-span-3"
                label="Comment"
                value={comment}
                onChange={setComment}
                placeholder="Add a note for the fulfillment team"
              />
            </>
          ),
        },
      ]}
    />
  )
}

export function PageFormSubmittingView() {
  const [customer] = useState(INITIAL_CUSTOMER)
  const [product] = useState(INITIAL_PRODUCT)
  const [amount] = useState(INITIAL_AMOUNT)

  return (
    <PageForm
      title="Edit order #4187"
      description="Update the order and save the changes"
      sections={[
        {
          title: "Order",
          children: (
            <div className="flex flex-col gap-4">
              <TextField
                label="Customer"
                value={customer}
                onChange={() => {}}
                disabled
              />
              <SelectField
                label="Product"
                value={product}
                onChange={() => {}}
                options={PRODUCT_OPTIONS}
                disabled
              />
              <NumberField
                label="Amount"
                value={amount}
                onChange={() => {}}
                disabled
              />
            </div>
          ),
        },
      ]}
      submitting
    />
  )
}

export function PageFormErrorView() {
  return <PageForm title="Edit order #4187" sections={[]} status="error" />
}
