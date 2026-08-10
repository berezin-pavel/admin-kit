"use client"

import { useState } from "react"

import { DateTimeField } from "@/registry/date-time-field/date-time-field"

export function DateTimeFieldView({
  initialValue = "",
  label,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <DateTimeField
        value={value}
        onChange={setValue}
        label={label}
        disabled={disabled}
      />
    </div>
  )
}
