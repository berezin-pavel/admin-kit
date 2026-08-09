import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface SidebarToggleProps {
  collapsed: boolean
  onToggle: () => void
  className?: string
}

export function SidebarToggle({
  collapsed,
  onToggle,
  className,
}: SidebarToggleProps) {
  const label = collapsed ? "Expand sidebar" : "Collapse sidebar"

  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={label}
      onClick={onToggle}
      className={cn("hidden md:inline-flex", className)}
    >
      {collapsed ? (
        <PanelLeftOpen className="size-4" />
      ) : (
        <PanelLeftClose className="size-4" />
      )}
    </Button>
  )
}
