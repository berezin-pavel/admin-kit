"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { DemoLanguageToggle } from "@/components/demo-language-toggle"
import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
import type { AdminNavLinkRenderer } from "@/registry/admin-shell/admin-shell"
import { AdminToaster } from "@/registry/admin-toaster/admin-toaster"
import { localeRu } from "@/registry/locale-ru/locale-ru"
import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"

import { getDemoNav } from "@/app/demo/data"
import { demoDictionary } from "@/app/demo/locale"
import { useDemoLocale } from "@/app/demo/locale-store"

const renderDemoLink: AdminNavLinkRenderer = ({
  href,
  className,
  children,
}) => (
  <Link href={href} className={className}>
    {children}
  </Link>
)

export function DemoShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const locale = useDemoLocale()

  return (
    <AdminShell
      appName={demoDictionary[locale].appName}
      nav={getDemoNav(locale)}
      activeHref={pathname}
      renderLink={renderDemoLink}
      header={false}
      collapsed={collapsed}
      labels={locale === "ru" ? localeRu.adminShell : undefined}
      sidebarFooter={
        <>
          <SidebarToggle
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
            labels={locale === "ru" ? localeRu.sidebarToggle : undefined}
          />
          <DemoThemeToggle />
          <DemoLanguageToggle />
        </>
      }
    >
      {children}
      <AdminToaster />
    </AdminShell>
  )
}
