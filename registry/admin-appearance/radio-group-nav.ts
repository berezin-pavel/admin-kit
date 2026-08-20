"use client"

import { useRef, useState, type KeyboardEvent } from "react"

export interface RadioGroupNavItemProps {
  ref: (node: HTMLElement | null) => void
  tabIndex: 0 | -1
  onKeyDown: (event: KeyboardEvent<HTMLElement>) => void
}

export interface UseRadioGroupNavOptions {
  count: number
  selectedIndex: number
}

export interface UseRadioGroupNavResult {
  itemProps: (index: number) => RadioGroupNavItemProps
}

export function useRadioGroupNav({
  count,
  selectedIndex,
}: UseRadioGroupNavOptions): UseRadioGroupNavResult {
  const itemRefs = useRef<(HTMLElement | null)[]>([])

  const fallbackIndex =
    selectedIndex >= 0 && selectedIndex < count ? selectedIndex : 0

  const [rovingIndex, setRovingIndex] = useState(fallbackIndex)
  const [syncedFallback, setSyncedFallback] = useState(fallbackIndex)

  if (fallbackIndex !== syncedFallback) {
    setSyncedFallback(fallbackIndex)
    setRovingIndex(fallbackIndex)
  }

  const activeIndex = rovingIndex < count ? rovingIndex : fallbackIndex

  const focusIndex = (index: number) => {
    setRovingIndex(index)
    itemRefs.current[index]?.focus()
  }

  const moveFocus = (from: number, key: string): boolean => {
    if (count === 0) {
      return false
    }

    switch (key) {
      case "ArrowRight":
      case "ArrowDown":
        focusIndex((from + 1) % count)
        return true
      case "ArrowLeft":
      case "ArrowUp":
        focusIndex((from - 1 + count) % count)
        return true
      case "Home":
        focusIndex(0)
        return true
      case "End":
        focusIndex(count - 1)
        return true
      default:
        return false
    }
  }

  const itemProps = (index: number): RadioGroupNavItemProps => ({
    ref: (node) => {
      itemRefs.current[index] = node
    },
    tabIndex: index === activeIndex ? 0 : -1,
    onKeyDown: (event) => {
      if (moveFocus(index, event.key)) {
        event.preventDefault()
      }
    },
  })

  return { itemProps }
}
