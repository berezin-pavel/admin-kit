"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useState } from "react"

import { cn } from "@/lib/utils"

export const SHOWCASE_NAV_SENTINEL_ID = "showcase-nav-sentinel"

export interface ShowcaseNavItem {
  id: string
  title: string
  children?: readonly ShowcaseNavItem[]
}

function useActiveSection(ids: readonly string[]) {
  const [activeId, setActiveId] = useState<string | null>(null)

  useEffect(() => {
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null)

    if (elements.length === 0) return

    const orderedIds = [...elements]
      .sort((a, b) =>
        a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1
      )
      .map((element) => element.id)
    const lastId = orderedIds[orderedIds.length - 1]

    const visible = new Set<string>()
    let atBottom = false

    const applyActive = () => {
      if (atBottom) {
        setActiveId(lastId)
        return
      }
      for (let index = orderedIds.length - 1; index >= 0; index -= 1) {
        if (visible.has(orderedIds[index])) {
          setActiveId(orderedIds[index])
          return
        }
      }
    }

    const sectionObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            visible.add(entry.target.id)
          } else {
            visible.delete(entry.target.id)
          }
        }
        applyActive()
      },
      { rootMargin: "-88px 0px -70% 0px", threshold: 0 }
    )
    elements.forEach((element) => sectionObserver.observe(element))

    const sentinel = document.getElementById(SHOWCASE_NAV_SENTINEL_ID)
    const bottomObserver = sentinel
      ? new IntersectionObserver(
          ([entry]) => {
            atBottom = entry.isIntersecting
            applyActive()
          },
          { threshold: 0 }
        )
      : null
    if (sentinel && bottomObserver) {
      bottomObserver.observe(sentinel)
    }

    return () => {
      sectionObserver.disconnect()
      bottomObserver?.disconnect()
    }
  }, [ids])

  return {
    activeId,
    activate: (id: string) => setActiveId(id),
  }
}

export function ShowcaseNavBody({
  items,
  referenceItems,
}: {
  items: readonly ShowcaseNavItem[]
  referenceItems: readonly ShowcaseNavItem[]
}) {
  const ids = useMemo(
    () => [
      ...referenceItems.map((item) => item.id),
      ...items.map((item) => item.id),
    ],
    [items, referenceItems]
  )
  const { activeId, activate } = useActiveSection(ids)

  return (
    <>
      <details className="-mx-6 border-b border-border bg-background/95 px-6 py-2 backdrop-blur md:hidden">
        <summary className="flex list-none items-center justify-between gap-2 text-sm font-medium">
          Sections
          <ChevronDown className="size-4 text-muted-foreground" />
        </summary>
        <NavLinkList
          items={items}
          referenceItems={referenceItems}
          activeId={activeId}
          onNavigate={activate}
          className="max-h-[70svh] overflow-y-auto py-3"
        />
      </details>
      <NavLinkList
        items={items}
        referenceItems={referenceItems}
        activeId={activeId}
        onNavigate={activate}
        className="hidden md:block"
      />
    </>
  )
}

function NavLinkList({
  items,
  referenceItems,
  activeId,
  onNavigate,
  className,
}: {
  items: readonly ShowcaseNavItem[]
  referenceItems: readonly ShowcaseNavItem[]
  activeId: string | null
  onNavigate: (id: string) => void
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <NavItemList
        items={referenceItems}
        activeId={activeId}
        onNavigate={onNavigate}
      />
      <NavItemList items={items} activeId={activeId} onNavigate={onNavigate} />
    </div>
  )
}

function NavItemList({
  items,
  activeId,
  onNavigate,
  className,
}: {
  items: readonly ShowcaseNavItem[]
  activeId: string | null
  onNavigate: (id: string) => void
  className?: string
}) {
  return (
    <ul className={cn("flex flex-col gap-1", className)}>
      {items.map((item) => (
        <NavItem
          key={item.id}
          item={item}
          activeId={activeId}
          onNavigate={onNavigate}
        />
      ))}
    </ul>
  )
}

function NavItem({
  item,
  activeId,
  onNavigate,
}: {
  item: ShowcaseNavItem
  activeId: string | null
  onNavigate: (id: string) => void
}) {
  const isActive = item.id === activeId
  const [openedByUser, setOpenedByUser] = useState<boolean | null>(null)
  const hasChildren = Boolean(item.children && item.children.length > 0)
  const isOpen = openedByUser ?? isActive
  const listId = `${item.id}-subsections`

  return (
    <li>
      <div className="flex items-center gap-1">
        <Link
          href={`#${item.id}`}
          aria-current={isActive ? "page" : undefined}
          onClick={() => onNavigate(item.id)}
          className={cn(
            "block flex-1 rounded-md px-2 py-1 transition-colors",
            isActive
              ? "bg-muted font-medium text-foreground"
              : "text-muted-foreground hover:bg-muted hover:text-foreground"
          )}
        >
          {item.title}
        </Link>
        {hasChildren ? (
          <button
            type="button"
            aria-expanded={isOpen}
            aria-controls={listId}
            aria-label={`${item.title} items`}
            onClick={() => setOpenedByUser(!isOpen)}
            className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <ChevronDown
              className={cn(
                "size-3.5 transition-transform",
                isOpen && "rotate-180"
              )}
            />
          </button>
        ) : null}
      </div>
      {hasChildren && isOpen ? (
        <ul id={listId} className="mt-1 ml-2 flex flex-col gap-0.5 border-l border-border pl-2">
          {item.children?.map((child) => (
            <li key={child.id}>
              <Link
                href={`#${child.id}`}
                onClick={() => onNavigate(item.id)}
                className="block rounded-md px-2 py-0.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                {child.title}
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </li>
  )
}
