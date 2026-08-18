"use client"

import {
  createContext,
  useContext,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react"

import type { AdminAppearance, BlockAppearance, GradientId } from "./appearance-palette"

export interface AppearanceLabels {
  blockMenu?: string
  gradient?: string
  none?: string
  heading?: string
  headingMuted?: string
  headingProminent?: string
  headingNone?: string
  gradients?: Partial<Record<GradientId, string>>
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
  labels: Required<Omit<AppearanceLabels, "gradients">> & {
    gradients: Partial<Record<GradientId, string>>
  }
}

const defaultAppearanceLabels: Required<Omit<AppearanceLabels, "gradients">> = {
  blockMenu: "Block appearance",
  gradient: "Gradient",
  none: "No gradient",
  heading: "Heading",
  headingMuted: "Muted",
  headingProminent: "Prominent",
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
      gradient: labels?.gradient ?? defaultAppearanceLabels.gradient,
      none: labels?.none ?? defaultAppearanceLabels.none,
      heading: labels?.heading ?? defaultAppearanceLabels.heading,
      headingMuted: labels?.headingMuted ?? defaultAppearanceLabels.headingMuted,
      headingProminent:
        labels?.headingProminent ?? defaultAppearanceLabels.headingProminent,
      headingNone: labels?.headingNone ?? defaultAppearanceLabels.headingNone,
      gradients: labels?.gradients ?? {},
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
