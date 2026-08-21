"use client"

import * as React from "react"
import { Icon, XIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useRadioGroupNav } from "@/registry/admin-appearance/radio-group-nav"

import type { IconCatalogEntry } from "./icon-catalog"
import { loadIconNodes, useIconNodes } from "./icon-nodes-store"
import { searchIcons } from "./icon-search"

export interface IconFieldLabels {
  placeholder?: string
  searchPlaceholder?: string
  empty?: string
  clear?: string
  showMore?: (count: number) => string
  loading?: string
}

export const iconFieldLabelDefaults: Required<IconFieldLabels> = {
  placeholder: "Choose an icon",
  searchPlaceholder: "Search icons",
  empty: "No icons match",
  clear: "Clear icon",
  showMore: (count: number) => `Show ${count} more`,
  loading: "Loading icons",
}

export interface IconFieldProps {
  value: string | null
  onChange: (name: string | null) => void
  label?: string
  hint?: string
  error?: string
  disabled?: boolean
  className?: string
  labels?: IconFieldLabels
  loadKeywords?: () => Promise<Readonly<Record<string, readonly string[]>>>
  pageSize?: number
}

type IconComponent = React.ComponentType<{ className?: string }>

const resolvedIconCache = new Map<string, IconComponent>()

export function resolveIcon(name: string): IconComponent {
  const cached = resolvedIconCache.get(name)
  if (cached) {
    return cached
  }

  function ResolvedIcon({ className }: { className?: string }) {
    const nodes = useIconNodes()
    const node = nodes?.[name]

    if (!node) {
      return <span aria-hidden className={cn("inline-block", className)} />
    }

    return <Icon iconNode={node} className={className} aria-hidden />
  }

  resolvedIconCache.set(name, ResolvedIcon)
  return ResolvedIcon
}

type CatalogState =
  | { status: "idle" }
  | { status: "loading" }
  | {
      status: "ready"
      catalog: readonly IconCatalogEntry[]
      keywords: Readonly<Record<string, readonly string[]>>
    }

export function IconField(props: IconFieldProps): React.ReactElement {
  const {
    value,
    onChange,
    label,
    hint,
    error,
    disabled = false,
    className,
    labels: labelsProp,
    loadKeywords,
    pageSize = 96,
  } = props

  const labels: Required<IconFieldLabels> = {
    ...iconFieldLabelDefaults,
    ...labelsProp,
  }

  const triggerId = React.useId()
  const errorId = `${triggerId}-error`
  const hintId = `${triggerId}-hint`

  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const deferredQuery = React.useDeferredValue(query)
  const [catalogState, setCatalogState] = React.useState<CatalogState>({
    status: "idle",
  })
  const [visibleCount, setVisibleCount] = React.useState(pageSize)
  const [syncedQuery, setSyncedQuery] = React.useState(deferredQuery)

  if (deferredQuery !== syncedQuery) {
    setSyncedQuery(deferredQuery)
    setVisibleCount(pageSize)
  }

  const handleOpenChange = (next: boolean) => {
    setOpen(next)

    if (!next) {
      return
    }

    setQuery("")
    setVisibleCount(pageSize)

    if (catalogState.status !== "idle") {
      return
    }

    setCatalogState({ status: "loading" })
    loadIconNodes()

    Promise.all([
      import("./icon-catalog"),
      loadKeywords ? loadKeywords() : Promise.resolve({}),
    ]).then(([catalogModule, keywords]) => {
      setCatalogState({
        status: "ready",
        catalog: catalogModule.iconCatalog,
        keywords,
      })
    })
  }

  const results =
    catalogState.status === "ready"
      ? searchIcons(catalogState.catalog, {
          query: deferredQuery,
          keywords: catalogState.keywords,
        })
      : []

  const visibleResults = results.slice(0, visibleCount)
  const remaining = results.length - visibleResults.length
  const nextCount = Math.min(pageSize, remaining)

  const selectedIndex = value
    ? visibleResults.findIndex((entry) => entry.name === value)
    : -1

  const gridNav = useRadioGroupNav({
    count: visibleResults.length,
    selectedIndex,
    columns: 8,
  })

  const selectIcon = (name: string) => {
    onChange(name)
    setOpen(false)
  }

  const CurrentIcon = value ? resolveIcon(value) : null
  const isLoadingCatalog =
    catalogState.status === "idle" || catalogState.status === "loading"

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      {label ? <Label htmlFor={triggerId}>{label}</Label> : null}
      <div className="flex items-center gap-1.5">
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger
            id={triggerId}
            data-testid="icon-field-trigger"
            disabled={disabled}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : hint ? hintId : undefined}
            className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-input bg-transparent px-2.5 text-sm transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 aria-expanded:border-ring aria-expanded:ring-3 aria-expanded:ring-ring/50 dark:bg-input/30 dark:hover:bg-input/50"
          >
            {CurrentIcon
              ? React.createElement(CurrentIcon, {
                  className: "size-4 shrink-0",
                })
              : null}
            <span
              className={cn(
                "flex-1 truncate text-left",
                !value && "text-muted-foreground"
              )}
            >
              {value ?? labels.placeholder}
            </span>
          </PopoverTrigger>
          <PopoverContent className="w-80">
            <Input
              autoFocus
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              aria-label={labels.searchPlaceholder}
              disabled={disabled}
            />
            {isLoadingCatalog ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {labels.loading}
              </p>
            ) : visibleResults.length === 0 ? (
              <p className="py-6 text-center text-sm text-muted-foreground">
                {labels.empty}
              </p>
            ) : (
              <div className="max-h-72 overflow-y-auto">
                <div
                  role="radiogroup"
                  aria-label={labels.placeholder}
                  className="grid grid-cols-8 gap-1"
                >
                  {visibleResults.map((entry, index) => {
                    const selected = entry.name === value
                    const TileIcon = resolveIcon(entry.name)
                    return (
                      <button
                        key={entry.name}
                        type="button"
                        role="radio"
                        aria-checked={selected}
                        aria-label={entry.name}
                        title={entry.name}
                        onClick={() => selectIcon(entry.name)}
                        className={cn(
                          "flex size-8 items-center justify-center rounded-md ring-1 ring-foreground/10 hover:bg-muted",
                          selected && "bg-muted ring-2 ring-ring"
                        )}
                        {...gridNav.itemProps(index)}
                      >
                        {React.createElement(TileIcon, { className: "size-4" })}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
            {remaining > 0 ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="w-full"
                onClick={() => setVisibleCount((count) => count + pageSize)}
              >
                {labels.showMore(nextCount)}
              </Button>
            ) : null}
          </PopoverContent>
        </Popover>
        {value ? (
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={disabled}
            aria-label={labels.clear}
            onPointerDown={(event) => event.stopPropagation()}
            onClick={() => onChange(null)}
          >
            <XIcon className="size-4" aria-hidden="true" />
          </Button>
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
