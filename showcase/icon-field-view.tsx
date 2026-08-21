"use client"

import { useState } from "react"

import { IconField } from "@/registry/icon-field/icon-field"

export function IconFieldView({
  initialValue = null,
  label = "Icon",
  hint,
  error,
  disabled = false,
}: {
  initialValue?: string | null
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <IconField
        value={value}
        onChange={setValue}
        label={label}
        hint={hint}
        error={error}
        disabled={disabled}
      />
    </div>
  )
}
