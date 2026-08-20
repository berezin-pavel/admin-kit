"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

export interface DemoHeaderContent {
  title?: string
  tabs?: ReactNode
}

const DemoHeaderSlotContext = createContext<
  ((content: DemoHeaderContent | null) => void) | null
>(null)

export function DemoHeaderSlotProvider({
  onContent,
  children,
}: {
  onContent: (content: DemoHeaderContent | null) => void
  children: ReactNode
}) {
  return (
    <DemoHeaderSlotContext.Provider value={onContent}>
      {children}
    </DemoHeaderSlotContext.Provider>
  )
}

export function useDemoHeaderContent(content: DemoHeaderContent | null) {
  const setContent = useContext(DemoHeaderSlotContext)

  useEffect(() => {
    if (!setContent || content === null) {
      return
    }
    setContent(content)
    return () => setContent(null)
  }, [setContent, content])
}

export function useDemoHeaderState() {
  return useState<DemoHeaderContent | null>(null)
}
