"use client"

import { useState } from "react"

import { TimeField } from "@/registry/time-field/time-field"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoTimeField() {
  const [deliveryTime, setDeliveryTime] = useState("11:30")
  const locale = useDemoLocale()

  return (
    <TimeField
      label={demoDictionary[locale].timeField.label}
      value={deliveryTime}
      onChange={setDeliveryTime}
      step={15}
      min="09:00"
      max="21:00"
    />
  )
}
