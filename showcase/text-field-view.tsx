"use client"

import { useState } from "react"

import { TextField, type TextFieldProps } from "@/registry/text-field/text-field"
import type { TextFilter } from "@/registry/text-field/text-filters"

export function TextFieldView({
  initialValue = "",
  label,
  placeholder,
  type,
  hint,
  error,
  disabled = false,
  filter,
}: {
  initialValue?: string
  label?: string
  placeholder?: string
  type?: TextFieldProps["type"]
  hint?: string
  error?: string
  disabled?: boolean
  filter?: TextFilter
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <TextField
        value={value}
        onChange={setValue}
        label={label}
        placeholder={placeholder}
        type={type}
        hint={hint}
        error={error}
        disabled={disabled}
        filter={filter}
      />
    </div>
  )
}
