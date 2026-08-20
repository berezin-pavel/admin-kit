"use client"

import {
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
  type ReactElement,
} from "react"
import { GripHorizontal } from "lucide-react"

interface DragOffset {
  x: number
  y: number
}

const NO_OFFSET: DragOffset = { x: 0, y: 0 }

export function useDragOffset<Element extends HTMLElement = HTMLDivElement>() {
  const element = useRef<Element | null>(null)
  const offset = useRef<DragOffset>(NO_OFFSET)
  const pending = useRef<DragOffset>(NO_OFFSET)
  const origin = useRef<DragOffset | null>(null)
  const scheduled = useRef(false)
  const frame = useRef(0)

  const paint = useCallback(() => {
    if (!element.current) {
      return
    }
    const { x, y } = offset.current
    element.current.style.transform =
      x === 0 && y === 0 ? "" : `translate3d(${x}px, ${y}px, 0)`
  }, [])

  useEffect(() => {
    const move = (event: PointerEvent) => {
      if (!origin.current) {
        return
      }
      pending.current = {
        x: event.clientX - origin.current.x,
        y: event.clientY - origin.current.y,
      }
      if (scheduled.current) {
        return
      }
      scheduled.current = true
      frame.current = window.requestAnimationFrame(() => {
        scheduled.current = false
        offset.current = pending.current
        paint()
      })
    }
    const stop = () => {
      origin.current = null
    }

    window.addEventListener("pointermove", move)
    window.addEventListener("pointerup", stop)
    window.addEventListener("pointercancel", stop)
    return () => {
      window.removeEventListener("pointermove", move)
      window.removeEventListener("pointerup", stop)
      window.removeEventListener("pointercancel", stop)
      if (scheduled.current) {
        window.cancelAnimationFrame(frame.current)
        scheduled.current = false
      }
    }
  }, [paint])

  const ref = useCallback(
    (node: Element | null) => {
      element.current = node
      paint()
    },
    [paint]
  )

  const start = (event: ReactPointerEvent<HTMLDivElement>) => {
    event.preventDefault()
    origin.current = {
      x: event.clientX - offset.current.x,
      y: event.clientY - offset.current.y,
    }
  }

  const reset = () => {
    origin.current = null
    offset.current = NO_OFFSET
    pending.current = NO_OFFSET
    paint()
  }

  return { ref, start, reset }
}

export function DragHandle({
  onPointerDown,
}: {
  onPointerDown: (event: ReactPointerEvent<HTMLDivElement>) => void
}): ReactElement {
  return (
    <div
      aria-hidden="true"
      data-slot="appearance-drag-handle"
      onPointerDown={onPointerDown}
      className="-mt-1 flex h-5 w-full shrink-0 cursor-grab touch-none select-none items-center justify-center rounded-sm text-muted-foreground active:cursor-grabbing"
    >
      <GripHorizontal className="size-4" />
    </div>
  )
}
