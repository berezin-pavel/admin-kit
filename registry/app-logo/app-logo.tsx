import type { ComponentType } from "react"

import { cn } from "@/lib/utils"

export interface AppLogoProps {
  name: string
  icon?: ComponentType<{ className?: string }>
  className?: string
}

export function AppLogo({ name, icon: Icon, className }: AppLogoProps) {
  const letter = Array.from(name.trim())[0] ?? ""

  return (
    <span
      data-slot="app-logo"
      aria-hidden="true"
      className={cn(
        "flex size-5 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
        className
      )}
    >
      {Icon ? (
        <Icon className="size-3" />
      ) : (
        <span className="text-[0.6rem] font-bold uppercase">{letter}</span>
      )}
    </span>
  )
}
