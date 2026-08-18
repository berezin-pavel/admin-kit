"use client"

import { adminThemeToCss } from "@/registry/admin-theme-tokens/admin-theme-css"

import { useDemoTheme } from "@/app/demo/theme-store"

export function DemoThemeStyle() {
  const theme = useDemoTheme()

  return <style dangerouslySetInnerHTML={{ __html: adminThemeToCss(theme) }} />
}
