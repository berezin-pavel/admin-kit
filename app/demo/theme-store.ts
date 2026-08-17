"use client"

import { useSyncExternalStore } from "react"

import { isAdminTheme } from "@/registry/admin-theme-tokens/admin-theme-css"
import {
  defaultAdminThemeSources,
  type AdminTheme,
} from "@/registry/admin-theme-tokens/admin-theme-tokens"

const STORAGE_KEY = "admin-kit-demo-theme"

export const DEFAULT_DEMO_THEME: AdminTheme = {
  sources: defaultAdminThemeSources,
  gradients: [
    {
      id: "revenue",
      name: "Revenue",
      light: {
        angle: 135,
        from: "#0369a1",
        via: "#4338ca",
        viaPosition: 50,
        to: "#7e22ce",
      },
      dark: {
        angle: 135,
        from: "#0b4a66",
        via: "#2c2f80",
        viaPosition: 50,
        to: "#5b1f86",
      },
    },
    {
      id: "orders",
      name: "Orders",
      light: { angle: 135, from: "#c2410c", to: "#9f1239" },
      dark: { angle: 135, from: "#7c3a08", to: "#7a1027" },
    },
  ],
}

type Listener = () => void

const listeners = new Set<Listener>()
let cachedTheme: AdminTheme | undefined

function readStoredTheme(): AdminTheme {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (!stored) {
      return DEFAULT_DEMO_THEME
    }
    const parsed: unknown = JSON.parse(stored)
    return isAdminTheme(parsed) ? parsed : DEFAULT_DEMO_THEME
  } catch {
    return DEFAULT_DEMO_THEME
  }
}

function subscribe(listener: Listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

function getSnapshot(): AdminTheme {
  if (cachedTheme === undefined) {
    cachedTheme = readStoredTheme()
  }
  return cachedTheme
}

function getServerSnapshot(): AdminTheme {
  return DEFAULT_DEMO_THEME
}

export function setDemoTheme(next: AdminTheme) {
  cachedTheme = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

export function useDemoTheme(): AdminTheme {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
