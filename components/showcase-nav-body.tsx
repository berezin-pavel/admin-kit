"use client"

import { ChevronDown } from "lucide-react"
import Link from "next/link"
import { type RefObject, useEffect, useMemo, useRef, useState } from "react"

import { cn } from "@/lib/utils"

export const SHOWCASE_NAV_SENTINEL_ID = "showcase-nav-sentinel"

export interface ShowcaseNavItem {
  id: string
  title: string
}

export interface ShowcaseNavGroupData {
  title: string
  items: readonly ShowcaseNavItem[]
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
  groups,
  referenceSection,
}: {
  groups: readonly ShowcaseNavGroupData[]
  referenceSection: ShowcaseNavGroupData
}) {
  const ids = useMemo(
    () => [
      ...groups.flatMap((group) => group.items.map((item) => item.id)),
      ...referenceSection.items.map((item) => item.id),
    ],
    [groups, referenceSection]
  )
  const { activeId, activate } = useActiveSection(ids)

  return (
    <>
      <details className="-mx-6 border-b border-border bg-background/95 px-6 py-2 backdrop-blur md:hidden">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-sm font-medium">
          Sections
          <ChevronDown className="size-4 text-muted-foreground" />
        </summary>
        <NavLinkList
          groups={groups}
          referenceSection={referenceSection}
          activeId={activeId}
          onNavigate={activate}
          className="max-h-[70svh] overflow-y-auto py-3"
        />
      </details>
      <NavLinkList
        groups={groups}
        referenceSection={referenceSection}
        activeId={activeId}
        onNavigate={activate}
        className="hidden md:block md:max-h-[calc(100svh-4rem)] md:overflow-y-auto"
      />
    </>
  )
}

function NavLinkList({
  groups,
  referenceSection,
  activeId,
  onNavigate,
  className,
}: {
  groups: readonly ShowcaseNavGroupData[]
  referenceSection: ShowcaseNavGroupData
  activeId: string | null
  onNavigate: (id: string) => void
  className?: string
}) {
  const linkRefs = useRef(new Map<string, HTMLAnchorElement>())

  useEffect(() => {
    if (!activeId) return
    const link = linkRefs.current.get(activeId)
    if (link && link.offsetParent !== null) {
      link.scrollIntoView({ block: "nearest" })
    }
  }, [activeId])

  return (
    <div className={cn("flex flex-col gap-5 text-sm", className)}>
      {groups.map((group) => (
        <NavGroup
          key={group.title}
          group={group}
          activeId={activeId}
          onNavigate={onNavigate}
          linkRefs={linkRefs}
        />
      ))}
      <div className="flex flex-col gap-1.5 border-t border-border pt-4">
        <NavGroup
          group={referenceSection}
          activeId={activeId}
          onNavigate={onNavigate}
          linkRefs={linkRefs}
        />
      </div>
    </div>
  )
}

function NavGroup({
  group,
  activeId,
  onNavigate,
  linkRefs,
}: {
  group: ShowcaseNavGroupData
  activeId: string | null
  onNavigate: (id: string) => void
  linkRefs: RefObject<Map<string, HTMLAnchorElement>>
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
        {group.title}
      </span>
      <ul className="flex flex-col gap-1">
        {group.items.map((item) => {
          const isActive = item.id === activeId

          return (
            <li key={item.id}>
              <Link
                href={`#${item.id}`}
                ref={(element) => {
                  if (element) {
                    linkRefs.current.set(item.id, element)
                  } else {
                    linkRefs.current.delete(item.id)
                  }
                }}
                aria-current={isActive ? "page" : undefined}
                onClick={() => onNavigate(item.id)}
                className={cn(
                  "block rounded-md px-2 py-1 transition-colors",
                  isActive
                    ? "bg-muted font-medium text-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.title}
              </Link>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
