"use client"

import * as React from "react"
import { CheckIcon } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"

export interface ColorFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  presets?: readonly string[]
  disabled?: boolean
  className?: string
  placeholder?: string
  hexInputLabel?: string
}

const DEFAULT_PRESETS = [
  "#ef4444",
  "#f97316",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#a855f7",
  "#ec4899",
  "#78716c",
] as const

const HEX_PATTERN = /^#[0-9a-f]{6}$/i

export function toHexDigits(raw: string) {
  return raw
    .toLowerCase()
    .replace(/[^0-9a-f]/g, "")
    .slice(0, 6)
}

export function isValidHexColor(value: string): boolean {
  return HEX_PATTERN.test(value)
}

export function ColorField(props: ColorFieldProps): React.ReactElement {
  const {
    value,
    onChange,
    label,
    presets = DEFAULT_PRESETS,
    disabled = false,
    className,
    placeholder = "Pick a color",
    hexInputLabel = "Color HEX code",
  } = props

  const triggerId = React.useId()
  const isValid = isValidHexColor(value)
  const color = value.toLowerCase()
  const [hexDigits, setHexDigits] = React.useState(() => color.slice(1))
  const [syncedValue, setSyncedValue] = React.useState(value)

  if (value !== syncedValue) {
    setSyncedValue(value)
    setHexDigits(color.slice(1))
  }

  const handleHexDigitsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const digits = toHexDigits(event.target.value)
    setHexDigits(digits)
    if (digits.length === 6) {
      onChange(`#${digits}`)
    }
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={triggerId}>{label}</Label> : null}
      <Popover>
        <PopoverTrigger
          id={triggerId}
          disabled={disabled}
          className="flex h-8 w-full items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50"
        >
          <span
            aria-hidden="true"
            className={cn(
              "size-4 shrink-0 rounded-sm",
              isValid
                ? "border border-transparent"
                : "border border-dashed border-muted-foreground/40"
            )}
            style={
              isValid
                ? { backgroundColor: color }
                : {
                    backgroundImage:
                      "linear-gradient(45deg, var(--muted) 25%, transparent 25%), linear-gradient(-45deg, var(--muted) 25%, transparent 25%), linear-gradient(45deg, transparent 75%, var(--muted) 75%), linear-gradient(-45deg, transparent 75%, var(--muted) 75%)",
                    backgroundSize: "6px 6px",
                    backgroundPosition: "0 0, 0 3px, 3px -3px, -3px 0px",
                  }
            }
          />
          <span
            className={cn(
              "flex-1 text-left",
              !isValid && "text-muted-foreground"
            )}
          >
            {isValid ? color : placeholder}
          </span>
        </PopoverTrigger>
        <PopoverContent className="w-64">
          <div className="grid grid-cols-6 gap-1.5">
            {presets.map((preset) => {
              const selected = isValid && preset.toLowerCase() === color
              return (
                <button
                  key={preset}
                  type="button"
                  aria-label={preset}
                  aria-pressed={selected}
                  onClick={() => onChange(preset.toLowerCase())}
                  className={cn(
                    "relative size-6 rounded-sm ring-1 ring-foreground/10 transition-transform hover:scale-110",
                    selected &&
                      "ring-2 ring-ring ring-offset-1 ring-offset-popover"
                  )}
                  style={{ backgroundColor: preset }}
                >
                  {selected ? (
                    <CheckIcon
                      aria-hidden="true"
                      className="absolute inset-0 m-auto size-3.5 text-white mix-blend-difference"
                    />
                  ) : null}
                </button>
              )
            })}
          </div>
          <div className="flex items-center gap-2">
            <label className="relative size-8 shrink-0 cursor-pointer overflow-hidden rounded-lg border border-input">
              <span className="sr-only">Custom color</span>
              <span
                aria-hidden="true"
                className="absolute inset-0"
                style={{ backgroundColor: isValid ? color : "#000000" }}
              />
              <input
                type="color"
                value={isValid ? color : "#000000"}
                onChange={(event) => onChange(event.target.value)}
                disabled={disabled}
                className="absolute inset-0 size-full cursor-pointer opacity-0"
              />
            </label>
            <div className="flex h-8 flex-1 items-center gap-1 rounded-lg border border-input px-2.5 dark:bg-input/30">
              <span className="text-sm text-muted-foreground">#</span>
              <Input
                value={hexDigits}
                onChange={handleHexDigitsChange}
                disabled={disabled}
                maxLength={6}
                spellCheck={false}
                autoComplete="off"
                aria-label={hexInputLabel}
                className="h-full border-0 bg-transparent px-0 focus-visible:ring-0"
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
