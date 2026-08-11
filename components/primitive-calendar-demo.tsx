"use client"

import { useState } from "react"
import { enUS } from "date-fns/locale"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"

const REFERENCE_DATE = new Date(2026, 7, 14)

export function PrimitiveCalendarDemo() {
  const [selected, setSelected] = useState<Date | undefined>(REFERENCE_DATE)

  return (
    <Calendar
      mode="single"
      locale={enUS}
      selected={selected}
      onSelect={setSelected}
      defaultMonth={REFERENCE_DATE}
      className="rounded-lg border border-border"
    />
  )
}

export function PrimitivePopoverDemo() {
  return (
    <>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          Open popover
        </PopoverTrigger>
        <PopoverContent>
          <PopoverHeader>
            <PopoverTitle>Delivery</PopoverTitle>
            <PopoverDescription>
              The courier will arrive within the chosen window, with a call an hour ahead.
            </PopoverDescription>
          </PopoverHeader>
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger render={<Button variant="outline" />}>
          On top
        </PopoverTrigger>
        <PopoverContent side="top" align="start" className="w-56">
          <PopoverTitle>Side and alignment</PopoverTitle>
          <PopoverDescription>
            The side and align props set where the panel pops up from.
          </PopoverDescription>
        </PopoverContent>
      </Popover>
    </>
  )
}
