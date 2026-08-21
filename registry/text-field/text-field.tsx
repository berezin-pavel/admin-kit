"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import type { TextFilter } from "./text-filters"

export interface TextFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  type?: "text" | "email" | "password" | "url" | "tel"
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  filter?: TextFilter
}

export function TextField({
  value,
  onChange,
  label,
  placeholder,
  type,
  hint,
  error,
  disabled = false,
  className,
  filter,
}: TextFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Input
        id={id}
        type={type ?? filter?.type ?? "text"}
        inputMode={filter?.inputMode}
        value={value}
        onChange={(event) =>
          onChange(
            filter ? filter.sanitize(event.target.value) : event.target.value
          )
        }
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? errorId : hint ? hintId : undefined}
      />
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
