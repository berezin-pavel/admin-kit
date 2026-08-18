"use client"

import { useSyncExternalStore } from "react"

import { isAdminTheme } from "@/registry/admin-theme-tokens/admin-theme-css"
import {
  defaultAdminThemeSources,
  gradientPresets,
  type AdminTheme,
} from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { isGradientId, type GradientId } from "@/registry/admin-appearance/appearance-palette"

const STORAGE_KEY = "admin-kit-demo-theme"

export const DEFAULT_DEMO_THEME: AdminTheme = {
  sources: defaultAdminThemeSources,
  gradients: gradientPresets.map((preset) => ({
    id: preset.name.toLowerCase(),
    name: preset.name,
    light: preset.light,
    dark: preset.dark,
  })),
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

export const DEMO_GRADIENT_BLOCK_IDS = ["orders-metric", "revenue-metric"] as const

export type DemoGradientBlockId = (typeof DEMO_GRADIENT_BLOCK_IDS)[number]

export interface DemoSurfaceGradients {
  shell?: GradientId
  signIn?: GradientId
}

export type DemoBlockGradients = Partial<Record<DemoGradientBlockId, GradientId>>

export interface DemoGradientAssignment {
  surfaces: DemoSurfaceGradients
  blocks: DemoBlockGradients
}

const ASSIGNMENT_STORAGE_KEY = "admin-kit-demo-gradient-assignment"

export const DEFAULT_DEMO_GRADIENT_ASSIGNMENT: DemoGradientAssignment = {
  surfaces: { shell: "ocean", signIn: "dusk" },
  blocks: { "orders-metric": "ember", "revenue-metric": "meadow" },
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function isDemoGradientBlockId(value: string): value is DemoGradientBlockId {
  return DEMO_GRADIENT_BLOCK_IDS.some((id) => id === value)
}

function isDemoSurfaceGradients(value: unknown): value is DemoSurfaceGradients {
  return (
    isRecord(value) &&
    (value.shell === undefined || isGradientId(value.shell)) &&
    (value.signIn === undefined || isGradientId(value.signIn))
  )
}

function isDemoBlockGradients(value: unknown): value is DemoBlockGradients {
  return (
    isRecord(value) &&
    Object.entries(value).every(
      ([key, entry]) => isDemoGradientBlockId(key) && isGradientId(entry)
    )
  )
}

export function isDemoGradientAssignment(
  value: unknown
): value is DemoGradientAssignment {
  return (
    isRecord(value) &&
    isDemoSurfaceGradients(value.surfaces) &&
    isDemoBlockGradients(value.blocks)
  )
}

const assignmentListeners = new Set<Listener>()
let cachedAssignment: DemoGradientAssignment | undefined

function readStoredAssignment(): DemoGradientAssignment {
  try {
    const stored = window.localStorage.getItem(ASSIGNMENT_STORAGE_KEY)
    if (!stored) {
      return DEFAULT_DEMO_GRADIENT_ASSIGNMENT
    }
    const parsed: unknown = JSON.parse(stored)
    return isDemoGradientAssignment(parsed)
      ? parsed
      : DEFAULT_DEMO_GRADIENT_ASSIGNMENT
  } catch {
    return DEFAULT_DEMO_GRADIENT_ASSIGNMENT
  }
}

function subscribeAssignment(listener: Listener) {
  assignmentListeners.add(listener)
  return () => assignmentListeners.delete(listener)
}

function getAssignmentSnapshot(): DemoGradientAssignment {
  if (cachedAssignment === undefined) {
    cachedAssignment = readStoredAssignment()
  }
  return cachedAssignment
}

function getAssignmentServerSnapshot(): DemoGradientAssignment {
  return DEFAULT_DEMO_GRADIENT_ASSIGNMENT
}

export function setDemoGradientAssignment(next: DemoGradientAssignment) {
  cachedAssignment = next
  window.localStorage.setItem(ASSIGNMENT_STORAGE_KEY, JSON.stringify(next))
  assignmentListeners.forEach((listener) => listener())
}

export function useDemoGradientAssignment(): DemoGradientAssignment {
  return useSyncExternalStore(
    subscribeAssignment,
    getAssignmentSnapshot,
    getAssignmentServerSnapshot
  )
}
