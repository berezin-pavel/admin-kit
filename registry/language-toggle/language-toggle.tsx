"use client"

import { Languages } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface LanguageToggleLocale {
  value: string
  label: string
}

export interface LanguageToggleProps {
  locale: string
  locales: readonly LanguageToggleLocale[]
  onLocaleChange: (locale: string) => void
  label?: string
  className?: string
}

export function LanguageToggle({
  locale,
  locales,
  onLocaleChange,
  label = "Switch language",
  className,
}: LanguageToggleProps) {
  const currentIndex = locales.findIndex((item) => item.value === locale)
  const current = currentIndex === -1 ? undefined : locales[currentIndex]

  const handleClick = () => {
    if (locales.length === 0) {
      return
    }

    const nextIndex =
      currentIndex === -1 ? 0 : (currentIndex + 1) % locales.length
    const next = locales[nextIndex]

    if (next) {
      onLocaleChange(next.value)
    }
  }

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      title={label}
      onClick={handleClick}
      className={cn("gap-0.5", className)}
    >
      {current ? (
        <span className="text-[10px] font-semibold tracking-wide">
          {current.label}
        </span>
      ) : (
        <Languages className="size-4" />
      )}
    </Button>
  )
}
