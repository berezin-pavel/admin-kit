import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
  className?: string
}

export function ThemeToggle({ isDark, onToggle, className }: ThemeToggleProps) {
  const label = isDark
    ? "Switch to light theme"
    : "Switch to dark theme"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={onToggle}
      className={className}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  )
}
