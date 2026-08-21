"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export interface SelectFieldOption {
  value: string
  label: string
}

export type FieldWidth = "auto" | "full"

export interface SelectFieldProps {
  value: string
  onChange: (value: string) => void
  options: readonly SelectFieldOption[]
  placeholder?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  width?: FieldWidth
  className?: string
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = "Select…",
  label,
  hint,
  error,
  disabled = false,
  width = "full",
  className,
}: SelectFieldProps) {
  const id = React.useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const selectedLabel = options.find((option) => option.value === value)?.label

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Select
        value={value}
        onValueChange={(next) => onChange(next ?? "")}
        disabled={disabled}
      >
        <SelectTrigger
          id={id}
          className={width === "full" ? "w-full" : "w-auto"}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
        >
          <SelectValue>{selectedLabel ?? placeholder}</SelectValue>
        </SelectTrigger>
        <SelectContent
          align="start"
          alignItemWithTrigger={false}
          className="w-auto min-w-(--anchor-width)"
        >
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
    </div>
  )
}
