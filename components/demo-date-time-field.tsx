"use client"

import { useState } from "react"

import { DateTimeField } from "@/registry/date-time-field/date-time-field"

export function DemoDateTimeField() {
  const [value, setValue] = useState("2026-08-14T11:00")

  return (
    <DateTimeField label="Pick up order" value={value} onChange={setValue} />
  )
}
