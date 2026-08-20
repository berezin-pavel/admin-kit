"use client"

import type { ReactNode } from "react"

import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import { AppearanceStyle } from "@/registry/admin-appearance/appearance-style"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import {
  parseDemoAppearance,
  seedDemoAppearance,
  setDemoAppearance,
  useDemoAppearance,
} from "@/app/demo/appearance-store"
import {
  parseDemoLocale,
  seedDemoLocale,
  useDemoLocale,
} from "@/app/demo/locale-store"

export function DemoAppearanceProvider({
  children,
  appearanceCookie,
  localeCookie,
}: {
  children: ReactNode
  appearanceCookie?: string
  localeCookie?: string
}) {
  const initialAppearance = parseDemoAppearance(appearanceCookie)
  if (initialAppearance) {
    seedDemoAppearance(initialAppearance)
  }

  const initialLocale = parseDemoLocale(localeCookie)
  if (initialLocale) {
    seedDemoLocale(initialLocale)
  }

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
