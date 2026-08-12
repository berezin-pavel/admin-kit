"use client"

import { useState } from "react"

import { NumberField } from "@/registry/number-field/number-field"

export function NumberFieldView({
  initialValue = "",
  label,
  placeholder,
  min,
  max,
  step,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  placeholder?: string
  min?: number
  max?: number
  step?: number
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <NumberField
        value={value}
        onChange={setValue}
        label={label}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
