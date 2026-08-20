"use client"

import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"

import { Store } from "lucide-react"

import { DemoHeaderControls } from "@/components/demo-header-controls"
import { DemoLanguageToggle } from "@/components/demo-language-toggle"
import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { DemoUserMenu } from "@/components/demo-user-menu"
import { AppearanceCanvas } from "@/registry/admin-appearance/appearance-style"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
import { AppLogo } from "@/registry/app-logo/app-logo"
import type { AdminNavLinkRenderer } from "@/registry/admin-shell/admin-shell"
import { AdminToaster } from "@/registry/admin-toaster/admin-toaster"
import { AppearanceMenu } from "@/registry/appearance-menu/appearance-menu"
import { resolvePageBackdrop } from "@/registry/admin-appearance/appearance-palette"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"

import {
  demoPageId,
  setDemoAppearance,
  useDemoAppearance,
  DEMO_APPEARANCE_PAGES,
} from "@/app/demo/appearance-store"
import { getDemoFlushNav, getDemoNav } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

export type DemoShellLayout = "card" | "flush-header"


const renderDemoLink: AdminNavLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <Link href={href} className={className}>
    {children}
  </Link>
)

export function DemoShell({
  layout,
  children,
}: {
  layout: DemoShellLayout
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const locale = useDemoLocale()
  const appearance = useDemoAppearance()
  const nav = demoDictionary[locale].nav
  const router = useRouter()
  const flush = layout === "flush-header"

  useEffect(() => {
    const items = flush ? getDemoFlushNav(locale) : getDemoNav(locale)
    const onKeyDown = (event: KeyboardEvent) => {
      if (!event.ctrlKey || event.metaKey || event.altKey || event.shiftKey) {
        return
      }
      const index = Number.parseInt(event.key, 10)
      if (Number.isNaN(index) || index < 1 || index > items.length) {
        return
      }
      event.preventDefault()
      router.push(items[index - 1].href)
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [flush, locale, router])
  const pageLabelById: Record<string, string> = {
    overview: nav.overview,
    orders: nav.orders,
    order: nav.order,
  }
  const appearanceMenuPages = DEMO_APPEARANCE_PAGES.map((page) => ({
    id: page.id,
    label: pageLabelById[page.id] ?? page.id,
  }))

  const backdrop = resolvePageBackdrop(appearance, demoPageId(pathname))

  const sharedProps = {
    appName: demoDictionary[locale].appName,
    nav: flush ? getDemoFlushNav(locale) : getDemoNav(locale),
    activeHref: pathname,
    renderLink: renderDemoLink,
    logo: <AppLogo name={demoDictionary[locale].appName} icon={Store} />,
    collapsed,
    sidebarGradient: appearance.sidebar ?? undefined,
    headerGradient: appearance.header ?? undefined,
    backdrop,
    labels: locale === "ru" ? localeRu.adminShell : undefined,
    sidebarFooter: (
      <>
        <DemoThemeToggle />
        <DemoLanguageToggle />
        <AppearanceMenu
          value={appearance}
          onChange={setDemoAppearance}
          pages={appearanceMenuPages}
          labels={locale === "ru" ? localeRu.appearanceMenu : undefined}
        />
        <SidebarToggle
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          labels={locale === "ru" ? localeRu.sidebarToggle : undefined}
        />
      </>
    ),
  }

  return (
    <>
      <AppearanceCanvas backdrop={backdrop} />
      {flush ? (
        <AdminShell
          {...sharedProps}
          variant="flush"
          actions={
            <>
              <DemoHeaderControls variant="header" />
              <DemoUserMenu variant="icon" />
            </>
          }
        >
          {children}
          <AdminToaster className="top-[4.5rem]" />
        </AdminShell>
      ) : (
        <AdminShell
          {...sharedProps}
          variant="card"
          header={false}
          sidebarActions={<DemoHeaderControls variant="sidebar" />}
          sidebarProfile={<DemoUserMenu variant="row" />}
        >
          {children}
          <AdminToaster />
        </AdminShell>
      )}
    </>
  )
}
