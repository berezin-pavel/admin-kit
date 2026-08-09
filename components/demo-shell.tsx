"use client"

import { useState } from "react"
import type { ReactNode } from "react"

import { DemoThemeToggle } from "@/components/demo-theme-toggle"
import { AdminShell } from "@/registry/admin-shell/admin-shell"
import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"

import { demoNav } from "@/app/demo/data"

export function DemoShell({
  sidebarVariant,
  children,
}: {
  sidebarVariant: "flush" | "card"
  children: ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <AdminShell
      appName="My Store"
      nav={demoNav}
      activeHref="/"
      header={false}
      collapsed={collapsed}
      sidebarVariant={sidebarVariant}
      sidebarFooter={
        <div className="flex items-center gap-2">
          <SidebarToggle
            collapsed={collapsed}
            onToggle={() => setCollapsed((prev) => !prev)}
          />
          <DemoThemeToggle />
        </div>
      }
    >
      {children}
    </AdminShell>
  )
}
