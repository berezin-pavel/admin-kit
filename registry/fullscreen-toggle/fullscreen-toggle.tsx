"use client"

import { useSyncExternalStore, type RefObject } from "react"
import { Maximize, Minimize } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Hint } from "@/registry/hint/hint"

export interface FullscreenToggleLabels {
  enter?: string
  exit?: string
}

export interface FullscreenToggleProps {
  target?: RefObject<HTMLElement | null>
  size?: "icon" | "icon-sm"
  className?: string
  labels?: FullscreenToggleLabels
}

function subscribe(onChange: () => void) {
  document.addEventListener("fullscreenchange", onChange)
  return () => document.removeEventListener("fullscreenchange", onChange)
}

function isFullscreen() {
  return document.fullscreenElement !== null
}

function isFullscreenEnabled() {
  return document.fullscreenEnabled
}

const serverFalse = () => false
const serverTrue = () => true

export function FullscreenToggle({
  target,
  size = "icon",
  className,
  labels,
}: FullscreenToggleProps) {
  const active = useSyncExternalStore(subscribe, isFullscreen, serverFalse)
  const enabled = useSyncExternalStore(subscribe, isFullscreenEnabled, serverTrue)
  const enterLabel = labels?.enter ?? "Enter full screen"
  const exitLabel = labels?.exit ?? "Exit full screen"
  const label = active ? exitLabel : enterLabel

  if (!enabled) {
    return null
  }

  const toggle = () => {
    if (document.fullscreenElement) {
      void document.exitFullscreen()
      return
    }
    const element = target?.current ?? document.documentElement
    void element.requestFullscreen()
  }

  return (
    <Hint
      text={label}
      render={
        <Button
          variant="outline"
          size={size}
          aria-label={label}
          aria-pressed={active}
          onClick={toggle}
          className={className}
        >
          {active ? (
            <Minimize className="size-4" />
          ) : (
            <Maximize className="size-4" />
          )}
        </Button>
      }
    />
  )
}
