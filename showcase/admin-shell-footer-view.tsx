"use client"

import { useState } from "react"
import {
  Bell,
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Store,
  User,
} from "lucide-react"

import { Button } from "@/components/ui/button"
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

const logoMark = (
  <span className="flex size-5 items-center justify-center rounded-md bg-primary text-primary-foreground">
    <Store className="size-3" />
  </span>
)

export function AdminShellFooterView({
  header = true,
  defaultCollapsed = false,
  children,
}: {
  header?: boolean
  defaultCollapsed?: boolean
  children?: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
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

  const notifications = (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Notifications"
      onClick={() => notify.info("No new notifications")}
    >
      <Bell className="size-4" />
    </Button>
  )

  const accountRow = (
    <UserMenu
      variant="row"
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
      logo={logoMark}
      nav={nav}
      activeHref="/orders"
      collapsed={collapsed}
      sidebarActions={notifications}
      sidebarProfile={accountRow}
      sidebarFooter={footer}
    >
      {children}
      <AdminToaster />
    </AdminShell>
  ) : (
    <AdminShell
      appName="My Store"
      logo={logoMark}
      nav={nav}
      activeHref="/orders"
      header={false}
      collapsed={collapsed}
      sidebarActions={notifications}
      sidebarProfile={accountRow}
      sidebarFooter={footer}
    >
      {children}
      <AdminToaster />
    </AdminShell>
  )
}
