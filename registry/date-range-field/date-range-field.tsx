"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
import type { Locale } from "date-fns"
import { enUS } from "date-fns/locale"
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subMonths,
  subWeeks,
  subYears,
} from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export interface DateRange {
  from: Date
  to: Date
}

export interface DateRangePreset {
  id: string
  label: string
  getRange: (today: Date) => DateRange
}

export interface DateRangeFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  hint?: string
  error?: string
  placeholder?: string
  presets?: readonly DateRangePreset[]
  disabled?: boolean
  className?: string
  locale?: Locale
  displayFormat?: string
}

function parseDatePart(part: string): Date | undefined {
  const [year, month, day] = part.split("-").map(Number)

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

function formatDatePart(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

export function parseDateRangeValue(value: string): DateRange | undefined {
  const [fromPart, toPart] = value.split("..")

  if (fromPart === undefined || toPart === undefined) {
    return undefined
  }

  const from = parseDatePart(fromPart)
  const to = parseDatePart(toPart)

  if (!from || !to || from > to) {
    return undefined
  }

  return { from, to }
}

export function formatDateRangeValue(range: DateRange): string {
  return `${formatDatePart(range.from)}..${formatDatePart(range.to)}`
}

export const defaultDateRangePresets: readonly DateRangePreset[] = [
  {
    id: "today",
    label: "Today",
    getRange: (today) => ({ from: today, to: today }),
  },
  {
    id: "yesterday",
    label: "Yesterday",
    getRange: (today) => {
      const day = subDays(today, 1)
      return { from: day, to: day }
    },
  },
  {
    id: "this-week",
    label: "This week",
    getRange: (today) => ({
      from: startOfWeek(today, { weekStartsOn: 1 }),
      to: today,
    }),
  },
  {
    id: "this-month",
    label: "This month",
    getRange: (today) => ({ from: startOfMonth(today), to: today }),
  },
  {
    id: "this-year",
    label: "This year",
    getRange: (today) => ({ from: startOfYear(today), to: today }),
  },
  {
    id: "last-week",
    label: "Last week",
    getRange: (today) => {
      const lastWeek = subWeeks(today, 1)
      return {
        from: startOfWeek(lastWeek, { weekStartsOn: 1 }),
        to: endOfWeek(lastWeek, { weekStartsOn: 1 }),
      }
    },
  },
  {
    id: "last-month",
    label: "Last month",
    getRange: (today) => {
      const lastMonth = subMonths(today, 1)
      return { from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) }
    },
  },
  {
    id: "last-year",
    label: "Last year",
    getRange: (today) => {
      const lastYear = subYears(today, 1)
      return { from: startOfYear(lastYear), to: endOfYear(lastYear) }
    },
  },
]

export function DateRangeField({
  value,
  onChange,
  label,
  hint,
  error,
  placeholder = "Pick a date range",
  presets = defaultDateRangePresets,
  disabled = false,
  className,
  locale = enUS,
  displayFormat = "MMM d, yyyy",
}: DateRangeFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [open, setOpen] = React.useState(false)
  const selected = parseDateRangeValue(value)

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
            ? `${format(selected.from, displayFormat, { locale })} – ${format(
                selected.to,
                displayFormat,
                { locale }
              )}`
            : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <div className="flex">
            <div className="flex flex-col gap-1 border-r p-2">
              {presets.map((preset) => {
                const presetRange = preset.getRange(new Date())
                const active = formatDateRangeValue(presetRange) === value

                return (
                  <Button
                    key={preset.id}
                    type="button"
                    variant="ghost"
                    className={cn(
                      "justify-start text-sm font-normal",
                      active && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onChange(formatDateRangeValue(presetRange))
                      setOpen(false)
                    }}
                  >
                    {preset.label}
                  </Button>
                )
              })}
            </div>
            <Calendar
              mode="range"
              locale={locale}
              numberOfMonths={2}
              selected={selected}
              onSelect={(range) => {
                if (!range?.from || !range?.to) {
                  return
                }

                onChange(
                  formatDateRangeValue({ from: range.from, to: range.to })
                )
                setOpen(false)
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
