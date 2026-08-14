"use client"

import * as React from "react"
import { XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  useComboboxAnchor,
} from "@/components/ui/combobox"

export interface MultiSelectFieldOption {
  value: string
  label: string
}

export interface MultiSelectFieldProps {
  value: readonly string[]
  onChange: (value: readonly string[]) => void
  options: readonly MultiSelectFieldOption[]
  placeholder?: string
  emptyLabel?: string
  removeLabel?: (label: string) => string
  maxItems?: number
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function toggleMultiSelectValue(
  value: readonly string[],
  option: string
): readonly string[] {
  if (value.includes(option)) {
    return value.filter((item) => item !== option)
  }

  return [...value, option]
}

const defaultRemoveLabel = (label: string) => `Remove ${label}`

function isOptionEqual(a: MultiSelectFieldOption, b: MultiSelectFieldOption) {
  return a.value === b.value
}

export function MultiSelectField({
  value,
  onChange,
  options,
  placeholder = "Search…",
  emptyLabel = "Nothing found",
  removeLabel = defaultRemoveLabel,
  maxItems,
  label,
  hint,
  error,
  disabled = false,
  className,
}: MultiSelectFieldProps) {
  const id = React.useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const anchor = useComboboxAnchor()

  const optionsByValue = React.useMemo(
    () => new Map(options.map((option) => [option.value, option])),
    [options]
  )

  const selectedOptions = React.useMemo(
    () =>
      value
        .map((item) => optionsByValue.get(item))
        .filter((option): option is MultiSelectFieldOption => option != null),
    [value, optionsByValue]
  )

  const limitReached = maxItems != null && selectedOptions.length >= maxItems

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Combobox
        items={options}
        value={selectedOptions}
        onValueChange={(next) => {
          const nextValues = next.map((option) => option.value)
          const added = nextValues.find((item) => !value.includes(item))

          if (added !== undefined) {
            onChange(toggleMultiSelectValue(value, added))
            return
          }

          const removed = value.find((item) => !nextValues.includes(item))

          if (removed !== undefined) {
            onChange(toggleMultiSelectValue(value, removed))
            return
          }

          onChange(nextValues)
        }}
        multiple
        isItemEqualToValue={isOptionEqual}
        disabled={disabled}
      >
        <ComboboxChips
          ref={anchor}
          onKeyDownCapture={(event) => {
            if (event.key === "Enter") {
              event.preventDefault()
            }
          }}
          className="has-disabled:pointer-events-none has-disabled:opacity-50"
        >
          {selectedOptions.map((option) => (
            <ComboboxChip
              key={option.value}
              showRemove={false}
              aria-label={option.label}
            >
              <span className="max-w-40 truncate">{option.label}</span>
              <Button
                type="button"
                variant="ghost"
                size="icon-xs"
                disabled={disabled}
                aria-label={removeLabel(option.label)}
                className="-ml-1 opacity-50 hover:opacity-100"
                onMouseDown={(event) => event.preventDefault()}
                onClick={(event) => {
                  event.stopPropagation()
                  onChange(toggleMultiSelectValue(value, option.value))
                }}
              >
                <XIcon className="pointer-events-none" />
              </Button>
            </ComboboxChip>
          ))}
          <ComboboxChipsInput
            id={id}
            placeholder={selectedOptions.length === 0 ? placeholder : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
          />
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
          <ComboboxList>
            {(option: MultiSelectFieldOption) => {
              const selected = value.includes(option.value)

              return (
                <ComboboxItem
                  key={option.value}
                  value={option}
                  disabled={!selected && limitReached}
                >
                  <span className="truncate">{option.label}</span>
                </ComboboxItem>
              )
            }}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
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
