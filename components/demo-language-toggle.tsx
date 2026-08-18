"use client"

import {
  DEMO_LOCALE_OPTIONS,
  isDemoLocale,
  setDemoLocale,
  useDemoLocale,
} from "@/app/demo/locale-store"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { LanguageToggle } from "@/registry/language-toggle/language-toggle"

export function DemoLanguageToggle({ className }: { className?: string }) {
  const locale = useDemoLocale()

  return (
    <LanguageToggle
      locale={locale}
      locales={DEMO_LOCALE_OPTIONS}
      onLocaleChange={(next) => {
        if (isDemoLocale(next)) {
          setDemoLocale(next)
        }
      }}
      label={locale === "ru" ? localeRu.languageToggle.label : undefined}
      className={className}
    />
  )
}
