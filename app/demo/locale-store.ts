"use client"

import { useSyncExternalStore } from "react"

export type DemoLocale = "en" | "ru"

export const DEMO_LOCALE_OPTIONS: readonly { value: DemoLocale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
]

const STORAGE_KEY = "admin-kit-demo-locale"
const DEFAULT_LOCALE: DemoLocale = "en"

type Listener = () => void

const listeners = new Set<Listener>()
let cachedLocale: DemoLocale | undefined

export function isDemoLocale(value: string | null): value is DemoLocale {
  return value === "en" || value === "ru"
}

function readStoredLocale(): DemoLocale {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isDemoLocale(stored) ? stored : DEFAULT_LOCALE
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): DemoLocale {
  if (cachedLocale === undefined) {
    cachedLocale = readStoredLocale()
  }
  return cachedLocale
}

function getServerSnapshot(): DemoLocale {
  return DEFAULT_LOCALE
}

export function setDemoLocale(next: DemoLocale) {
  cachedLocale = next
  window.localStorage.setItem(STORAGE_KEY, next)
  listeners.forEach((listener) => listener())
}

export function useDemoLocale(): DemoLocale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
