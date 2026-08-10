"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"
import { format } from "date-fns"
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
  disabled?: boolean
  className?: string
}

function parseDateValue(value: string): Date | undefined {
  const [year, month, day] = value.split("-").map(Number)

  if (!year || !month || !day) {
    return undefined
  }

  return new Date(year, month - 1, day)
}

function formatDateValue(date: Date): string {
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
  disabled = false,
  className,
}: DateFieldProps) {
  const id = React.useId()
  const [open, setOpen] = React.useState(false)
  const selected = parseDateValue(value)

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          id={id}
          disabled={disabled}
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
            ? format(selected, "MMMM d, yyyy", { locale: enUS })
            : placeholder}
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0">
          <Calendar
            mode="single"
            locale={enUS}
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
    </div>
  )
}
