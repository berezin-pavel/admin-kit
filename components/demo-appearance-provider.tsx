"use client"

import type { ReactNode } from "react"

import { AppearanceProvider } from "@/registry/admin-appearance/appearance-provider"
import { AppearanceStyle } from "@/registry/admin-appearance/appearance-style"
import { localeRu } from "@/registry/locale-ru/locale-ru"

import {
  DEMO_APPEARANCE_DEFAULT,
  parseDemoAppearance,
  seedDemoAppearance,
  setDemoAppearance,
  useDemoAppearance,
} from "@/app/demo/appearance-store"
import {
  DEMO_LOCALE_DEFAULT,
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
  seedDemoAppearance(
    parseDemoAppearance(appearanceCookie) ?? DEMO_APPEARANCE_DEFAULT
  )
  seedDemoLocale(parseDemoLocale(localeCookie) ?? DEMO_LOCALE_DEFAULT)

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
