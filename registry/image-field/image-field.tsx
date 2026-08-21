"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  ImageUp,
  Trash2,
} from "lucide-react"

import { Button, buttonVariants } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { ImageFieldPreview } from "./image-field-preview"

export interface ImageFieldItem {
  id: string
  url: string
  name?: string
  progress?: number
  speed?: string
  error?: string
}

export interface ImageFieldLabels {
  dropzone?: string
  dropzoneHint?: string
  preview?: string
  openInNewTab?: string
  remove?: string
  moveEarlier?: string
  moveLater?: string
  uploading?: string
  imageName?: (index: number) => string
  previous?: string
  next?: string
  counter?: (index: number, total: number) => string
  close?: string
}

export const imageFieldLabelDefaults: Required<ImageFieldLabels> = {
  dropzone: "Drop images here or click to choose",
  dropzoneHint: "PNG, JPG or WEBP",
  preview: "Preview",
  openInNewTab: "Open in a new tab",
  remove: "Remove",
  moveEarlier: "Move earlier",
  moveLater: "Move later",
  uploading: "Uploading",
  imageName: (index) => `Image ${index + 1}`,
  previous: "Previous image",
  next: "Next image",
  counter: (index, total) => `${index + 1} of ${total}`,
  close: "Close",
}

export interface ImageFieldProps {
  value: readonly ImageFieldItem[]
  onChange: (items: readonly ImageFieldItem[]) => void
  onSelect: (files: readonly File[]) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  multiple?: boolean
  accept?: string
  maxItems?: number
  labels?: ImageFieldLabels
  className?: string
}

const SPEED_UNITS = ["B/s", "KB/s", "MB/s", "GB/s"] as const

export function formatUploadSpeed(bytesPerSecond: number): string {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond <= 0) {
    return `0 ${SPEED_UNITS[0]}`
  }

  let value = bytesPerSecond
  let unitIndex = 0

  while (value >= 1024 && unitIndex < SPEED_UNITS.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  const rounded = value >= 100 || unitIndex === 0 ? Math.round(value) : value.toFixed(1)

  return `${rounded} ${SPEED_UNITS[unitIndex]}`
}

export function moveImageFieldItem<Item>(
  items: readonly Item[],
  from: number,
  to: number
): readonly Item[] {
  if (
    from === to ||
    from < 0 ||
    to < 0 ||
    from >= items.length ||
    to >= items.length
  ) {
    return items
  }

  const next = [...items]
  const [moved] = next.splice(from, 1)
  next.splice(to, 0, moved)

  return next
}

export function limitImageFieldFiles(
  files: readonly File[],
  currentCount: number,
  multiple: boolean,
  maxItems?: number
): readonly File[] {
  const images = files.filter((file) => file.type.startsWith("image/"))

  if (!multiple) {
    return images.slice(0, 1)
  }

  if (maxItems === undefined) {
    return images
  }

  return images.slice(0, Math.max(0, maxItems - currentCount))
}

const TILE_DRAG_THRESHOLD = 4

interface TileDragState {
  id: string
  fromIndex: number
  pointerId: number
  startX: number
  startY: number
  moved: boolean
  positions: readonly { id: string; centerX: number; centerY: number }[]
}

