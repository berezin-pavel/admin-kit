"use client"

import { useState } from "react"

import { DateField } from "@/registry/date-field/date-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoDateField() {
  const [value, setValue] = useState("2026-08-14")
  const locale = useDemoLocale()

  return (
    <DateField
      label={demoDictionary[locale].dateField.label}
      value={value}
      onChange={setValue}
      locale={locale === "ru" ? localeRu.dateField.locale : undefined}
      displayFormat={
        locale === "ru" ? localeRu.dateField.displayFormat : undefined
      }
    />
  )
}
