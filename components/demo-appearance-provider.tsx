"use client"

import type { ReactNode } from "react"

import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import { AppearanceStyle } from "@/registry/admin-appearance/appearance-style"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import { setDemoAppearance, useDemoAppearance } from "@/app/demo/appearance-store"
import { useDemoLocale } from "@/app/demo/locale-store"

export function DemoAppearanceProvider({ children }: { children: ReactNode }) {
  const appearance = useDemoAppearance()
  const locale = useDemoLocale()

  return (
    <>
      <AppearanceStyle value={appearance} />
      <AppearanceProvider
        value={appearance}
        onChange={setDemoAppearance}
        editable
        labels={locale === "ru" ? localeRu.adminAppearance : undefined}
      >
        {children}
      </AppearanceProvider>
    </>
  )
}
