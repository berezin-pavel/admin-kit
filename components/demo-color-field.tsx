"use client"

import { useState } from "react"

import { ColorField } from "@/registry/color-field/color-field"

function getForeground(hex: string) {
  if (!/^#[0-9a-f]{6}$/.test(hex)) {
    return undefined
  }
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.6 ? "#0f172a" : "#f8fafc"
}

export function DemoColorField() {
  const [color, setColor] = useState("#22c55e")

  return (
    <div className="flex flex-wrap items-end gap-6">
      <ColorField
        label="Category tag color"
        value={color}
        onChange={setColor}
        className="max-w-64"
      />
      <div className="flex flex-col gap-1.5">
        <span className="text-sm text-muted-foreground">Storefront tag</span>
        <span
          className="inline-flex w-fit items-center rounded-full px-3 py-1 text-sm font-medium"
          style={{
            backgroundColor: color || "var(--muted)",
            color: getForeground(color),
          }}
        >
          Seasonal
        </span>
      </div>
    </div>
  )
}
