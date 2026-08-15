import { PanelLeftClose, PanelLeftOpen } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Hint } from "@/registry/hint/hint"
import { cn } from "@/lib/utils"

export interface SidebarToggleLabels {
  expand?: string
  collapse?: string
}

export interface SidebarToggleProps {
  collapsed: boolean
  onToggle: () => void
  className?: string
  labels?: SidebarToggleLabels
}

export function SidebarToggle({
  collapsed,
  onToggle,
  className,
  labels,
}: SidebarToggleProps) {
  const expandLabel = labels?.expand ?? "Expand sidebar"
  const collapseLabel = labels?.collapse ?? "Collapse sidebar"
  const label = collapsed ? expandLabel : collapseLabel

  return (
    <Hint
      text={label}
      render={
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
      }
    />
  )
}
