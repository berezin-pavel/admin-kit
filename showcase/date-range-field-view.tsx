"use client"

import { useState } from "react"

import { DateRangeField } from "@/registry/date-range-field/date-range-field"

export function DateRangeFieldView({
  initialValue = "",
  label,
  error,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-sm">
      <DateRangeField
        value={value}
        onChange={setValue}
        label={label}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
