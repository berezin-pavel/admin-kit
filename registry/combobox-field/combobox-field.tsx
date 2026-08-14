"use client"

import * as React from "react"

import { cn } from "@/lib/utils"
import { Label } from "@/components/ui/label"
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/components/ui/combobox"

export interface ComboboxFieldOption {
  value: string
  label: string
  group?: string
}

export interface ComboboxFieldProps {
  value: string
  onChange: (value: string) => void
  options: readonly ComboboxFieldOption[]
  placeholder?: string
  emptyLabel?: string
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function filterComboboxOptions(
  options: readonly ComboboxFieldOption[],
  query: string
): readonly ComboboxFieldOption[] {
  const trimmed = query.trim().toLowerCase()

  if (trimmed === "") {
    return options
  }

  return options.filter((option) =>
    option.label.toLowerCase().includes(trimmed)
  )
}

interface ComboboxFieldGroup {
  group?: string
  items: readonly ComboboxFieldOption[]
}

function groupComboboxOptions(
  options: readonly ComboboxFieldOption[]
): readonly ComboboxFieldGroup[] {
  const ungrouped: ComboboxFieldOption[] = []
  const groupOrder: string[] = []
  const groupedByName = new Map<string, ComboboxFieldOption[]>()

  for (const option of options) {
    if (!option.group) {
      ungrouped.push(option)
      continue
    }

    if (!groupedByName.has(option.group)) {
      groupedByName.set(option.group, [])
      groupOrder.push(option.group)
    }

    groupedByName.get(option.group)?.push(option)
  }

  const namedGroups = groupOrder.map((name) => ({
    group: name,
    items: groupedByName.get(name) ?? [],
  }))

  return ungrouped.length > 0
    ? [{ items: ungrouped }, ...namedGroups]
    : namedGroups
}

export function ComboboxField({
  value,
  onChange,
  options,
  placeholder = "Search…",
  emptyLabel = "Nothing found",
  label,
  hint,
  error,
  disabled = false,
  className,
}: ComboboxFieldProps) {
  const id = React.useId()
  const hintId = `${id}-hint`
  const errorId = `${id}-error`

  const selectedOption =
    options.find((option) => option.value === value) ?? null
  const hasGroups = options.some((option) => Boolean(option.group))
  const groups = React.useMemo(
    () => (hasGroups ? groupComboboxOptions(options) : []),
    [hasGroups, options]
  )

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <Combobox
        items={hasGroups ? groups : options}
        value={selectedOption}
        onValueChange={(next) => onChange(next ? next.value : "")}
        isItemEqualToValue={(
          itemValue: ComboboxFieldOption,
          current: ComboboxFieldOption
        ) => itemValue.value === current.value}
        filter={(itemValue: ComboboxFieldOption, query: string) =>
          filterComboboxOptions([itemValue], query).length > 0
        }
        autoHighlight
        disabled={disabled}
      >
        <ComboboxInput
          id={id}
          placeholder={placeholder}
          disabled={disabled}
          showClear
          className="w-full"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
        />
        <ComboboxContent>
          <ComboboxEmpty>{emptyLabel}</ComboboxEmpty>
          <ComboboxList>
            {hasGroups
              ? (group: ComboboxFieldGroup) => (
                  <ComboboxGroup
                    key={group.group ?? "ungrouped"}
                    items={group.items}
                  >
                    {group.group ? (
                      <ComboboxLabel>{group.group}</ComboboxLabel>
                    ) : null}
                    <ComboboxCollection>
                      {(option: ComboboxFieldOption) => (
                        <ComboboxItem key={option.value} value={option}>
                          <span className="truncate">{option.label}</span>
                        </ComboboxItem>
                      )}
                    </ComboboxCollection>
                  </ComboboxGroup>
                )
              : (option: ComboboxFieldOption) => (
                  <ComboboxItem key={option.value} value={option}>
                    <span className="truncate">{option.label}</span>
                  </ComboboxItem>
                )}
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
