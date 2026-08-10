"use client"

import { useState } from "react"

import {
  ColorField,
  type ColorFieldProps,
} from "@/registry/color-field/color-field"

export function ColorFieldView({
  initialValue = "",
  label,
  presets,
  disabled = false,
}: {
  initialValue?: string
  label?: string
  presets?: ColorFieldProps["presets"]
  disabled?: boolean
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <ColorField
      value={value}
      onChange={setValue}
      label={label}
      presets={presets}
      disabled={disabled}
    />
  )
}
