"use client"

import { useState } from "react"

import { DateField } from "@/registry/date-field/date-field"

export function DateFieldView({
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
      <DateField
        value={value}
        onChange={setValue}
        label={label}
        disabled={disabled}
      />
    </div>
  )
}
