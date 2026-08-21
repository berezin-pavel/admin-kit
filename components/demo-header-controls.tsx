"use client"

import { useMemo, useState } from "react"
import { usePathname, useRouter } from "next/navigation"

import { FullscreenToggle } from "@/registry/fullscreen-toggle/fullscreen-toggle"
import { GlobalSearch } from "@/registry/global-search/global-search"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { NotificationsMenu } from "@/registry/notifications-menu/notifications-menu"

import { getDemoNotifications, getDemoSearchItems } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"
import { DEMO_CARD_BASE, demoBasePath } from "@/app/demo/paths"

const PAGE_PREFIX = "page:"

export function DemoHeaderControls({
  variant,
}: {
  variant: "header" | "sidebar"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const locale = useDemoLocale()
  const strings = demoDictionary[locale]
  const [open, setOpen] = useState(false)
  const [readIds, setReadIds] = useState<readonly string[]>([])

  const items = useMemo(() => getDemoSearchItems(locale), [locale])
  const notifications = useMemo(
    () =>
      getDemoNotifications(locale).map((item) =>
        readIds.includes(item.id) ? { ...item, read: true } : item
      ),
    [locale, readIds]
  )

  const basePath = demoBasePath(pathname)

  const selectSearchItem = (id: string) => {
    setOpen(false)

    if (id.startsWith(PAGE_PREFIX)) {
      const cardPath = id.slice(PAGE_PREFIX.length)
      router.push(`${basePath}${cardPath.slice(DEMO_CARD_BASE.length)}`)
      return
    }

    router.push(`${basePath}/order`)
  }

  return (
    <>
      <GlobalSearch
        items={items}
        onSelect={selectSearchItem}
        open={open}
        onOpenChange={setOpen}
        hotkey={variant === "header"}
        variant={variant === "header" ? "field" : "icon"}
        className={variant === "header" ? "w-44 lg:w-56" : undefined}
        labels={strings.search}
      />
      <NotificationsMenu
        notifications={notifications}
        onSelect={(id: string) =>
          setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]))
        }
        onMarkAllRead={() =>
          setReadIds(notifications.map((notification) => notification.id))
        }
        labels={strings.notifications}
        align={variant === "header" ? "end" : "start"}
      />
      <FullscreenToggle
        labels={locale === "ru" ? localeRu.fullscreenToggle : undefined}
      />
    </>
  )
}
