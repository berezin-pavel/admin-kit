"use client"

import * as React from "react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface TimeFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  step?: number
  min?: string
  max?: string
  disabled?: boolean
  className?: string
}

export function TimeField({
  value,
  onChange,
  label,
  step = 5,
  min,
  max,
  disabled,
  className,
}: TimeFieldProps) {
  const id = React.useId()

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Input
        id={id}
        type="time"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        step={step * 60}
        min={min}
        max={max}
        disabled={disabled}
        className="[&::-webkit-calendar-picker-indicator]:cursor-pointer dark:[&::-webkit-calendar-picker-indicator]:opacity-80 dark:[&::-webkit-calendar-picker-indicator]:invert"
      />
    </div>
  )
}
