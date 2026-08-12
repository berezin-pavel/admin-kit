"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateTimeFieldProps {
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

export function parseDateTimeValue(value: string): Date | undefined {
  const [datePart, timePart] = value.split("T")
  const [year, month, day] = (datePart ?? "").split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  const [hours = 0, minutes = 0] = (timePart ?? "").split(":").map(Number)

  if (hours > 23 || minutes > 59) {
    return undefined
  }

  const date = new Date(year, month - 1, day, hours || 0, minutes || 0)

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day ||
    date.getHours() !== (hours || 0) ||
    date.getMinutes() !== (minutes || 0)
  ) {
    return undefined
  }

  return date
}

export function formatDateTimeValue(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")
  const hours = String(date.getHours()).padStart(2, "0")
  const minutes = String(date.getMinutes()).padStart(2, "0")

  return `${year}-${month}-${day}T${hours}:${minutes}`
}

export function mergeSelectedDate(date: Date, selected: Date | undefined): Date {
  const next = new Date(date)

  if (selected) {
    next.setHours(selected.getHours(), selected.getMinutes())
  } else {
    next.setHours(0, 0)
  }

  return next
}

export function mergeSelectedTime(
  base: Date,
  hours: number,
  minutes: number
): Date {
  const next = new Date(base)

  next.setHours(hours, minutes, 0, 0)

  return next
}

export function DateTimeField({
  value,
  onChange,
  label,
  placeholder = "Pick a date and time",
  hint,
  error,
  disabled = false,
  className,
  locale = enUS,
  displayFormat = "MMMM d, yyyy HH:mm",
}: DateTimeFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [open, setOpen] = React.useState(false)
  const selected = parseDateTimeValue(value)
  const timeValue = selected
    ? `${String(selected.getHours()).padStart(2, "0")}:${String(
        selected.getMinutes()
      ).padStart(2, "0")}`
    : ""

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

              onChange(formatDateTimeValue(mergeSelectedDate(date, selected)))
            }}
          />
          <div className="border-t px-3 py-2.5">
            <Input
              type="time"
              value={timeValue}
              disabled={disabled}
              onChange={(event) => {
                const time = event.target.value

                if (!time) {
                  return
                }

                const [hours, minutes] = time.split(":").map(Number)
                const base = selected ?? new Date()

                onChange(
                  formatDateTimeValue(mergeSelectedTime(base, hours, minutes))
                )
              }}
            />
          </div>
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
