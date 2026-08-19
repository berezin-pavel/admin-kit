"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"

export interface ShowcaseNavItem {
  id: string
  title: string
  href: string
  children?: readonly ShowcaseNavItem[]
}

export function ShowcaseNavBody({
  items,
  referenceItems,
  activeId,
}: {
  items: readonly ShowcaseNavItem[]
  referenceItems: readonly ShowcaseNavItem[]
  activeId?: string
}) {
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
          className="max-h-[70svh] overflow-y-auto py-3"
        />
      </details>
      <NavLinkList
        items={items}
        referenceItems={referenceItems}
        activeId={activeId}
        className="hidden md:block"
      />
    </>
  )
}

function NavLinkList({
  items,
  referenceItems,
  activeId,
  className,
}: {
  items: readonly ShowcaseNavItem[]
  referenceItems: readonly ShowcaseNavItem[]
  activeId?: string
  className?: string
}) {
  return (
    <div className={cn("flex flex-col gap-2 text-sm", className)}>
      <NavItemList items={referenceItems} activeId={activeId} />
      <NavItemList items={items} activeId={activeId} />
    </div>
  )
}

function NavItemList({
  items,
  activeId,
}: {
  items: readonly ShowcaseNavItem[]
  activeId?: string
}) {
  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => (
        <NavItem key={item.id} item={item} activeId={activeId} />
      ))}
    </ul>
  )
}

function NavItem({
  item,
  activeId,
}: {
  item: ShowcaseNavItem
  activeId?: string
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
          href={item.href}
          aria-current={isActive ? "page" : undefined}
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
                href={child.href}
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
