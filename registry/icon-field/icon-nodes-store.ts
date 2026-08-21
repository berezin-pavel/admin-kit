"use client"

import { useSyncExternalStore } from "react"
import type { IconNode } from "lucide-react"

export type IconNodes = Readonly<Record<string, IconNode>>

let nodesPromise: Promise<IconNodes> | null = null

export function loadIconNodes(): Promise<IconNodes> {
  if (!nodesPromise) {
    nodesPromise = import("./icon-nodes").then((module) =>
      module.parseIconNodes()
    )
  }
  return nodesPromise
}

type Listener = () => void

let currentNodes: IconNodes | null = null
const listeners = new Set<Listener>()

function subscribe(listener: Listener): () => void {
  listeners.add(listener)

  if (!currentNodes) {
    loadIconNodes().then((nodes) => {
      currentNodes = nodes
      for (const notify of listeners) {
        notify()
      }
    })
  }

  return () => {
    listeners.delete(listener)
  }
}

function getSnapshot(): IconNodes | null {
  return currentNodes
}

function getServerSnapshot(): IconNodes | null {
  return null
}

export function useIconNodes(): IconNodes | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
