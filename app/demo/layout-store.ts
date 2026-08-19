"use client"

import { useSyncExternalStore } from "react"

export type DemoLayout = "card" | "flush" | "flush-header"

export const DEMO_LAYOUT_ORDER: readonly DemoLayout[] = [
  "card",
  "flush",
  "flush-header",
]

const STORAGE_KEY = "admin-kit-demo-layout"
const DEFAULT_LAYOUT: DemoLayout = "card"

type Listener = () => void

const listeners = new Set<Listener>()
let cachedLayout: DemoLayout | undefined

export function isDemoLayout(value: string | null): value is DemoLayout {
  return value === "card" || value === "flush" || value === "flush-header"
}

function readStoredLayout(): DemoLayout {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isDemoLayout(stored) ? stored : DEFAULT_LAYOUT
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): DemoLayout {
  if (cachedLayout === undefined) {
    cachedLayout = readStoredLayout()
  }
  return cachedLayout
}

function getServerSnapshot(): DemoLayout {
  return DEFAULT_LAYOUT
}

export function setDemoLayout(next: DemoLayout) {
  cachedLayout = next
  window.localStorage.setItem(STORAGE_KEY, next)
  listeners.forEach((listener) => listener())
}

export function useDemoLayout(): DemoLayout {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
