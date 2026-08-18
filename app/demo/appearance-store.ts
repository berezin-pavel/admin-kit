"use client"

import { useSyncExternalStore } from "react"

import {
  isAccentId,
  isGradientId,
  type AdminAppearance,
  type BlockAppearance,
  type BlockHeading,
  type PageBackdrop,
} from "@/registry/admin-appearance/appearance-palette"

const STORAGE_KEY = "admin-kit-demo-appearance"

export const DEMO_APPEARANCE_DEFAULT: AdminAppearance = {
  accent: "emerald",
  sidebar: "forest",
  signIn: "dusk",
  page: { gradient: "ocean", soft: true },
  pages: {},
  blocks: {
    "overview.orders": { gradient: "ember" },
    "overview.revenue": { gradient: "meadow" },
    "overview.average": { gradient: "lagoon" },
    "overview.goal-revenue": { gradient: "copper" },
    "overview.goal-orders": { gradient: "peach" },
    "overview.actions": { gradient: "amber" },
    "overview.finance": { gradient: "midnight", heading: "large" },
    "overview.channel": { gradient: "grape" },
    "overview.customers": { gradient: "sky" },
    "overview.recent-orders": { gradient: "rose" },
    "overview.products": { gradient: "sand" },
    "overview.split": { gradient: "berry" },
    "overview.activity": { gradient: "slate" },
    "orders.header": { heading: "large" },
    "order.order": { gradient: "sky" },
    "order.customer": { gradient: "mint" },
    "order.delivery": { gradient: "graphite" },
    "order.history": { gradient: "lavender" },
    "order.related": { gradient: "sunset" },
  },
}

export const DEMO_APPEARANCE_PAGES: readonly { id: string }[] = [
  { id: "overview" },
  { id: "orders" },
  { id: "order" },
]

export function demoPageId(pathname: string): string | undefined {
  if (pathname === "/demo") {
    return "overview"
  }
  if (pathname === "/demo/orders") {
    return "orders"
  }
  if (pathname === "/demo/order") {
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

function isPageBackdrop(value: unknown): value is PageBackdrop {
  return (
    isRecord(value) &&
    (value.gradient === null || isGradientId(value.gradient)) &&
    typeof value.soft === "boolean"
  )
}

export function isAdminAppearance(value: unknown): value is AdminAppearance {
  if (!isRecord(value)) {
    return false
  }
  if (!isAccentId(value.accent)) {
    return false
  }
  if (value.sidebar !== null && !isGradientId(value.sidebar)) {
    return false
  }
  if (value.signIn !== null && !isGradientId(value.signIn)) {
    return false
  }
  if (!isPageBackdrop(value.page)) {
    return false
  }
  if (!isRecord(value.pages) || !Object.values(value.pages).every(isPageBackdrop)) {
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
