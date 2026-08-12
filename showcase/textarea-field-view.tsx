"use client"

import { useState } from "react"

import { TextareaField } from "@/registry/textarea-field/textarea-field"

export function TextareaFieldView({
  initialValue = "",
  label,
  placeholder,
  rows,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  placeholder?: string
  rows?: number
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-sm">
      <TextareaField
        value={value}
        onChange={setValue}
        label={label}
        placeholder={placeholder}
        rows={rows}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
