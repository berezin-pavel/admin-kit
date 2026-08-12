"use client"

import { useState } from "react"

import { CheckboxField } from "@/registry/checkbox-field/checkbox-field"

export function CheckboxFieldView({
  initialChecked = false,
  label,
  hint,
  error,
  disabled = false,
}: {
  initialChecked?: boolean
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [checked, setChecked] = useState(initialChecked)

  return (
    <CheckboxField
      checked={checked}
      onChange={setChecked}
      label={label}
      hint={hint}
      error={error}
      disabled={disabled}
    />
  )
}
