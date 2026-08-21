"use client"

import { useSyncExternalStore } from "react"

import { isAdminAppearance } from "@/registry/admin-appearance/appearance-css"

export { isAdminAppearance }
import type { AdminAppearance } from "@/registry/admin-appearance/appearance-palette"

import {
  DEMO_APPEARANCE_COOKIE,
  isServerRender,
  readDemoCookie,
  writeDemoCookie,
} from "./demo-cookie"

export const DEMO_APPEARANCE_DEFAULT: AdminAppearance = {
  accent: "emerald",
  sidebar: "ivy",
  header: "ivy",
  signIn: "ivy",
  page: "#e6efeb",
  pages: {},
  blocks: {
    "overview.finance": { heading: "large" },
    "orders.table": { heading: "none" },
  },
}

export const DEMO_APPEARANCE_PAGES: readonly { id: string }[] = [
  { id: "overview" },
  { id: "orders" },
  { id: "products" },
  { id: "order" },
]

export function demoPageId(pathname: string): string | undefined {
  if (pathname === "/demo" || pathname === "/demo-flush") {
    return "overview"
  }
  if (pathname === "/demo/orders" || pathname === "/demo-flush/orders") {
    return "orders"
  }
  if (pathname === "/demo/products" || pathname === "/demo-flush/products") {
    return "products"
  }
  if (pathname === "/demo/order" || pathname === "/demo-flush/order") {
    return "order"
  }
  return undefined
}

export function parseDemoAppearance(
  raw: string | undefined
): AdminAppearance | undefined {
  if (!raw) {
    return undefined
  }
  try {
    const parsed: unknown = JSON.parse(raw)
    return isAdminAppearance(parsed) ? parsed : undefined
  } catch {
    return undefined
  }
}

type Listener = () => void

const listeners = new Set<Listener>()
let cachedAppearance: AdminAppearance | undefined

function readStoredAppearance(): AdminAppearance {
  return (
    parseDemoAppearance(readDemoCookie(DEMO_APPEARANCE_COOKIE)) ??
    DEMO_APPEARANCE_DEFAULT
  )
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
  return cachedAppearance ?? DEMO_APPEARANCE_DEFAULT
}

export function seedDemoAppearance(value: AdminAppearance) {
  if (!isServerRender() && cachedAppearance !== undefined) {
    return
  }
  cachedAppearance = value
}

export function getDemoAppearance(): AdminAppearance {
  return getSnapshot()
}

export function setDemoAppearance(next: AdminAppearance) {
  cachedAppearance = next
  writeDemoCookie(DEMO_APPEARANCE_COOKIE, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function useDemoAppearance(): AdminAppearance {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
