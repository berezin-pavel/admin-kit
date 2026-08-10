"use client"

import { useState } from "react"

import { TimeField } from "@/registry/time-field/time-field"

export interface TimeFieldViewProps {
  initialValue: string
  label?: string
  step?: number
  min?: string
  max?: string
  disabled?: boolean
}

export function TimeFieldView({
  initialValue,
  label,
  step,
  min,
  max,
  disabled,
}: TimeFieldViewProps) {
  const [value, setValue] = useState(initialValue)

  return (
    <TimeField
      value={value}
      onChange={setValue}
      label={label}
      step={step}
      min={min}
      max={max}
      disabled={disabled}
    />
  )
}
