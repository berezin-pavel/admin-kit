"use client"

import { useState } from "react"

import { TextField, type TextFieldProps } from "@/registry/text-field/text-field"

export function TextFieldView({
  initialValue = "",
  label,
  placeholder,
  type,
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  placeholder?: string
  type?: TextFieldProps["type"]
  hint?: string
  error?: string
  disabled?: boolean
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
      />
    </div>
  )
}
