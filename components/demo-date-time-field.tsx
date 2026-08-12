"use client"

import { useState } from "react"

import { DateTimeField } from "@/registry/date-time-field/date-time-field"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoDateTimeField() {
  const [value, setValue] = useState("2026-08-14T11:00")
  const locale = useDemoLocale()

  return (
    <DateTimeField
      label={demoDictionary[locale].dateTimeField.label}
      value={value}
      onChange={setValue}
      locale={locale === "ru" ? localeRu.dateTimeField.locale : undefined}
      displayFormat={
        locale === "ru" ? localeRu.dateTimeField.displayFormat : undefined
      }
    />
  )
}
