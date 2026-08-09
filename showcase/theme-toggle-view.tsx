"use client"

import { useState } from "react"

import { ThemeToggle } from "@/registry/theme-toggle/theme-toggle"

export function ThemeToggleView({ initialIsDark }: { initialIsDark: boolean }) {
  const [isDark, setIsDark] = useState(initialIsDark)

  return (
    <ThemeToggle isDark={isDark} onToggle={() => setIsDark((prev) => !prev)} />
  )
}
