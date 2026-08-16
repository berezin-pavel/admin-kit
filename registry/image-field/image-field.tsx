"use client"

import * as React from "react"
import {
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  ExternalLink,
  ImageUp,
  Maximize2,
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
  const [draggedIndex, setDraggedIndex] = React.useState<number | null>(null)
  const [dropIndex, setDropIndex] = React.useState<number | null>(null)
  const [filesOver, setFilesOver] = React.useState(false)
  const [previewIndex, setPreviewIndex] = React.useState<number | null>(null)
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
                aria-label={name}
                draggable={!disabled && value.length > 1}
                onDragStart={(event) => {
                  setDraggedIndex(index)
                  event.dataTransfer.effectAllowed = "move"
                  event.dataTransfer.setData("text/plain", String(index))
                }}
                onDragOver={(event) => {
                  if (draggedIndex === null) return
                  event.preventDefault()
                  event.dataTransfer.dropEffect = "move"
                  setDropIndex(index)
                }}
                onDrop={(event) => {
                  if (draggedIndex === null) return
                  event.preventDefault()
                  event.stopPropagation()
                  move(draggedIndex, index)
                  setDraggedIndex(null)
                  setDropIndex(null)
                }}
                onDragEnd={() => {
                  setDraggedIndex(null)
                  setDropIndex(null)
                }}
                className={cn(
                  "group relative size-32 shrink-0 overflow-hidden rounded-lg border bg-muted",
                  item.error ? "border-destructive" : "border-border",
                  draggedIndex === index && "opacity-40",
                  dropIndex === index &&
                    draggedIndex !== null &&
                    draggedIndex !== index &&
                    "ring-2 ring-ring"
                )}
              >
                <img
                  src={item.url}
                  alt={name}
                  draggable={false}
                  className={cn(
                    "size-full object-cover",
                    (isUploading || item.error) && "opacity-40"
                  )}
                />
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
                      onClick={() => move(index, index - 1)}
                    >
                      <ChevronLeft />
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon-xs"
                      aria-label={`${resolvedLabels.preview}: ${name}`}
                      onClick={() => setPreviewIndex(index)}
                    >
                      <Maximize2 />
                    </Button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      aria-label={`${resolvedLabels.openInNewTab}: ${name}`}
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
      />
    </div>
  )
}
