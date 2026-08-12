"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  locale?: Locale
  displayFormat?: string
}

export function parseDateValue(value: string): Date | undefined {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const date = new Date(year, month - 1, day)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return undefined
  }

  return date
}

export function formatDateValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function DateField({
  value,
  onChange,
  label,
  placeholder = "Pick a date",
  hint,
  error,
  disabled = false,
  className,
  locale = enUS,
  displayFormat = "MMMM d, yyyy",
}: DateFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [open, setOpen] = React.useState(false)
  const selected = parseDateValue(value)

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          render={
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start font-normal",
                !selected && "text-muted-foreground"
              )}
            />
          }
        >
          <CalendarIcon />
          {selected
            ? format(selected, displayFormat, { locale })
            : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            locale={locale}
            selected={selected}
            onSelect={(date) => {
              if (!date) {
                return
              }

              onChange(formatDateValue(date))
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
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
