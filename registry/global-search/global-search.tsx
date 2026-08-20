"use client"

import {
  Fragment,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type ComponentType,
} from "react"
import { Search, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Hint } from "@/registry/hint/hint"

export interface GlobalSearchItem {
  id: string
  label: string
  group?: string
  icon?: ComponentType<{ className?: string }>
  hint?: string
}

export interface GlobalSearchLabels {
  button?: string
  shortcut?: string
  placeholder?: string
  empty?: string
  title?: string
  close?: string
}

export interface GlobalSearchProps {
  items: readonly GlobalSearchItem[]
  onSelect: (id: string) => void
  open: boolean
  onOpenChange: (open: boolean) => void
  hotkey?: boolean
  labels?: GlobalSearchLabels
  variant?: "field" | "icon"
  className?: string
}

interface GlobalSearchOption {
  item: GlobalSearchItem
  index: number
}

interface GlobalSearchGroup {
  key: string
  label?: string
  options: GlobalSearchOption[]
}

function isEditableTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  if (target.isContentEditable) {
    return true
  }

  const tagName = target.tagName

  return tagName === "INPUT" || tagName === "TEXTAREA" || tagName === "SELECT"
}

function matchesQuery(item: GlobalSearchItem, query: string): boolean {
  if (query === "") {
    return true
  }

  return (
    item.label.toLowerCase().includes(query) ||
    (item.group?.toLowerCase().includes(query) ?? false)
  )
}

function groupItems(
  items: readonly GlobalSearchItem[],
  query: string
): { groups: GlobalSearchGroup[]; count: number } {
  const named = new Map<string, GlobalSearchItem[]>()
  const loose: GlobalSearchItem[] = []

  for (const item of items) {
    if (!matchesQuery(item, query)) {
      continue
    }

    if (item.group === undefined) {
      loose.push(item)
      continue
    }

    const bucket = named.get(item.group)

    if (bucket) {
      bucket.push(item)
    } else {
      named.set(item.group, [item])
    }
  }

  const buckets: { key: string; label?: string; items: GlobalSearchItem[] }[] = [
    ...[...named].map(([label, groupItemList]) => ({
      key: label,
      label,
      items: groupItemList,
    })),
  ]

  if (loose.length > 0) {
    buckets.push({ key: "", label: undefined, items: loose })
  }

  let index = 0
  const groups = buckets.map((bucket) => ({
    key: bucket.key,
    label: bucket.label,
    options: bucket.items.map((item) => ({ item, index: index++ })),
  }))

  return { groups, count: index }
}

