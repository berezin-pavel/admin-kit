"use client"

import { useState } from "react"

import { TimeField } from "@/registry/time-field/time-field"

export function DemoTimeField() {
  const [deliveryTime, setDeliveryTime] = useState("11:30")

  return (
    <TimeField
      label="Delivery time"
      value={deliveryTime}
      onChange={setDeliveryTime}
      step={15}
      min="09:00"
      max="21:00"
    />
  )
}
