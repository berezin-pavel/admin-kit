"use client"

import { useSyncExternalStore } from "react"
import { useTheme } from "next-themes"

import { useDemoLocale } from "@/app/demo/locale-store"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { ThemeToggle } from "@/registry/theme-toggle/theme-toggle"

const subscribeNever = () => () => {}

function useMounted() {
  return useSyncExternalStore(
    subscribeNever,
    () => true,
    () => false
  )
}

export function DemoThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const locale = useDemoLocale()

  if (!mounted) {
    return null
  }

  return (
    <ThemeToggle
      isDark={resolvedTheme === "dark"}
      onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      labels={locale === "ru" ? localeRu.themeToggle : undefined}
    />
  )
}
