"use client"

import { useState } from "react"
import { LayoutDashboard, LogOut, ShoppingCart, User } from "lucide-react"

import {
  AdminShell,
  type AdminNavItem,
} from "@/registry/admin-shell/admin-shell"
import { AdminToaster, notify } from "@/registry/admin-toaster/admin-toaster"
import { LanguageToggle } from "@/registry/language-toggle/language-toggle"
import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"
import { ThemeToggle } from "@/registry/theme-toggle/theme-toggle"
import { UserMenu } from "@/registry/user-menu/user-menu"

const nav: readonly AdminNavItem[] = [
  { href: "/", title: "Overview", icon: LayoutDashboard },
  { href: "/orders", title: "Orders", icon: ShoppingCart },
]

const locales = [
  { value: "en", label: "EN" },
  { value: "ru", label: "RU" },
]

export function AdminShellFooterView({
  header = true,
  children,
}: {
  header?: boolean
  children?: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [locale, setLocale] = useState("en")

  const footer = (
    <>
      <SidebarToggle
        collapsed={collapsed}
        onToggle={() => setCollapsed((previous) => !previous)}
      />
      <ThemeToggle isDark={isDark} onToggle={() => setIsDark((d) => !d)} />
      <LanguageToggle
        locale={locale}
        locales={locales}
        onLocaleChange={setLocale}
      />
    </>
  )

  const userMenu = (
    <UserMenu
      name="Alex Morgan"
      email="alex@example.com"
      side="bottom"
      align="start"
      items={[
        {
          id: "profile",
          label: "Profile",
          icon: User,
          onSelect: () => notify.info("Opened profile"),
        },
        {
          id: "sign-out",
          label: "Sign out",
          icon: LogOut,
          tone: "danger",
          onSelect: () => notify.info("Signed out"),
        },
      ]}
    />
  )

  return header ? (
    <AdminShell
      appName="My Store"
      nav={nav}
      activeHref="/orders"
      collapsed={collapsed}
      sidebarActions={userMenu}
      sidebarFooter={footer}
    >
      {children}
      <AdminToaster />
    </AdminShell>
  ) : (
    <AdminShell
      appName="My Store"
      nav={nav}
      activeHref="/orders"
      header={false}
      collapsed={collapsed}
      sidebarActions={userMenu}
      sidebarFooter={footer}
    >
      {children}
      <AdminToaster />
    </AdminShell>
  )
}
