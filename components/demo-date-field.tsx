"use client"

import { useState } from "react"

import { DateField } from "@/registry/date-field/date-field"

export function DemoDateField() {
  const [value, setValue] = useState("2026-08-14")

  return <DateField label="Delivery date" value={value} onChange={setValue} />
}
