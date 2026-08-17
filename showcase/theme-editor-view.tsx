"use client"

import { useState } from "react"

import type { AdminTheme } from "@/registry/admin-theme-tokens/admin-theme-tokens"
import { ThemeEditor } from "@/registry/theme-editor/theme-editor"

export function ThemeEditorView({
  initialTheme,
}: {
  initialTheme: AdminTheme
}) {
  const [theme, setTheme] = useState(initialTheme)

  return <ThemeEditor value={theme} onChange={setTheme} showCss />
}
