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

import {
  DEMO_APPEARANCE_COOKIE,
  isServerRender,
  readDemoCookie,
  writeDemoCookie,
} from "./demo-cookie"

export const DEMO_APPEARANCE_DEFAULT: AdminAppearance = {
  accent: "#12876f",
  sidebar: "#24473d",
  header: "#24473d",
  signIn: "#16302a",
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
