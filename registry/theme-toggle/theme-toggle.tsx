import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface ThemeToggleLabels {
  toLight?: string
  toDark?: string
}

export interface ThemeToggleProps {
  isDark: boolean
  onToggle: () => void
  className?: string
  labels?: ThemeToggleLabels
}

export function ThemeToggle({
  isDark,
  onToggle,
  className,
  labels,
}: ThemeToggleProps) {
  const toLightLabel = labels?.toLight ?? "Switch to light theme"
  const toDarkLabel = labels?.toDark ?? "Switch to dark theme"
  const label = isDark ? toLightLabel : toDarkLabel

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
