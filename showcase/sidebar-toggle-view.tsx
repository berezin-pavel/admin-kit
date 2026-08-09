"use client"

import { useState } from "react"

import { SidebarToggle } from "@/registry/sidebar-toggle/sidebar-toggle"

export function SidebarToggleView({
  initialCollapsed,
}: {
  initialCollapsed: boolean
}) {
  const [collapsed, setCollapsed] = useState(initialCollapsed)

  return (
    <SidebarToggle
      collapsed={collapsed}
      onToggle={() => setCollapsed((prev) => !prev)}
    />
  )
}