export function ImageField({
  value,
  onChange,
  onSelect,
  label,
  hint,
  error,
  disabled = false,
  multiple = true,
  accept = "image/*",
  maxItems,
  labels,
  className,
}: ImageFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [filesOver, setFilesOver] = React.useState(false)
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null)
  const [draggingId, setDraggingId] = React.useState<string | null>(null)
  const [dropTargetId, setDropTargetId] = React.useState<string | null>(null)
  const resolvedLabels = { ...imageFieldLabelDefaults, ...labels }
  const isFull = maxItems !== undefined && value.length >= maxItems
  const canAdd = !disabled && !isFull

  const handleFiles = (files: readonly File[]) => {
    const accepted = limitImageFieldFiles(
      files,
      value.length,
      multiple,
      maxItems
    )

    if (accepted.length > 0) {
      onSelect(accepted)
    }
  }

  const move = (from: number, to: number) => {
    const next = moveImageFieldItem(value, from, to)

    if (next !== value) {
      onChange(next)
    }
  }

  const valueRef = React.useRef(value)
  const moveRef = React.useRef(move)

  React.useEffect(() => {
    valueRef.current = value
    moveRef.current = move
  })

  const tileElements = React.useRef(new Map<string, HTMLLIElement>())
  const dragState = React.useRef<TileDragState | null>(null)
  const dropTargetRef = React.useRef<string | null>(null)
  const suppressClickId = React.useRef<string | null>(null)
  const pendingDelta = React.useRef({ x: 0, y: 0 })
  const scheduled = React.useRef(false)
  const frame = React.useRef(0)

  const paintTileTransform = React.useCallback(() => {
    scheduled.current = false
    const state = dragState.current
    if (!state) return
    const node = tileElements.current.get(state.id)
    if (!node) return
    const { x, y } = pendingDelta.current
    node.style.transform = `translate3d(${x}px, ${y}px, 0)`
  }, [])

  React.useEffect(() => {
    const handlePointerMove = (event: PointerEvent) => {
      const state = dragState.current
      if (!state || event.pointerId !== state.pointerId) return

      const dx = event.clientX - state.startX
      const dy = event.clientY - state.startY

      if (!state.moved) {
        if (Math.hypot(dx, dy) < TILE_DRAG_THRESHOLD) return
        state.moved = true
        state.positions = valueRef.current.map((item) => {
          const node = tileElements.current.get(item.id)
          const rect = node?.getBoundingClientRect()
          return {
            id: item.id,
            centerX: rect ? rect.left + rect.width / 2 : 0,
            centerY: rect ? rect.top + rect.height / 2 : 0,
          }
        })
        const node = tileElements.current.get(state.id)
        if (node && typeof node.setPointerCapture === "function") {
          node.setPointerCapture(state.pointerId)
        }
        setDraggingId(state.id)
      }

      pendingDelta.current = { x: dx, y: dy }
      if (!scheduled.current) {
        scheduled.current = true
        frame.current = window.requestAnimationFrame(paintTileTransform)
      }

      let nearestId = state.id
      let nearestDistance = Number.POSITIVE_INFINITY
      for (const position of state.positions) {
        const distance = Math.hypot(
          event.clientX - position.centerX,
          event.clientY - position.centerY
        )
        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestId = position.id
        }
      }
      if (dropTargetRef.current !== nearestId) {
        dropTargetRef.current = nearestId
        setDropTargetId(nearestId)
      }
    }

    const finishTileDrag = () => {
      const state = dragState.current
      if (!state) return

      const node = tileElements.current.get(state.id)
      if (node) node.style.transform = ""

      if (state.moved) {
        const toId = dropTargetRef.current
        const toIndex = toId
          ? valueRef.current.findIndex((item) => item.id === toId)
          : -1
        if (toIndex >= 0 && toIndex !== state.fromIndex) {
          moveRef.current(state.fromIndex, toIndex)
        }
        suppressClickId.current = state.id
      }

      dragState.current = null
      dropTargetRef.current = null
      setDraggingId(null)
      setDropTargetId(null)
      if (scheduled.current) {
        window.cancelAnimationFrame(frame.current)
        scheduled.current = false
      }
    }

    window.addEventListener("pointermove", handlePointerMove)
    window.addEventListener("pointerup", finishTileDrag)
    window.addEventListener("pointercancel", finishTileDrag)
    window.addEventListener("lostpointercapture", finishTileDrag)
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", finishTileDrag)
      window.removeEventListener("pointercancel", finishTileDrag)
      window.removeEventListener("lostpointercapture", finishTileDrag)
    }
  }, [paintTileTransform])

  const registerTile = (id: string) => (node: HTMLLIElement | null) => {
    if (node) tileElements.current.set(id, node)
    else tileElements.current.delete(id)
  }

  const startTileDrag = (
    event: React.PointerEvent<HTMLLIElement>,
    itemId: string,
    index: number
  ) => {
    if (disabled || value.length <= 1 || event.button !== 0) return
    dragState.current = {
      id: itemId,
      fromIndex: index,
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      moved: false,
      positions: [],
    }
  }

  const openPreviewUnlessDragged = (itemId: string, index: number) => {
    if (suppressClickId.current === itemId) {
      suppressClickId.current = null
      return
    }
    setPreviewIndex(index)
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div
        className={cn(
          "rounded-lg transition-colors",
          filesOver && canAdd && "bg-muted/50 ring-2 ring-ring",
          disabled && "pointer-events-none opacity-50"
        )}
        onDragOver={(event) => {
          if (!canAdd || !event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          setFilesOver(true)
        }}
        onDragLeave={(event) => {
          if (event.currentTarget.contains(event.relatedTarget as Node)) return
          setFilesOver(false)
        }}
        onDrop={(event) => {
          if (!canAdd || !event.dataTransfer.types.includes("Files")) return
          event.preventDefault()
          setFilesOver(false)
          handleFiles([...event.dataTransfer.files])
        }}
      >
        <ul className="flex flex-wrap gap-2">
          {value.map((item, index) => {
            const name = item.name ?? resolvedLabels.imageName(index)
            const isUploading = item.error === undefined && item.progress !== undefined
            const isReady = item.error === undefined && item.progress === undefined

            return (
              <li
                key={item.id}
                ref={registerTile(item.id)}
                aria-label={name}
                onPointerDown={(event) => startTileDrag(event, item.id, index)}
                className={cn(
                  "group relative size-32 shrink-0 touch-none overflow-hidden rounded-lg border bg-muted select-none",
                  item.error ? "border-destructive" : "border-border",
                  !disabled && value.length > 1 && "cursor-grab",
                  draggingId === item.id && "z-10 cursor-grabbing opacity-40",
                  dropTargetId === item.id &&
                    draggingId !== null &&
                    draggingId !== item.id &&
                    "ring-2 ring-ring"
                )}
              >
                {isReady ? (
                  <button
                    type="button"
                    aria-label={`${resolvedLabels.preview}: ${name}`}
                    className="block size-full"
                    onClick={() => openPreviewUnlessDragged(item.id, index)}
                  >
                    <img
                      src={item.url}
                      alt={name}
                      draggable={false}
                      className="size-full object-cover"
                    />
                  </button>
                ) : (
                  <img
                    src={item.url}
                    alt={name}
                    draggable={false}
                    className={cn(
                      "size-full object-cover",
                      (isUploading || item.error) && "opacity-40"
                    )}
                  />
                )}
                {isUploading ? (
                  <div className="absolute inset-x-0 bottom-0 flex flex-col gap-1 bg-background/85 px-2 py-1.5">
                    <Progress
                      value={item.progress ?? 0}
                      aria-label={`${resolvedLabels.uploading}: ${name}`}
                    />
                    <span className="flex items-center justify-between gap-1 text-[0.7rem] text-muted-foreground tabular-nums">
                      <span>{Math.round(item.progress ?? 0)}%</span>
                      {item.speed ? <span>{item.speed}</span> : null}
                    </span>
                  </div>
                ) : null}
                {item.error ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 bg-destructive/10 px-2 text-center">
                    <CircleAlert className="size-5 text-destructive" />
                    <span className="line-clamp-3 text-[0.7rem] text-destructive">
                      {item.error}
                    </span>
                  </div>
                ) : null}
                <Button
                  type="button"
                  variant="secondary"
                  size="icon-xs"
                  aria-label={`${resolvedLabels.remove}: ${name}`}
                  disabled={disabled}
                  onPointerDown={(event) => event.stopPropagation()}
                  onClick={() =>
                    onChange(value.filter((candidate) => candidate !== item))
                  }
                  className="absolute top-1 right-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100 focus-visible:opacity-100"
                >
                  <Trash2 />
                </Button>
                {isReady ? (
                  <div className="absolute inset-x-1 bottom-1 flex items-center justify-center gap-0.5 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      aria-label={`${resolvedLabels.moveEarlier}: ${name}`}
                      disabled={disabled || index === 0}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => move(index, index - 1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${resolvedLabels.openInNewTab}: ${name}`}
                      onPointerDown={(event) => event.stopPropagation()}
                      className={cn(
                        buttonVariants({
                          variant: "secondary",
                          size: "icon-xs",
                        }),
                        "cursor-default"
                      )}
                    >
                      <ExternalLink />
                    </a>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      aria-label={`${resolvedLabels.moveLater}: ${name}`}
                      disabled={disabled || index === value.length - 1}
                      onPointerDown={(event) => event.stopPropagation()}
                      onClick={() => move(index, index + 1)}
                    >
                      <ChevronRight />
                    </Button>
                  </div>
                ) : null}
              </li>
            )
          })}
          {canAdd ? (
            <li className="min-w-48 flex-1">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="flex h-32 w-full cursor-default flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-input px-3 text-center text-sm text-muted-foreground transition-colors outline-none hover:bg-muted/50 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                <ImageUp className="size-5 shrink-0" />
                <span>{resolvedLabels.dropzone}</span>
                <span className="text-xs">{resolvedLabels.dropzoneHint}</span>
              </button>
            </li>
          ) : null}
        </ul>
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={(event) => {
            handleFiles([...(event.target.files ?? [])])
            event.target.value = ""
          }}
        />
      </div>
      {error ? (
        <p id={errorId} className="text-sm text-destructive">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <ImageFieldPreview
        items={value}
        index={previewIndex}
        onIndexChange={setPreviewIndex}
        onClose={() => setPreviewIndex(null)}
        imageName={resolvedLabels.imageName}
        openInNewTabLabel={resolvedLabels.openInNewTab}
        previousLabel={resolvedLabels.previous}
        nextLabel={resolvedLabels.next}
        counterLabel={resolvedLabels.counter}
        closeLabel={resolvedLabels.close}
      />
    </div>
  )
}
