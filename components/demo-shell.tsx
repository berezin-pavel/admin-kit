"use client"

import { useState } from "react"
import type { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
import type { AdminNavLinkRenderer } from "@/registry/admin-shell/admin-shell"
import { AdminToaster } from "@/registry/admin-toaster/admin-toaster"
import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"

import { demoNav } from "@/app/demo/data"

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

  return (
    <AdminShell
      appName="My Store"
      nav={demoNav}
      activeHref={pathname}
      renderLink={renderDemoLink}
      header={false}
      collapsed={collapsed}
      sidebarFooter={
        <>
          <SidebarToggle
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
          />
          <DemoThemeToggle />
        </>
      }
    >
      {children}
      <AdminToaster />
    </AdminShell>
  )
}
