"use client"

import { useState } from "react"

import { TextField, type TextFieldProps } from "@/registry/text-field/text-field"
import {
  phoneFilter,
  textFilters,
  type TextFilter,
} from "@/registry/text-field/text-filters"

export function TextFieldView({
  initialValue = "",
  label,
  placeholder,
  type,
  hint,
  error,
  disabled = false,
  filter,
}: {
  initialValue?: string
  label?: string
  placeholder?: string
  type?: TextFieldProps["type"]
  hint?: string
  error?: string
  disabled?: boolean
  filter?: TextFilter
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <div className="max-w-xs">
      <TextField
        value={value}
        onChange={setValue}
        label={label}
        placeholder={placeholder}
        type={type}
        hint={hint}
        error={error}
        disabled={disabled}
        filter={filter}
      />
    </div>
  )
}

const filterViews = {
  phone: {
    label: "Phone",
    placeholder: "+7 (999) 123-45-67",
    filter: phoneFilter("+7 (###) ###-##-##"),
  },
  email: { label: "Email", placeholder: "name@example.com", filter: textFilters.email },
  slug: {
    label: "URL slug",
    placeholder: "nova-sneakers",
    hint: "Lowercase latin letters, digits and dashes; Cyrillic is transliterated",
    filter: textFilters.slug,
  },
  code: { label: "SKU", placeholder: "FTW-SNK-001", filter: textFilters.code },
} as const

export function TextFieldFilterView({ kind }: { kind: keyof typeof filterViews }) {
  const view = filterViews[kind]
  return (
    <TextFieldView
      label={view.label}
      placeholder={view.placeholder}
      hint={"hint" in view ? view.hint : undefined}
      filter={view.filter}
    />
  )
}
