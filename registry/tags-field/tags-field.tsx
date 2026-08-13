"use client"

import * as React from "react"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

export interface TagsFieldProps {
  value: readonly string[]
  onChange: (tags: readonly string[]) => void
  label?: string
  placeholder?: string
  suggestions?: readonly string[]
  removeLabel?: (tag: string) => string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
}

export function addTag(
  tags: readonly string[],
  raw: string
): readonly string[] {
  const trimmed = raw.trim()

  if (!trimmed || tags.includes(trimmed)) {
    return tags
  }

  return [...tags, trimmed]
}

const defaultRemoveLabel = (tag: string) => `Remove ${tag}`

export function TagsField({
  value,
  onChange,
  label,
  placeholder = "Add a tag…",
  suggestions,
  removeLabel = defaultRemoveLabel,
  hint,
  error,
  disabled = false,
  className,
}: TagsFieldProps) {
  const id = React.useId()
  const errorId = `${id}-error`
  const hintId = `${id}-hint`
  const [draft, setDraft] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const filteredSuggestions = React.useMemo(() => {
    if (!suggestions || draft.trim() === "") {
      return []
    }

    const query = draft.trim().toLowerCase()

    return suggestions.filter(
      (suggestion) =>
        !value.includes(suggestion) &&
        suggestion.toLowerCase().includes(query)
    )
  }, [suggestions, draft, value])

  const commitDraft = () => {
    onChange(addTag(value, draft))
    setDraft("")
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={id}>{label}</Label> : null}
      <div className="relative">
        <div
          className={cn(
            "flex min-h-8 w-full flex-wrap items-center gap-1.5 rounded-lg border border-input bg-transparent px-2.5 py-1 transition-colors focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 dark:bg-input/30",
            error &&
              "border-destructive ring-3 ring-destructive/20 dark:ring-destructive/40"
          )}
        >
          {value.map((tag) => (
            <Badge key={tag} variant="secondary" className="gap-1">
              <span>{tag}</span>
              <button
                type="button"
                data-icon="inline-end"
                aria-label={removeLabel(tag)}
                disabled={disabled}
                onClick={() => onChange(value.filter((item) => item !== tag))}
                className="rounded-full outline-none hover:bg-foreground/10 focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-3" />
              </button>
            </Badge>
          ))}
          <input
            id={id}
            value={draft}
            disabled={disabled}
            placeholder={value.length === 0 ? placeholder : undefined}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            onFocus={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === ",") {
                event.preventDefault()
                commitDraft()
                return
              }

              if (event.key === "Backspace" && draft === "" && value.length > 0) {
                onChange(value.slice(0, -1))
              }
            }}
            className="min-w-24 flex-1 border-0 bg-transparent p-0 text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed"
          />
        </div>
        {open && filteredSuggestions.length > 0 ? (
          <ul className="absolute z-10 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-border bg-popover p-1 text-sm text-popover-foreground shadow-md">
            {filteredSuggestions.map((suggestion) => (
              <li key={suggestion}>
                <button
                  type="button"
                  className="w-full rounded-md px-2 py-1.5 text-left hover:bg-muted"
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => {
                    onChange(addTag(value, suggestion))
                    setDraft("")
                  }}
                >
                  {suggestion}
                </button>
              </li>
            ))}
          </ul>
        ) : null}
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
