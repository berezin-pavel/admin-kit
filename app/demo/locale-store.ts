"use client"

import { useSyncExternalStore } from "react"

import {
  DEMO_LOCALE_COOKIE,
  isServerRender,
  readDemoCookie,
  writeDemoCookie,
} from "./demo-cookie"

export type DemoLocale = "en" | "ru"

export const DEMO_LOCALE_OPTIONS: readonly { value: DemoLocale; label: string }[] = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
]

export const DEMO_LOCALE_DEFAULT: DemoLocale = "en"

type Listener = () => void

const listeners = new Set<Listener>()
let cachedLocale: DemoLocale | undefined

export function isDemoLocale(value: unknown): value is DemoLocale {
  return value === "en" || value === "ru"
}

export function parseDemoLocale(
  raw: string | undefined
): DemoLocale | undefined {
  return isDemoLocale(raw) ? raw : undefined
}

function readStoredLocale(): DemoLocale {
  return (
    parseDemoLocale(readDemoCookie(DEMO_LOCALE_COOKIE)) ?? DEMO_LOCALE_DEFAULT
  )
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
  return cachedLocale ?? DEMO_LOCALE_DEFAULT
}

export function seedDemoLocale(value: DemoLocale) {
  if (!isServerRender() && cachedLocale !== undefined) {
    return
  }
  cachedLocale = value
}

export function getDemoLocale(): DemoLocale {
  return getSnapshot()
}

export function setDemoLocale(next: DemoLocale) {
  cachedLocale = next
  writeDemoCookie(DEMO_LOCALE_COOKIE, next)
  listeners.forEach((listener) => listener())
}

export function useDemoLocale(): DemoLocale {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
