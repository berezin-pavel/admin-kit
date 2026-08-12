"use client"

import { useState } from "react"

import {
  SelectField,
  type SelectFieldOption,
} from "@/registry/select-field/select-field"

const DEFAULT_OPTIONS: readonly SelectFieldOption[] = [
  { value: "delivered", label: "Delivered" },
  { value: "in-transit", label: "Shipped" },
  { value: "paid", label: "Paid" },
  { value: "cancelled", label: "Cancelled" },
]

export function SelectFieldView({
  initialValue = "",
  label,
  options = DEFAULT_OPTIONS,
  placeholder,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  options?: readonly SelectFieldOption[]
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <SelectField
        value={value}
        onChange={setValue}
        options={options}
        label={label}
        placeholder={placeholder}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
