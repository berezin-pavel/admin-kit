"use client"

import { useState } from "react"

import {
  ImageField,
  type ImageFieldItem,
} from "@/registry/image-field/image-field"

export function ImageFieldView({
  label = "Images",
  hint,
  error,
  disabled,
  multiple,
  maxItems,
  initial,
}: {
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  multiple?: boolean
  maxItems?: number
  initial: readonly ImageFieldItem[]
}) {
  const [value, setValue] = useState(initial)

  return (
    <ImageField
      label={label}
      hint={hint}
      error={error}
      disabled={disabled}
      multiple={multiple}
      maxItems={maxItems}
      value={value}
      onChange={setValue}
      onSelect={(files) =>
        setValue((current) => [
          ...current,
          ...files.map((file) => ({
            id: `${file.name}-${current.length}-${file.lastModified}`,
            url: URL.createObjectURL(file),
            name: file.name,
          })),
        ])
      }
    />
  )
}
