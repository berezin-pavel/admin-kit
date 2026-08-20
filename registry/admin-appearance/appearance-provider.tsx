"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react"

import {
  gradientFamilyNames,
  type AdminAppearance,
  type BlockAppearance,
  type GradientFamily,
  type GradientId,
} from "./appearance-palette"

export interface AppearanceLabels {
  blockMenu?: string
  close?: string
  gradient?: string
  none?: string
  heading?: string
  headingRegular?: string
  headingLarge?: string
  headingNone?: string
  gradients?: Partial<Record<GradientId, string>>
  families?: Partial<Record<GradientFamily, string>>
}

export interface AppearanceProviderProps {
  value: AdminAppearance
  onChange: (next: AdminAppearance) => void
  editable?: boolean
  labels?: AppearanceLabels
  children: ReactNode
}

export interface AppearanceContextValue {
  value: AdminAppearance
  onChange: (next: AdminAppearance) => void
  editable: boolean
  labels: Required<Omit<AppearanceLabels, "gradients" | "families">> & {
    gradients: Partial<Record<GradientId, string>>
    families: Record<GradientFamily, string>
  }
}

const defaultAppearanceLabels: Required<
  Omit<AppearanceLabels, "gradients" | "families">
> = {
  blockMenu: "Block appearance",
  close: "Close",
  gradient: "Gradient",
  none: "No gradient",
  heading: "Heading",
  headingRegular: "Regular",
  headingLarge: "Large",
  headingNone: "Hidden",
}

const AppearanceContext = createContext<AppearanceContextValue | undefined>(
  undefined
)

export function AppearanceProvider({
  value,
  onChange,
  editable = false,
  labels,
  children,
}: AppearanceProviderProps): ReactElement {
  const resolvedLabels = useMemo<AppearanceContextValue["labels"]>(
    () => ({
      blockMenu: labels?.blockMenu ?? defaultAppearanceLabels.blockMenu,
      close: labels?.close ?? defaultAppearanceLabels.close,
      gradient: labels?.gradient ?? defaultAppearanceLabels.gradient,
      none: labels?.none ?? defaultAppearanceLabels.none,
      heading: labels?.heading ?? defaultAppearanceLabels.heading,
      headingRegular: labels?.headingRegular ?? defaultAppearanceLabels.headingRegular,
      headingLarge:
        labels?.headingLarge ?? defaultAppearanceLabels.headingLarge,
      headingNone: labels?.headingNone ?? defaultAppearanceLabels.headingNone,
      gradients: labels?.gradients ?? {},
      families: { ...gradientFamilyNames, ...labels?.families },
    }),
    [labels]
  )

  const contextValue = useMemo<AppearanceContextValue>(
    () => ({ value, onChange, editable, labels: resolvedLabels }),
    [value, onChange, editable, resolvedLabels]
  )

  return (
    <AppearanceContext.Provider value={contextValue}>
      {children}
    </AppearanceContext.Provider>
  )
}

export function useAppearance(): AppearanceContextValue | undefined {
  return useContext(AppearanceContext)
}

export function useBlockAppearance(id?: string): BlockAppearance {
  const context = useContext(AppearanceContext)
  if (!context || id === undefined) {
    return {}
  }
  return context.value.blocks[id] ?? {}
}

export function setBlockAppearance(
  value: AdminAppearance,
  id: string,
  patch: BlockAppearance
): AdminAppearance {
  const merged: BlockAppearance = { ...(value.blocks[id] ?? {}), ...patch }
  const nextEntry: BlockAppearance = {}
  if (merged.gradient !== undefined) {
    nextEntry.gradient = merged.gradient
  }
  if (merged.heading !== undefined) {
    nextEntry.heading = merged.heading
  }

  const blocks = { ...value.blocks }
  if (Object.keys(nextEntry).length === 0) {
    delete blocks[id]
  } else {
    blocks[id] = nextEntry
  }

  return { ...value, blocks }
}

export function resolveBlockGradient(
  stored: BlockAppearance,
  fallback?: GradientId
): GradientId | undefined {
  if (stored.gradient === null) {
    return undefined
  }
  return stored.gradient ?? fallback
}
