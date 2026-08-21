"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format, isSameDay } from "date-fns"
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
import { useRadioGroupNav } from "@/registry/admin-appearance/radio-group-nav"
import { Button } from "@/components/ui/button"
import { Calendar, CalendarDayButton } from "@/components/ui/calendar"
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
  width?: "auto" | "full"
  className?: string
  locale?: Locale
  displayFormat?: string
  presetsLabel?: string
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

export function orderDateRange(anchor: Date, target: Date): DateRange {
  return target < anchor
    ? { from: target, to: anchor }
    : { from: anchor, to: target }
}

export function previewDateRange(
  anchor: Date | undefined,
  hovered: Date | undefined,
  committed: DateRange | undefined
): DateRange | undefined {
  if (!anchor) {
    return committed
  }

  return orderDateRange(anchor, hovered ?? anchor)
}

function isKeyboardActivation(event: React.MouseEvent | React.KeyboardEvent) {
  return event.detail === 0
}

type CalendarComponents = React.ComponentProps<typeof Calendar>["components"]

interface DayPress {
  day: Date
  startedHere: boolean
  moved: boolean
}

interface DayGesture {
  press: (day: Date, event: React.PointerEvent<HTMLButtonElement>) => void
  track: (day: Date) => void
  release: (day: Date) => void
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
  width = "auto",
  className,
  locale = enUS,
  displayFormat = "MMM d, yyyy",
  presetsLabel = "Quick ranges",
}: DateRangeFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [open, setOpen] = React.useState(false)
  const [anchor, setAnchor] = React.useState<Date | undefined>(undefined)
  const [hovered, setHovered] = React.useState<Date | undefined>(undefined)
  const [dragging, setDragging] = React.useState(false)
  const pressRef = React.useRef<DayPress | null>(null)
  const gestureRef = React.useRef<DayGesture | null>(null)
  const selected = parseDateRangeValue(value)
  const preview = previewDateRange(anchor, hovered, selected)
  const activePresetIndex = presets.findIndex(
    (preset) => formatDateRangeValue(preset.getRange(new Date())) === value
  )
  const presetNav = useRadioGroupNav({
    count: presets.length,
    selectedIndex: activePresetIndex,
  })

  function clearSelection() {
    pressRef.current = null
    setAnchor(undefined)
    setHovered(undefined)
    setDragging(false)
  }

  function commitRange(range: DateRange) {
    clearSelection()
    setOpen(false)
    onChange(formatDateRangeValue(range))
  }

  function selectDay(day: Date) {
    if (!anchor) {
      setAnchor(day)
      setHovered(day)
      return
    }

    commitRange(orderDateRange(anchor, day))
  }

  const gesture: DayGesture = {
    press: (day, event) => {
      if (pressRef.current) {
        return
      }

      if (event.pointerType === "mouse" && event.button !== 0) {
        return
      }

      if (event.currentTarget.hasPointerCapture(event.pointerId)) {
        event.currentTarget.releasePointerCapture(event.pointerId)
      }

      pressRef.current = { day, startedHere: !anchor, moved: false }

      if (!anchor) {
        setAnchor(day)
      }

      setHovered(day)
      setDragging(true)
    },
    track: (day) => {
      const press = pressRef.current

      if (press && !isSameDay(press.day, day)) {
        press.moved = true
      }

      setHovered(day)
    },
    release: (day) => {
      const press = pressRef.current

      if (!press) {
        return
      }

      pressRef.current = null
      setDragging(false)

      const from = press.startedHere ? press.day : anchor

      if (from && (press.moved || !press.startedHere)) {
        commitRange(orderDateRange(from, day))
      }
    },
  }

  React.useEffect(() => {
    gestureRef.current = gesture
  })

  React.useEffect(() => {
    if (!dragging) {
      return
    }

    function cancelPress() {
      const press = pressRef.current

      if (!press) {
        return
      }

      pressRef.current = null
      setDragging(false)

      if (press.startedHere) {
        setAnchor(undefined)
        setHovered(undefined)
      }
    }

    window.addEventListener("pointerup", cancelPress)
    window.addEventListener("pointercancel", cancelPress)

    return () => {
      window.removeEventListener("pointerup", cancelPress)
      window.removeEventListener("pointercancel", cancelPress)
    }
  }, [dragging])

  const calendarComponents = React.useMemo<CalendarComponents>(
    () => ({
      Root: ({ className: rootClassName, rootRef, ...rootProps }) => (
        <div
          data-slot="calendar"
          ref={rootRef}
          className={rootClassName}
          {...rootProps}
        />
      ),
      DayButton: (dayProps) => (
        <CalendarDayButton
          {...dayProps}
          locale={locale}
          className={cn(dayProps.className, "touch-none")}
          onPointerDown={(event) =>
            gestureRef.current?.press(dayProps.day.date, event)
          }
          onPointerEnter={() => gestureRef.current?.track(dayProps.day.date)}
          onPointerUp={() => gestureRef.current?.release(dayProps.day.date)}
        />
      ),
    }),
    [locale]
  )

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Popover
        open={open}
        onOpenChange={(next) => {
          if (!next) {
            clearSelection()
          }

          setOpen(next)
        }}
      >
        <PopoverTrigger
          id={id}
          disabled={disabled}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          render={
            <Button
              variant="outline"
              className={cn(
                "justify-start font-normal",
                width === "full" ? "w-full" : "w-auto",
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
            <div
              role="radiogroup"
              aria-label={presetsLabel}
              className="flex flex-col gap-1 border-r p-2"
            >
              {presets.map((preset, index) => {
                const presetRange = preset.getRange(new Date())
                const active = formatDateRangeValue(presetRange) === value

                return (
                  <Button
                    key={preset.id}
                    {...presetNav.itemProps(index)}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    variant="ghost"
                    className={cn(
                      "justify-start text-sm font-normal",
                      active && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => commitRange(presetRange)}
                  >
                    {preset.label}
                  </Button>
                )
              })}
            </div>
            <div
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  clearSelection()
                }
              }}
              onPointerLeave={() => {
                if (!pressRef.current) {
                  setHovered(undefined)
                }
              }}
            >
              <Calendar
                mode="range"
                locale={locale}
                numberOfMonths={2}
                components={calendarComponents}
                selected={preview}
                onSelect={(_range, day, _modifiers, event) => {
                  if (!isKeyboardActivation(event)) {
                    return
                  }

                  selectDay(day)
                }}
              />
            </div>
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
