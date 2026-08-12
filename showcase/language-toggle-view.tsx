"use client"

import { useState } from "react"

import { LanguageToggle } from "@/registry/language-toggle/language-toggle"

const locales = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
] as const

export function LanguageToggleView({ initialLocale }: { initialLocale: string }) {
  const [locale, setLocale] = useState(initialLocale)

  return (
    <LanguageToggle locale={locale} locales={locales} onLocaleChange={setLocale} />
  )
}
