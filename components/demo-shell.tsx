"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { Store } from "lucide-react"

import { DemoLanguageToggle } from "@/components/demo-language-toggle"
import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { DemoUserMenu } from "@/components/demo-user-menu"
import { AppearanceCanvas } from "@/registry/admin-appearance/appearance-style"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
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

const FLUSH_APPEARANCE_PAGE_IDS = ["overview", "orders"]

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
  const flush = layout === "flush-header"
  const pageLabelById: Record<string, string> = {
    overview: nav.overview,
    orders: nav.orders,
    order: nav.order,
  }
  const appearanceMenuPages = DEMO_APPEARANCE_PAGES.filter(
    (page) => !flush || FLUSH_APPEARANCE_PAGE_IDS.includes(page.id)
  ).map((page) => ({
    id: page.id,
    label: pageLabelById[page.id] ?? page.id,
  }))

  const backdrop = resolvePageBackdrop(appearance, demoPageId(pathname))

  const sharedProps = {
    appName: demoDictionary[locale].appName,
    nav: flush ? getDemoFlushNav(locale) : getDemoNav(locale),
    activeHref: pathname,
    renderLink: renderDemoLink,
    logo: (
      <span className="flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <Store className="size-3" />
      </span>
    ),
    collapsed,
    sidebarGradient: appearance.sidebar ?? undefined,
    backdrop,
    labels: locale === "ru" ? localeRu.adminShell : undefined,
    sidebarFooter: (
      <>
        <SidebarToggle
          collapsed={collapsed}
          onToggle={() => setCollapsed((prev) => !prev)}
          labels={locale === "ru" ? localeRu.sidebarToggle : undefined}
        />
        <DemoThemeToggle />
        <DemoLanguageToggle />
        <AppearanceMenu
          value={appearance}
          onChange={setDemoAppearance}
          pages={appearanceMenuPages}
          labels={locale === "ru" ? localeRu.appearanceMenu : undefined}
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
          actions={<DemoUserMenu variant="icon" />}
        >
          {children}
          <AdminToaster />
        </AdminShell>
      ) : (
        <AdminShell
          {...sharedProps}
          variant="card"
          header={false}
          sidebarProfile={<DemoUserMenu variant="row" />}
        >
          {children}
          <AdminToaster />
        </AdminShell>
      )}
    </>
  )
}
