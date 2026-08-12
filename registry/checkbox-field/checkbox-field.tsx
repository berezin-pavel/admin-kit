"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"

export interface CheckboxFieldProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function CheckboxField({
  checked,
  onChange,
  label,
  hint,
  error,
  disabled = false,
  className,
}: CheckboxFieldProps) {
  const id = React.useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <div className="flex items-center gap-2">
        <Checkbox
          id={id}
          checked={checked}
          onCheckedChange={(next) => onChange(next)}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
        />
        {label ? <Label htmlFor={id}>{label}</Label> : null}
      </div>
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
