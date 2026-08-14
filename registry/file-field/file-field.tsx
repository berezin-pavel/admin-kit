"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

export interface FileFieldProps {
  value: File | null
  onChange: (file: File | null) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  accept?: string
  buttonLabel?: string
  noFileLabel?: string
  clearLabel?: string
}

const FILE_SIZE_UNITS = ["B", "KB", "MB", "GB", "TB"] as const

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`
  }

  let value = bytes
  let unitIndex = 0

  while (value >= 1024 && unitIndex < FILE_SIZE_UNITS.length - 1) {
    value /= 1024
    unitIndex += 1
  }

  return `${value.toFixed(1)} ${FILE_SIZE_UNITS[unitIndex]}`
}

export function FileField({
  value,
  onChange,
  label,
  hint,
  error,
  disabled = false,
  className,
  accept,
  buttonLabel = "Choose file",
  noFileLabel = "No file selected",
  clearLabel = "Remove file",
}: FileFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const inputRef = React.useRef<HTMLInputElement>(null)
  const [isDragOver, setIsDragOver] = React.useState(false)

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div
        aria-disabled={disabled || undefined}
        className={cn(
          "relative flex items-center gap-2 rounded-lg border border-dashed border-input px-2.5 py-1.5 transition-colors",
          isDragOver && "border-ring bg-muted/50",
          disabled && "pointer-events-none opacity-50"
        )}
        onDragOver={(event) => {
          event.preventDefault()
          setIsDragOver(true)
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(event) => {
          event.preventDefault()
          setIsDragOver(false)

          const file = event.dataTransfer.files[0]

          if (file) {
            onChange(file)
          }
        }}
      >
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={disabled}
          onClick={() => inputRef.current?.click()}
        >
          {buttonLabel}
        </Button>
        <span className="min-w-0 flex-1 truncate text-sm">
          {value ? (
            <>
              <span className="text-foreground">{value.name}</span>{" "}
              <span className="text-muted-foreground">
                ({formatFileSize(value.size)})
              </span>
            </>
          ) : (
            <span className="text-muted-foreground">{noFileLabel}</span>
          )}
        </span>
        {value ? (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label={clearLabel}
            disabled={disabled}
            onClick={() => onChange(null)}
          >
            <X />
          </Button>
        ) : null}
        <input
          ref={inputRef}
          id={id}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          onChange={(event) => {
            const file = event.target.files?.[0] ?? null

            onChange(file)
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
    </div>
  )
}
