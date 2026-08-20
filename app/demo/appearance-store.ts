"use client"

import { useSyncExternalStore } from "react"

import {
  isAccentId,
  isCustomColor,
  isGradientId,
  type AdminAppearance,
  type BlockAppearance,
  type BlockHeading,
} from "@/registry/admin-appearance/appearance-palette"

const STORAGE_KEY = "admin-kit-demo-appearance"

export const DEMO_APPEARANCE_DEFAULT: AdminAppearance = {
  accent: "#2563eb",
  sidebar: "#334155",
  header: "#334155",
  signIn: "#0f172a",
  page: "#e2e8f0",
  pages: {},
  blocks: {
    "overview.finance": { heading: "large" },
    "orders.table": { heading: "none" },
  },
}

export const DEMO_APPEARANCE_PAGES: readonly { id: string }[] = [
  { id: "overview" },
  { id: "orders" },
  { id: "order" },
]

export function demoPageId(pathname: string): string | undefined {
  if (pathname === "/demo" || pathname === "/demo-flush") {
    return "overview"
  }
  if (pathname === "/demo/orders" || pathname === "/demo-flush/orders") {
    return "orders"
  }
  if (pathname === "/demo/order" || pathname === "/demo-flush/order") {
    return "order"
  }
  return undefined
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isBlockHeading(value: unknown): value is BlockHeading {
  return value === "regular" || value === "large" || value === "none"
}

function isBlockAppearance(value: unknown): value is BlockAppearance {
  if (!isRecord(value)) {
    return false
  }
  if (
    value.gradient !== undefined &&
    value.gradient !== null &&
    !isGradientId(value.gradient)
  ) {
    return false
  }
  if (value.heading !== undefined && !isBlockHeading(value.heading)) {
    return false
  }
  return true
}

function isSurfaceChoice(value: unknown): boolean {
  return isGradientId(value) || isCustomColor(value)
}

function isNullableSurfaceChoice(value: unknown): boolean {
  return value === null || isSurfaceChoice(value)
}

export function isAdminAppearance(value: unknown): value is AdminAppearance {
  if (!isRecord(value)) {
    return false
  }
  if (!isAccentId(value.accent) && !isCustomColor(value.accent)) {
    return false
  }
  if (value.sidebar !== null && !isSurfaceChoice(value.sidebar)) {
    return false
  }
  if (value.header !== null && !isSurfaceChoice(value.header)) {
    return false
  }
  if (value.signIn !== null && !isSurfaceChoice(value.signIn)) {
    return false
  }
  if (!isNullableSurfaceChoice(value.page)) {
    return false
  }
  if (
    !isRecord(value.pages) ||
    !Object.values(value.pages).every(isNullableSurfaceChoice)
  ) {
    return false
  }
  if (
    !isRecord(value.blocks) ||
    !Object.values(value.blocks).every(isBlockAppearance)
  ) {
    return false
  }
  return true
}

type Listener = () => void

const listeners = new Set<Listener>()
let cachedAppearance: AdminAppearance | undefined

function readStoredAppearance(): AdminAppearance {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return DEMO_APPEARANCE_DEFAULT
    }
    const parsed: unknown = JSON.parse(stored)
    return isAdminAppearance(parsed) ? parsed : DEMO_APPEARANCE_DEFAULT
  } catch {
    return DEMO_APPEARANCE_DEFAULT
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): AdminAppearance {
  if (cachedAppearance === undefined) {
    cachedAppearance = readStoredAppearance()
  }
  return cachedAppearance
}

function getServerSnapshot(): AdminAppearance {
  return DEMO_APPEARANCE_DEFAULT
}

export function setDemoAppearance(next: AdminAppearance) {
  cachedAppearance = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function useDemoAppearance(): AdminAppearance {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