export function GlobalSearch({
  items,
  onSelect,
  open,
  onOpenChange,
  hotkey = true,
  labels,
  variant = "field",
  className,
}: GlobalSearchProps) {
  const buttonLabel = labels?.button ?? "Search…"
  const shortcutLabel = labels?.shortcut ?? "⌘K"
  const placeholderLabel = labels?.placeholder ?? "Type to search…"
  const emptyLabel = labels?.empty ?? "Nothing found"
  const titleLabel = labels?.title ?? "Search"
  const closeLabel = labels?.close ?? "Close"

  const triggerRef = useRef<HTMLButtonElement | null>(null)
  const baseId = useId()
  const listId = `${baseId}-list`
  const [query, setQuery] = useState("")
  const [activeIndex, setActiveIndex] = useState(0)

  const { groups, count } = useMemo(
    () => groupItems(items, query.trim().toLowerCase()),
    [items, query]
  )

  const active = count === 0 ? -1 : Math.min(activeIndex, count - 1)
  const activeId = active < 0 ? undefined : `${baseId}-option-${active}`

  const changeOpen = (next: boolean) => {
    setQuery("")
    setActiveIndex(0)
    onOpenChange(next)
  }

  useEffect(() => {
    if (!hotkey) {
      return
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== "k") {
        return
      }

      if (!event.metaKey && !event.ctrlKey) {
        return
      }

      if (!open && isEditableTarget(event.target)) {
        return
      }

      event.preventDefault()
      setQuery("")
      setActiveIndex(0)
      onOpenChange(!open)
    }

    document.addEventListener("keydown", handleKeyDown)

    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [hotkey, open, onOpenChange])

  useEffect(() => {
    if (!open || activeId === undefined) {
      return
    }

    document.getElementById(activeId)?.scrollIntoView?.({ block: "nearest" })
  }, [open, activeId])

  const options = groups.flatMap((group) => group.options)

  const select = (id: string) => {
    onSelect(id)
    changeOpen(false)
  }

  const trigger =
    variant === "icon" ? (
      <Hint
        text={buttonLabel}
        render={
          <Button
            ref={triggerRef}
            variant="outline"
            size="icon"
            aria-label={buttonLabel}
            onClick={() => changeOpen(true)}
            className={className}
          >
            <Search className="size-4" />
          </Button>
        }
      />
    ) : (
      <Button
        ref={triggerRef}
        variant="outline"
        onClick={() => changeOpen(true)}
        className={cn(
          "w-full justify-start gap-2 font-normal text-muted-foreground",
          className
        )}
      >
        <Search className="size-4 shrink-0" aria-hidden="true" />
        <span className="truncate">{buttonLabel}</span>
        {shortcutLabel ? (
          <kbd className="ml-auto rounded border border-border bg-muted px-1 py-px font-mono text-[0.7rem] text-muted-foreground">
            {shortcutLabel}
          </kbd>
        ) : null}
      </Button>
    )

  return (
    <>
      {trigger}
      <Dialog open={open} onOpenChange={changeOpen}>
        <DialogContent
          data-slot="global-search"
          showCloseButton={false}
          finalFocus={triggerRef}
          className="top-[12vh] translate-y-0 gap-0 self-start overflow-hidden p-0 sm:max-w-lg"
        >
          <DialogTitle className="sr-only">{titleLabel}</DialogTitle>
          <div className="flex items-center gap-2 border-b px-3">
            <Search
              className="size-4 shrink-0 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              autoFocus
              value={query}
              onChange={(event) => {
                setQuery(event.target.value)
                setActiveIndex(0)
              }}
              onKeyDown={(event) => {
                if (event.key === "ArrowDown" && count > 0) {
                  event.preventDefault()
                  setActiveIndex((active + 1) % count)
                  return
                }

                if (event.key === "ArrowUp" && count > 0) {
                  event.preventDefault()
                  setActiveIndex((active - 1 + count) % count)
                  return
                }

                if (event.key === "Enter") {
                  event.preventDefault()
                  const option = options[active]

                  if (option) {
                    select(option.item.id)
                  }
                }
              }}
              role="combobox"
              aria-expanded="true"
              aria-controls={listId}
              aria-autocomplete="list"
              aria-label={titleLabel}
              aria-activedescendant={activeId}
              placeholder={placeholderLabel}
              className="h-11 rounded-none border-0 px-0 focus-visible:ring-0"
            />
            <button
              type="button"
              aria-label={closeLabel}
              onClick={() => changeOpen(false)}
              className="flex size-6 shrink-0 items-center justify-center rounded-sm text-muted-foreground transition-colors outline-none hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>
          <div
            id={listId}
            role="listbox"
            aria-label={titleLabel}
            tabIndex={0}
            className="h-80 overflow-y-auto p-1 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {count === 0 ? (
              <div
                role="presentation"
                className="px-2 py-6 text-center text-sm text-muted-foreground"
              >
                {emptyLabel}
              </div>
            ) : (
              groups.map((group) => {
                const rendered = group.options.map(({ item, index }) => {
                  const Icon = item.icon

                  return (
                    <div
                      key={item.id}
                      id={`${baseId}-option-${index}`}
                      role="option"
                      aria-selected={index === active}
                      onClick={() => select(item.id)}
                      onPointerMove={() => setActiveIndex(index)}
                      className={cn(
                        "flex cursor-default items-center gap-2 rounded-md px-2 py-1.5 text-sm",
                        index === active && "bg-muted text-foreground"
                      )}
                    >
                      {Icon ? (
                        <Icon className="size-4 shrink-0 text-muted-foreground" />
                      ) : null}
                      <span className="truncate">{item.label}</span>
                      {item.hint ? (
                        <span className="ml-auto shrink-0 pl-2 text-xs text-muted-foreground">
                          {item.hint}
                        </span>
                      ) : null}
                    </div>
                  )
                })

                if (group.label === undefined) {
                  return <Fragment key={group.key}>{rendered}</Fragment>
                }

                return (
                  <div key={group.key} role="group" aria-label={group.label}>
                    <div
                      aria-hidden="true"
                      className="px-2 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      {group.label}
                    </div>
                    {rendered}
                  </div>
                )
              })
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
